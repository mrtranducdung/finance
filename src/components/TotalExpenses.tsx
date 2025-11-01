import { BarChart3 } from 'lucide-react';

interface TotalExpensesProps {
  sumDay10: number;
  sumDay20: number;
  sumDay30: number;
  sumDay10Next: number;
  totalRecurring: number;
}

const TotalExpenses = ({ sumDay10 = 0, sumDay20 = 0, sumDay30 = 0, sumDay10Next = 0, totalRecurring = 0 }: TotalExpensesProps) => {
  const milestones = [
    { label: '10th', cardSum: sumDay10 || 0 },
    { label: '20th', cardSum: sumDay20 || 0 },
    { label: '30th', cardSum: sumDay30 || 0 },
    { label: '10th (sau)', cardSum: sumDay10Next || 0 },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      {/* Tổng chi theo mốc ngày */}
      <div className="flex items-center gap-2 mb-6 justify-center">
        <BarChart3 className="w-5 h-5 text-gray-300" />
        <span className="text-gray-300 text-sm font-medium">
          Tổng chi theo mốc ngày
        </span>
      </div>

      {/* Cố định - tổng tháng */}
      <div className="text-sm text-gray-400 !mb-3 text-center">
        Cố định (tổng tháng):{" "}
        <strong className="text-white font-semibold">
          ¥{totalRecurring.toLocaleString()}
        </strong>
      </div>

      {/* Header bảng */}
      <div className="grid grid-cols-3 text-xs text-gray-400 uppercase mb-2 px-2 border-b border-white/20 bg-blue-900/30">
        <div className="text-base font-bold text-left pl-2">Mốc</div>
        <div className="text-base font-bold text-left pl-4">Thẻ</div>
        <div className="text-base font-bold text-left pl-4">Tổng</div>
      </div>

      {/* Các hàng bảng */}
      <div className="grid grid-cols-1 gap-1">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 items-center py-3 px-2 transition-colors rounded-lg
              ${index % 2 === 0 ? "bg-white/5" : "bg-white/2"} 
              hover:bg-white/10`}
          >
            <div className="text-white text-sm font-medium text-left pl-2">
              {milestone.label}
            </div>
            <div className="text-white font-medium text-left pl-4">
              ¥{milestone.cardSum.toLocaleString()}
            </div>
            <div className="text-white font-bold text-left pl-4">
              ¥{(milestone.cardSum + totalRecurring).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalExpenses;