"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { postSchema } from "../api/schema/schema";
import Post, { PostType } from "./Post";

type PartialObject<T> = {
  [P in keyof T]?: T[P] | undefined;
};

type PostRaw = PartialObject<z.infer<typeof postSchema>["posts"][number]>;

interface PostContainerProps {
  postsRaw: (PostRaw | undefined)[];
  favouriteXPosts: string[];
  setFavouriteXPosts: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

export default function PostsGrid({
  postsRaw,
  favouriteXPosts,
  setFavouriteXPosts,
  className = "",
}: PostContainerProps) {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    setPosts(
      postsRaw.map((post, i) => ({
        id: i + 1,
        content: post?.content,
        potential: post?.potential,
        isFavorite: false,
      }))
    );
  }, [postsRaw]);

  const handleFavorite = (id: number) => {
    const [postToSet] = posts.filter((post) => post.id === id);

    if (!postToSet.isFavorite) {
      setFavouriteXPosts([...favouriteXPosts, postToSet.content ?? ""]);
      setPosts(
        posts.map((post) =>
          post === postToSet ? { ...post, isFavorite: true } : post
        )
      );
    } else {
      setFavouriteXPosts(
        favouriteXPosts.filter((post) => post !== postToSet.content)
      );
      setPosts(
        posts.map((post) =>
          post === postToSet ? { ...post, isFavorite: false } : post
        )
      );
    }
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div
      className={`w-full text-foreground p-6 rounded-lg shadow-lg overflow-hidden grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 ${className}`}
    >
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onFavorite={handleFavorite}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
