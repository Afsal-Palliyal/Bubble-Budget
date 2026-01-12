import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { month: 'Jul', income: 4800, expenses: 3200 },
  { month: 'Aug', income: 5200, expenses: 3400 },
  { month: 'Sep', income: 4900, expenses: 3100 },
  { month: 'Oct', income: 5500, expenses: 3800 },
  { month: 'Nov', income: 5100, expenses: 3500 },
  { month: 'Dec', income: 6200, expenses: 4200 },
  { month: 'Jan', income: 6000, expenses: 2115 },
];

export function TrendChart() {
  return (
    <motion.div
      data-testid="trend-chart"
      className="bg-card rounded-2xl p-6 shadow-lg border border-card-border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Income vs Expenses
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(340, 82%, 52%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(340, 82%, 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(340, 82%, 52%)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(160,84%,39%)]" />
          <span className="text-sm text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(340,82%,52%)]" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}
