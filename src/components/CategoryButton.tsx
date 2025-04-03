
import React from 'react';
import { cn } from "@/lib/utils";
import { Mountain, Palette, HeartPulse, Users, Utensils, Music, Laptop, Gamepad, Stethoscope } from "lucide-react";

interface CategoryButtonProps {
  category: string;
  onClick: () => void;
  isActive: boolean;
}

const getCategoryIcon = (category: string) => {
  switch(category.toLowerCase()) {
    case 'outdoors':
      return <Mountain size={24} />;
    case 'arts & crafts':
      return <Palette size={24} />;
    case 'sports':
      return <HeartPulse size={24} />;
    case 'educational':
      return <Users size={24} />;
    case 'cooking':
      return <Utensils size={24} />;
    case 'music':
      return <Music size={24} />;
    case 'technology':
      return <Laptop size={24} />;
    case 'gaming':
      return <Gamepad size={24} />;
    case 'wellness':
      return <Stethoscope size={24} />;
    default:
      return <Users size={24} />;
  }
};

const getCategoryColor = (category: string) => {
  switch(category.toLowerCase()) {
    case 'outdoors':
      return 'bg-kids-green';
    case 'arts & crafts':
      return 'bg-kids-teal';
    case 'sports':
      return 'bg-kids-yellow';
    case 'educational':
      return 'bg-kids-pink';
    case 'cooking':
      return 'bg-kids-orange';
    case 'music':
      return 'bg-kids-purple';
    case 'technology':
      return 'bg-kids-pink';
    case 'gaming':
      return 'bg-kids-pink';
    case 'wellness':
      return 'bg-kids-pink';
    default:
      return 'bg-kids-blue';
  }
};

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, onClick, isActive }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      <div 
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center text-white mb-2 transition-transform hover:scale-105",
          getCategoryColor(category)
        )}
      >
        {getCategoryIcon(category)}
      </div>
      <span className="text-sm font-medium text-gray-700">{category}</span>
    </div>
  );
};

export default CategoryButton;
