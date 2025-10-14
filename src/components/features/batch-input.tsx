'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { validateBatchUrls } from '@/lib/youtubeUtils';
import { MAX_BATCH_URLS } from '@/lib/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface BatchInputProps {
  onSubmit: (urls: string[]) => void;
  isProcessing: boolean;
}

export function BatchInput({ onSubmit, isProcessing }: BatchInputProps) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInput(clipboardText);
      setErrors([]);
    } catch (err) {
      toast.error('Failed to read from clipboard');
      console.error('Clipboard error:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!input.trim()) {
      setErrors(['Please enter at least one YouTube URL']);
      return;
    }

    // Split input by newlines and other common separators
    const lines = input.split(/[\n,;]+/).map(line => line.trim()).filter(Boolean);

    if (lines.length > MAX_BATCH_URLS) {
      setErrors([`You can only process up to ${MAX_BATCH_URLS} videos at once.`]);
      return;
    }

    if (lines.length === 0) {
      setErrors(['Please enter at least one YouTube URL']);
      return;
    }

    // Validate each URL
    const { valid, invalid } = validateBatchUrls(lines);

    if (valid.length === 0) {
      setErrors(['No valid YouTube URLs found. Please check your input.']);
      return;
    }

    if (invalid.length > 0) {
      setErrors([
        `${invalid.length} invalid URL${invalid.length > 1 ? 's' : ''} found: ${invalid.join(', ')}`,
      ]);
      return;
    }

    // Submit valid URLs
    onSubmit(valid);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col">
          <Textarea
            placeholder={`Enter up to ${MAX_BATCH_URLS} YouTube URLs (one per line)`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (errors.length) setErrors([]);
            }}
            className={`min-h-[150px] ${errors.length ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
            disabled={isProcessing}
          />
          {errors.length > 0 && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePaste}
            disabled={isProcessing}
          >
            Paste from Clipboard
          </Button>

          <Button
            type="submit"
            className="ml-auto"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Summarize All'}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Tip: You can separate URLs by newlines, commas, or semicolons. Maximum {MAX_BATCH_URLS} URLs per batch.
        </p>
      </div>
    </form>
  );
}
