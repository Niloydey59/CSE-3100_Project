import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  isUploading,
  uploadProgress,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">
          Upload Verification Document
        </label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSelectFile}
            disabled={isUploading}
            className="flex-1"
          >
            {selectedFile ? selectedFile.name : "Choose image file..."}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".jpg,.jpeg,.png"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Accepted formats: JPEG, PNG (max 5MB)
        </p>
      </div>

      {isUploading ? (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Uploading... {uploadProgress.toFixed(0)}%
          </p>
        </div>
      ) : (
        <Button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      )}
    </div>
  );
};

export default DocumentUploader;
