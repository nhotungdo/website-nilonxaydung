"use client";
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';

export default function AnimatedPageWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}
