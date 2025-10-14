"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidYouTubeUrl } from "@/lib/youtubeUtils";
import { ClipboardCopyIcon, YoutubeIcon } from "lucide-react";
import { toast } from "sonner";

interface YouTubeInputProps {
  onSubmit: (url: string) => void;
  isProcessing: boolean;
}

export function YouTubeInput({ onSubmit, isProcessing }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (isValidYouTubeUrl(clipboardText)) {
        setUrl(clipboardText);
        setError("");
      } else {
        toast.error("Invalid YouTube URL from clipboard");
        setError("Please paste a valid YouTube URL");
      }
    } catch (err) {
      toast.error("Failed to read from clipboard");
      console.error("Clipboard error:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setError("");
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Input
            type="url"
            placeholder="Paste YouTube video URL"
            value={url}
            onChange={(e) => {
              let value = e.target.value.trim();
              if (!/^https?:\/\//i.test(value)) {
                value = "https://" + value;
              }
              setUrl(value);
              if (error && isValidYouTubeUrl(value)) {
                setError("");
              }
            }}
            className={`pl-10 h-12 ${
              error ? "border-red-500 focus-visible:ring-red-400" : ""
            }`}
            disabled={isProcessing}
          />
          <YoutubeIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={handlePaste}
          disabled={isProcessing}
        >
          <ClipboardCopyIcon className="h-5 w-5" />
          <span className="sr-only">Paste from clipboard</span>
        </Button>
        <Button type="submit" className="h-12 px-8" disabled={isProcessing}>
          {isProcessing ? (
            <span className="loader-dots flex justify-center">
              <span className="mx-0.5 h-2 w-2 rounded-full bg-white" />
              <span className="mx-0.5 h-2 w-2 rounded-full bg-white" />
              <span className="mx-0.5 h-2 w-2 rounded-full bg-white" />
            </span>
          ) : (
            "Summarize"
          )}
        </Button>
      </div>
    </form>
  );
}
