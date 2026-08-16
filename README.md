# Jhashree Web

Next.js 16 starter configured with:

- Pages Router under `src/pages`
- Shared layout support through `src/components/layout.tsx`
- Tailwind CSS 4
- TypeScript
- ESLint

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Firebase

The project has separate Firebase configurations for browser and server code:

- `src/lib/firebase/client.ts` exports Firebase Auth, Firestore, and Storage for browser code.
- `src/lib/firebase/admin.ts` exposes lazy Admin SDK helpers for API routes.
- `src/lib/firebase/require-admin.ts` verifies a Firebase ID token before an admin API performs protected work.

Copy `.env.example` to `.env.local` and replace its placeholders. The
`NEXT_PUBLIC_FIREBASE_*` values come from the Firebase web app settings. The
server-only values come from a Firebase service account and must never be
prefixed with `NEXT_PUBLIC_` or committed. The six browser variables are enough
for `/admin/login`; the Admin SDK variables are needed once protected server
APIs use `requireAdmin`.

There is no user collection or role table. Every account manually created in
Firebase Authentication is treated as an admin. Enable Email/Password sign-in,
then open **Authentication > Settings > User actions** and disable end-user
account creation and deletion. Hiding a sign-up form is not enough because
Firebase enables those actions by default.

Firestore and Storage security rules are managed directly in the Firebase
Console for this project.

### Works admin

The admin dashboard at `/admin` lists every work and supports create, edit,
publish/draft, and delete operations. JSON mutations go through authenticated
Next.js API routes. Images and videos upload directly to Firebase Storage with
progress reporting, then the API verifies the stored file before writing its
Firestore document.

Supported uploads:

- JPEG, PNG, WebP, and GIF images up to 10 MB
- MP4, WebM, and QuickTime videos up to 100 MB

The API routes require the four server-only values in `.env.example`. Generate
a private key from **Firebase Console > Project settings > Service accounts**
and map `project_id`, `client_email`, and `private_key` to their corresponding
environment variables. Use the bucket value shown in Firebase Storage for
`FIREBASE_STORAGE_BUCKET`.

Because rules are managed in the Firebase Console, configure them there. The
Firestore client only needs to read published works; all writes use the Admin
SDK and bypass client rules:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /works/{workId} {
      allow read: if request.auth != null
        || resource.data.status == 'published';
      allow write: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

The browser uploads media directly, so Storage allows authenticated admins to
create/delete only supported files while keeping portfolio media publicly
viewable:

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /works/{workId}/media/{fileName} {
      allow read: if true;
      allow create: if request.auth != null && (
        (request.resource.contentType.matches('image/(jpeg|png|webp|gif)')
          && request.resource.size <= 10 * 1024 * 1024)
        ||
        (request.resource.contentType.matches('video/(mp4|webm|quicktime)')
          && request.resource.size <= 100 * 1024 * 1024)
      );
      allow delete: if request.auth != null;
      allow update: if false;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Project structure

```text
src/
  components/
    layout.tsx
  pages/
    _app.tsx
    index.tsx
  styles/
    globals.css
```

## Notes

- Add new routes inside `src/pages`.
- Use the default `Layout` wrapper from `src/pages/_app.tsx`, or define `getLayout` on a page when you want a custom layout for that page.
