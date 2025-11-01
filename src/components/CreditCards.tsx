import { CreditCard, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { CreditCard as CreditCardType } from '../types';

interface CreditCardsProps {
  cards: CreditCardType[];
  expandedCard: number | null;
  setExpandedCard: (id: number | null) => void;
  onUpdate: (id: number, field: keyof CreditCardType, value: string | number) => void;
  onUpdateMilestone: (id: number, day: 'day10' | 'day20' | 'day30' | 'day10Next', value: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const CreditCards = ({ cards, expandedCard, setExpandedCard, onUpdate, onUpdateMilestone, onDelete, onAdd }: CreditCardsProps) => {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Thẻ tín dụng
        </h2>
        <button
          onClick={onAdd}
          className="text-white-70 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {cards.map(card => (
          <div key={card.id} className="card-item">
            <div
              className="card-header"
              onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${card.color}`} />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdate(card.id, 'name', e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-white font-semibold text-sm bg-transparent border-none outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">¥{(card.day10Next || 0).toLocaleString()}</span>
                  <span className="badge text-white-60">{card.paymentDay === '27' ? '27' : '6'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(card.id);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedCard === card.id ? (
                    <ChevronUp className="w-4 h-4 text-white-70" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white-70" />
                  )}
                </div>
              </div>
            </div>

            {expandedCard === card.id && (
              <div className="px-3 pb-3 space-y-2 border-t border-white-10 pt-3">
                <div className="space-y-1">
                  <div className="text-white-50 text-xs uppercase mb-2">Chi tiêu theo ngày</div>
                  {[
                    { key: 'day10' as const, label: 'Ngày 10' },
                    { key: 'day20' as const, label: 'Ngày 20' },
                    { key: 'day30' as const, label: 'Ngày 30' },
                    { key: 'day10Next' as const, label: 'Ngày 10 (sau)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="grid grid-cols-2 gap-2 py-1">
                      <span className="text-white-70 text-sm">{label}</span>
                      <input
                        type="number"
                        value={card[key] || 0}
                        onChange={(e) => onUpdateMilestone(card.id, key, parseFloat(e.target.value) || 0)}
                        className="input-field text-white text-right"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 bg-white-5 rounded-lg px-3 mt-3">
                  <span className="text-white-70 text-sm">Ngày đóng</span>
                  <select
                    value={card.paymentDay}
                    onChange={(e) => onUpdate(card.id, 'paymentDay', e.target.value)}
                    className="bg-white-10 text-white px-2 py-1 rounded-lg text-sm border-none outline-none"
                  >
                    <option value="27">27</option>
                    <option value="6">6</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditCards;