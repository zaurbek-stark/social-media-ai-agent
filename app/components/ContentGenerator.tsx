"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import SocialPreview from "./SocialPreview";
import { getAssetPrompt } from "../utils/getAssetPrompt";
import { useCompletion } from "ai/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import PostContainer from "./PostsScreen";
import PostsSkeleton from "./PostsSkeleton";
import { experimental_useObject as useObject } from "ai/react";
import { postSchema } from "../api/schema/schema";

const ContentGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [xPosts, setXPosts] = useState("");
  const [linkedInPosts, setLinkedInPosts] = useState("");
  const [displayError, setDisplayError] = useState("");
  const { user } = useUser();
  const { openSignUp } = useClerk();

  // const {
  //   completion,
  //   complete,
  //   isLoading,
  //   error: completionError,
  // } = useCompletion({
  //   api: "/api/generate-tweets",
  //   onError: (error) => {
  //     setDisplayError(`An error occurred: ${error.message}`);
  //   },
  // });

  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate-tweets",
    schema: postSchema,
  });

  useEffect(() => {
    if (user) {
      const savedInput = localStorage.getItem("lastInput");
      if (savedInput) {
        setVideoUrl(savedInput);
        localStorage.removeItem("lastInput");
      }
    }
  }, [user]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      localStorage.setItem("lastInput", videoUrl);
      openSignUp();
      return;
    }

    setDisplayError("");

    try {
      await submit({
        body: { videoUrl, exampleTweets: xPosts },
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
        {isLoading && <PostsSkeleton />}
        {/* <PostsSkeleton /> */}

        {!isLoading && object?.posts && (
          <PostContainer postsRaw={object?.posts} />
        )}
        {/* <PostContainer /> */}
      </div>
      <div className="mx-auto p-6 bg-background rounded-lg shadow-md text-foreground max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-4">
          {!isLoading && !object?.posts && (
            <>
              <div className="space-y-2 mb-10 text-start">
                <Input
                  id="youtube-link"
                  type="text"
                  placeholder="Enter YouTube video URL..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <p>Paste sample posts from X and LinkedIn to help guide the AI</p>
              <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-2">
                <div className="text-start">
                  <Textarea
                    className="mt-2"
                    id="x-posts"
                    placeholder="Paste example X posts here..."
                    rows={6}
                    value={xPosts}
                    onChange={(e) => setXPosts(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-start">
                  <Textarea
                    className="mt-2"
                    id="linkedin-posts"
                    placeholder="Paste example LinkedIn posts here..."
                    rows={6}
                    value={linkedInPosts}
                    onChange={(e) => setLinkedInPosts(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
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
                <span>Generate X posts</span>
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
