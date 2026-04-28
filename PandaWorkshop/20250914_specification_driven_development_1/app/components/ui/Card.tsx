'use client';

import { clsx } from 'clsx';
import type { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false 
}) => {
  return (
    <div
      className={clsx(
        'card',
        hover && 'card-hover',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
