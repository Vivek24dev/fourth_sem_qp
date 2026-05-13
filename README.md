# Fourth Sem QP

A simple full-stack question paper manager for personal semester study use.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Firebase Authentication with Google login
- Firebase Firestore
- Firebase Storage for direct file uploads
- Tailwind CSS
- Framer Motion
- React Hot Toast

## Routes

- `/` -> Home page with subject cards
- `/login` -> Google login
- `/admin` -> Admin dashboard
- `/admin/upload` -> Add PDF links or upload PDFs
- `/admin/subjects` -> Add or delete subjects
- `/subject/[id]` -> Subject papers with title search
- `/viewer/[id]` -> In-site PDF preview

## Admin Access

Only this email can access admin pages:

```text
shreedharmm3@gmail.com
```

Other signed-in users can browse, preview, and download papers.

## Firebase Setup

1. Create a Firebase project at `https://console.firebase.google.com`.
2. Enable Authentication -> Sign-in method -> Google.
3. Create Firestore Database.
4. Optional: Enable Storage only if you want direct file upload from the app.
5. Register a Web App in Firebase project settings.
6. Copy the web config values into `.env.local`.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Restart the dev server after changing `.env.local`.

## Free PDF Upload Option

Firebase Cloud Storage now requires the Blaze pay-as-you-go plan. If you want to
stay fully on the free Firebase Spark plan, use the `Add PDF link` option on
`/admin/upload`.

Free workflow:

1. Upload your PDF to Google Drive.
2. Set sharing to `Anyone with the link can view`.
3. Copy the share link.
4. Paste it into `Add PDF link`.

The app saves only the title, subject, link, upload date, and download count in
Firestore. This avoids Firebase Storage completely.

Direct `Upload file` still works only when your Firebase project can use Cloud
Storage.

## Firestore Structure

`subjects` collection:

```ts
{
  id: string;
  name: string;
  icon: string;
  createdAt: Timestamp;
}
```

`papers` collection:

```ts
{
  id: string;
  subjectId: string;
  title: string;
  pdfUrl: string;
  uploadedAt: Timestamp;
  downloadCount: number;
  storagePath?: string;
}
```

## Firebase Rules

Rules are included in:

- `firestore.rules`
- `storage.rules`

Deploy them with:

```bash
firebase deploy --only firestore:rules,storage
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy To Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add the same `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel.
4. Deploy.
5. Add the Vercel domain to Firebase Authentication -> Authorized domains.

## First Admin Steps

1. Sign in with `shreedharmm3@gmail.com`.
2. Open `/admin/subjects`.
3. Click `Add defaults` to create ADA, MC, DBMS, GT, Biology, and UHV.
4. Open `/admin/upload` and add Google Drive PDF links subject-wise.
