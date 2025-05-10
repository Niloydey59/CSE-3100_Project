import React from 'react';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <div className="bg-transparent min-h-[80vh] flex items-center justify-center">
      <motion.div 
        className="relative w-48 h-48"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.5 }
        }}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0">
          <motion.path
            d="M100 40 L160 80 L100 120 L40 80 Z"
            fill="#3B82F6"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              rotate: [0, 360],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          
          <motion.circle
            cx="100" 
            cy="100" 
            r="80"
            fill="transparent"
            stroke="#60A5FA"
            strokeWidth="2"
            initial={{ strokeDasharray: 520, strokeDashoffset: 520 }}
            animate={{
              strokeDashoffset: 0,
              transition: {
                duration: 2,
                ease: "easeInOut"
              }
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default Loading;