import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  description: string;
}

export interface SavingsBucket {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  icon: string;
}

export interface MoneyBubble {
  id: string;
  amount: number;
  category: string;
  color: string;
  x: number;
  y: number;
}

interface FinanceState {
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
  savingsBuckets: SavingsBucket[];
  moneyBubbles: MoneyBubble[];
  hasCompletedOnboarding: boolean;
}

interface FinanceContextType extends FinanceState {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transferToBucket: (bubbleId: string, bucketId: string, amount: number) => void;
  completeOnboarding: () => void;
  updateBubblePosition: (id: string, x: number, y: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const mockTransactions: Transaction[] = [
  { id: '1', amount: 5200, category: 'Salary', type: 'income', date: '2026-01-10', description: 'Monthly salary' },
  { id: '2', amount: 1200, category: 'Rent', type: 'expense', date: '2026-01-05', description: 'Monthly rent' },
  { id: '3', amount: 85, category: 'Groceries', type: 'expense', date: '2026-01-08', description: 'Weekly groceries' },
  { id: '4', amount: 120, category: 'Utilities', type: 'expense', date: '2026-01-06', description: 'Electric bill' },
  { id: '5', amount: 65, category: 'Entertainment', type: 'expense', date: '2026-01-09', description: 'Streaming services' },
  { id: '6', amount: 250, category: 'Dining', type: 'expense', date: '2026-01-07', description: 'Restaurant visits' },
  { id: '7', amount: 800, category: 'Freelance', type: 'income', date: '2026-01-11', description: 'Side project' },
  { id: '8', amount: 150, category: 'Shopping', type: 'expense', date: '2026-01-10', description: 'New clothes' },
  { id: '9', amount: 45, category: 'Transport', type: 'expense', date: '2026-01-09', description: 'Gas' },
  { id: '10', amount: 200, category: 'Health', type: 'expense', date: '2026-01-08', description: 'Gym membership' },
];

const mockBuckets: SavingsBucket[] = [
  { id: '1', name: 'Emergency Fund', target: 10000, current: 3500, color: 'hsl(160, 84%, 39%)', icon: '🛡️' },
  { id: '2', name: 'Vacation', target: 3000, current: 1200, color: 'hsl(199, 89%, 48%)', icon: '✈️' },
  { id: '3', name: 'New Car', target: 25000, current: 8000, color: 'hsl(262, 83%, 58%)', icon: '🚗' },
  { id: '4', name: 'Education', target: 5000, current: 2100, color: 'hsl(43, 96%, 56%)', icon: '📚' },
];

const categoryColors: Record<string, string> = {
  Salary: 'hsl(160, 84%, 39%)',
  Freelance: 'hsl(160, 72%, 50%)',
  Rent: 'hsl(340, 82%, 52%)',
  Groceries: 'hsl(43, 96%, 56%)',
  Utilities: 'hsl(199, 89%, 48%)',
  Entertainment: 'hsl(262, 83%, 58%)',
  Dining: 'hsl(0, 84%, 60%)',
  Shopping: 'hsl(280, 70%, 55%)',
  Transport: 'hsl(180, 60%, 45%)',
  Health: 'hsl(120, 60%, 45%)',
};

function generateBubblesFromTransactions(transactions: Transaction[]): MoneyBubble[] {
  return transactions.map((t, i) => ({
    id: `bubble-${t.id}`,
    amount: t.amount,
    category: t.category,
    color: categoryColors[t.category] || 'hsl(220, 15%, 50%)',
    x: 20 + (i % 5) * 18,
    y: 20 + Math.floor(i / 5) * 25,
  }));
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FinanceState>(() => {
    const income = mockTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = mockTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      balance: income - expenses,
      income,
      expenses,
      transactions: mockTransactions,
      savingsBuckets: mockBuckets,
      moneyBubbles: generateBubblesFromTransactions(mockTransactions),
      hasCompletedOnboarding: false,
    };
  });

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setState(prev => {
      const newTransaction = { ...transaction, id: Date.now().toString() };
      const newTransactions = [...prev.transactions, newTransaction];
      const income = newTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = newTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return {
        ...prev,
        transactions: newTransactions,
        balance: income - expenses,
        income,
        expenses,
        moneyBubbles: generateBubblesFromTransactions(newTransactions),
      };
    });
  }, []);

  const transferToBucket = useCallback((bubbleId: string, bucketId: string, amount: number) => {
    setState(prev => {
      const newBubbles = prev.moneyBubbles.filter(b => b.id !== bubbleId);
      const newBuckets = prev.savingsBuckets.map(bucket =>
        bucket.id === bucketId
          ? { ...bucket, current: Math.min(bucket.current + amount, bucket.target) }
          : bucket
      );
      return {
        ...prev,
        moneyBubbles: newBubbles,
        savingsBuckets: newBuckets,
        balance: prev.balance - amount,
      };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prev => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  const updateBubblePosition = useCallback((id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      moneyBubbles: prev.moneyBubbles.map(b => b.id === id ? { ...b, x, y } : b),
    }));
  }, []);

  return (
    <FinanceContext.Provider value={{ ...state, addTransaction, transferToBucket, completeOnboarding, updateBubblePosition }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
