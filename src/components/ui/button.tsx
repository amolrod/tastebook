import { Slot } from '@radix-ui/react-slot';
import { type ButtonHTMLAttributes, type ForwardedRef, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonProps = {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:
    'bg-brand text-white shadow-sm hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
  outline:
    'border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 rounded-full px-4 text-xs font-semibold',
  md: 'h-10 rounded-full px-5 text-sm font-semibold',
  lg: 'h-11 rounded-full px-6 text-base font-semibold'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'md', asChild = false, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        className={cn(
          'inline-flex items-center justify-center gap-2 transition focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
