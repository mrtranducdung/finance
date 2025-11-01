import { useState } from 'react';
import Header from './components/Header';
import IncomeBalance from './components/IncomeBalance';
import TotalExpenses from './components/TotalExpenses';
import PaymentSchedule from './components/PaymentSchedule';
import CreditCards from './components/CreditCards';
import RecurringExpenses from './components/RecurringExpenses';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useFinanceData } from './hooks/useFinanceData';
import type { CreditCard, RecurringExpense } from './types';

function App() {
  const {
    currentMonth,
    setCurrentMonth,
    income,
    setIncome,
    balance,
    setBalance,
    creditCards,
    setCreditCards,
    recurringExpenses,
    setRecurringExpenses,
    setGlobalCardNames,
    exportData,
    importData
  } = useFinanceData();

  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'card' | 'expense'; id: number } | null>(null);

  // Calculate totals
  const sumDay10 = creditCards.reduce((sum, card) => sum + (card.day10 || 0), 0);
  const sumDay20 = creditCards.reduce((sum, card) => sum + (card.day20 || 0), 0);
  const sumDay30 = creditCards.reduce((sum, card) => sum + (card.day30 || 0), 0);
  const sumDay10Next = creditCards.reduce((sum, card) => sum + (card.day10Next || 0), 0);

  const totalRecurring = recurringExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const paymentDue27 = creditCards
    .filter(card => card.paymentDay === '27')
    .reduce((sum, card) => sum + Math.max(card.day10Next || 0, card.day10 || 0, card.day20 || 0, card.day30 || 0), 0) +
    recurringExpenses
    .filter(exp => exp.paymentDay === '27')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const paymentDue6 = creditCards
    .filter(card => card.paymentDay === '6')
    .reduce((sum, card) => sum + Math.max(card.day10Next || 0, card.day10 || 0, card.day20 || 0, card.day30 || 0), 0) +
    recurringExpenses
    .filter(exp => exp.paymentDay === '6')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Update handlers
  const updateCard = (id: number, field: keyof CreditCard, value: string) => {
    setCreditCards(prev => prev.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));

    if (field === 'name') {
      setGlobalCardNames(prev => {
        const next = { ...prev, [id]: value };
        try {
          localStorage.setItem('finance-cards-global', JSON.stringify({ names: next }));
        } catch (error) {
          console.error('Failed to save global card names:', error);
        }
        return next;
      });
    }
  };

  const updateCardMilestone = (id: number, day: 'day10' | 'day20' | 'day30' | 'day10Next', value: string) => {
    setCreditCards(prev => prev.map(card =>
      card.id === id ? { ...card, [day]: parseFloat(value) || 0 } : card
    ));
  };

  const updateRecurringExpense = (id: number, field: keyof RecurringExpense, value: string) => {
    setRecurringExpenses(prev => prev.map(exp =>
      exp.id === id ? { ...exp, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : exp
    ));
  };

  const addRecurringExpense = () => {
    const newExpense: RecurringExpense = {
      id: Date.now(),
      name: 'New Expense',
      amount: 0,
      paymentDay: '27'
    };
    setRecurringExpenses(prev => [...prev, newExpense]);
  };

  const deleteCard = (id: number) => {
    setDeleteConfirm({ type: 'card', id });
  };

  const deleteExpense = (id: number) => {
    setDeleteConfirm({ type: 'expense', id });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'card') {
      setCreditCards(prev => prev.filter(card => card.id !== deleteConfirm.id));
    } else if (deleteConfirm.type === 'expense') {
      setRecurringExpenses(prev => prev.filter(exp => exp.id !== deleteConfirm.id));
    }
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const addCard = () => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
    const newCard: CreditCard = {
      id: Date.now(),
      name: `Card ${creditCards.length + 1}`,
      color: colors[creditCards.length % colors.length],
      day10: 0,
      day20: 0,
      day30: 0,
      day10Next: 0,
      paymentDay: '27'
    };
    setCreditCards(prev => [...prev, newCard]);

    setGlobalCardNames(prev => {
      const next = { ...prev, [newCard.id]: newCard.name };
      try {
        localStorage.setItem('finance-cards-global', JSON.stringify({ names: next }));
      } catch (error) {
        console.error('Failed to save global card names:', error);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-20">
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        type={deleteConfirm?.type}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <div className="max-w-md mx-auto">
        <Header
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          onExport={exportData}
          onImport={importData}
        />

        <div className="flex flex-col gap-8">
          <IncomeBalance
            income={income}
            setIncome={setIncome}
            balance={balance}
            setBalance={setBalance}
          />

          <TotalExpenses
            sumDay10={sumDay10}
            sumDay20={sumDay20}
            sumDay30={sumDay30}
            sumDay10Next={sumDay10Next}
            totalRecurring={totalRecurring}
          />

          <PaymentSchedule
            paymentDue27={paymentDue27}
            paymentDue6={paymentDue6}
          />

          <CreditCards
            cards={creditCards}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
            onUpdate={updateCard}
            onUpdateMilestone={updateCardMilestone}
            onDelete={deleteCard}
            onAdd={addCard}
          />

          <RecurringExpenses
            expenses={recurringExpenses}
            onUpdate={updateRecurringExpense}
            onDelete={deleteExpense}
            onAdd={addRecurringExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default App;