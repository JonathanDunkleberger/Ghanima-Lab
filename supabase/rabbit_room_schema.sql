-- Rabbit Room schema
-- Run once in the Supabase Dashboard → SQL Editor
-- Discussion threads live on each media detail page.
-- A review = a root post (parent_id IS NULL); replies nest via parent_id.

-- ── Profiles (Clerk user → display identity) ───────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id           text PRIMARY KEY,              -- Clerk user id
  username     text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Room posts (reviews + nested replies) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS room_posts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id          text NOT NULL,            -- e.g. tmdb-2287 (no FK; external titles)
  user_id           text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id         uuid REFERENCES room_posts(id) ON DELETE CASCADE,
  title             text,                     -- optional; root posts only
  rating            smallint CHECK (rating IS NULL OR (rating BETWEEN 1 AND 10)),
  body              text NOT NULL DEFAULT '',
  contains_spoilers boolean NOT NULL DEFAULT false,
  is_deleted        boolean NOT NULL DEFAULT false,
  depth             smallint NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  -- Root posts (reviews) must have a rating; replies must not
  CONSTRAINT room_posts_root_rating CHECK (
    (parent_id IS NULL AND rating IS NOT NULL) OR
    (parent_id IS NOT NULL AND rating IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS room_posts_media_id_idx ON room_posts(media_id);
CREATE INDEX IF NOT EXISTS room_posts_parent_id_idx ON room_posts(parent_id);
CREATE INDEX IF NOT EXISTS room_posts_user_id_idx ON room_posts(user_id);
CREATE INDEX IF NOT EXISTS room_posts_media_created_idx ON room_posts(media_id, created_at DESC);

-- ── Votes (one vote per user per post; toggle off by re-submitting) ────────
CREATE TABLE IF NOT EXISTS room_post_votes (
  post_id    uuid NOT NULL REFERENCES room_posts(id) ON DELETE CASCADE,
  user_id    text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  value      smallint NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS room_post_votes_user_id_idx ON room_post_votes(user_id);
