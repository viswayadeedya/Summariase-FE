'use client';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ThemeToggle } from './theme-toggle';
import { useEffect } from 'react';
import { getTokenFromStorage } from '@/lib/tokenUtils';
import Link from 'next/link';
import Image from 'next/image';
import { useTokenStore } from '@/store/useStoreToken';

export function Header() {
  const { hasToken, setHasToken } = useTokenStore();

  useEffect(() => {
    const token = getTokenFromStorage();
    setHasToken(!!token);
  }, []);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
          <Image className='rounded-xl' src="/summarAIse-logo.png" alt="SummarAIse Logo" width={40} height={40} />
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
