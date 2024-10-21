"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { getAssetPrompt } from "../utils/getAssetPrompt";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import PostsGrid from "./PostsGrid";
import PostsSkeleton from "./PostsSkeleton";
import { useCompletion } from "ai/react";
import { postSchema } from "../api/schema/schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

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
  const [posts, setPosts] = useState();
  const [favouritePosts, setFavouritePosts] = useState([""]);
  const [displayError, setDisplayError] = useState("");
  const { user } = useUser();
  const { openSignUp } = useClerk();
  const [error, setError] = useState("");

  const {
    completion,
    complete,
    isLoading,
    error: completionError,
  } = useCompletion({
    api: "/api/generate-posts",
    onError: (error) => {
      setError(`An error occurred: ${error.message}`);
    },
  });
  console.log("🚀 ~ completion:", completion);

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

    console.log("Hello mate");

    if (!user) {
      localStorage.setItem("lastInput", userInput);
      openSignUp();
      return;
    }

    setDisplayError("");

    try {
      console.log("ohhh");

      await complete(userInput, {
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
          posts={posts}
          favouritePosts={favouritePosts}
          setFavouritePosts={setFavouritePosts}
        />
      </div>
      <div className="mx-auto p-6 bg-background rounded-lg shadow-md text-foreground max-w-[560px]">
        <form onSubmit={onSubmitPosts}>
          {!isLoading && !posts && (
            <div className="mb-5 text-start">
              <Textarea
                className="mt-2 resize-none"
                id="user-input"
                placeholder="Enter your topic..."
                rows={15}
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
