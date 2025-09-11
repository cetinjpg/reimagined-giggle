import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  return (
    <motion.div
      className={`
        rounded-xl border border-gray-200/20 dark:border-gray-700/30 shadow-lg
        ${gradient 
          ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900' 
          : 'bg-white/80 dark:bg-gray-800/80'
        }
        backdrop-blur-sm
        ${hover ? 'hover:shadow-xl' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}