"use client";

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { z } from "zod";
import { postSchema } from "../api/schema/schema";

type PartialObject<T> = {
  [P in keyof T]?: T[P] | undefined;
};

type PostRaw = PartialObject<z.infer<typeof postSchema>["posts"][number]>;

interface PostContainerProps {
  postsRaw: (PostRaw | undefined)[];
  className?: string;
}

export default function PostContainer({
  postsRaw,
  className = "",
}: PostContainerProps) {
  const [posts, setPosts] = useState<Post[]>(
    postsRaw.map((post, i) => ({
      // Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      // content: `This is an example post content for post ${
      //   i + 1
      // }. It can be much longer in real scenarios.`,
      content: post?.content,
      potential: post?.potential,
      isFavorite: false,
    }))
  );

  const handleFavorite = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, isFavorite: !post.isFavorite } : post
      )
    );
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className={`w-full mx-auto text-foreground ${className}`}>
      <div className="rounded-lg shadow-lg overflow-hidden grid grid-cols-3 gap-3">
        {posts.map((post) => {
          if (
            post &&
            typeof post.content === "string" &&
            typeof post.potential === "number"
          ) {
            return (
              <SocialMediaPost
                key={post.id}
                post={post}
                onFavorite={handleFavorite}
                onDelete={handleDelete}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

interface Post {
  id: number;
  content?: string;
  potential?: number;
  isFavorite: boolean;
}

interface SocialMediaPostProps {
  maxHeight?: string;
  post: Post;
  onFavorite: (id: number) => void;
  onDelete: (id: number) => void;
}

function SocialMediaPost({ post, onFavorite, onDelete }: SocialMediaPostProps) {
  return (
    <div className="flex flex-col rounded-lg">
      <ScrollArea className="h-full border border-border p-4 rounded-lg my-4 text-start">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </ScrollArea>
      <p className="font-semibold mb-3">Viral Potential: {post.potential}/10</p>
      <div className="flex space-x-4 justify-center">
        <Button
          className="hover:bg-primary"
          variant={post.isFavorite ? "default" : "outline"}
          size="icon"
          onClick={() => onFavorite(post.id)}
          aria-label={
            post.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Star className={post.isFavorite ? "fill-current" : ""} />
        </Button>
        <Button
          className="hover:bg-destructive"
          variant="outline"
          size="icon"
          onClick={() => onDelete(post.id)}
          aria-label="Delete post"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
