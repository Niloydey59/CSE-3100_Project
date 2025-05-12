import React from "react";
import { User } from "@/src/types/user.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileTextIcon,
  Mail,
  Pencil,
  User as UserIcon,
  UserCheck,
  XCircle,
} from "lucide-react";

interface VerificationStatusProps {
  user: User;
  onManageDocuments: () => void;
  isEmailVerified?: boolean;
  onSendVerificationEmail?: () => Promise<void>;
  isEmailVerificationLoading?: boolean;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  user,
  onManageDocuments,
  isEmailVerified = false,
  onSendVerificationEmail,
  isEmailVerificationLoading = false,
}) => {
  const seriesStatus = user.series?.isApproved
    ? "verified"
    : user.series?.pendingApproval
    ? "pending"
    : "unverified";

  const departmentStatus = user.department?.isApproved
    ? "verified"
    : user.department?.pendingApproval
    ? "pending"
    : "unverified";

  const positionStatus = user.position?.isApproved
    ? "verified"
    : user.position?.pendingApproval
    ? "pending"
    : "unverified";

  const hasDocuments =
    user.verificationDocument && user.verificationDocument.length > 0;

  return (
    <div className="space-y-6">
      {/* Email Verification Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-500" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Verification Status</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isEmailVerified
                  ? "Your email address has been verified"
                  : "Your email address needs to be verified"}
              </p>
            </div>
            {isEmailVerified ? (
              <Badge className="bg-green-500/10 text-green-600 border-green-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
                <AlertCircle className="mr-1 h-3 w-3" />
                Not Verified
              </Badge>
            )}
          </div>
        </CardContent>
        {!isEmailVerified && onSendVerificationEmail && (
          <CardFooter className="flex justify-end border-t pt-3">
            <Button
              variant="default"
              size="sm"
              onClick={onSendVerificationEmail}
              disabled={isEmailVerificationLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isEmailVerificationLoading
                ? "Sending..."
                : "Send Verification Email"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Academic Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <UserCheck className="mr-2 h-5 w-5 text-blue-500" />
            Academic Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-accent/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Series</span>
                  {seriesStatus === "verified" && (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 border-green-200"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {seriesStatus === "pending" && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 border-amber-200"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                  {seriesStatus === "unverified" && (
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-600 border-red-200"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-bold">
                  {user.series?.value ? user.series.value : "Not Set"}
                </p>
              </div>

              <div className="bg-accent/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Department</span>
                  {departmentStatus === "verified" && (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 border-green-200"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {departmentStatus === "pending" && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 border-amber-200"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                  {departmentStatus === "unverified" && (
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-600 border-red-200"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-bold">
                  {user.department?.value || "Not Set"}
                </p>
              </div>

              <div className="bg-accent/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Position</span>
                  {positionStatus === "verified" && (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 border-green-200"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {positionStatus === "pending" && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 border-amber-200"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                  {positionStatus === "unverified" && (
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-600 border-red-200"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-bold capitalize">
                  {user.position?.value?.replace("_", " ") || "Not Set"}
                </p>
              </div>
            </div>

            <div className="bg-accent/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Documents</span>
                {hasDocuments ? (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-600 border-amber-200"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Review
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-500/10 text-red-600 border-red-200"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    No Documents
                  </Badge>
                )}
              </div>
              <p className="text-sm">
                {hasDocuments
                  ? `${
                      user.verificationDocument!.length
                    } document(s) uploaded and pending review`
                  : "No verification documents have been uploaded"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onManageDocuments} className="w-full sm:w-auto">
              <Pencil className="mr-2 h-4 w-4" />
              Manage Documents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStatus;
