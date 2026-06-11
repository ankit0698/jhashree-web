# Jhashree Web

Next.js 16 starter configured with:

- Pages Router under `src/pages`
- Shared layout support through `src/components/layout.tsx`
- Tailwind CSS 4
- TypeScript
- ESLint

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

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
