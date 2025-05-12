"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/src/types/user.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById, updateUser } from "@/src/services/features/userService";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import ProfileInformationForm from "@/components/user/settings/ProfileInformationForm";
import AcademicInformationForm from "@/components/user/settings/AcademicInformationForm";

const UserSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    series: "",
    position: "none",
    department: "none",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For now use a mock user ID
        const userId = "68007b0f485e0a2e69295c2b";
        const response = await getUserById(userId);
        setUser(response.payload.user);

        // Initialize form data
        setFormData({
          username: response.payload.user.username || "",
          bio: response.payload.user.bio || "",
          series: response.payload.user.series?.value?.toString() || "",
          position: response.payload.user.position?.value || "none",
          department: response.payload.user.department?.value || "none",
        });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        username: user.username,
        bio: user.bio || "",
        series: user.series?.value?.toString() || "",
        position: user.position?.value || "none",
        department: user.department?.value || "none",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      if (!user) return;

      const updateData = {
        username: formData.username,
        bio: formData.bio,
        series:
          formData.series && formData.series !== "none"
            ? {
                value: parseInt(formData.series),
                pendingApproval: true,
              }
            : undefined,
        position:
          formData.position && formData.position !== "none"
            ? {
                value: formData.position as any,
                pendingApproval: true,
              }
            : undefined,
        department:
          formData.department && formData.department !== "none"
            ? {
                value: formData.department as any,
                pendingApproval: true,
              }
            : undefined,
      };

      try {
        // Use the actual API call instead of simulation
        const response = await updateUser(user._id, updateData);

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });

        // Update the user state with response data
        setUser(response.payload.user);
      } catch (apiError) {
        console.error("API call failed:", apiError);
        throw new Error(
          apiError instanceof Error
            ? apiError.message
            : "Failed to update profile"
        );
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and profile details
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="academic">Academic Details</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileInformationForm
            user={user}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            saveLoading={saveLoading}
          />
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <AcademicInformationForm
            user={user}
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            saveLoading={saveLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
