'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidYouTubeUrl } from '@/lib/youtubeUtils';
import { toast } from 'sonner';
import { Trash2Icon, YoutubeIcon, PlusIcon } from 'lucide-react';

interface YouTubeBatchInputProps {
  onSubmit: (urls: string[]) => void;
  isProcessing: boolean;
}

export function YouTubeBatchInput({ onSubmit, isProcessing }: YouTubeBatchInputProps) {
  const [urls, setUrls] = useState<string[]>(['']);
  const maxLinks = 5;

  const handleChange = (value: string, index: number) => {
    let urlLink = value.trim();
    if (!/^https?:\/\//i.test(value)) {
        value = 'https://' + value;
    }
    const newUrls = [...urls];
    newUrls[index] = urlLink;
    setUrls(newUrls);
  };

  const handleAdd = () => {
    if (urls.length >= maxLinks) return;
    setUrls([...urls, '']);
  };

  const handleRemove = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrls = urls.map((u) => u.trim()).filter(Boolean);

    if (trimmedUrls.length === 0) {
      toast.error('Please enter at least one YouTube URL.');
      return;
    }

    if (trimmedUrls.some((u) => !isValidYouTubeUrl(u))) {
      toast.error('One or more URLs are invalid.');
      return;
    }

    onSubmit(trimmedUrls);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      {urls.map((url, index) => (
        <div key={index} className="relative flex gap-2 items-center">
          <YoutubeIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="url"
            placeholder={`YouTube video URL ${index + 1}`}
            value={url}
            onChange={(e) => handleChange(e.target.value, index)}
            className="pl-10 h-12"
            disabled={isProcessing}
          />
          {urls.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={urls.length >= maxLinks || isProcessing}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Video
        </Button>

        <Button type="submit" className="px-6 h-10" disabled={isProcessing}>
          {isProcessing ? (
            <span className="loader-dots flex justify-center">
              <span className="mx-0.5 h-2 w-2 rounded-full bg-white" />
              <span className="mx-0.5 h-2 w-2 rounded-full bg-white" />
              <span className="mx-0.5 h-2 w-2 rounded-full bg-white" />
            </span>
          ) : (
            'Summarize All'
          )}
        </Button>
      </div>
    </form>
  );
}
