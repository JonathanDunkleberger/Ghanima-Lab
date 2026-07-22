"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export type RoomProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type RoomPost = {
  id: string;
  media_id: string;
  user_id: string;
  parent_id: string | null;
  title: string | null;
  rating: number | null;
  body: string;
  contains_spoilers: boolean;
  is_deleted: boolean;
  depth: number;
  created_at: string;
  updated_at: string;
  profile: RoomProfile | null;
  score: number;
  myVote: 1 | -1 | null;
};

export type RoomPostNode = RoomPost & { children: RoomPostNode[] };

export function buildTree(flat: RoomPost[]): RoomPostNode[] {
  const map = new Map<string, RoomPostNode>();
  const roots: RoomPostNode[] = [];

  for (const p of flat) {
    map.set(p.id, { ...p, children: [] });
  }
  for (const p of flat) {
    const node = map.get(p.id)!;
    if (p.parent_id && map.has(p.parent_id)) {
      map.get(p.parent_id)!.children.push(node);
    } else if (!p.parent_id) {
      roots.push(node);
    }
  }
  // Newest roots first; replies stay chronological
  roots.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return roots;
}

function roomKey(mediaId: string) {
  return ["room", mediaId] as const;
}

export function useRoomPosts(mediaId: string | undefined) {
  return useQuery({
    queryKey: roomKey(mediaId || ""),
    queryFn: async () => {
      const res = await fetch(`/api/rooms/${encodeURIComponent(mediaId!)}`);
      if (!res.ok) throw new Error("Failed to load Rabbit Room");
      const data = await res.json();
      return (data.posts || []) as RoomPost[];
    },
    enabled: !!mediaId,
    staleTime: 30_000,
  });
}

type CreatePayload = {
  parentId?: string | null;
  body: string;
  rating?: number | null;
  title?: string | null;
  containsSpoilers?: boolean;
  mediaSnapshot?: Record<string, unknown>;
};

export function useCreatePost(mediaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayload) => {
      const res = await fetch(`/api/rooms/${encodeURIComponent(mediaId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to post");
      }
      return res.json() as Promise<RoomPost>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKey(mediaId) });
    },
  });
}

export function useVotePost(mediaId: string) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, value }: { postId: string; value: 1 | -1 }) => {
      const res = await fetch(
        `/api/rooms/${encodeURIComponent(mediaId)}/${postId}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        }
      );
      if (!res.ok) throw new Error("Failed to vote");
      return res.json() as Promise<{ score: number; myVote: 1 | -1 | null }>;
    },
    onMutate: async ({ postId, value }) => {
      await queryClient.cancelQueries({ queryKey: roomKey(mediaId) });
      const prev = queryClient.getQueryData<RoomPost[]>(roomKey(mediaId));
      if (prev && userId) {
        queryClient.setQueryData<RoomPost[]>(
          roomKey(mediaId),
          prev.map((p) => {
            if (p.id !== postId) return p;
            const was = p.myVote;
            let nextVote: 1 | -1 | null = value;
            let delta: number = value;
            if (was === value) {
              nextVote = null;
              delta = -value;
            } else if (was) {
              delta = value - was;
            }
            return { ...p, myVote: nextVote, score: p.score + delta };
          })
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(roomKey(mediaId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomKey(mediaId) });
    },
  });
}

export function useDeletePost(mediaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(
        `/api/rooms/${encodeURIComponent(mediaId)}/${postId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKey(mediaId) });
    },
  });
}
