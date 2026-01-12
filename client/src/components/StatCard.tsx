import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      data-testid={`stat-${title.toLowerCase().replace(/\s/g, '-')}`}
      className="bg-card rounded-2xl p-5 shadow-lg border border-card-border relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              changeType === 'positive'
                ? 'bg-green-100 text-green-700'
                : changeType === 'negative'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </p>
    </motion.div>
  );
}
