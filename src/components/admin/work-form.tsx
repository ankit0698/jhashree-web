import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useRef, useState } from "react";

import WorkPreview from "@/components/admin/work-preview";
import { firebaseStorage } from "@/lib/firebase/client";
import {
  createAdminWork,
  updateAdminWork,
} from "@/lib/works/admin-api";
import { extractYouTubeVideoId } from "@/lib/works/validation";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  formatFileSize,
  isUploadedMedia,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  type UploadedMedia,
  type Work,
  type WorkInput,
} from "@/types/work";

type WorkFormProps = {
  user: User;
  workId?: string;
  existingWork?: Work;
};

function sanitizeFilename(filename: string) {
  const extension = filename.includes(".")
    ? `.${filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "")}`
    : "";
  const basename = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return `${basename || "media"}${extension}`;
}

function getUploadError(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === "storage/unauthorized") {
      return "Firebase Storage denied the upload. Check your Storage rules.";
    }

    if (error.code === "storage/retry-limit-exceeded") {
      return "The upload timed out. Check your connection and try again.";
    }
  }

  return error instanceof Error
    ? error.message
    : "The work could not be saved.";
}

async function uploadMedia(
  workId: string,
  file: File,
  onProgress: (progress: number) => void,
): Promise<UploadedMedia> {
  const storagePath = `works/${workId}/media/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;
  const storageReference = ref(firebaseStorage, storagePath);
  const uploadTask = uploadBytesResumable(storageReference, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        onProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
      },
      reject,
      resolve,
    );
  });

  return {
    source: "upload",
    type: file.type.startsWith("image/") ? "image" : "video",
    storagePath,
    url: await getDownloadURL(uploadTask.snapshot.ref),
    contentType: file.type,
    sizeBytes: file.size,
    originalName: file.name,
  };
}

export default function WorkForm({
  user,
  workId,
  existingWork,
}: WorkFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(existingWork?.title ?? "");
  const [description, setDescription] = useState(
    existingWork?.description ?? "",
  );
  const [label, setLabel] = useState(existingWork?.label ?? "Client Work");
  const [status, setStatus] = useState<"draft" | "published">(
    existingWork?.status ?? "draft",
  );
  const [sortOrder, setSortOrder] = useState(
    String(existingWork?.sortOrder ?? 10),
  );
  const [instagramUrl, setInstagramUrl] = useState(
    existingWork?.instagramUrl ?? "",
  );
  const [mediaSource, setMediaSource] = useState<"youtube" | "upload">(
    existingWork?.media.source ?? "youtube",
  );
  const [uploadType, setUploadType] = useState<"image" | "video">(
    existingWork?.media.source === "upload"
      ? existingWork.media.type
      : "image",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(
    existingWork?.media.source === "youtube"
      ? `https://www.youtube.com/watch?v=${existingWork.media.videoId}`
      : "",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function selectMediaSource(source: "youtube" | "upload") {
    setMediaSource(source);
    setError("");
  }

  function selectUploadType(type: "image" | "video") {
    setUploadType(type);
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(file: File | null) {
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes =
      uploadType === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
    const isExpectedType = allowedTypes.includes(file.type);
    const maximumSize = uploadType === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

    if (!isExpectedType) {
      setError(`Please select a valid ${uploadType} file.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > maximumSize) {
      setError(
        uploadType === "image"
          ? "Images must be 10 MB or smaller."
          : "Videos must be 100 MB or smaller.",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    setUploadProgress(0);

    let newlyUploadedMedia: UploadedMedia | null = null;

    try {
      const resolvedWorkId = workId ?? crypto.randomUUID();
      let media: WorkInput["media"];

      if (mediaSource === "youtube") {
        const videoId = extractYouTubeVideoId(youtubeUrl);

        if (!videoId) {
          throw new Error("Enter a valid YouTube video URL.");
        }

        media = { source: "youtube", type: "video", videoId };
      } else if (selectedFile) {
        newlyUploadedMedia = await uploadMedia(
          resolvedWorkId,
          selectedFile,
          setUploadProgress,
        );
        media = newlyUploadedMedia;
      } else if (
        existingWork &&
        isUploadedMedia(existingWork.media) &&
        existingWork.media.type === uploadType
      ) {
        media = existingWork.media;
      } else {
        throw new Error(`Select a ${uploadType} file to upload.`);
      }

      const workInput: WorkInput = {
        title,
        description,
        label,
        status,
        sortOrder: Number(sortOrder),
        instagramUrl: instagramUrl.trim() || null,
        media,
      };

      if (existingWork) {
        await updateAdminWork(user, resolvedWorkId, workInput);
      } else {
        await createAdminWork(user, resolvedWorkId, workInput);
      }

      await router.push("/admin");
    } catch (saveError) {
      if (newlyUploadedMedia) {
        try {
          await deleteObject(ref(firebaseStorage, newlyUploadedMedia.storagePath));
        } catch {
          // The server may already have accepted or removed the object.
        }
      }

      setError(getUploadError(saveError));
      setIsSaving(false);
    }
  }

  const existingPreview = existingWork?.media;
  const maximumSize = uploadType === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <section className="grid gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:grid-cols-2 sm:p-7">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-bold" htmlFor="title">
            Work title
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={120}
            className="admin-input"
            placeholder="Greenonions Restaurant"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="label">
            Label
          </label>
          <input
            id="label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            required
            maxLength={60}
            className="admin-input"
            placeholder="Client Work"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="sort-order">
            Display order
          </label>
          <input
            id="sort-order"
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            required
            className="admin-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-bold" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            maxLength={5000}
            rows={6}
            className="admin-input resize-y"
            placeholder="Describe the project and its impact."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "draft" | "published")
            }
            className="admin-input"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="instagram-url">
            Instagram link <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <input
            id="instagram-url"
            type="url"
            value={instagramUrl}
            onChange={(event) => setInstagramUrl(event.target.value)}
            maxLength={500}
            className="admin-input"
            placeholder="https://www.instagram.com/reel/..."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <h2 className="font-serif text-3xl font-semibold">Work media</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Choose one media source for this work.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(["youtube", "upload"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => selectMediaSource(source)}
              className={`rounded-xl border px-4 py-4 text-left transition ${
                mediaSource === source
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/10"
                  : "border-[var(--border-strong)] bg-white hover:border-[var(--accent)]"
              }`}
            >
              <span className="block font-bold">
                {source === "youtube" ? "YouTube video" : "Upload media"}
              </span>
              <span className="mt-1 block text-sm text-[var(--muted)]">
                {source === "youtube"
                  ? "Paste a public YouTube URL"
                  : "Choose an image or video file"}
              </span>
            </button>
          ))}
        </div>

        {mediaSource === "youtube" ? (
          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold" htmlFor="youtube-url">
              YouTube URL
            </label>
            <input
              id="youtube-url"
              type="text"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              required
              className="admin-input"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex gap-3">
              {(["image", "video"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => selectUploadType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                    uploadType === type
                      ? "bg-[var(--foreground-contrast)] text-white"
                      : "bg-[var(--surface-soft)] text-[var(--muted)]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <label
              htmlFor="media-file"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-white px-5 py-10 text-center transition hover:border-[var(--accent)]"
            >
              <span className="font-bold">
                {selectedFile ? selectedFile.name : `Choose ${uploadType}`}
              </span>
              <span className="mt-2 text-sm text-[var(--muted)]">
                Maximum {formatFileSize(maximumSize)}
              </span>
              {selectedFile ? (
                <span className="mt-1 text-xs text-[var(--muted)]">
                  {formatFileSize(selectedFile.size)} selected
                </span>
              ) : null}
            </label>
            <input
              ref={fileInputRef}
              id="media-file"
              type="file"
              accept={
                uploadType === "image"
                  ? ALLOWED_IMAGE_TYPES.join(",")
                  : ALLOWED_VIDEO_TYPES.join(",")
              }
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              className="sr-only"
            />

            {!selectedFile && existingPreview?.source === "upload" && existingPreview.type === uploadType ? (
              <div className="mt-4 max-w-sm">
                <p className="mb-2 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
                  Current file—choose a new file only to replace it
                </p>
                <WorkPreview media={existingPreview} title={title || "Current work"} compact />
              </div>
            ) : null}
          </div>
        )}
      </section>

      {uploadProgress > 0 && isSaving ? (
        <div aria-live="polite">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Uploading media</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
            <div
              className="h-full rounded-full bg-[var(--accent-deep)] transition-[width]"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          disabled={isSaving}
          className="admin-button admin-button-secondary min-w-28"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="admin-button admin-button-primary min-w-36"
        >
          {isSaving
            ? uploadProgress > 0 && uploadProgress < 100
              ? `Uploading ${uploadProgress}%`
              : "Saving…"
            : existingWork
              ? "Save changes"
              : "Create work"}
        </button>
      </div>
    </form>
  );
}
