import { type ForwardedRef, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[140px] w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm transition focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';
