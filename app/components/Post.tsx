import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trash2 } from "lucide-react";

export interface PostType {
  id: number;
  content?: string;
  potential?: number;
  isFavorite: boolean;
}

interface SocialMediaPostProps {
  maxHeight?: string;
  post: PostType;
  onFavorite: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Post({
  post,
  onFavorite,
  onDelete,
}: SocialMediaPostProps) {
  return (
    <div className="p-4 rounded-lg grid grid-rows-[1fr_40px] border border-border h-[65vh]">
      <ScrollArea className="border border-border p-4 rounded-lg my-4 text-start">
        <p>{post.content}</p>
      </ScrollArea>
      <div className="flex justify-between items-center">
        <p className="font-semibold">Viral Potential: {post.potential}/10</p>
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
    </div>
  );
}
