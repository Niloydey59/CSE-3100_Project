"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/src/types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/src/services/features/userService";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import UserSettingsAvatar from "@/components/user/settings/UserSettingsAvatar";

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
    position: "",
    department: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For now use a mock user ID
        const userId = "68007b0f485e0a2e69295c2b";
        const response = await userService.getUserById(userId);
        setUser(response.payload.user);

        // Initialize form data
        setFormData({
          username: response.payload.user.username || "",
          bio: response.payload.user.bio || "",
          series: response.payload.user.series?.value?.toString() || "",
          position: response.payload.user.position?.value || "",
          department: response.payload.user.department?.value || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      if (!user) return;

      const updateData = {
        username: formData.username,
        bio: formData.bio,
        series: formData.series
          ? {
              value: parseInt(formData.series),
              pendingApproval: true,
            }
          : undefined,
        position: formData.position
          ? {
              value: formData.position as any,
              pendingApproval: true,
            }
          : undefined,
        department: formData.department
          ? {
              value: formData.department as any,
              pendingApproval: true,
            }
          : undefined,
      };

      // In a real app, call the API
      try {
        // const response = await userService.updateUser(user._id, updateData);

        // For demo, simulate success
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });

        // Update the user state with new values
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            username: formData.username,
            bio: formData.bio,
            series: {
              value: formData.series ? parseInt(formData.series) : null,
              isApproved: false,
              pendingApproval: true,
            },
            position: {
              value: formData.position as any,
              isApproved: false,
              pendingApproval: true,
            },
            department: {
              value: formData.department as any,
              isApproved: false,
              pendingApproval: true,
            },
          };
        });
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
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                  <UserSettingsAvatar user={user} />

                  <div className="space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Your username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact an administrator if you
                        need to update your email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio about yourself"
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (user) {
                      setFormData({
                        username: user.username,
                        bio: user.bio || "",
                        series: user.series?.value?.toString() || "",
                        position: user.position?.value || "",
                        department: user.department?.value || "",
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveLoading}>
                  {saveLoading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>
                Update your academic details and affiliations
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("department", value)
                    }
                    value={formData.department}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="CSE">
                        Computer Science & Engineering
                      </SelectItem>
                      <SelectItem value="EEE">
                        Electrical & Electronic Engineering
                      </SelectItem>
                      <SelectItem value="ME">Mechanical Engineering</SelectItem>
                      <SelectItem value="CE">Civil Engineering</SelectItem>
                      <SelectItem value="IPE">
                        Industrial & Production Engineering
                      </SelectItem>
                      <SelectItem value="GCE">
                        Glass & Ceramic Engineering
                      </SelectItem>
                      <SelectItem value="MTE">
                        Materials Science & Engineering
                      </SelectItem>
                      <SelectItem value="ETE">
                        Electronics & Telecommunication Engineering
                      </SelectItem>
                      <SelectItem value="CFPE">
                        Chemical & Food Process Engineering
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {user.department?.pendingApproval &&
                    !user.department?.isApproved && (
                      <p className="text-xs text-amber-600 mt-1">
                        Your department change is pending approval from an
                        administrator.
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("position", value)
                    }
                    value={formData.position}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="associate_professor">
                        Associate Professor
                      </SelectItem>
                      <SelectItem value="assistant_professor">
                        Assistant Professor
                      </SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                      <SelectItem value="lab_assistant">
                        Lab Assistant
                      </SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>

                  {user.position?.pendingApproval &&
                    !user.position?.isApproved && (
                      <p className="text-xs text-amber-600 mt-1">
                        Your position change is pending approval from an
                        administrator.
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="series">Series</Label>
                  <Input
                    id="series"
                    name="series"
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    value={formData.series}
                    onChange={handleChange}
                    placeholder="e.g. 2019"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your batch/series year (e.g. 2019)
                  </p>

                  {user.series?.pendingApproval && !user.series?.isApproved && (
                    <p className="text-xs text-amber-600 mt-1">
                      Your series change is pending approval from an
                      administrator.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (user) {
                      setFormData({
                        username: user.username,
                        bio: user.bio || "",
                        series: user.series?.value?.toString() || "",
                        position: user.position?.value || "",
                        department: user.department?.value || "",
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveLoading}>
                  {saveLoading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
