"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { getAssetPrompt } from "../utils/getAssetPrompt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import PostsGrid from "./PostsGrid";
import PostsSkeleton from "./PostsSkeleton";
import { experimental_useObject as useObject } from "ai/react";
import { postSchema } from "../api/schema/schema";
import { z } from "zod";

type PartialObject<T> = {
  [P in keyof T]?: T[P] | undefined;
};

type PostRaw = PartialObject<z.infer<typeof postSchema>["posts"][number]>;

interface RenderPostsProps {
  isLoading: boolean;
  posts?: (PostRaw | undefined)[];
  favouritePosts: string[];
  setFavouritePosts: React.Dispatch<React.SetStateAction<string[]>>;
}

const RenderPosts: React.FC<RenderPostsProps> = ({
  isLoading,
  posts,
  favouritePosts,
  setFavouritePosts,
}) => {
  if (isLoading && !posts) {
    return <PostsSkeleton />;
  }

  if (posts) {
    return (
      <PostsGrid
        postsRaw={posts}
        favouriteXPosts={favouritePosts}
        setFavouriteXPosts={setFavouritePosts}
      />
    );
  }

  return null;
};

const ContentGenerator: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [favouritePosts, setFavouritePosts] = useState([""]);
  const [displayError, setDisplayError] = useState("");
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const {
    object: linkedInObject,
    submit,
    isLoading,
    error,
  } = useObject({
    api: "/api/generate-posts",
    schema: postSchema,
  });

  useEffect(() => {
    if (user) {
      const savedInput = localStorage.getItem("lastInput");
      if (savedInput) {
        setUserInput(savedInput);
        localStorage.removeItem("lastInput");
      }
    }
  }, [user]);

  const onSubmitPosts = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      localStorage.setItem("lastInput", userInput);
      openSignUp();
      return;
    }

    setDisplayError("");

    try {
      await submit({
        body: { userInput, selectedPosts: favouritePosts },
      });
    } catch (error) {
      setDisplayError(
        "There was an error generating content. Please try again."
      );
    }
  };

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <RenderPosts
          isLoading={isLoading}
          posts={linkedInObject?.posts}
          favouritePosts={favouritePosts}
          setFavouritePosts={setFavouritePosts}
        />
      </div>
      <div className="mx-auto p-6 bg-background rounded-lg shadow-md text-foreground max-w-[560px]">
        <form onSubmit={onSubmitPosts}>
          {!isLoading && !linkedInObject?.posts && (
            <div className="mb-5 text-start">
              <Input
                id="user-input"
                type="text"
                placeholder="Enter your topic..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <Button
            className="w-full bg-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-foreground"></div>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                <span>Generate posts</span>
              </>
            )}
          </Button>
        </form>

        {(error || displayError) && (
          <p className="text-red-500 mb-4">{error?.message || displayError}</p>
        )}
      </div>
    </>
  );
};

export default ContentGenerator;
