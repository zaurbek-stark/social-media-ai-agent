import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import SocialPreview from "./SocialPreview";
import { getAssetPrompt } from "../utils/getAssetPrompt";
import { useCompletion } from "ai/react";

const ContentGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [socialPosts, setSocialPosts] = useState<string[]>(["", "", ""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();
  const { openSignUp } = useClerk();
  const { complete } = useCompletion({
    api: "/api/generate-tweets",
    body: {
      videoUrl,
    },
    onFinish: (prompt, completion) => {
      setError("");

      let generatedContent = completion;
      setSocialPosts([generatedContent]);
      setIsLoading(false);
    },
    onError: (error) => {
      setError(`An error occurred calling the OpenAI API: ${error}`);
      setIsLoading(false);
    },
  });

  // useEffect(() => {
  //   if (user) {
  //     // If the user is authenticated, get the last input from localStorage
  //     const savedInput = localStorage.getItem("lastInput");
  //     if (savedInput) {
  //       handleInputChange({e: {target: savedInput}} as React.ChangeEvent<HTMLInputElement>);
  //       localStorage.removeItem("lastInput");
  //     }
  //   }
  // }, [user]);

  const generateAssets = async (input: string) => {
    const response = await fetch(`/api/social-posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: getAssetPrompt(input) }),
    });
    const { posts, message } = await response.json();
    if (posts) {
      setSocialPosts((currentPosts) => [...currentPosts, posts]);
    } else {
      setError(message);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      localStorage.setItem("lastInput", videoUrl);
      openSignUp();
      return;
    }

    setError("");
    setIsLoading(true);
    setSocialPosts([]);

    try {
      complete(videoUrl, {
        body: {
          context: "HELLO",
        },
      });
    } catch (error) {
      setError(
        "There was an error generating the illustration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="instructions-text">
        Enter the idea/concept that you want to visualize.
      </p>
      <form className="inline-flex m-auto" onSubmit={onSubmit}>
        <div className="input-group">
          <input
            className="input-style"
            name="idea-input"
            type="text"
            placeholder='e.g. "Smart work beats hard work"'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <div>
          <button
            className="label-style send-button"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      <SocialPreview posts={socialPosts} />
    </div>
  );
};

export default ContentGenerator;
