import React from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormErrorProps {
  message: string | null;
}

const AuthFormError: React.FC<AuthFormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div
      className="bg-destructive/15 text-destructive px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle size={16} />
      <span>{message}</span>
    </motion.div>
  );
};

export default AuthFormError;
