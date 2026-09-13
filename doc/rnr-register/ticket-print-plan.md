# Roots & Reels — Ticket print logic (proven)

Working approach validated locally with serial `RR2-001`. Reuse this when wiring paid registration downloads.

## Method

**Server-side composite** (not browser canvas):

1. Load blank ticket JPEG from disk.
2. Register a bundled TTF font.
3. Draw template → paint white SR. NO. box → draw serial text.
4. Return JPEG bytes from a Node API route.
5. Browser only previews / downloads the finished image.

Library: `@napi-rs/canvas` (`createCanvas`, `loadImage`, `GlobalFonts`).

> Do **not** use sharp SVG `<text>` for the serial. On Linux/server it often draws the white box but skips text (missing system fonts).

## Assets (must ship with deploy)

| Path | Role |
|------|------|
| `public/assets/root-and-reels-ticket.jpeg` | Blank ticket template (1600×682) |
| `assets/fonts/LiberationSans-Bold.ttf` | Font used for serial text |

## Serial format

- Pattern: `RR2-001`, `RR2-002`, …
- Assigned only after successful payment.
- Display label on ticket: `SR. NO. RR2-001`

## Overlay coordinates (template 1600×682)

Calibrated to the white **SR. NO.** box (top-right of center panel, left of yellow ENTRY PASS stub):

```ts
const BOX = { x: 1205, y: 24, w: 196, h: 42, r: 8, size: 17 } as const;
```

Draw order:

1. `ctx.drawImage(template, 0, 0)`
2. White rounded rect over the box (`fillStyle = #ffffff`, `roundRect`)
3. Centered text (`fillStyle = #1B3644`, `font = bold 17px Ticket`, `textAlign = center`, `textBaseline = middle`)

## Core helper (current)

File: `src/lib/tickets/render-pass.ts`

```ts
export async function renderRootsReelsTicket(serialNumber: string): Promise<Buffer>
```

- Registers font as family name `"Ticket"` once via `GlobalFonts.registerFromPath`.
- Throws `TicketRenderError` if font or template cannot load.
- Returns `canvas.toBuffer("image/jpeg", 92)`.

## API pattern (production)

**Production:** e.g. `GET /api/registrations/ticket/[token]`  
- Verify registration is `paid` + token matches  
- Call `renderRootsReelsTicket(registration.registration_code)`  
- Return `image/jpeg` with `Content-Disposition: attachment`

Generate **on demand** (or cache once to Storage). Do not store the blank PNG as a Postgres blob.

Admin test route was removed after validation; keep using `renderRootsReelsTicket` only from registration APIs.

## Next.js deploy notes

Already set in `next.config.ts`:

```ts
serverExternalPackages: ["@napi-rs/canvas"]
```

- Must run on **Node** runtime (not Edge).
- Browser users need nothing special — they only receive the JPEG.
- After first production deploy, generate one paid/test ticket once to confirm the native canvas binary loads on the host.

## Error handling (keep)

- Server: `console.error("[ticket]", …)` + JSON `{ error: message }` on failure.
- Surface real error text to the client on ticket download failures.

## What not to do

- Don’t rely on system Arial/Helvetica.
- Don’t stamp the serial only in the client (easy to forge).
- Don’t mark a ticket as printable until payment is verified server-side.

## Hook-up for registration (next phase)

After Razorpay verify → assign `RR2-XXX` → confirmation page **View / Download ticket** calls the ticket API with a secret `ticket_token` → same `renderRootsReelsTicket` helper.
