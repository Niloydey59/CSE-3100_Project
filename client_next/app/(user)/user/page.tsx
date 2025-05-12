"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/src/services/features/authService";
import { User } from "@/src/types/user.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pencil,
  Calendar,
  BookOpen,
  Building2,
  GraduationCap,
  ShieldCheck,
  FileText,
} from "lucide-react";
import UserProfileOverview from "@/components/user/overview/UserProfileOverview";
import RecentUserPosts from "@/components/user/overview/RecentUserPosts";
import { formatDate } from "@/src/utils/dateUtils";
import Loading from "@/components/Loading/Loading";
import Link from "next/link";
import { useUser } from "@/components/layout/UserContext";

export default function UserDashboard() {
  const { user, loading } = useUser();

  const [profileCompleteness, setProfileCompleteness] = useState(0);

  useEffect(() => {
    if (user) {
      // Calculate profile completeness
      calculateProfileCompleteness(user);
    }
  }, [user]);

  const calculateProfileCompleteness = (user: User) => {
    // Logic to calculate profile completeness - only count verified fields
    const fields = [
      !!user.username,
      !!user.email,
      !!user.bio,
      !!(user.series && user.series.value && user.series.isApproved),
      !!(
        user.department &&
        user.department.value &&
        user.department.isApproved
      ),
      !!(user.position && user.position.value && user.position.isApproved),
      !!user.isVerified,
    ];

    const completedFields = fields.filter(Boolean).length;
    const completenessPercentage = Math.round(
      (completedFields / fields.length) * 100
    );
    setProfileCompleteness(completenessPercentage);
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.username}!
          </p>
        </div>
        {/* Removed the buttons container */}
      </div>

      {/* Profile Completeness Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Profile Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {profileCompleteness}% complete
              </span>
              <Link href="/user/settings">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Complete Profile
                </Button>
              </Link>
            </div>
            <Progress value={profileCompleteness} className="h-2" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {!user.bio && (
                <Link href="/user/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-1 px-2 text-xs"
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Add Bio
                  </Button>
                </Link>
              )}

              {(!user.department?.value || !user.department.isApproved) && (
                <Link href="/user/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-1 px-2 text-xs"
                  >
                    <Building2 className="mr-1 h-3 w-3" />
                    {user.department?.pendingApproval
                      ? "Department Pending"
                      : "Add Department"}
                  </Button>
                </Link>
              )}

              {(!user.series?.value || !user.series.isApproved) && (
                <Link href="/user/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-1 px-2 text-xs"
                  >
                    <BookOpen className="mr-1 h-3 w-3" />
                    {user.series?.pendingApproval
                      ? "Series Pending"
                      : "Add Series"}
                  </Button>
                </Link>
              )}

              {(!user.position?.value || !user.position.isApproved) && (
                <Link href="/user/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-1 px-2 text-xs"
                  >
                    <GraduationCap className="mr-1 h-3 w-3" />
                    {user.position?.pendingApproval
                      ? "Position Pending"
                      : "Add Position"}
                  </Button>
                </Link>
              )}

              {!user.isVerified && (
                <Link href="/user/verification">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-1 px-2 text-xs"
                  >
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Get Verified
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfileOverview user={user} />
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Posts</CardTitle>
            <Link href="/user/posts">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RecentUserPosts userId={user._id} />
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="space-y-1">
              <dt className="text-muted-foreground">Username</dt>
              <dd className="font-medium">{user.username}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Account Created</dt>
              <dd className="font-medium">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Verification Status</dt>
              <dd className="font-medium">
                {user.isVerified ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">
                    Pending Verification
                  </Badge>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
