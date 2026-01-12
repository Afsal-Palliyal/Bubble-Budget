import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '@/context/FinanceContext';

const COLORS = [
  'hsl(340, 82%, 52%)',
  'hsl(43, 96%, 56%)',
  'hsl(199, 89%, 48%)',
  'hsl(262, 83%, 58%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 70%, 55%)',
  'hsl(180, 60%, 45%)',
  'hsl(120, 60%, 45%)',
];

export function BudgetChart() {
  const { transactions } = useFinance();

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      data-testid="budget-chart"
      className="bg-card rounded-2xl p-6 shadow-lg border border-card-border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Spending by Category
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                ${total.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  ${item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(0)}%)
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
