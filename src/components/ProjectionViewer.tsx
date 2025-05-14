import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ProjectionViewer({ category, date, onClose, setDate }: { 
  category: any;
  date: string;
  onClose: () => void;
  setDate: (date: string) => void;
}) {
  const projection = useQuery(api.categories.getProjectedBalance, {
    categoryId: category._id,
    targetDate: date,
  });

  if (!projection || !category.spendingCap) return null;

  const percentage = (projection.projected / projection.cap) * 100;
  const color = percentage > 90 ? 'text-red-500' : percentage > 75 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Projected Balance</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-gray-600">
              {category.spendingCap.period} cap: ${category.spendingCap.amount}
            </p>
          </div>

          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                const newDate = e.target.value;
                if (newDate) {
                  setDate(newDate);
                  window.location.hash = `projection=${category._id},${newDate}`;
                }
              }}
              className="w-full p-2 border rounded mb-2"
            />
            <div className={color}>
              ${projection.remaining.toFixed(2)} remaining
              <span className="text-gray-600"> (${projection.projected.toFixed(2)} projected spend)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full ${color.replace('text', 'bg')}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {percentage > 100 ? (
              <p className="text-red-500">
                Warning: Projected spending exceeds cap by ${(projection.projected - projection.cap).toFixed(2)}
              </p>
            ) : (
              <p>Projected to use {percentage.toFixed(1)}% of cap</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
