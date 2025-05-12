import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentUploader from "./DocumentUploader";
import VerificationDocumentList from "./VerificationDocumentList";
import VerificationForm from "./VerificationForm";

interface DocumentManagementProps {
  documents: string[];
  onDelete: (documentIndex: number) => void;
  onUpload: (file: File) => void;
  onUpdateInfo: (data: {
    series?: number;
    position?: string;
    department?: string;
  }) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({
  documents,
  onDelete,
  onUpload,
  onUpdateInfo,
  isUploading,
  uploadProgress,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationForm onSubmit={onUpdateInfo} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Upload Verification Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploader
            onUpload={onUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationDocumentList documents={documents} onDelete={onDelete} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManagement;
