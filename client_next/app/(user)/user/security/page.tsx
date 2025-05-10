"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/src/types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userService } from "@/src/services/features/userService";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import {
  InfoIcon,
  AlertTriangle,
  ShieldCheck,
  Lock,
  SendHorizonal,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PasswordStrengthMeter from "@/components/user/security/PasswordStrengthMeter";
import { checkPasswordStrength } from "@/src/utils/passwordUtils";

const UserSecurityPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { toast } = useToast();

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  // Error states
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For now use a mock user ID
        const userId = "68007b0f485e0a2e69295c2b";
        const response = await userService.getUserById(userId);
        setUser(response.payload.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    // If changing new password, check strength
    if (name === "newPassword") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength({
        score: strength.score,
        feedback: strength.feedback,
      });
    }

    // Clear errors when typing
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validatePasswordForm = () => {
    const errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!passwordForm.oldPassword) {
      errors.oldPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setUpdateLoading(true);
    try {
      if (!user) return;

      // For demo, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, call the API
      // await userService.updatePassword(user._id, passwordForm);

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });

      // Reset form
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordStrength({
        score: 0,
        feedback: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to update password. Please check your current password and try again.",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!user) return;

    setVerificationLoading(true);
    try {
      // For demo, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, call the API
      // await userService.sendVerificationEmail();

      toast({
        title: "Verification email sent",
        description:
          "Please check your email and follow the instructions to verify your account.",
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to send verification email. Please try again later.",
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security and password
        </p>
      </div>

      {/* Account Verification Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
            Account Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.isVerified ? (
            <Alert className="bg-green-500/10 text-green-600 border-green-200">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Account Verified</AlertTitle>
              <AlertDescription>
                Your account is verified. You have full access to all platform
                features.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert className="bg-amber-500/10 text-amber-600 border-amber-200 mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Your account is not verified. Verify your email to unlock all
                  features.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSendVerificationEmail}
                disabled={verificationLoading}
                className="w-full sm:w-auto"
              >
                <SendHorizonal className="mr-2 h-4 w-4" />
                {verificationLoading ? "Sending..." : "Send Verification Email"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdatePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.oldPassword ? "border-red-300" : ""}
              />
              {passwordErrors.oldPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.oldPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.newPassword ? "border-red-300" : ""}
              />
              {passwordErrors.newPassword ? (
                <p className="text-sm text-red-500">
                  {passwordErrors.newPassword}
                </p>
              ) : (
                passwordForm.newPassword && (
                  <PasswordStrengthMeter
                    score={passwordStrength.score}
                    feedback={passwordStrength.feedback}
                  />
                )
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={
                  passwordErrors.confirmPassword ? "border-red-300" : ""
                }
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Password requirements</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1">
                  <li>At least 8 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={updateLoading}
              className="w-full sm:w-auto"
            >
              {updateLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserSecurityPage;
