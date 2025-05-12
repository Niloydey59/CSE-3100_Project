export interface Document {
  id: string;
  type: string;
  filename: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  url: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
}

export interface VerificationDocument {
  url: string;
  uploadDate: string;
  fieldToVerify: string;
}

export interface VerificationField {
  value: string | number | null;
  isApproved: boolean;
  pendingApproval: boolean;
}
