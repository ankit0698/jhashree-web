# Jhashree Platform Redesign Plan

Reference mood: [TechSparks 2025](https://techsparks.yourstory.com/2025)  
Principle: **borrow mood + chrome, not event IA**.  
Content rule: **keep all existing data/copy/flows**; change visual system only.

---

## 1. Decisions (locked)

| Decision | Choice |
|---|---|
| Scope | Whole platform: Home, `/rootsnreels`, `/survey`, ticket pages, admin shell chrome |
| Darkness | **B** — dark cinematic heroes + slightly lighter charcoal content sections |
| Madhubani | Keep as **small accents only** (low opacity corners / dividers). Main visuals = new AI photos |
| Display type | Bold **geometric sans** (TechSparks-like), not Cormorant serif |
| Body type | Clean geometric/neo-grotesk sans for UI + forms |
| Images | AI-generated into `public/assets/` (review set first, then promote winners) |
| IA | Do **not** add agenda/speakers/partner-wall patterns. Keep studio + event-form structure |

---

## 2. Goals

1. One cohesive dark-cinematic brand across public + admin chrome.
2. Hero / page tops feel photographic and atmospheric (fading image layers on Home).
3. Forms (`/survey`, `/rootsnreels`) stay usable: high contrast, clear inputs, same logic.
4. Cultural root stays as a whisper (accent color + tiny Madhubani), not the full cream/paper theme.
5. Ship reviewable AI images before wiring them into production UI.

---

## 3. Out of scope (this redesign)

- Changing registration/payment/survey API behavior
- Rewriting marketing copy or services list
- Cloning TechSparks section types (agenda tabs, speaker grids, partner logos)
- Replacing real event poster `Roots-and-Reels.png` unless you later request it
- Deleting Madhubani files until redesign is approved (demote usage first)

---

## 4. Visual system

### 4.1 Color tokens (replace cream system)

Proposed CSS variables (names can stay; values change):

| Token | Role | Proposed |
|---|---|---|
| `--background` | Page base | `#0c0c0b` |
| `--surface` | Cards / forms | `#161614` |
| `--surface-soft` | Nested panels | `#1e1d1a` |
| `--ink` / `--foreground` | Primary text | `#f4f0e8` |
| `--muted` | Secondary text | `#a8a29a` |
| `--rust` | Brand accent (YourStory-red analogue) | keep near `#c45a3a` / `#b84a2f` |
| `--accent` | Soft gold highlight | `#c9a06a` (sparingly) |
| `--border` | Hairlines | `rgba(255,255,255,0.10)` |
| `--paper-light` | Legacy alias | map to charcoal surface (avoid cream) |
| `--hero-overlay` | Image readability | `linear-gradient` black 55–75% |

**Section rhythm (Darkness B):**
- Heroes / tops: near-black + photo + overlay
- Mid sections: `#121211` → `#181714` (slightly lifted charcoal)
- Footer: darkest band + thin white rules

### 4.2 Typography

Replace in `_app.tsx`:

| Role | Current | Proposed |
|---|---|---|
| Display / H1–H2 | Cormorant Garamond (`--font-serif`) | **Space Grotesk** or **Syne** bold (geometric) |
| Body / UI | Manrope | **Manrope** keep *or* switch to **Inter** / **DM Sans** if Space Grotesk is display-only |

Rules:
- Headlines: uppercase or tight tracking optional; heavy weight; large scale
- Eyebrows: small, `tracking-[0.28em]`, rust accent
- Drop italic serif flourishes on `/rootsnreels` + `/survey` titles

### 4.3 Chrome patterns (from TechSparks)

Adopt:
- Transparent / glass sticky header on dark hero
- Uppercase nav links, white/muted, rust active state
- Thin horizontal rules
- Rectangular / slightly rounded CTAs (not soft cream pills everywhere) — or keep pill if brand prefers; prefer sharper for this theme
- Subtle film grain overlay (reuse/adapt current `body::before` for dark)

Avoid:
- Magenta→blue TechSparks gradient
- Event date megaliths, agenda tabs, partner logo walls
- Purple glow / neon stacks

### 4.4 Motion

Home hero: slow crossfade between approved images (6–10s), opacity only.  
`prefers-reduced-motion: reduce` → static first frame.  
Section entrances: light fade/translate only (2–3 intentional motions sitewide).

---

## 5. Surface-by-surface plan

### 5.1 Global

| File / area | Change |
|---|---|
| `src/styles/globals.css` | Retokenize colors; dark body; grain for dark; button classes |
| `src/pages/_app.tsx` | Swap fonts to geometric display |
| Shared headers/footers | Dark chrome |

### 5.2 Home (`/`)

| Section | Keep | Restyle |
|---|---|---|
| Header | Nav items, logo | Transparent dark, uppercase links |
| Hero | Tagline, H1, supporting line, CTA | Full-bleed **fading AI images** + overlay; geometric display type; left content cluster |
| Our Works | Works data/API | Dark cards, rust hover, charcoal rail |
| About | Stats, highlights, copy | Charcoal band; Madhubani image → small accent or replace main photo with AI cultural shot |
| Services | Services list + process | Dark list/grid; thin rules; no cream cards |
| Contact | Form fields + enquiry API | Dark form surfaces; same validation/API |
| Footer | Links/social | Dark band |

**Hero image behavior:** component e.g. `HeroAtmosphere` cycles approved files from `public/assets/redesign/` (after review).

### 5.3 `/survey`

| Keep | Restyle |
|---|---|
| All form questions, submit API, success states | Dark page shell, charcoal form card, geometric titles |
| Poster image `Roots-and-Reels.png` | Keep unless you replace later |
| Madhubani bird/lotus backgrounds | Shrink to tiny corner accents or remove from primary view |

### 5.4 `/rootsnreels` (+ ticket pages)

| Keep | Restyle |
|---|---|
| Pricing, BOGO, Razorpay flow, ticket download | Same dark shell as survey |
| Registration form logic | Dark inputs, clearer focus rings on charcoal |
| Ticket success UI | Dark printable-friendly contrast |

Optional: use `jhashree-roots-reels-event` (or winner) as soft hero wash behind the register header.

### 5.5 Admin (`/admin/*`)

| Keep | Restyle |
|---|---|
| Auth, tables, CRUD, panels | Align `admin-shell` + panels to same dark tokens so staff UI matches brand |
| Functionality | Untouched |

---

## 6. Image pipeline

### 6.1 Review set (generated now)

Folder: `public/assets/redesign-candidates/`

| File | Intent | Suggested use |
|---|---|---|
| `jhashree-video-production.jpg` | Crew + cinema camera | Home hero fade #1 |
| `jhashree-social-content.jpg` | Reels / social shoot | Home hero fade #2 |
| `jhashree-branding-workspace.jpg` | Brand / identity craft | Home hero fade #3 or About |
| `jhashree-editing-suite.jpg` | Post-production | Home hero fade #4 |
| `jhashree-mithila-story.jpg` | Culture × filmmaking | About / soft accent |
| `jhashree-roots-reels-event.jpg` | Creator meetup energy | `/rootsnreels` + `/survey` header wash |

You decide keep / reject / regenerate per image.  
Winners move to `public/assets/redesign/` and get wired in code.

### 6.2 Generation criteria

- Photorealistic, documentary/cinematic
- Relevant to Jhashree: video, social, branding, Mithila storytelling, creator events
- No fake logos, no unreadable banner text, no watermarks
- Dark-grade friendly (works under heavy overlay)
- Prefer 16:9 for heroes

### 6.3 After approval

1. Copy winners → `public/assets/redesign/`
2. Wire Home fade stack
3. Wire survey/register header washes
4. Optionally compress to WebP
5. Delete unused candidates to free space

---

## 7. Implementation phases

### Phase 0 — Review (this doc + images)
- [ ] You review candidate images and mark keep/drop/regen
- [x] Confirm font pick: **Space Grotesk** display + Manrope body

### Phase 1 — Design tokens + fonts
- [x] Update `globals.css` tokens
- [x] Update `_app.tsx` fonts (Space Grotesk display + Manrope body)
- [x] Restyle `.site-button` / shared utilities for dark
- [x] Remap former dark `bg-[var(--ink)]` → `bg-[var(--canvas)]` (ink is now text)

### Phase 2 — Home shell
- [ ] Header + footer dark chrome
- [x] Hero atmosphere crossfade (`HeroAtmosphere` + `/assets/redesign/*`)
- [ ] About / Services / Contact / Works restyle
- [x] Madhubani demoted to accents (hero corners + About bird whisper; About lady kept as Mithila touch)

### Phase 3 — Public forms
- [ ] `/survey` shell + form surfaces
- [ ] `/rootsnreels` shell + registration form
- [ ] Ticket pages contrast pass

### Phase 4 — Admin chrome
- [ ] Admin shell + list/detail panels on same tokens
- [ ] Smoke-check login, works, messages, survey/registrations views

### Phase 5 — Polish
- [ ] Motion + reduced-motion
- [ ] Mobile pass
- [ ] Image compression / cleanup candidates
- [ ] Quick a11y contrast check on forms

---

## 8. Risk notes

- **Forms on dark:** inputs need strong borders + clear focus; avoid low-contrast gray-on-gray.
- **Existing cream class names** (`bg-[var(--paper-light)]`) are widespread — retokenizing `--paper-light` to charcoal is the safest migration path.
- **Admin readability:** tables need zebra/hover states tuned for charcoal.
- **Do not break Razorpay / survey submit** — visual-only edits in form components.

---

## 9. Success criteria

- Home first viewport reads as one cinematic composition (brand + one headline + one line + CTA + fading photos).
- `/survey` and `/rootsnreels` feel like the same brand, forms remain fully usable.
- Madhubani is a small cultural touch, not the theme.
- No TechSparks event IA patterns.
- You have approved the final hero image set before launch.

---

## 10. Next step after this plan

1. You mark each candidate image: **keep / drop / regenerate**.
2. Switch to implementation starting Phase 1 (tokens + fonts), then Home, then forms, then admin.
