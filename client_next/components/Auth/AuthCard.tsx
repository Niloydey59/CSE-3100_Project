import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import AnimatedLine from "./AnimatedLine";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  footer,
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 },
      }}
    >
      <Card
        className={cn(
          "w-full max-w-md mx-auto shadow-lg border-primary/10 overflow-hidden relative",
          className
        )}
        {...props}
      >
        <AnimatedLine />

        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            {description && (
              <CardDescription className="text-center">
                {description}
              </CardDescription>
            )}
          </motion.div>
        </CardHeader>

        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </CardContent>

        {footer && (
          <CardFooter>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {footer}
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default AuthCard;
