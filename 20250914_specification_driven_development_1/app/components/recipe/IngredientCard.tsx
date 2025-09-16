'use client';

import { clsx } from 'clsx';
import type { IngredientCardProps } from '@/types';

const IngredientCard: React.FC<IngredientCardProps> = ({ 
  category, 
  selected, 
  onClick 
}) => {
  return (
    <div
      className={clsx(
        'w-30 h-30 bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
        'flex flex-col items-center justify-center text-center gap-2',
        'hover:border-primary-main hover:shadow-lg',
        selected 
          ? 'bg-primary-bg border-primary-main border-3 shadow-md' 
          : 'border-gray-200'
      )}
      onClick={onClick}
    >
      {/* Check mark for selected state */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-main rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
      
      {/* Category Icon */}
      <span className="text-3xl mb-2">
        {category.icon}
      </span>
      
      {/* Category Name */}
      <span className="text-sm font-medium text-gray-700">
        {category.name}
      </span>
    </div>
  );
};

export default IngredientCard;
