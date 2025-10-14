'use client';

import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex justify-center">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {currentYear} {APP_NAME}.cc All rights reserved.
        </p>
      </div>
    </footer>
  );
}
