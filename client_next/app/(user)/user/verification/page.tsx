"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/src/types/user.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  X,
  HelpCircle,
} from "lucide-react";
import { userService } from "@/src/services/features/userService";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DocumentUploader from "@/components/user/verification/DocumentUploader";
import VerificationDocumentList from "@/components/user/verification/VerificationDocumentList";

// Mock verification document types
const DOCUMENT_TYPES = [
  {
    id: "id_card",
    name: "Student/Faculty ID Card",
    description: "Upload a clear image of your university ID card",
  },
  {
    id: "certificate",
    name: "Certificate/Degree",
    description: "Upload your certificate or degree from the university",
  },
  {
    id: "letter",
    name: "Official Letter",
    description: "An official letter from your department",
  },
];

// Mock verification documents (would come from API in a real app)
const MOCK_DOCUMENTS = [
  {
    id: "doc1",
    type: "id_card",
    filename: "student_id_card.jpg",
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
    notes: "Verified and approved by admin.",
  },
];

const VerificationPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("status");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const { toast } = useToast();

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
          description: "Failed to load user data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleUpload = async (file: File, documentType: string) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload with progress
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(i * (100 / totalSteps));
    }

    try {
      // In a real app, you would upload to your server here
      // const formData = new FormData();
      // formData.append('document', file);
      // formData.append('type', documentType);
      // const response = await apiClient.post('/users/verification-documents', formData);

      // For demo, simulate successful upload
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add the new document to the list
      const newDocument = {
        id: `doc${Date.now()}`,
        type: documentType,
        filename: file.name,
        uploadDate: new Date().toISOString(),
        status: "pending",
        notes: "Document is under review.",
      };

      setDocuments((prev) => [...prev, newDocument]);

      toast({
        title: "Document uploaded",
        description:
          "Your verification document has been uploaded and is pending review.",
      });

      // Switch to the Documents tab to show the newly uploaded document
      setActiveTab("documents");
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          "There was a problem uploading your document. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    // In a real app, you would call API to delete the document
    toast({
      title: "Document deleted",
      description: "Your document has been successfully deleted.",
    });

    // Update local state
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Account Verification
        </h1>
        <p className="text-muted-foreground mt-1">
          Verify your identity and account information
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status">Verification Status</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6 space-y-6">
          {/* Verification Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.isVerified ? (
                <Alert className="bg-green-500/10 text-green-600 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Verified Account</AlertTitle>
                  <AlertDescription>
                    Your account has been fully verified. You have access to all
                    platform features.
                  </AlertDescription>
                </Alert>
              ) : documents.some((doc) => doc.status === "approved") ? (
                <Alert className="bg-green-500/10 text-green-600 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Partially Verified</AlertTitle>
                  <AlertDescription>
                    Some of your documents have been verified. Complete the
                    verification process to unlock all features.
                  </AlertDescription>
                </Alert>
              ) : documents.some((doc) => doc.status === "pending") ? (
                <Alert className="bg-amber-500/10 text-amber-600 border-amber-200">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Verification In Progress</AlertTitle>
                  <AlertDescription>
                    Your documents are being reviewed. This process typically
                    takes 1-2 business days.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-primary/10">
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>Not Verified</AlertTitle>
                  <AlertDescription>
                    Please upload identification documents to verify your
                    account.
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">
                  Verification Progress
                </h3>
                <Progress
                  value={user.isVerified ? 100 : documents.length > 0 ? 50 : 0}
                  className="h-2 mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Documents Uploaded</span>
                  <span>Admin Review</span>
                  <span>Fully Verified</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium">Account Details Status</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {user.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 border-green-200"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-xs text-muted-foreground">
                        {user.department?.value || "Not provided"}
                      </p>
                    </div>
                    {user.department?.value ? (
                      user.department.isApproved ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-200"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-600 border-amber-200"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500/10 text-red-600 border-red-200"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Missing
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Position</p>
                      <p className="text-xs text-muted-foreground">
                        {user.position?.value
                          ? user.position.value.replace("_", " ")
                          : "Not provided"}
                      </p>
                    </div>
                    {user.position?.value ? (
                      user.position.isApproved ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-200"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-600 border-amber-200"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500/10 text-red-600 border-red-200"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Missing
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Series</p>
                      <p className="text-xs text-muted-foreground">
                        {user.series?.value || "Not provided"}
                      </p>
                    </div>
                    {user.series?.value ? (
                      user.series.isApproved ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-200"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-600 border-amber-200"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500/10 text-red-600 border-red-200"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Missing
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setActiveTab("documents")}
                className="w-full sm:w-auto"
                variant={documents.length === 0 ? "default" : "outline"}
              >
                <FileText className="mr-2 h-4 w-4" />
                {documents.length === 0
                  ? "Upload Verification Documents"
                  : "Manage Documents"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 space-y-6">
          {/* Document Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>
                Upload documents to verify your identity and academic
                affiliation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {documents.length > 0 && (
                <VerificationDocumentList
                  documents={documents}
                  onDelete={handleDeleteDocument}
                />
              )}

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">
                  Upload New Document
                </h3>
                <DocumentUploader
                  documentTypes={DOCUMENT_TYPES}
                  onUpload={handleUpload}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <Alert className="bg-primary/5 border-primary/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Document guidelines</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-muted-foreground">
                      <li>Documents must be clear and legible</li>
                      <li>Accepted formats: JPEG, PNG, PDF</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Personal information must be clearly visible</li>
                      <li>Avoid uploading expired documents</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <p className="text-muted-foreground">
                  Your documents are securely stored and will only be used for
                  verification purposes. Document verification typically takes
                  1-2 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationPage;
