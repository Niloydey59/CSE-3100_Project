"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedLine: React.FC = () => {
  const [visible, setVisible] = useState(true);

  // Hide the line after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // slightly longer than the animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
};

export default AnimatedLine;
