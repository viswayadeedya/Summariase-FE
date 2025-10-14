'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyIcon } from 'lucide-react';
import { validateToken, setTokenInStorage } from '@/lib/tokenUtils';
import { toast } from 'sonner';

interface TokenInputProps {
  onSuccess: () => void;
}

export function TokenInput({ onSuccess }: TokenInputProps) {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please enter your Pro token');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(token)
      const { isValid, tokenType } = validateToken(token);

      if (isValid) {
        // Store the token
        setTokenInStorage(token);

        // Display success message based on token type
        let message = 'Pro token activated successfully!';
        if (tokenType === 'one-time') {
          message = 'One-time purchase token activated! You now have 30 summaries per month.';
        } else if (tokenType === 'monthly') {
          message = 'Monthly subscription token activated! You now have 100 summaries per month.';
        } else if (tokenType === 'yearly') {
          message = 'Yearly subscription token activated! You now have 300 summaries per month.';
        }

        toast.success(message);
        onSuccess();
      } else {
        setError('Invalid token. Please check and try again.');
      }
    } catch (err) {
      console.error('Token validation error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your Pro token"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError('');
              }}
              className={`pl-10 h-10 ${error ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
              disabled={isSubmitting}
            />
            <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Activating...' : 'Activate Token'}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Don't have a token yet?{' '}
          <a href="/pricing" className="text-primary hover:underline">
            Purchase a Pro plan
          </a>
        </p>
      </div>
    </form>
  );
}
