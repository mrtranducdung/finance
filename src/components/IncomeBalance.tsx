import { TrendingUp, Wallet } from 'lucide-react';

interface IncomeBalanceProps {
  income: number;
  setIncome: (income: number) => void;
  balance: number;
  setBalance: (balance: number) => void;
}

const IncomeBalance = ({ income, setIncome, balance, setBalance }: IncomeBalanceProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-white-70" />
          <span className="text-white-70 text-sm">Thu nhập</span>
        </div>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
          className="w-full text-2xl font-bold text-white outline-none border-none bg-transparent"
          placeholder="0"
        />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-white-70" />
          <span className="text-white-70 text-sm">Số dư</span>
        </div>
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
          className="w-full text-2xl font-bold text-white outline-none border-none bg-transparent"
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default IncomeBalance;