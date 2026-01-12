import { motion } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function TransactionList() {
  const { transactions } = useFinance();

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      data-testid="transaction-list"
      className="bg-card rounded-2xl p-6 shadow-lg border border-card-border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Recent Transactions
      </h3>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {sortedTransactions.slice(0, 8).map((transaction, index) => (
          <motion.div
            key={transaction.id}
            data-testid={`transaction-${transaction.id}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                transaction.type === 'income'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              {transaction.type === 'income' ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">{transaction.category}</p>
            </div>

            <div className="text-right">
              <p
                className={`font-semibold text-sm ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
