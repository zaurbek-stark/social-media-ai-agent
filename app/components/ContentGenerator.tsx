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

const ContentGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [xPosts, setXPosts] = useState("");
  const [linkedInPosts, setLinkedInPosts] = useState("");

  const [error, setError] = useState("");
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const {
    completion,
    complete,
    isLoading,
    error: completionError,
  } = useCompletion({
    api: "/api/generate-tweets",
    onError: (error) => {
      setError(`An error occurred: ${error.message}`);
    },
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

    setError("");

    try {
      await complete(videoUrl, {
        body: { videoUrl, exampleTweets: xPosts },
      });
    } catch (error) {
      setError("There was an error generating content. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-background rounded-lg shadow-md text-foreground">
      <h3 className="text-2xl font-bold mb-6">
        Drop the link to your YouTube video below
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2 mb-10 text-start">
          <Label htmlFor="youtube-link">YouTube Video Link:</Label>
          <Input
            id="youtube-link"
            type="text"
            placeholder="Enter YouTube video URL..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <h3 className="text-2xl font-bold mb-6">Add inspiration content</h3>
        <p>Paste sample posts from X and LinkedIn to help guide the AI</p>
        <div className="grid grid-cols-2 space-x-2">
          <div className="text-start">
            <Label htmlFor="x-posts">X Posts:</Label>
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
            <Label htmlFor="linkedin-posts">LinkedIn Posts:</Label>
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

        <Button
          className="w-full bg-primary"
          type="submit"
          disabled={isLoading}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {isLoading ? "Generating..." : "Start generating"}
        </Button>
      </form>

      {isLoading && (
        <div className="text-center mb-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Generating content...</p>
        </div>
      )}

      {(error || completionError) && (
        <p className="text-red-500 mb-4">{error || completionError?.message}</p>
      )}

      {completion && <SocialPreview posts={[completion]} />}
    </div>
  );
};

export default ContentGenerator;
