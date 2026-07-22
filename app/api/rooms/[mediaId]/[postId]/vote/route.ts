import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/profiles";

type RouteCtx = { params: Promise<{ mediaId: string; postId: string }> };

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const { mediaId: rawMedia, postId } = await ctx.params;
  const mediaId = decodeURIComponent(rawMedia);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { value?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const value = body.value;
  if (value !== 1 && value !== -1) {
    return NextResponse.json({ error: "value must be 1 or -1" }, { status: 400 });
  }

  const profile = await ensureProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: "Could not resolve profile" }, { status: 500 });
  }

  const supabase = createServerClient();

  // Confirm post belongs to this room
  const { data: post } = await supabase
    .from("room_posts")
    .select("id")
    .eq("id", postId)
    .eq("media_id", mediaId)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Toggle off if same value already cast
  const { data: existing } = await supabase
    .from("room_post_votes")
    .select("value")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.value === value) {
    await supabase
      .from("room_post_votes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
  } else {
    const { error } = await supabase.from("room_post_votes").upsert(
      { post_id: postId, user_id: userId, value },
      { onConflict: "post_id,user_id" }
    );
    if (error) {
      console.error("Vote upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { data: votes } = await supabase
    .from("room_post_votes")
    .select("value, user_id")
    .eq("post_id", postId);

  const list = votes || [];
  const score = list.reduce((sum, v) => sum + (v.value || 0), 0);
  const myVote =
    (list.find((v) => v.user_id === userId)?.value as 1 | -1 | undefined) ?? null;

  return NextResponse.json({ score, myVote });
}
