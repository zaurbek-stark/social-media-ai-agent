"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function IntroScreen() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [xPosts, setXPosts] = useState("");
  const [linkedInPosts, setLinkedInPosts] = useState("");

  const handleGenerateContent = () => {
    // Placeholder function for generating content
    console.log("Generating content based on:", youtubeLink);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-background rounded-lg shadow-md text-foreground">
      <h3 className="text-2xl font-bold mb-6">
        Drop the link to your YouTube video below
      </h3>

      <div className="space-y-4">
        <div className="space-y-2 mb-10 text-start">
          <Label htmlFor="youtube-link">YouTube Video Link:</Label>
          <Input
            id="youtube-link"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
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
            />
          </div>
        </div>

        <Button
          onClick={handleGenerateContent}
          // className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          className="w-full bg-primary"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Start generating
        </Button>
      </div>
    </div>
  );
}
