# Claude Code Prompt — MLB Merchandise Tracker

## Overview

Build a full-stack web application called **"The Dugout"** for tracking MLB merchandise — specifically hats and jerseys. The app should be mobile-first, responsive, modern, and dead simple to use. No authentication required. The design theme should be inspired by the **Los Angeles Dodgers** (Dodger Blue `#005A9C`, white, and subtle gray accents). Deploy-ready on **Vercel** using **Next.js App Router** with **Supabase** as the backend (Postgres DB + image storage).

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router, Server Components where appropriate)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase Postgres
- **Image Storage:** Supabase Storage (create a public bucket called `merchandise-images`)
- **Deployment:** Vercel
- **State/Data Fetching:** React Server Components + Supabase JS client. Use server actions for mutations where appropriate.

---

## Supabase Schema

### Table: `hats`

| Column       | Type      | Notes                                      |
| ------------ | --------- | ------------------------------------------ |
| id           | uuid (PK) | Default `gen_random_uuid()`                |
| team         | text      | MLB team name (from predefined list)       |
| color_design | text      | Free text — color or design description    |
| storage_bin  | text      | One of: `Box 1`, `Box 2`, `Box 3`, `Box 4`|
| image_url    | text      | Public URL from Supabase Storage           |
| created_at   | timestamp | Default `now()`                            |
| updated_at   | timestamp | Default `now()`                            |

### Table: `jerseys`

| Column       | Type      | Notes                                      |
| ------------ | --------- | ------------------------------------------ |
| id           | uuid (PK) | Default `gen_random_uuid()`                |
| team         | text      | MLB team name (from predefined list)       |
| player       | text      | Player name                                |
| color_design | text      | Free text — color or design description    |
| image_url    | text      | Public URL from Supabase Storage           |
| created_at   | timestamp | Default `now()`                            |
| updated_at   | timestamp | Default `now()`                            |

### Supabase Storage

- Create a **public** bucket named `merchandise-images`
- Images should be uploaded with unique filenames (e.g., `{uuid}-{original_filename}`)
- Store the resulting public URL in the `image_url` column

### RLS (Row Level Security)

- Disable RLS on both tables (no auth required — open access)
- Make sure Supabase anon key has full CRUD access

---

## MLB Teams List

Use this complete list of all 30 MLB teams as a dropdown/select in all forms. Pre-sort alphabetically. Place **Los Angeles Dodgers** at the top of the list as a favorite/pinned option, visually separated from the rest:

Arizona Diamondbacks, Atlanta Braves, Baltimore Orioles, Boston Red Sox, Chicago Cubs, Chicago White Sox, Cincinnati Reds, Cleveland Guardians, Colorado Rockies, Detroit Tigers, Houston Astros, Kansas City Royals, Los Angeles Angels, Los Angeles Dodgers, Miami Marlins, Milwaukee Brewers, Minnesota Twins, New York Mets, New York Yankees, Oakland Athletics, Philadelphia Phillies, Pittsburgh Pirates, San Diego Padres, San Francisco Giants, Seattle Mariners, St. Louis Cardinals, Tampa Bay Rays, Texas Rangers, Toronto Blue Jays, Washington Nationals

---

## Pages & Layout

### Global Layout

- Clean top navigation bar with app name **"The Dugout"** and a baseball/⚾ icon
- Nav links: **Dashboard**, **Hats**, **Jerseys**
- Bottom mobile nav bar (for mobile) with the same three sections + an "Add" quick action button
- Dodgers blue (`#005A9C`) as the primary accent color. White background, light gray (`#F5F5F5`) card backgrounds. Use a clean sans-serif font.
- All pages must look great on mobile (375px+) and desktop (1024px+)

### 1. Dashboard (`/`)

The home page. Think of it like a mini PowerBI dashboard — visual, filterable, and informative.

**Stats Summary Cards (top of page):**
- Total Hats count
- Total Jerseys count
- Total Items (combined)
- Storage Bin breakdown: show count per box (Box 1, Box 2, Box 3, Box 4) — hats only since jerseys don't have bins

**Filters (shared, apply to all dashboard content below):**
- Filter by Type: All / Hats / Jerseys
- Filter by Team (dropdown, multi-select or single-select)
- Filter by Color/Design (search text input)
- Clear All Filters button

