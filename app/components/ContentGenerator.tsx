import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import SocialPreview from "./SocialPreview";
import { getAssetPrompt } from "../utils/getAssetPrompt";
import { useCompletion } from "ai/react";

const ContentGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
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
        body: { videoUrl, exampleTweets: "TEST" },
      });
    } catch (error) {
      setError("There was an error generating content. Please try again.");
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Generator</h1>
      <p className="mb-4">
        Enter a YouTube video URL to generate social media content.
      </p>
      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex items-center mb-4">
          <input
            className="flex-grow p-2 border rounded-l text-gray-600"
            type="text"
            placeholder="Enter YouTube video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 rounded-r ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
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
