"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/src/store/authStore";

import AuthBackground from "@/components/Auth/AuthBackground";
import AuthCard from "@/components/Auth/AuthCard";
import AuthFormError from "@/components/Auth/AuthFormError";
import Navbar from "@/components/Navbar/Navbar";
import FormAnimationWrapper from "@/components/Auth/FormAnimationWrapper";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    error,
    isLoading,
    registrationSuccess,
    clearError,
    resetRegistrationSuccess,
  } = useAuthStore();
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Clear error and reset registration status when unmounting
  useEffect(() => {
    return () => {
      clearError();
      resetRegistrationSuccess();
    };
  }, [clearError, resetRegistrationSuccess]);

  // Update form error when store error changes
  useEffect(() => {
    setFormError(error);
  }, [error]);

  // Redirect to login page after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, router]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data.username, data.email, data.password);
      toast({
        title: "Registration successful!",
        description: "Please check your email for an activation link.",
      });
    } catch (error) {
      // Error already handled by the store
    }
  };

  return (
    <>
      <Navbar />
      <AuthBackground />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground mt-2">
              Join the RUET community to connect and share knowledge
            </p>
          </motion.div>

          <AuthCard
            title="Sign Up"
            footer={
              <p className="text-center text-sm text-muted-foreground w-full">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            }
          >
            {registrationSuccess ? (
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                </motion.div>
                <motion.h3
                  className="text-lg font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Registration Successful!
                </motion.h3>
                <motion.p
                  className="text-muted-foreground mt-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Please check your email for an activation link.
                </motion.p>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Redirecting to login page...
                </motion.p>
              </motion.div>
            ) : (
              <>
                {formError && <AuthFormError message={formError} />}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormAnimationWrapper index={0}>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormAnimationWrapper>

                    <FormAnimationWrapper index={1}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="your.email@example.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormAnimationWrapper>

                    <FormAnimationWrapper index={2}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="••••••••"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormAnimationWrapper>

                    <FormAnimationWrapper index={3}>
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="••••••••"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormAnimationWrapper>

                    <FormAnimationWrapper index={4}>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </FormAnimationWrapper>
                  </form>
                </Form>
              </>
            )}
          </AuthCard>
        </div>
      </div>
    </>
  );
}
