'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { InputProps } from '@/types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    helperText,
    className,
    ...props 
  }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className="form-label block">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          className={clsx(
            'input-field',
            error && 'error',
            className
          )}
          {...props}
        />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="caption text-gray-500">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
