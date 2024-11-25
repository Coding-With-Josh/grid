'use client';

import Loader2 from './loader2';

interface ButtonLoaderProps {
  text?: string;
}

export function ButtonLoader({ text = 'Loading...' }: ButtonLoaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Loader2 size="sm" />
      <span>{text}</span>
    </div>
  );
}
