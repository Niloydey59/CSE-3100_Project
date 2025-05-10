"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const AuthBackground: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to be mounted to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkTheme = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDarkTheme
                ? "bg-primary/30 blur-[50px]" // Higher opacity in dark mode
                : "bg-primary/40 blur-[40px]" // Orange-ish in light mode
            }`}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              scale: [
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 1.2,
                Math.random() * 0.5 + 0.8,
              ],
            }}
            transition={{
              duration: 15 + i * 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
            }}
          />
        ))}
      </div>

      {/* Additional animated elements for more visual interest */}
      <div className="absolute top-0 left-0 w-full h-full opacity-70">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className={`absolute rounded-full ${
              isDarkTheme ? "bg-orange-500/20" : "bg-orange-400/30"
            }`}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthBackground;
