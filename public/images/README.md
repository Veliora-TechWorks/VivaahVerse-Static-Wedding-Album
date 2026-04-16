# 📁 Image Assets — VivaahVerse

Drop your photos into the matching folder. The app references them as `/images/<folder>/<filename>`.

---

## Folder Guide

| Folder | What to put here |
|---|---|
| `couple/` | Bride & groom individual portraits used on the home page couple section |
| `hero/` | Full-width hero / banner photos (home, story, events, gallery pages) |
| `story/` | Timeline photos — one per story milestone (First Meet → Wedding) |
| `events/haldi/` | Haldi ceremony photos |
| `events/mehendi/` | Mehendi ceremony photos |
| `events/sangeet/` | Sangeet night photos |
| `events/wedding/` | Wedding ceremony photos |
| `events/reception/` | Reception photos |
| `gallery/` | General gallery photos shown in the masonry grid |
| `cards/` | Invitation card scans / digital card images |
| `guestbook/` | Optional avatar / background images for the guestbook page |
| `misc/` | Anything else — decorations, venue shots, candid moments |

---

## Recommended Formats
- **Format:** `.jpg` or `.webp` (smaller file size, faster load)
- **Hero images:** 1920 × 1080 px minimum
- **Portrait / couple:** 800 × 1000 px minimum
- **Gallery thumbs:** 600 × 600 px minimum

## Usage in Code
```tsx
// Next.js Image component
<Image src="/images/couple/bride.jpg" alt="Bride" fill className="object-cover" />
<Image src="/images/hero/wedding-hero.jpg" alt="Hero" fill className="object-cover" priority />
```
