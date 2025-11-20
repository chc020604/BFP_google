import React from 'react';
import { EventCategory } from '../types';

interface CategoryTabsProps {
  activeCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex justify-center md:justify-start space-x-4 sm:space-x-8">
      <button
        onClick={() => onSelectCategory(EventCategory.PERFORMANCE)}
        className={`pb-2 text-base sm:text-lg transition-all duration-300 relative px-2 ${
          activeCategory === EventCategory.PERFORMANCE
            ? 'font-bold'
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <span className={activeCategory === EventCategory.PERFORMANCE ? "bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500" : ""}>
            공연·전시
        </span>
        {activeCategory === EventCategory.PERFORMANCE && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-t-md"></span>
        )}
      </button>
      <button
        onClick={() => onSelectCategory(EventCategory.FESTIVAL)}
        className={`pb-2 text-base sm:text-lg transition-all duration-300 relative px-2 ${
          activeCategory === EventCategory.FESTIVAL
            ? 'font-bold'
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <span className={activeCategory === EventCategory.FESTIVAL ? "bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500" : ""}>
            축제·행사
        </span>
        {activeCategory === EventCategory.FESTIVAL && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-t-md"></span>
        )}
      </button>
    </div>
  );
};

export default CategoryTabs;