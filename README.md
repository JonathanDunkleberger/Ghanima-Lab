<p align="center">
  <img src="public/feyris-cat.svg" alt="Feyris mascot — Ghanima" width="72" />
</p>

<h1 align="center">Feyris</h1>

<p align="center">
  <strong>A unified media library for films, TV, anime, games, and books.</strong><br/>
  Discover across sources, collect what you love, get taste-aware recommendations,<br/>
  and discuss titles in the Rabbit Room.
</p>

<p align="center">
  <a href="https://feyrisrec.com">Live site</a>
  ·
  <a href="#why-feyris">Why</a>
  ·
  <a href="#product">Product</a>
  ·
  <a href="#architecture">Architecture</a>
  ·
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/License-MIT-c8a44e" alt="MIT" />
</p>

---

## Why Feyris

Most people don’t consume media in one silo. You finish a film, start the novel it was based on, then drop into a related game — but the tools you use to track taste are still fragmented (Letterboxd for film, MAL for anime, Goodreads for books, Steam for games).

**Feyris** is a product experiment in *cross-medium continuity*: one library, one search surface, one recommendation loop, and room for conversation around each title.

It was built as a hands-on product & engineering project — scoping a real user problem, shipping an end-to-end web app, and iterating on discovery UX, identity, and community features.

> **Brand note.** The name *Feyris* stays for now. The mascot is **Ghanima**, a silver doll-face Persian — a personal dedication that also anchors the product’s visual language (pearl, silver, soft blush, gold accents). Discussion lives in the **Rabbit Room**, inspired by the idea of a small literary circle rather than a drive-by comment box.

---

## Product

### Goals

| Goal | How it shows up |
|------|-----------------|
| Reduce context-switching across media apps | Single search + unified `MediaItem` model |
| Make taste legible | Collection, ratings, Wrapped |
| Recommend *across* mediums, not just within one | For You scoring + diversity weighting |
| Encourage thoughtful discourse | Rabbit Room nested threads (sign-in required) |

### Core surfaces

- **Home** — trending rails across film, TV, anime, games, and books  
- **Collection** — favorites, watched / played / read, want-to lists  
- **For You** — personalized recommendations from your library signals  
- **Wrapped** — a year-in-review style snapshot of consumption  
- **Rabbit Room** — per-title reviews & nested discussion (reviews are root posts)

### Screenshots

<p align="center">
  <img src="docs/screenshots/01-homepage.png" alt="Feyris homepage with trending rails" width="100%" />
  <br/><em>Homepage — unified discovery and trending rails</em>
</p>

<p align="center">
  <img src="docs/screenshots/02-media-detail.png" alt="Media detail panel with Rabbit Room" width="100%" />
  <br/><em>Media detail — actions, ratings, and Rabbit Room</em>
</p>

<p align="center">
  <img src="docs/screenshots/04-for-you.png" alt="For You recommendations" width="100%" />
  <br/><em>For You — taste-aware recommendations</em>
</p>

<p align="center">
  <img src="docs/screenshots/03-collection.png" alt="Collection page empty state" width="100%" />
  <br/><em>Collection — favorites, watched, and watchlist in one place</em>
</p>

---

## Architecture

<p align="center">
  <img src="docs/feyris-architecture.svg" alt="Feyris system architecture diagram" width="100%" />
</p>

**Experience** — Discover, collect, recommend, discuss.  
**Application** — Next.js App Router (TypeScript), Zustand + React Query on the client, Route Handlers as the API boundary, Clerk for auth.  
**Services** — TMDB (film / TV / anime), IGDB via Twitch (games), Google Books, optional OpenAI embeddings for seeding.  
**Data** — Supabase Postgres for profiles, library, activity, and Rabbit Room (`room_posts`, `room_post_votes`); localStorage for lightweight client lists.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 18, Tailwind CSS, Framer Motion |
| Client state | Zustand, TanStack Query |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Media APIs | TMDB, IGDB / Twitch, Google Books |
| Hosting | Vercel |

---

## Quick start

### Prerequisites

- Node.js 18+
- Accounts / keys for TMDB, Twitch (IGDB), Google Books, Supabase, and Clerk

### Setup

```bash
git clone https://github.com/JonathanDunkleberger/Feyris.git
cd Feyris
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` (see [Environment](#environment)), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Rabbit Room schema

If you want discussion threads, run [`supabase/rabbit_room_schema.sql`](supabase/rabbit_room_schema.sql) once in the Supabase SQL Editor. That creates `profiles`, `room_posts`, and `room_post_votes`.

---

## Environment

### Server-side (secret)

| Variable | Purpose |
|----------|---------|
| `TMDB_API_KEY` | Film, TV, anime |
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | IGDB games via Twitch |
| `GOOGLE_BOOKS_API_KEY` | Books |
| `OPENAI_API_KEY` | Optional embeddings / seeding |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes (library, rooms) |
| `CLERK_SECRET_KEY` | Auth |

### Client-side (public)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `NEXT_PUBLIC_DISCORD_INVITE_URL` | Optional community link |

---

## Repository layout

```
Feyris/
├── app/                  # App Router pages + API route handlers
├── components/           # UI (layout, media, room, reviews)
├── hooks/                # Data hooks (library, rooms, media)
├── lib/                  # API adapters, recommendations, Supabase
├── stores/               # Zustand stores
├── supabase/             # SQL schemas (Rabbit Room, etc.)
├── docs/                 # Architecture diagram + screenshots
├── public/               # Static assets (mascot SVG, icons)
└── scripts/              # Utility / seed scripts
```

---

## Roadmap

Shipped in the current build:

- [x] Cross-source search and trending rails  
- [x] Collection, ratings, For You, Wrapped  
- [x] Clerk authentication  
- [x] Rabbit Room (persisted nested discussion)  
- [x] Ghanima brand system (mascot + silver palette)

Good next steps (product / PM backlog):

- [ ] Public profiles with real post history (`/u/[username]`)  
- [ ] Standalone Rabbit Room index (browse active rooms across titles)  
- [ ] Moderation / report flows for community posts  
- [ ] Stronger recommendation evaluation (diversity metrics, A/B hooks)  
- [ ] Import from Letterboxd / MAL / Goodreads  
- [ ] Accessibility and performance pass (Lighthouse, keyboard paths)  
- [ ] Optional rename / sub-branding for book-club style community features  

---

## Design principles

1. **One composition for discovery** — Home should feel like a media universe, not a dashboard dump.  
2. **Identity when it matters** — Browsing is open; discourse requires a real account.  
3. **Cross-medium first** — A recommendation that only stays inside film is a missed product opportunity.  
4. **Personal, not generic** — Visual language and Rabbit Room framing keep the product human.

---

## Attribution

- Film / TV / anime data via [TMDB](https://www.themoviedb.org/) (not endorsed or certified by TMDB)  
- Games via [IGDB](https://www.igdb.com/) / Twitch API  
- Books via [Google Books](https://developers.google.com/books)  
- Logos and trademarks belong to their respective owners  

---

## License

MIT — see [`LICENSE`](LICENSE).

---

<p align="center">
  <sub>Built by Jonathan Dunkleberger · Portfolio / product case study · <a href="https://feyrisrec.com">feyrisrec.com</a></sub>
</p>
