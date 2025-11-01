export interface CreditCard {
  id: number;
  name: string;
  color: string;
  day10: number;
  day20: number;
  day30: number;
  day10Next: number;
  paymentDay: '27' | '6';
}

export interface RecurringExpense {
  id: number;
  name: string;
  amount: number;
  paymentDay: '27' | '6';
}

export interface GlobalCardNames {
  [key: number]: string;
}