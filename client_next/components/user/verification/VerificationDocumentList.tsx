import React, { useState } from "react";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Eye,
  MessageCircle,
  FileIcon,
  FileType,
  Image as ImageIcon,
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
import Image from "next/image";

interface VerificationDocumentListProps {
  documents: string[];
  onDelete: (documentIndex: number) => void;
}

const VerificationDocumentList: React.FC<VerificationDocumentListProps> = ({
  documents,
  onDelete,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const getFileIcon = (url: string) => {
    return <ImageIcon className="h-4 w-4 text-blue-500" />;
  };

  const getDocumentName = (url: string) => {
    // Extract filename from URL
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleOpenDetails = (documentUrl: string) => {
    setSelectedDocument(documentUrl);
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-md p-3 mb-2">
        <h3 className="text-sm font-medium">Your Documents</h3>
        <p className="text-xs text-muted-foreground mt-1">
          These documents are used to verify your identity and academic
          affiliations.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-6 border rounded-md border-dashed">
          <p className="text-muted-foreground mb-2">
            No documents uploaded yet
          </p>
          <p className="text-xs text-muted-foreground">
            Upload verification documents to validate your account details
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-accent/40">
                <div className="flex items-center min-w-0">
                  {getFileIcon(document)}
                  <div className="ml-2 min-w-0">
                    <p className="font-medium text-sm truncate">
                      Verification Document
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {getDocumentName(document)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              </div>

              <div className="p-3 text-xs border-t">
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
                        View Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Document Preview</DialogTitle>
                        <DialogDescription>
                          Preview of your verification document
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="flex justify-center mb-4">
                          <div className="bg-muted rounded-lg p-2 inline-flex">
                            <div className="relative h-64 w-64">
                              <Image
                                src={document}
                                alt="Verification Document"
                                fill
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                          </div>
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
                          onClick={() => onDelete(index)}
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
      )}
    </div>
  );
};

export default VerificationDocumentList;
