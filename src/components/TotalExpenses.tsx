import { BarChart3, Calendar } from 'lucide-react';

interface TotalExpensesProps {
  sumDay10: number;
  sumDay20: number;
  sumDay30: number;
  sumDay10Next: number;
  totalRecurring: number;
}

const TotalExpenses = ({ sumDay10, sumDay20, sumDay30, sumDay10Next, totalRecurring }: TotalExpensesProps) => {
  const milestones = [
    { label: '10th', cardSum: sumDay10, color: 'from-blue-500/20 to-cyan-500/20' },
    { label: '20th', cardSum: sumDay20, color: 'from-purple-500/20 to-pink-500/20' },
    { label: '30th', cardSum: sumDay30, color: 'from-orange-500/20 to-red-500/20' },
    { label: '10th (Next)', cardSum: sumDay10Next, color: 'from-green-500/20 to-emerald-500/20' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-white/10">
      {/* Header with enhanced styling */}
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
          <BarChart3 className="w-5 h-5 text-blue-300" />
        </div>
        <span className="text-gray-200 text-lg font-semibold gradient-text">
          Tổng chi theo mốc ngày
        </span>
      </div>

      {/* Fixed expenses with beautiful badge */}
      <div className="flex justify-center mb-8">
        <div className="glass rounded-full px-4 py-2 border border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Cố định (tháng):</span>
            <strong className="text-green-400 font-bold text-lg">
              ¥{totalRecurring.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
      {/* Enhanced table */}
      <div className="space-y-3">
        {/* Table header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 text-sm text-gray-300 mb-4 px-4">
          <div className="font-semibold text-left flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            Mốc
          </div>
          <div className="font-semibold text-right">Thẻ</div>
          <div className="font-semibold text-right">Tổng</div>
        </div>

        {/* Table rows */}
        <div className="space-y-3">
          {milestones.map((milestone, index) => {
            const total = milestone.cardSum + totalRecurring;
            return (
              <div
                key={index}
                className={`
                  grid grid-cols-[1.5fr_1fr_1fr] gap-4 items-center p-4 
                  rounded-xl transition-all duration-300 group
                  bg-gradient-to-r ${milestone.color} border border-white/5
                  hover:border-white/20 hover:scale-[1.02] hover:shadow-lg
                  backdrop-blur-sm
                `}
              >
                {/* Milestone label */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <span className="text-white text-xs font-bold">
                      {milestone.label.replace('th', '').replace(' (Next)', '')}
                    </span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {milestone.label}
                  </div>
                </div>

                {/* Card amount */}
                <div className="text-white font-semibold text-lg text-right">
                  ¥{milestone.cardSum.toLocaleString()}
                </div>

                {/* Total amount */}
                <div className="text-white font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-right">
                  ¥{total.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TotalExpenses;