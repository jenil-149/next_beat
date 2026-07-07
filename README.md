# Next Beat

A Spotify-inspired music streaming web app built with Next.js and Supabase. Users can upload songs, create playlists, like tracks, and stream audio directly in the browser.

## Features

- User authentication via Supabase Auth
- Song upload with cover image to Supabase Storage
- Audio playback with seek bar, volume control, and mute toggle
- Skip forward and backward, auto-advance to next track, loops back to start
- Like songs and access them from a dedicated liked songs page
- Create playlists and add songs to them
- Search songs by title with debounce
- Library sidebar showing user-uploaded tracks
- Stripe integration for subscription and billing (products, prices, subscriptions)
- Responsive layout with mobile and desktop player controls

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database and Auth | Supabase (PostgreSQL + Auth + Storage) |
| State Management | Zustand |
| Forms | React Hook Form |
| UI Primitives | Radix UI (Dialog, Slider, Icons) |
| Icons | React Icons |
| Payments | Stripe |
| Notifications | React Hot Toast |
| Font | Poppins (Google Fonts) |

## Project Structure

```
app/              # Next.js App Router pages (site, search, library, liked, playlist, account)
frontend/
  components/     # UI components (Player, Sidebar, Modals, Library, etc.)
  hooks/          # Zustand stores and custom hooks
  providers/      # Context providers (Supabase, User, Modal, Toaster)
  types.ts        # Shared TypeScript types
backend/
  actions/        # Server-side data fetching (getSongs, getLikedSongs, etc.)
database/
  database.types.ts  # Supabase generated types
  supabase/          # Supabase client setup
```

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your Supabase and Stripe credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

3. Run the dev server:

```bash
npm run dev
```

## Learnings

- **Supabase Auth with Next.js App Router** - Handling server-side session access using `auth-helpers-nextjs` alongside client components requires careful separation of server and client Supabase instances.
- **Audio with React refs** - Managing an `HTMLAudioElement` via `useRef` instead of a third-party library gave full control over playback, seek, and cleanup on song change. Proper event listener cleanup in the `useEffect` return is critical to avoid memory leaks and ghost audio.
- **Zustand for media state** - A simple Zustand store handles the player queue, active song, and volume globally without prop drilling, which is the right fit for a persistent player bar that lives outside the page component tree.
- **Next.js revalidation** - Setting `export const revalidate = 0` at the layout level forces fresh data on every request, which matters for a music library that changes frequently.
- **Radix UI Slider** - Using a headless, accessible slider for both the seek bar and volume control avoids building custom drag logic from scratch while keeping full styling control via Tailwind.
- **Debouncing search** - A `useDebounce` hook on the search input prevents firing a Supabase query on every keystroke, reducing unnecessary database reads.
- **Stripe type integration** - Typing billing address and payment method directly against `Stripe.*` types keeps the data model aligned with the Stripe API without maintaining a separate type layer.
