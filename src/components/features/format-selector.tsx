'use client';

import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUMMARY_FORMATS } from '@/lib/constants';
import type { SummaryFormat } from '@/lib/types';
import { useState } from 'react';

interface FormatSelectorProps {
  selectedFormat: SummaryFormat;
  onChange: (format: SummaryFormat) => void;
  isPro: boolean;
  disabled?: boolean;
}

export function FormatSelector({
  selectedFormat,
  onChange,
  isPro,
  disabled = false,
}: FormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (format: SummaryFormat) => {
    onChange(format);
    setIsOpen(false);
  };

  const currentFormat = SUMMARY_FORMATS[selectedFormat];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex justify-between w-full md:w-auto md:min-w-[200px]"
          disabled={disabled}
        >
          <span className="flex items-center gap-2">
            <span className="font-medium">{currentFormat.label}</span>
            <span className="text-xs text-muted-foreground">{currentFormat.description}</span>
          </span>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full min-w-[220px]">
        {Object.entries(SUMMARY_FORMATS).map(([key, format]) => {
          const isProOnly = format.proOnly;
          const isSelected = selectedFormat === key;

          return (
            <DropdownMenuItem
              key={key}
              disabled={isProOnly && !isPro}
              onClick={() => handleSelect(key as SummaryFormat)}
              className={isSelected ? 'bg-accent' : ''}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{format.label}</span>
                  {isSelected && <Check className="h-4 w-4 mr-2" />}
                </div>
                <span className="text-xs text-muted-foreground">{format.description}</span>
                {isProOnly && !isPro && (
                  <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 mt-1">
                    Pro feature
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
