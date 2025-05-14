import { Id } from "../../convex/_generated/dataModel";
import { ReactNode } from "react";

interface EventModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  onToggle?: (event: any) => void;
  selectedDate: string;
  getCategoryOptions: (type: string) => ReactNode[];
  editingEvent?: any;
}

export function EventModal({ 
  onClose, 
  onSubmit, 
  onDelete,
  onToggle,
  selectedDate, 
  getCategoryOptions,
  editingEvent,
}: EventModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{editingEvent ? 'Edit' : 'Add'} Financial Event</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            required
            defaultValue={editingEvent?.title}
          />
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            className="w-full p-2 border rounded"
            required
            defaultValue={editingEvent?.amount}
          />
          {!editingEvent && (
            <select name="type" className="w-full p-2 border rounded" required defaultValue={editingEvent?.type}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          )}
          <select 
            name="categoryId" 
            className="w-full p-2 border rounded" 
            required
            defaultValue={editingEvent?.categoryId}
          >
            <optgroup label="Income Categories">
              {getCategoryOptions('income')}
            </optgroup>
            <optgroup label="Expense Categories">
              {getCategoryOptions('expense')}
            </optgroup>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded"
            defaultValue={editingEvent?.description}
          />
          {!editingEvent && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="recurring"
                  id="recurring"
                  className="rounded"
                />
                <label htmlFor="recurring">Recurring Event</label>
              </div>
              <div className="space-y-2 recurring-options">
                <select name="frequency" className="w-full p-2 border rounded">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <input
                  type="date"
                  name="endDate"
                  className="w-full p-2 border rounded"
                  placeholder="End Date (Optional)"
                />
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingEvent ? 'Update' : 'Add'} Event
              </button>
            </div>
            {editingEvent && (
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => onToggle?.(editingEvent)}
                  className={`px-4 py-2 ${editingEvent.enabled ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded`}
                >
                  {editingEvent.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
