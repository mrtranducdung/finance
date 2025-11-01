import { useState, useEffect } from 'react';

const defaultCards = [
  { id: 1, name: 'Card 1', color: 'bg-blue-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27', fixedSpending: [] },
  { id: 2, name: 'Card 2', color: 'bg-purple-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27', fixedSpending: [] },
  { id: 3, name: 'Card 3', color: 'bg-pink-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '6', fixedSpending: [] },
  { id: 4, name: 'Card 4', color: 'bg-green-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27', fixedSpending: [] },
  { id: 5, name: 'Card 5', color: 'bg-yellow-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '6', fixedSpending: [] },
  { id: 6, name: 'Card 6', color: 'bg-red-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '27', fixedSpending: [] },
  { id: 7, name: 'Card 7', color: 'bg-indigo-500', day10: 0, day20: 0, day30: 0, day10Next: 0, paymentDay: '6', fixedSpending: [] },
];

const defaultRecurring = [
  { id: Date.now() + 1, name: 'Rent', amount: 0, paymentDay: '27' },
  { id: Date.now() + 2, name: 'Utilities', amount: 0, paymentDay: '27' },
  { id: Date.now() + 3, name: 'Internet', amount: 0, paymentDay: '6' },
];

const applyGlobalNames = (cards, names) =>
  cards.map(c => ({ ...c, name: names?.[c.id] ?? c.name }));

const applyGlobalFixedSpending = (cards, fixedSpendingMap) =>
  cards.map(c => ({ ...c, fixedSpending: fixedSpendingMap?.[c.id] ?? [] }));

export const useFinanceData = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [globalCardNames, setGlobalCardNames] = useState({});
  const [globalFixedSpending, setGlobalFixedSpending] = useState({});
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

  // Load global fixed spending
  useEffect(() => {
    try {
      const saved = localStorage.getItem('finance-fixed-spending-global');
      if (saved) {
        const data = JSON.parse(saved);
        setGlobalFixedSpending(data.fixedSpending || {});
      } else {
        const initial = Object.fromEntries(defaultCards.map(c => [c.id, []]));
        setGlobalFixedSpending(initial);
        localStorage.setItem('finance-fixed-spending-global', JSON.stringify({ fixedSpending: initial }));
      }
    } catch (error) {
      const initial = Object.fromEntries(defaultCards.map(c => [c.id, []]));
      setGlobalFixedSpending(initial);
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
    if (Object.keys(globalFixedSpending).length === 0) return; // Wait for global data to load
    
    setIsLoaded(false);
    const key = `finance-${currentMonth}`;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setIncome(data.income || 0);
        setBalance(data.balance || 0);

        if (data.creditCards && data.creditCards.length > 0) {
          let cards = applyGlobalNames(data.creditCards, globalCardNames);
          cards = applyGlobalFixedSpending(cards, globalFixedSpending);
          setCreditCards(cards);
        } else {
          let initialCards = applyGlobalNames(defaultCards, globalCardNames);
          initialCards = applyGlobalFixedSpending(initialCards, globalFixedSpending);
          setCreditCards(initialCards);
          
          const cardsToSave = initialCards.map(card => {
            const { fixedSpending, ...rest } = card;
            return rest;
          });
          localStorage.setItem(key, JSON.stringify({ income: 0, balance: 0, creditCards: cardsToSave }));
        }
      } else {
        let initialCards = applyGlobalNames(defaultCards, globalCardNames);
        initialCards = applyGlobalFixedSpending(initialCards, globalFixedSpending);
        setIncome(0);
        setBalance(0);
        setCreditCards(initialCards);
        
        const cardsToSave = initialCards.map(card => {
          const { fixedSpending, ...rest } = card;
          return rest;
        });
        localStorage.setItem(key, JSON.stringify({ income: 0, balance: 0, creditCards: cardsToSave }));
      }
    } catch (error) {
      let fallbackCards = applyGlobalNames(defaultCards, globalCardNames);
      fallbackCards = applyGlobalFixedSpending(fallbackCards, globalFixedSpending);
      setIncome(0);
      setBalance(0);
      setCreditCards(fallbackCards);
    }

    setIsLoaded(true);
  }, [currentMonth, globalCardNames, globalFixedSpending]);

  // Persist month data
  useEffect(() => {
    if (!isLoaded) return;

    const key = `finance-${currentMonth}`;
    // Remove fixedSpending before saving (it's stored globally)
    const cardsToSave = creditCards.map(card => {
      const { fixedSpending, ...rest } = card;
      return rest;
    });
    const data = { income, balance, creditCards: cardsToSave };

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
      globalData: { 
        recurringExpenses, 
        cardNames: globalCardNames,
        fixedSpending: globalFixedSpending 
      },
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
          let cards = applyGlobalNames(data.monthData.creditCards || defaultCards, globalCardNames);
          cards = applyGlobalFixedSpending(cards, globalFixedSpending);
          setCreditCards(cards);

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
          if (data.globalData.fixedSpending) {
            setGlobalFixedSpending(data.globalData.fixedSpending);
            try {
              localStorage.setItem('finance-fixed-spending-global', JSON.stringify({ fixedSpending: data.globalData.fixedSpending }));
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
    globalFixedSpending,
    setGlobalFixedSpending,
    exportData,
    importData
  };
};