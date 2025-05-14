"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { verifyAccount } from "@/src/services/features/userService";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import ErrorPage from "@/components/Error/Error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    const verifyUserAccount = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Make API call to verify the account
        const response = await verifyAccount({ token });

        setIsVerified(true);
        toast({
          title: "Success!",
          description: "Your account has been verified successfully.",
          variant: "default",
        });
      } catch (error: any) {
        console.error("Verification error:", error);
        setError(
          error.message ||
            "Failed to verify your account. The token may be invalid or expired."
        );
        toast({
          title: "Verification Failed",
          description:
            error.message ||
            "Failed to verify your account. The token may be invalid or expired.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyUserAccount();
    } else {
      setError("Invalid verification link");
      setIsLoading(false);
    }
  }, [token, toast]);

  const goToLogin = () => {
    router.push("/login");
  };

  const goToHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="elevated-component border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full"
              >
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl">
              Account Verified!
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Your account has been successfully verified. You can now access
              all features of StackRUET.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p className="mb-4">
              Thank you for verifying your email address. You're now part of the
              RUET community forum.
            </p>
            <p>
              You can now ask questions, provide answers, and interact with
              other members of the RUET community.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={goToLogin}
              className="w-full sm:w-auto"
              variant="default"
            >
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={goToHome}
              className="w-full sm:w-auto"
              variant="outline"
            >
              Go to Homepage
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
