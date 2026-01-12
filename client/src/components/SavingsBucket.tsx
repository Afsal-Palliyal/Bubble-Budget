import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import type { SavingsBucket as SavingsBucketType } from '@/context/FinanceContext';

interface SavingsBucketProps {
  bucket: SavingsBucketType;
  isDropTarget: boolean;
}

export const SavingsBucket = forwardRef<HTMLDivElement, SavingsBucketProps>(
  ({ bucket, isDropTarget }, ref) => {
    const progress = (bucket.current / bucket.target) * 100;
    const remaining = bucket.target - bucket.current;

    return (
      <motion.div
        ref={ref}
        data-testid={`bucket-${bucket.id}`}
        data-bucket-id={bucket.id}
        className={`relative p-4 rounded-2xl transition-all duration-300 ${
          isDropTarget
            ? 'ring-4 ring-primary ring-offset-2 scale-105 shadow-xl'
            : 'shadow-md hover:shadow-lg'
        }`}
        style={{
          background: `linear-gradient(135deg, ${bucket.color}15, ${bucket.color}08)`,
          borderColor: isDropTarget ? bucket.color : 'transparent',
          borderWidth: 2,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${bucket.color}25` }}
            animate={isDropTarget ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isDropTarget ? Infinity : 0 }}
          >
            {bucket.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {bucket.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              ${remaining.toLocaleString()} to go
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium">${bucket.current.toLocaleString()}</span>
            <span className="text-muted-foreground">${bucket.target.toLocaleString()}</span>
          </div>
          <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: bucket.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {progress.toFixed(0)}% saved
          </p>
        </div>

        {isDropTarget && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: `2px dashed ${bucket.color}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }
);

SavingsBucket.displayName = 'SavingsBucket';