**Visual Breakdown Section:**
- A simple bar chart or visual showing items per team (top 10 teams by count)
- Items grid/list showing recent additions (most recent first), showing thumbnail, team, and type. Clicking an item navigates to its detail in the appropriate section.

### 2. Hats Page (`/hats`)

**View: Filterable Gallery**
- Grid of hat cards (2 columns on mobile, 3–4 on desktop)
- Each card shows: thumbnail image, team name, color/design, storage bin badge
- Clicking a card opens a detail view/modal with full image + all info + Edit and Delete buttons

**Filters (top of page, collapsible on mobile):**
- Team (dropdown)
- Color/Design (text search)
- Storage Bin (dropdown: All, Box 1, Box 2, Box 3, Box 4)

**Add Hat Button:**
- Prominent floating action button (FAB) on mobile, standard button on desktop
- Opens a form (modal or dedicated page) with:
  - Image upload (tap to select from camera/gallery, show preview before saving)
  - Team (dropdown select from MLB teams list — Dodgers pinned at top)
  - Color/Design (free text input)
  - Storage Bin (select: Box 1, Box 2, Box 3, Box 4)
  - Save and Cancel buttons

**Edit Flow:**
- Same form as Add, pre-populated with existing data
- Ability to replace the image

**Delete Flow:**
- Confirmation dialog before deleting
- Also deletes the image from Supabase Storage

### 3. Jerseys Page (`/jerseys`)

**View: Filterable Gallery**
- Same grid layout as hats
- Each card shows: thumbnail image, team name, player name, color/design
- Clicking a card opens detail view/modal with full image + all info + Edit and Delete buttons

**Filters (top of page, collapsible on mobile):**
- Team (dropdown)
- Player (text search)
- Color/Design (text search)

**Add Jersey Button:**
- Same FAB pattern as hats
- Form fields:
  - Image upload (same UX as hats)
  - Team (dropdown select from MLB teams list — Dodgers pinned at top)
  - Player (text input)
  - Color/Design (free text input)
  - Save and Cancel buttons

**Edit and Delete:** Same pattern as hats.

---

## Image Handling

- Accept common image formats: JPEG, PNG, WEBP
- Compress/resize on the client before uploading if the image is larger than 2MB (use browser canvas API or a lightweight library)
- Show a preview of the selected image in the form before saving
- Display images in cards as square thumbnails (object-fit: cover)
- In the detail view, show the full image

---

## UX Details

- Use loading skeletons/spinners when data is being fetched
- Show toast notifications for success (item added, updated, deleted) and errors
- Empty states: when no hats or jerseys exist yet, show a friendly message with a call to action to add the first item ("No hats yet — add your first one!")
- Forms should have validation: team is required, image is optional but encouraged (show a placeholder image if none), player is required for jerseys
- All actions should feel snappy — use optimistic UI where possible
- The image field should be very mobile-friendly — large tap target, clearly labeled "Tap to add a photo"

---

## Environment Variables

The app needs these environment variables (to be set in Vercel and in a local `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=<supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
```

---

## Folder Structure Suggestion

```
src/
  app/
    layout.tsx          # Global layout with nav
    page.tsx            # Dashboard
    hats/
      page.tsx          # Hats gallery + filters
    jerseys/
      page.tsx          # Jerseys gallery + filters
  components/
    ui/                 # shadcn/ui components
    dashboard/          # Dashboard-specific components (stats cards, charts, etc.)
    merchandise/        # Shared components (card, detail modal, form, filters, image upload)
    layout/             # Nav, mobile bottom bar
  lib/
    supabase.ts         # Supabase client initialization
    types.ts            # TypeScript types for Hat, Jersey
    constants.ts        # MLB teams list, storage bin options
    utils.ts            # Helpers (image compression, etc.)
```

---

## Deployment Notes

- Configure `next.config.js` to allow Supabase storage domain in `images.remotePatterns`
- Ensure the Supabase storage bucket is public so images render without auth tokens
- Add environment variables in Vercel project settings before deploying

---

## Summary Priorities

1. **Mobile-first** — this will primarily be used on a phone
2. **Simple to use** — big buttons, clear labels, minimal steps to add an item
3. **Dodgers theme** — Dodger Blue accent, clean white/gray, feels like a sports app
4. **Reliable** — data persists, images load, filtering is fast
5. **Dashboard feels useful** — quick glance at collection stats and recent items