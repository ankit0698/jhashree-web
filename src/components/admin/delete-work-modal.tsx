import { useEffect } from "react";

type DeleteWorkModalProps = {
  workTitle: string;
  isDeleting: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteWorkModal({
  workTitle,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteWorkModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeleting, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-work-title"
        aria-describedby="delete-work-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[var(--paper-light)] shadow-[0_35px_100px_rgba(0,0,0,0.38)]"
      >
        <div className="h-1.5 bg-[var(--rust)]" />

        <div className="p-6 md:p-7">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-red-200 bg-red-50 text-red-700">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
            </svg>
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--rust)]">
            Delete work
          </p>
          <h2
            id="delete-work-title"
            className="mt-2 font-serif text-3xl font-semibold leading-tight text-[var(--foreground-contrast)]"
          >
            Delete “{workTitle}”?
          </h2>
          <p
            id="delete-work-description"
            className="mt-3 text-sm leading-6 text-[var(--muted)]"
          >
            This permanently removes the work and any uploaded media from
            Firebase. This action cannot be undone.
          </p>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              autoFocus
              className="admin-button admin-button-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="admin-button admin-button-danger"
            >
              {isDeleting ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
