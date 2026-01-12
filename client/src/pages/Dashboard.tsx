import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';
import { MoneyBubble } from '@/components/MoneyBubble';
import { SavingsBucket } from '@/components/SavingsBucket';
import { BudgetChart } from '@/components/BudgetChart';
import { TrendChart } from '@/components/TrendChart';
import { TransactionList } from '@/components/TransactionList';
import { StatCard } from '@/components/StatCard';
import { Onboarding } from '@/components/Onboarding';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const {
    balance,
    income,
    expenses,
    moneyBubbles,
    savingsBuckets,
    hasCompletedOnboarding,
    completeOnboarding,
    transferToBucket,
  } = useFinance();

  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const bucketRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const incomeBubbles = moneyBubbles.filter(b => 
    ['Salary', 'Freelance'].includes(b.category)
  );

  const handleDragEnd = useCallback(
    (bubbleId: string, _info: PanInfo, element: HTMLDivElement | null) => {
      if (!element) return;

      const bubbleRect = element.getBoundingClientRect();
      const bubbleCenter = {
        x: bubbleRect.left + bubbleRect.width / 2,
        y: bubbleRect.top + bubbleRect.height / 2,
      };

      let matchedBucketId: string | null = null;
      let matchedBucketName: string | null = null;

      bucketRefs.current.forEach((bucketEl, bucketId) => {
        const rect = bucketEl.getBoundingClientRect();
        if (
          bubbleCenter.x >= rect.left &&
          bubbleCenter.x <= rect.right &&
          bubbleCenter.y >= rect.top &&
          bubbleCenter.y <= rect.bottom
        ) {
          const bucket = savingsBuckets.find(b => b.id === bucketId);
          if (bucket) {
            matchedBucketId = bucketId;
            matchedBucketName = bucket.name;
          }
        }
      });

      if (matchedBucketId && matchedBucketName) {
        const bubble = moneyBubbles.find(b => b.id === bubbleId);
        if (bubble) {
          transferToBucket(bubbleId, matchedBucketId, bubble.amount);
          toast.success(`$${bubble.amount} added to ${matchedBucketName}!`, {
            icon: '🎉',
          });
        }
      }

      setDropTargetId(null);
    },
    [moneyBubbles, savingsBuckets, transferToBucket]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      let foundTarget: string | null = null;
      
      bucketRefs.current.forEach((bucketEl, bucketId) => {
        const rect = bucketEl.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          foundTarget = bucketId;
        }
      });

      if (foundTarget !== dropTargetId) {
        setDropTargetId(foundTarget);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [dropTargetId]);

  return (
    <>
      <AnimatePresence>
        {!hasCompletedOnboarding && <Onboarding onComplete={completeOnboarding} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 glass border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-xl bubble-gradient flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                BubbleBudget
              </h1>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-sm text-muted-foreground hidden sm:block">
                January 2026
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </motion.div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Balance"
              value={`$${balance.toLocaleString()}`}
              change="+12.5%"
              changeType="positive"
              icon={Wallet}
              color="hsl(160, 84%, 39%)"
              delay={0}
            />
            <StatCard
              title="Income"
              value={`$${income.toLocaleString()}`}
              change="+8.2%"
              changeType="positive"
              icon={TrendingUp}
              color="hsl(199, 89%, 48%)"
              delay={0.1}
            />
            <StatCard
              title="Expenses"
              value={`$${expenses.toLocaleString()}`}
              change="-5.3%"
              changeType="negative"
              icon={TrendingDown}
              color="hsl(340, 82%, 52%)"
              delay={0.2}
            />
            <StatCard
              title="Savings"
              value={`$${savingsBuckets.reduce((s, b) => s + b.current, 0).toLocaleString()}`}
              change="+15.8%"
              changeType="positive"
              icon={PiggyBank}
              color="hsl(262, 83%, 58%)"
              delay={0.3}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-lg border border-card-border relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  Money Bubbles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag income bubbles to savings
                </p>
              </div>

              <div
                ref={bubbleContainerRef}
                className="relative h-[280px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--border)) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <AnimatePresence>
                  {incomeBubbles.map(bubble => (
                    <MoneyBubble
                      key={bubble.id}
                      bubble={bubble}
                      onDragEnd={handleDragEnd}
                      containerRef={bubbleContainerRef}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Savings Buckets
              </h3>
              <div className="space-y-3">
                {savingsBuckets.map(bucket => (
                  <SavingsBucket
                    key={bucket.id}
                    ref={el => {
                      if (el) bucketRefs.current.set(bucket.id, el);
                    }}
                    bucket={bucket}
                    isDropTarget={dropTargetId === bucket.id}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <BudgetChart />
            <TrendChart />
          </div>

          <TransactionList />
        </main>

        <footer className="border-t border-border/50 py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            Made with bubbles and love
          </div>
        </footer>
      </div>
    </>
  );
}
