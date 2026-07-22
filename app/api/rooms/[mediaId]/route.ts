/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/profiles";

type RouteCtx = { params: Promise<{ mediaId: string }> };

function scoreVotes(votes: { value: number; user_id: string }[] | null, userId?: string | null) {
  const list = votes || [];
  const score = list.reduce((sum, v) => sum + (v.value || 0), 0);
  const myVote = userId
    ? (list.find((v) => v.user_id === userId)?.value as 1 | -1 | undefined) ?? null
    : null;
  return { score, myVote };
}

export async function GET(_request: NextRequest, ctx: RouteCtx) {
  const { mediaId: rawId } = await ctx.params;
  const mediaId = decodeURIComponent(rawId);
  const { userId } = await auth();
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("room_posts")
    .select(
      `
      id, media_id, user_id, parent_id, title, rating, body,
      contains_spoilers, is_deleted, depth, created_at, updated_at,
      profiles:user_id ( id, username, display_name, avatar_url ),
      room_post_votes ( value, user_id )
    `
    )
    .eq("media_id", mediaId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Room fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const posts = (data || []).map((row: any) => {
    const { score, myVote } = scoreVotes(row.room_post_votes, userId);
    const { room_post_votes: _votes, profiles, ...rest } = row;
    return {
      ...rest,
      profile: profiles || null,
      score,
      myVote,
    };
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const { mediaId: rawId } = await ctx.params;
  const mediaId = decodeURIComponent(rawId);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    parentId = null,
    body: postBody = "",
    rating = null,
    title = null,
    containsSpoilers = false,
    mediaSnapshot = null,
  } = body;

  const text = typeof postBody === "string" ? postBody.trim() : "";
  const isRoot = !parentId;

  if (isRoot) {
    if (rating == null || rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Root posts (reviews) require a rating from 1–10" },
        { status: 400 }
      );
    }
  } else if (!text) {
    return NextResponse.json(
      { error: "Reply body is required" },
      { status: 400 }
    );
  }

  const profile = await ensureProfile(userId);
  if (!profile) {
    return NextResponse.json(
      { error: "Could not resolve profile" },
      { status: 500 }
    );
  }

  const supabase = createServerClient();

  // Best-effort media upsert so the title exists if other tables FK to it
  if (mediaSnapshot && typeof mediaSnapshot === "object") {
    const snap = mediaSnapshot as Record<string, unknown>;
    await supabase.from("media").upsert(
      {
        id: mediaId,
        slug: snap.slug || mediaId,
        title: snap.title || mediaId,
        media_type: snap.media_type || "film",
        cover_image_url: snap.cover_image_url || null,
        description: snap.description || null,
      },
      { onConflict: "id" }
    );
  }

  let depth = 0;
  if (parentId) {
    const { data: parent, error: parentErr } = await supabase
      .from("room_posts")
      .select("id, depth, media_id")
      .eq("id", parentId)
      .single();

    if (parentErr || !parent) {
      return NextResponse.json({ error: "Parent post not found" }, { status: 404 });
    }
    if (parent.media_id !== mediaId) {
      return NextResponse.json({ error: "Parent is in a different room" }, { status: 400 });
    }
    depth = (parent.depth ?? 0) + 1;
    if (depth > 12) {
      return NextResponse.json({ error: "Thread too deep" }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("room_posts")
    .insert({
      media_id: mediaId,
      user_id: userId,
      parent_id: parentId,
      title: isRoot && title ? String(title).trim().slice(0, 120) : null,
      rating: isRoot ? rating : null,
      body: text,
      contains_spoilers: !!containsSpoilers,
      depth,
    })
    .select(
      `
      id, media_id, user_id, parent_id, title, rating, body,
      contains_spoilers, is_deleted, depth, created_at, updated_at,
      profiles:user_id ( id, username, display_name, avatar_url )
    `
    )
    .single();

  if (error) {
    console.error("Room post create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row: any = data;
  return NextResponse.json(
    {
      ...row,
      profile: row.profiles || null,
      profiles: undefined,
      score: 0,
      myVote: null,
    },
    { status: 201 }
  );
}
