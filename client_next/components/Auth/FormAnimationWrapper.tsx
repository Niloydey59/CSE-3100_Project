import React from "react";
import { motion } from "framer-motion";

interface FormAnimationWrapperProps {
  children: React.ReactNode;
  index: number;
}

const FormAnimationWrapper: React.FC<FormAnimationWrapperProps> = ({
  children,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.1 * index,
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default FormAnimationWrapper;
