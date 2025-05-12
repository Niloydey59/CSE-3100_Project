import React from "react";
import { User } from "@/src/types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AcademicFormData {
  series: string;
  position: string;
  department: string;
}

interface AcademicInformationFormProps {
  user: User;
  formData: AcademicFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  saveLoading: boolean;
}

const AcademicInformationForm: React.FC<AcademicInformationFormProps> = ({
  user,
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  resetForm,
  saveLoading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Information</CardTitle>
        <CardDescription>
          Update your academic details and affiliations
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              onValueChange={(value) => handleSelectChange("department", value)}
              value={formData.department}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="CSE">
                  Computer Science & Engineering
                </SelectItem>
                <SelectItem value="EEE">
                  Electrical & Electronic Engineering
                </SelectItem>
                <SelectItem value="ME">Mechanical Engineering</SelectItem>
                <SelectItem value="CE">Civil Engineering</SelectItem>
                <SelectItem value="IPE">
                  Industrial & Production Engineering
                </SelectItem>
                <SelectItem value="GCE">Glass & Ceramic Engineering</SelectItem>
                <SelectItem value="MTE">
                  Materials Science & Engineering
                </SelectItem>
                <SelectItem value="ETE">
                  Electronics & Telecommunication Engineering
                </SelectItem>
                <SelectItem value="CFPE">
                  Chemical & Food Process Engineering
                </SelectItem>
              </SelectContent>
            </Select>

            {user.department?.pendingApproval &&
              !user.department?.isApproved && (
                <p className="text-xs text-amber-600 mt-1">
                  Your department change is pending approval from an
                  administrator.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              onValueChange={(value) => handleSelectChange("position", value)}
              value={formData.position}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="associate_professor">
                  Associate Professor
                </SelectItem>
                <SelectItem value="assistant_professor">
                  Assistant Professor
                </SelectItem>
                <SelectItem value="lecturer">Lecturer</SelectItem>
                <SelectItem value="lab_assistant">Lab Assistant</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>

            {user.position?.pendingApproval && !user.position?.isApproved && (
              <p className="text-xs text-amber-600 mt-1">
                Your position change is pending approval from an administrator.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="series">Series</Label>
            <Input
              id="series"
              name="series"
              type="number"
              min="1900"
              max="2099"
              step="1"
              value={formData.series}
              onChange={handleChange}
              placeholder="e.g. 2019"
            />
            <p className="text-xs text-muted-foreground">
              Enter your batch/series year (e.g. 2019)
            </p>

            {user.series?.pendingApproval && !user.series?.isApproved && (
              <p className="text-xs text-amber-600 mt-1">
                Your series change is pending approval from an administrator.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button type="submit" disabled={saveLoading}>
            {saveLoading ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AcademicInformationForm;
