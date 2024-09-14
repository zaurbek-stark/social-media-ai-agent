import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";

interface PostContainerProps {
  maxHeight?: string;
  className?: string;
}

export default function PostContainer({
  maxHeight = "max-h-[100px]",
  className = "",
}: PostContainerProps) {
  const [posts, setPosts] = useState<Post[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      content: `This is an example post content for post ${
        i + 1
      }. It can be much longer in real scenarios.`,
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
    <div className={`w-full max-w-2xl mx-auto text-foreground ${className}`}>
      <div className="rounded-lg shadow-lg overflow-hidden grid grid-cols-3 gap-3">
        {/* {[...Array(6)].map((_, i) => (
          <ScrollArea className={`bg-card p-4 rounded-lg ${maxHeight}`}>
            <div key={i}>
              <h3 className="font-semibold">Tweet {i + 1}</h3>
              <p>
                This is an example tweet content. It can be much longer in real
                scenarios.
              </p>
            </div>
          </ScrollArea>
        ))} */}
        {posts.map((post) => (
          <SocialMediaPost
            key={post.id}
            post={post}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface Post {
  id: number;
  content: string;
  isFavorite: boolean;
}

interface SocialMediaPostProps {
  maxHeight?: string;
  post: Post;
  onFavorite: (id: number) => void;
  onDelete: (id: number) => void;
}

function SocialMediaPost({
  post,
  onFavorite,
  onDelete,
  maxHeight = "max-h-[100px]",
}: SocialMediaPostProps) {
  return (
    <>
      {/* <div className="bg-background p-4 rounded-lg"> */}
      <h3 className="font-semibold">Post {post.id}</h3>
      <ScrollArea className={`bg-background p-4 rounded-lg ${maxHeight}`}>
        <p>{post.content}</p>
      </ScrollArea>
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
    </>
    // </div>
  );
}
