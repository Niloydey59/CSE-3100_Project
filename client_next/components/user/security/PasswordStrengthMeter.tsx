import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  score: number;
  feedback: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  score,
  feedback,
}) => {
  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Very weak";
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-amber-400";
      case 3:
        return "bg-green-400";
      case 4:
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  const strengthText = getStrengthText(score);
  const strengthColor = getStrengthColor(score);
  const progressValue = (score + 1) * 20; // Convert 0-4 scale to 20-100 scale

  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center">
        <p
          className={cn(
            "text-xs font-medium",
            score <= 1
              ? "text-red-500"
              : score === 2
              ? "text-amber-500"
              : "text-green-500"
          )}
        >
          Password strength: {strengthText}
        </p>
        <span className="text-xs text-muted-foreground">{progressValue}%</span>
      </div>
      <Progress
        value={progressValue}
        className="h-1.5"
        indicatorClassName={strengthColor}
      />

      {feedback && (
        <p className="text-xs text-muted-foreground mt-1">{feedback}</p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
