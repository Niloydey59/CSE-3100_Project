import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileUp, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  documentTypes: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  onUpload: (file: File, documentType: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documentTypes,
  onUpload,
  isUploading,
  uploadProgress,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypChange = (value: string) => {
    setSelectedType(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    if (selectedFile && selectedType) {
      onUpload(selectedFile, selectedType);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const selectedTypeDetails = documentTypes.find(
    (type) => type.id === selectedType
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="documentType">Document Type</Label>
        <Select
          value={selectedType}
          onValueChange={handleTypChange}
          disabled={isUploading}
        >
          <SelectTrigger id="documentType">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTypeDetails && (
          <p className="text-xs text-muted-foreground mt-1">
            {selectedTypeDetails.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Document File</Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            isUploading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary/50 hover:bg-accent/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {selectedFile ? (
              <div className="w-full">
                <div className="flex items-center justify-between bg-accent/50 rounded p-2 mb-2">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <FileUp className="h-4 w-4 flex-shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={isUploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to replace with a different file
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    Drag files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPEG, PNG, and PDF (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading...</span>
            <span>{uploadProgress.toFixed(0)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!selectedFile || !selectedType || isUploading}
        className="w-full"
      >
        {isUploading ? "Uploading..." : "Upload Document"}
      </Button>
    </div>
  );
};

export default DocumentUploader;
