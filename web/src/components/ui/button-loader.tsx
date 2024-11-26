'use client';

import { string } from 'zod';
import Loader2 from './loader2';
import { Button } from './button';

interface ButtonLoaderProps {
  text?: string;
  type?: string;
  disabled?: any
}

export function ButtonLoader({ text = 'Loading...', type, disabled}: ButtonLoaderProps) {
  return (
    <>
      {type === "create" ? (
        <Button className="flex items-center gap-2" disabled={disabled}>
          <Loader2 size="sm" />
          <span>{text}</span>
        </Button>
      ) : (<div className="flex items-center gap-2">
        <Loader2 size="sm" />
        <span>{text}</span>
      </div>)}
    </>

  );
}
