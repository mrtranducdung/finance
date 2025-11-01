import { CreditCard, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface FixedSpending {
  id: number;
  name: string;
  amount: number;
}

interface CreditCardType {
  id: number;
  name: string;
  color: string;
  day10: number;
  day20: number;
  day30: number;
  day10Next: number;
  paymentDay: '27' | '6';
  fixedSpending: FixedSpending[];
}

interface CreditCardsProps {
  cards?: CreditCardType[];
  expandedCard?: number | null;
  setExpandedCard?: (id: number | null) => void;
  onUpdate?: (id: number, field: keyof CreditCardType, value: string | number) => void;
  onUpdateMilestone?: (id: number, day: 'day10' | 'day20' | 'day30' | 'day10Next', value: number) => void;
  onDelete?: (id: number) => void;
  onAdd?: () => void;
  onAddFixedSpending?: (cardId: number) => void;
  onUpdateFixedSpending?: (cardId: number, spendingId: number, field: 'name' | 'amount', value: string | number) => void;
  onDeleteFixedSpending?: (cardId: number, spendingId: number) => void;
}

const CreditCards = ({ 
  cards = [], 
  expandedCard = null, 
  setExpandedCard = () => {}, 
  onUpdate = () => {}, 
  onUpdateMilestone = () => {}, 
  onDelete = () => {}, 
  onAdd = () => {},
  onAddFixedSpending = () => {},
  onUpdateFixedSpending = () => {},
  onDeleteFixedSpending = () => {}
}: CreditCardsProps) => {
  const calculateCardValues = (card: CreditCardType) => {
    const biggestNumber = Math.max(card.day10 || 0, card.day20 || 0, card.day30 || 0, card.day10Next || 0);
    const totalFixedSpending = (card.fixedSpending || []).reduce((sum, item) => sum + (item.amount || 0), 0);
    const monthlySpend = biggestNumber - totalFixedSpending;
    
    return { biggestNumber, totalFixedSpending, monthlySpend };
  };

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
        {cards.map(card => {
          const { biggestNumber, totalFixedSpending, monthlySpend } = calculateCardValues(card);
          
          return (
            <div key={card.id} className="card-item">
              <div
                className="card-header"
                onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
              >
                <div className="flex items-center gap-2 ">
                  <div className="flex items-center gap-2 w-1/3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${card.color}`} />
                    <input
                      type="text"
                      value={card.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdate(card.id, 'name', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-white font-semibold text-sm bg-transparent border-none outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2, w-2/3">
                    <div className="flex items-center text-xs gap-2 justify-between, w-full">
                      <span className="text-orange-300">¥{totalFixedSpending.toLocaleString()}</span>
                      <span className="text-white-50">|</span>
                      <span className="text-green-300">¥{monthlySpend.toLocaleString()}</span>
                      <span className="text-white-50">|</span>
                      <span className="text-blue-300">¥{biggestNumber.toLocaleString()}</span>
                    </div>
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
                <div className="px-3 pb-3 space-y-3 border-t border-white-10 pt-3">
                  {/* Chi tiêu theo ngày */}
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
                          value={card[key] === 0 ? '' : card[key]}
                          onChange={(e) => onUpdateMilestone(card.id, key, parseFloat(e.target.value) || 0)}
                          className="input-field text-white text-right"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Chi phí cố định */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white-50 text-xs uppercase">Chi phí cố định</div>
                      <button
                        onClick={() => onAddFixedSpending(card.id)}
                        className="text-white-70 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {(card.fixedSpending || []).map(spending => (
                      <div key={spending.id} className="grid grid-cols-[1fr_auto_auto] gap-2 py-1 items-center">
                        <input
                          type="text"
                          value={spending.name}
                          onChange={(e) => onUpdateFixedSpending(card.id, spending.id, 'name', e.target.value)}
                          className="input-field text-white text-sm"
                          placeholder="Tên chi phí"
                        />
                        <input
                          type="number"
                          value={spending.amount === 0 ? '' : spending.amount}
                          onChange={(e) => onUpdateFixedSpending(card.id, spending.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="input-field text-white text-right w-24"
                          placeholder="0"
                        />
                        <button
                          onClick={() => onDeleteFixedSpending(card.id, spending.id)}
                          className="text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Ngày đóng */}
                  <div className="grid grid-cols-2 gap-2 py-2 bg-white-5 rounded-lg px-3">
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
          );
        })}
      </div>
    </div>
  );
};

export default CreditCards;