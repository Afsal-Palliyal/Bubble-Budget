import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, PiggyBank, TrendingUp, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Wallet,
    title: 'Welcome to BubbleBudget',
    description: 'Your finances, visualized as playful bubbles. Watch your money grow and flow in a whole new way.',
    color: 'hsl(160, 84%, 39%)',
  },
  {
    icon: Sparkles,
    title: 'Watch Your Money Grow',
    description: 'Each bubble represents a transaction. Income bubbles grow green and vibrant, while expenses appear in warm colors.',
    color: 'hsl(43, 96%, 56%)',
  },
  {
    icon: PiggyBank,
    title: 'Drag & Drop to Save',
    description: 'Simply drag any income bubble onto a savings bucket to allocate funds. It\'s that easy to build your savings!',
    color: 'hsl(262, 83%, 58%)',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Beautiful charts show your spending patterns and help you reach your financial goals faster.',
    color: 'hsl(199, 89%, 48%)',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <motion.div
      data-testid="onboarding"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(220, 20%, 97%) 0%, hsl(220, 15%, 92%) 100%)',
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 40 + Math.random() * 80,
              height: 40 + Math.random() * 80,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: steps[i % steps.length].color,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ background: `${step.color}20` }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-10 h-10" style={{ color: step.color }} />
            </motion.div>

            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {step.title}
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                background: i === currentStep ? step.color : 'hsl(var(--muted))',
              }}
              animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1"
            data-testid="button-skip"
          >
            Skip
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
            style={{ background: step.color }}
            data-testid="button-next"
          >
            {currentStep === steps.length - 1 ? "Let's Go!" : 'Next'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
