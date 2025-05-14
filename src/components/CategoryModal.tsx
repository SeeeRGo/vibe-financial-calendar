import { Id } from "../../convex/_generated/dataModel";
import { CategoryBalance } from "./CategoryBalance";

interface CategoryModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  categories: any[];
  editingCategory: any;
  setEditingCategory: (category: any) => void;
  showSpendingCap: boolean;
  setShowSpendingCap: (show: boolean) => void;
  onProjectClick: (category: any) => void;
}

export function CategoryModal({
  onClose,
  onSubmit,
  categories,
  editingCategory,
  setEditingCategory,
  showSpendingCap,
  setShowSpendingCap,
  onProjectClick,
}: CategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Categories</h3>
          <button
            onClick={() => {
              onClose();
              setEditingCategory(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Add Category</h4>
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Category Name"
                className="w-full p-2 border rounded"
                required
                defaultValue={editingCategory?.name || ''}
              />
              {!editingCategory && (
                <select name="type" className="w-full p-2 border rounded" required>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              )}
              <select name="parentId" className="w-full p-2 border rounded">
                <option value="">No Parent (Main Category)</option>
                {categories
                  .filter(cat => !cat.parentId && (!editingCategory || cat._id !== editingCategory._id))
                  .map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="hasSpendingCap"
                    id="hasSpendingCap"
                    className="rounded"
                    defaultChecked={!!editingCategory?.spendingCap}
                    onChange={(e) => setShowSpendingCap(e.target.checked)}
                  />
                  <label htmlFor="hasSpendingCap">Set Spending Cap</label>
                </div>
                
                {(showSpendingCap || editingCategory?.spendingCap) && (
                  <div className="space-y-2">
                    <input
                      type="number"
                      name="capAmount"
                      step="0.01"
                      placeholder="Cap Amount"
                      className="w-full p-2 border rounded"
                      defaultValue={editingCategory?.spendingCap?.amount}
                      required
                    />
                    <select
                      name="capPeriod"
                      className="w-full p-2 border rounded"
                      defaultValue={editingCategory?.spendingCap?.period || 'monthly'}
                      required
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </form>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <div className="space-y-2">
              <div className="font-medium">Income Categories</div>
              {categories
                .filter(cat => cat.type === 'income' && !cat.parentId)
                .map(cat => (
                  <div key={cat._id} className="pl-2">
                    <div className="flex items-center justify-between">
                      <span>{cat.name}</span>
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                    <CategoryBalance category={cat} onProjectClick={onProjectClick} />
                    {categories
                      .filter(subCat => subCat.parentId === cat._id)
                      .map(subCat => (
                        <div key={subCat._id} className="pl-4">
                          <div className="flex items-center justify-between">
                            <span>↳ {subCat.name}</span>
                            <button
                              onClick={() => setEditingCategory(subCat)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                          </div>
                          <CategoryBalance category={subCat} onProjectClick={onProjectClick} />
                        </div>
                      ))}
                  </div>
                ))}
              
              <div className="font-medium mt-4">Expense Categories</div>
              {categories
                .filter(cat => cat.type === 'expense' && !cat.parentId)
                .map(cat => (
                  <div key={cat._id} className="pl-2">
                    <div className="flex items-center justify-between">
                      <span>{cat.name}</span>
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                    <CategoryBalance category={cat} onProjectClick={onProjectClick} />
                    {categories
                      .filter(subCat => subCat.parentId === cat._id)
                      .map(subCat => (
                        <div key={subCat._id} className="pl-4">
                          <div className="flex items-center justify-between">
                            <span>↳ {subCat.name}</span>
                            <button
                              onClick={() => setEditingCategory(subCat)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                          </div>
                          <CategoryBalance category={subCat} onProjectClick={onProjectClick} />
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
