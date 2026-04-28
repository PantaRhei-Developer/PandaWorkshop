'use client';

import type { IngredientCategory } from '@/types';

interface SelectedIngredientsDisplayProps {
  selectedCategories: IngredientCategory[];
  onRemove: (categoryId: string) => void;
}

const SelectedIngredientsDisplay: React.FC<SelectedIngredientsDisplayProps> = ({ 
  selectedCategories, 
  onRemove 
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 min-h-20">
      <h3 className="text-base font-bold text-gray-700 mb-3">
        選択中の食材
      </h3>
      
      {selectedCategories.length === 0 ? (
        <p className="text-gray-500 text-sm">
          食材を選択してください
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={category.id}
              className="tag tag-removable"
            >
              <span className="mr-1">{category.icon}</span>
              <span>{category.name}</span>
              <button
                onClick={() => onRemove(category.id)}
                className="ml-2 text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedIngredientsDisplay;
