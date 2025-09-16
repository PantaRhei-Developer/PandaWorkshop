'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { RecipeCardProps } from '@/types';

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  day, 
  onClick 
}) => {
  const dayLabels = {
    monday: '月曜日',
    tuesday: '火曜日', 
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日',
  };

  return (
    <Card className="w-40 h-70 cursor-pointer" hover>
      {/* Day Header */}
      <div className="h-10 bg-primary-main flex items-center justify-center">
        <span className="text-white text-sm font-bold">
          {dayLabels[day]}
        </span>
      </div>

      {/* Recipe Image */}
      <div className="relative h-25 bg-gray-200 flex items-center justify-center">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-4xl text-gray-400">🍽️</span>
        )}
      </div>

      {/* Recipe Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Recipe Name */}
        <h3 className="text-base font-bold text-gray-700 mb-2 line-clamp-2">
          {recipe.name}
        </h3>

        {/* Cooking Time */}
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <span className="mr-1">⏰</span>
          <span>{recipe.cookingTime}分</span>
        </div>

        {/* Save Button */}
        <div className="mt-auto">
          <Button
            variant="secondary"
            size="default"
            className="w-full h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // Handle save functionality
            }}
          >
            保存
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
