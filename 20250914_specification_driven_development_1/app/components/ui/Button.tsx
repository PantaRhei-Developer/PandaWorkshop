'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { ButtonProps } from '@/types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'default',
    loading = false,
    disabled,
    className,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-main/20 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    };
    
    const sizeClasses = {
      default: 'px-6 py-3 text-base',
      large: 'btn-large',
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <div className="spinner w-4 h-4" />
        )}
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
