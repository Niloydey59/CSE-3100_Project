import React, { useState } from "react";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Trash2,
  Eye,
  MessageCircle,
  FileIcon,
  Image as ImageIcon,
  FileType,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  type: string;
  filename: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

interface VerificationDocumentListProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
}

const VerificationDocumentList: React.FC<VerificationDocumentListProps> = ({
  documents,
  onDelete,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "id_card":
        return "Student/Faculty ID";
      case "certificate":
        return "Certificate/Degree";
      case "letter":
        return "Official Letter";
      default:
        return "Document";
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case "pdf":
        return <FileIcon className="h-4 w-4 text-red-500" />;
      default:
        return <FileType className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleOpenDetails = (document: Document) => {
    setSelectedDocument(document);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md border-dashed">
        <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
        <p className="text-xs text-muted-foreground">
          Upload verification documents to validate your account details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-md p-3 mb-2">
        <h3 className="text-sm font-medium">Your Documents</h3>
        <p className="text-xs text-muted-foreground mt-1">
          These documents are used to verify your identity and academic
          affiliations.
        </p>
      </div>

      <div className="space-y-3">
        {documents.map((document) => (
          <div key={document.id} className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-accent/40">
              <div className="flex items-center min-w-0">
                {getFileIcon(document.filename)}
                <div className="ml-2 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {getDocumentTypeLabel(document.type)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {document.filename}
                  </p>
                </div>
              </div>
              {getStatusBadge(document.status)}
            </div>

            <div className="p-3 text-xs border-t">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Uploaded</span>
                <span>{formatRelativeTime(document.uploadDate)}</span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleOpenDetails(document)}
                      title="View document details"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Document Details</DialogTitle>
                      <DialogDescription>
                        Information about your verification document
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="flex justify-center mb-4">
                        <div className="bg-muted rounded-lg p-6 inline-flex">
                          {getFileIcon(document.filename)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-muted-foreground">
                            Document Type
                          </div>
                          <div className="font-medium">
                            {getDocumentTypeLabel(document.type)}
                          </div>

                          <div className="text-muted-foreground">Filename</div>
                          <div className="font-medium">{document.filename}</div>

                          <div className="text-muted-foreground">
                            Upload Date
                          </div>
                          <div className="font-medium">
                            {new Date(document.uploadDate).toLocaleDateString()}
                          </div>

                          <div className="text-muted-foreground">Status</div>
                          <div>{getStatusBadge(document.status)}</div>
                        </div>

                        {document.notes && (
                          <div className="mt-4 pt-3 border-t text-sm">
                            <div className="flex items-center text-muted-foreground mb-1">
                              <MessageCircle className="h-3.5 w-3.5 mr-1" />
                              Admin Feedback
                            </div>
                            <p className="p-2 rounded bg-muted">
                              {document.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      title="Delete this document"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this document? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(document.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationDocumentList;
