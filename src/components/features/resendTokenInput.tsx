'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface ResendTokenProps {
  onSuccess: () => void;
}

export function ResendTokenInput({ onSuccess }: ResendTokenProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5050/api/token/resend', { email });

      if (res.data.success) {
        toast.success('Token sent successfully! Check your inbox.');
        setEmail('');
      } else {
        setError(res.data.error || 'Failed to send token');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setError(msg);
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
              type="email"
              placeholder="Enter your purchase email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className={`pl-10 h-10 ${error ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
              disabled={isSubmitting}
            />
            <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Token'}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          We'll resend the token to the email you used at checkout.
        </p>
      </div>
    </form>
  );
}
