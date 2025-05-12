import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check } from "lucide-react";

const DocumentRequirements: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Verification Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 rounded-md p-3 border border-amber-200 dark:border-amber-900">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-500">
                  Important Information
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Please upload clear images of official documents that verify
                  your identity, academic position, and departmental
                  affiliation.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Acceptable Documents</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>RUET Student ID Card</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>RUET Faculty/Staff ID Card</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Admission Letter</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Department-issued Certificate or ID</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              The review process typically takes 1-3 business days. You'll be
              notified once your verification is complete.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentRequirements;
