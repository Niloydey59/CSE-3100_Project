"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import VerificationStatus from "@/components/user/verification/VerificationStatus";
import DocumentManagement from "@/components/user/verification/DocumentManagement";
import DocumentRequirements from "@/components/user/verification/DocumentRequirements";
import { useUser } from "@/components/layout/UserContext";
import {
  requestVerification,
  uploadVerificationDocuments,
  sendVerificationEmail,
} from "@/src/services/features/authService";

const VerificationPage = () => {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("status");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);
  const [isEmailVerificationLoading, setIsEmailVerificationLoading] =
    useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.verificationDocument) {
      setDocuments(user.verificationDocument);
    }
  }, [user]);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return newProgress;
      });
    }, 300);

    try {
      // Use the actual API to upload the document
      const response = await uploadVerificationDocuments([file]);

      // Update documents with the new one from the response
      if (response && response.documents) {
        setDocuments(response.documents);
      }

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
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDeleteDocument = (documentIndex: number) => {
    // In a real app, you would call API to delete the document
    // For now, just update the state
    const newDocs = [...documents];
    newDocs.splice(documentIndex, 1);
    setDocuments(newDocs);

    toast({
      title: "Document deleted",
      description: "Your document has been successfully deleted.",
    });
  };

  const handleUpdateInfo = async (data: {
    series?: number;
    position?: string;
    department?: string;
  }) => {
    try {
      await requestVerification(data);

      toast({
        title: "Information submitted",
        description: "Your information has been submitted for verification.",
      });
    } catch (error) {
      console.error("Failed to submit verification info:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          "There was a problem submitting your information. Please try again.",
      });
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsEmailVerificationLoading(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and follow the instructions.",
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description:
          "There was a problem sending the verification email. Please try again later.",
      });
    } finally {
      setIsEmailVerificationLoading(false);
    }
  };

  const handleManageDocuments = () => {
    setActiveTab("documents");
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
          <VerificationStatus
            user={user}
            onManageDocuments={handleManageDocuments}
            isEmailVerified={user.isVerified}
            onSendVerificationEmail={handleSendVerificationEmail}
            isEmailVerificationLoading={isEmailVerificationLoading}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6 space-y-6">
          <DocumentManagement
            documents={documents}
            onDelete={handleDeleteDocument}
            onUpload={handleUpload}
            onUpdateInfo={handleUpdateInfo}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          <DocumentRequirements />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationPage;
