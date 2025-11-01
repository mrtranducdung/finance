import { Repeat, Plus, Trash2 } from 'lucide-react';
import type { RecurringExpense } from '../types';

interface RecurringExpensesProps {
  expenses: RecurringExpense[];
  onUpdate: (id: number, field: keyof RecurringExpense, value: string | number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const RecurringExpenses = ({ expenses, onUpdate, onDelete, onAdd }: RecurringExpensesProps) => {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Repeat className="w-5 h-5" />
          Chi phí cố định
        </h2>
        <button
          onClick={onAdd}
          className="text-white-70 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {expenses.map(exp => (
          <div key={exp.id} className="bg-white-5 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={exp.name}
                  onChange={(e) => onUpdate(exp.id, 'name', e.target.value)}
                  className="w-full text-white font-semibold text-sm bg-transparent border-none outline-none"
                  placeholder="Tên khoản chi"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white font-bold text-sm">¥{(exp.amount || 0).toLocaleString()}</span>
                <span className="badge text-white-60">{exp.paymentDay === '27' ? '27' : '6'}</span>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white-10 grid grid-cols-2 gap-2">
              <div>
                <div className="text-white-50 text-xs mb-1">Số tiền</div>
                <input
                  type="number"
                  value={exp.amount || 0}
                  onChange={(e) => onUpdate(exp.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white-10 text-white text-right px-2 py-1 rounded-lg text-sm border-none outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <div className="text-white-50 text-xs mb-1">Ngày đóng</div>
                <select
                  value={exp.paymentDay}
                  onChange={(e) => onUpdate(exp.id, 'paymentDay', e.target.value)}
                  className="w-full bg-white-10 text-white px-2 py-1 rounded-lg text-sm border-none outline-none"
                >
                  <option value="27">27</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringExpenses;