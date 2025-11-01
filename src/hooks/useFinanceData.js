import { useState, useEffect } from 'react';

const defaultCards = [
  { id: 1, name: 'Card 1', color: 'bg-blue-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27' },
  { id: 2, name: 'Card 2', color: 'bg-purple-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27' },
  { id: 3, name: 'Card 3', color: 'bg-pink-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '6' },
  { id: 4, name: 'Card 4', color: 'bg-green-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27' },
  { id: 5, name: 'Card 5', color: 'bg-yellow-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '6' },
  { id: 6, name: 'Card 6', color: 'bg-red-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27' },
  { id: 7, name: 'Card 7', color: 'bg-indigo-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '6' },
];

const defaultRecurring = [
  { id: Date.now() + 1, name: 'Rent', amount: 0, paymentDay: '27' },
  { id: Date.now() + 2, name: 'Utilities', amount: 0, paymentDay: '27' },
  { id: Date.now() + 3, name: 'Internet', amount: 0, paymentDay: '6' },
];

const applyGlobalNames = (cards, names) =>
  cards.map(c => ({ ...c, name: names?.[c.id] ?? c.name }));

export const useFinanceData = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [globalCardNames, setGlobalCardNames] = useState({});
  const [creditCards, setCreditCards] = useState(defaultCards);
  const [recurringExpenses, setRecurringExpenses] = useState([]);

  // Load global card names
  useEffect(() => {
    try {
      const saved = localStorage.getItem('finance-cards-global');
      if (saved) {
        const data = JSON.parse(saved);
        setGlobalCardNames(data.names || {});
      } else {
        const initial = Object.fromEntries(defaultCards.map(c => [c.id, c.name]));
        setGlobalCardNames(initial);
        localStorage.setItem('finance-cards-global', JSON.stringify({ names: initial }));
      }
    } catch (error) {
      const initial = Object.fromEntries(defaultCards.map(c => [c.id, c.name]));
      setGlobalCardNames(initial);
    }
  }, []);

  // Load global recurring expenses
  useEffect(() => {
    try {
      const saved = localStorage.getItem('finance-global');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.recurringExpenses) {
          setRecurringExpenses(data.recurringExpenses);
        }
      } else {
        setRecurringExpenses(defaultRecurring);
        localStorage.setItem('finance-global', JSON.stringify({ recurringExpenses: defaultRecurring }));
      }
    } catch (error) {
      setRecurringExpenses(defaultRecurring);
    }
  }, []);

  // Load month data
  useEffect(() => {
    setIsLoaded(false);
    const key = `finance-${currentMonth}`;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setIncome(data.income || 0);
        setBalance(data.balance || 0);

        if (data.creditCards && data.creditCards.length > 0) {
          setCreditCards(applyGlobalNames(data.creditCards, globalCardNames));
        } else {
          const initialCards = applyGlobalNames(defaultCards, globalCardNames);
          setCreditCards(initialCards);
          localStorage.setItem(key, JSON.stringify({ income: 0, balance: 0, creditCards: initialCards }));
        }
      } else {
        const initialCards = applyGlobalNames(defaultCards, globalCardNames);
        setIncome(0);
        setBalance(0);
        setCreditCards(initialCards);
        localStorage.setItem(key, JSON.stringify({ income: 0, balance: 0, creditCards: initialCards }));
      }
    } catch (error) {
      const fallbackCards = applyGlobalNames(defaultCards, globalCardNames);
      setIncome(0);
      setBalance(0);
      setCreditCards(fallbackCards);
    }

    setIsLoaded(true);
  }, [currentMonth, globalCardNames]);

  // Persist month data
  useEffect(() => {
    if (!isLoaded) return;

    const key = `finance-${currentMonth}`;
    const data = { income, balance, creditCards };

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }, [income, balance, creditCards, currentMonth, isLoaded]);

  // Persist recurring expenses
  useEffect(() => {
    if (recurringExpenses.length === 0) return;

    try {
      localStorage.setItem('finance-global', JSON.stringify({ recurringExpenses }));
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }, [recurringExpenses]);

  const exportData = () => {
    const allData = {
      currentMonth,
      monthData: { income, balance, creditCards },
      globalData: { recurringExpenses, cardNames: globalCardNames },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✅ Đã xuất dữ liệu thành công!');
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);

        if (data.monthData) {
          setIncome(data.monthData.income || 0);
          setBalance(data.monthData.balance || 0);
          setCreditCards(applyGlobalNames(data.monthData.creditCards || defaultCards, globalCardNames));

          const key = `finance-${currentMonth}`;
          localStorage.setItem(key, JSON.stringify(data.monthData));
        }

        if (data.globalData) {
          if (data.globalData.recurringExpenses) {
            setRecurringExpenses(data.globalData.recurringExpenses);
            localStorage.setItem('finance-global', JSON.stringify({ recurringExpenses: data.globalData.recurringExpenses }));
          }
          if (data.globalData.cardNames) {
            setGlobalCardNames(data.globalData.cardNames);
            try {
              localStorage.setItem('finance-cards-global', JSON.stringify({ names: data.globalData.cardNames }));
            } catch (error) { }
          }
        }

        alert('✅ Đã nhập dữ liệu thành công!');
      } catch (error) {
        alert('❌ File không hợp lệ!');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return {
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
    globalCardNames,
    setGlobalCardNames,
    exportData,
    importData
  };
};