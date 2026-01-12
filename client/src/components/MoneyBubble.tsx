import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import type { MoneyBubble as MoneyBubbleType } from '@/context/FinanceContext';

interface MoneyBubbleProps {
  bubble: MoneyBubbleType;
  onDragEnd: (id: string, info: PanInfo, element: HTMLDivElement | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function MoneyBubble({ bubble, onDragEnd, containerRef }: MoneyBubbleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const boxShadow = useTransform(
    scale,
    [1, 1.15],
    [
      `0 4px 20px ${bubble.color}40`,
      `0 12px 40px ${bubble.color}60`
    ]
  );

  const size = Math.max(60, Math.min(120, 40 + bubble.amount / 50));
  const fontSize = size > 80 ? 'text-sm' : 'text-xs';

  return (
    <motion.div
      ref={bubbleRef}
      data-testid={`bubble-${bubble.id}`}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        zIndex: isDragging ? 100 : 10,
      }}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={containerRef}
      onDragStart={() => {
        setIsDragging(true);
        scale.set(1.15);
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        scale.set(1);
        onDragEnd(bubble.id, info, bubbleRef.current);
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="rounded-full flex flex-col items-center justify-center text-white font-semibold relative overflow-hidden"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${bubble.color}ee, ${bubble.color})`,
          boxShadow,
          scale,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" style={{ height: '45%' }} />
        <span className={`${fontSize} font-bold relative z-10 drop-shadow-sm`}>
          ${bubble.amount >= 1000 ? `${(bubble.amount / 1000).toFixed(1)}k` : bubble.amount}
        </span>
        <span className="text-[10px] opacity-80 relative z-10 drop-shadow-sm truncate max-w-[90%]">
          {bubble.category}
        </span>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)',
              'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)',
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
