import { BarChart3 } from 'lucide-react';

interface TotalExpensesProps {
  sumDay10: number;
  sumDay20: number;
  sumDay30: number;
  sumDay10Next: number;
  totalRecurring: number;
}

const TotalExpenses = ({ sumDay10, sumDay20, sumDay30, sumDay10Next, totalRecurring }: TotalExpensesProps) => {
  const milestones = [
    { label: '10th', cardSum: sumDay10 },
    { label: '20th', cardSum: sumDay20 },
    { label: '30th', cardSum: sumDay30 },
    { label: '10th (sau)', cardSum: sumDay10Next },
  ];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-white-70" />
        <span className="text-white-70 text-sm">Tổng chi theo mốc ngày</span>
      </div>

      <div className="text-xs text-white-60 mb-3">
        Cố định (tổng tháng): <strong className="text-white">¥{totalRecurring.toLocaleString()}</strong>
      </div>

      <div className="grid grid-cols-3 text-xs text-white-50 uppercase mb-2">
        <div className="text-white-60">Mốc</div>
        <div className="text-right text-white-60">Thẻ</div>
        <div className="text-right text-white-60">Tổng</div>
      </div>

      <div className="grid grid-cols-1">
        {milestones.map((milestone, index) => (
          <div key={index} className="grid grid-cols-3 items-center py-2 border-t border-white-10">
            <div className="text-white text-sm">{milestone.label}</div>
            <div className="text-right text-white">¥{milestone.cardSum.toLocaleString()}</div>
            <div className="text-right text-white font-semibold">
              ¥{(milestone.cardSum + totalRecurring).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalExpenses;