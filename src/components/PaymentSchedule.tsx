import { Calendar } from 'lucide-react';

interface PaymentScheduleProps {
  paymentDue27: number;
  paymentDue6: number;
}

const PaymentSchedule = ({ paymentDue27, paymentDue6 }: PaymentScheduleProps) => {
  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Ngày thanh toán
      </h2>
      <div className="space-y-3">
        <div className="payment-card bg-orange-grad">
          <div className="text-white-70 text-sm mb-1">Ngày 27 (tháng này)</div>
          <div className="text-2xl font-bold text-white">¥{paymentDue27.toLocaleString()}</div>
        </div>
        <div className="payment-card bg-blue-grad">
          <div className="text-white-70 text-sm mb-1">Ngày 6 (tháng sau)</div>
          <div className="text-2xl font-bold text-white">¥{paymentDue6.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;