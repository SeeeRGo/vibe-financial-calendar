import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CategoryBalance({ category, onProjectClick }: { 
  category: any;
  onProjectClick: (category: any) => void;
}) {
  const balance = useQuery(api.categories.getRemainingBalance, { categoryId: category._id });
  if (!balance || !category.spendingCap) return null;
  
  const percentage = (balance.spent / balance.cap) * 100;
  const color = percentage > 90 ? 'text-red-500' : percentage > 75 ? 'text-yellow-500' : 'text-green-500';
  
  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between items-center">
        <div className={color}>
          ${balance.remaining.toFixed(2)} remaining of ${balance.cap}
          ({percentage.toFixed(1)}% used)
        </div>
        <button
          onClick={() => onProjectClick(category)}
          className="text-blue-500 hover:text-blue-700 text-xs"
        >
          Project
        </button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color.replace('text', 'bg')}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
