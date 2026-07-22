/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

type RouteCtx = { params: Promise<{ mediaId: string; postId: string }> };

export async function PATCH(request: NextRequest, ctx: RouteCtx) {
  const { mediaId: rawMedia, postId } = await ctx.params;
  const mediaId = decodeURIComponent(rawMedia);
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

  const text = typeof body.body === "string" ? body.body.trim() : null;
  if (text === null) {
    return NextResponse.json({ error: "body required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {
    body: text,
    updated_at: new Date().toISOString(),
  };
  if (body.containsSpoilers != null) {
    updates.contains_spoilers = !!body.containsSpoilers;
  }

  const { data, error } = await supabase
    .from("room_posts")
    .update(updates)
    .eq("id", postId)
    .eq("media_id", mediaId)
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .select(
      `
      id, media_id, user_id, parent_id, title, rating, body,
      contains_spoilers, is_deleted, depth, created_at, updated_at,
      profiles:user_id ( id, username, display_name, avatar_url )
    `
    )
    .single();

  if (error) {
    console.error("Room post edit error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row: any = data;
  return NextResponse.json({
    ...row,
    profile: row.profiles || null,
    profiles: undefined,
  });
}

export async function DELETE(_request: NextRequest, ctx: RouteCtx) {
  const { mediaId: rawMedia, postId } = await ctx.params;
  const mediaId = decodeURIComponent(rawMedia);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  // Soft delete — keep the node so replies aren't orphaned
  const { data, error } = await supabase
    .from("room_posts")
    .update({
      is_deleted: true,
      body: "",
      title: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("media_id", mediaId)
    .eq("user_id", userId)
    .select("id, is_deleted")
    .single();

  if (error) {
    console.error("Room post delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, post: data });
}
