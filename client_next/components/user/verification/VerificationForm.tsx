import React, { useState } from "react";
import { useUser } from "@/components/layout/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PositionType, DepartmentType } from "@/src/types/user.types";
import { SendHorizonal, Info } from "lucide-react";

interface VerificationFormProps {
  onSubmit: (data: {
    series?: number;
    position?: string;
    department?: string;
  }) => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onSubmit }) => {
  const { user } = useUser();
  const currentYear = new Date().getFullYear();

  // Just use the series value as stored in user data
  const [year, setYear] = useState<string>("");
  const [position, setPosition] = useState<string>(user?.position?.value || "");
  const [department, setDepartment] = useState<string>(
    user?.department?.value || ""
  );

  const positions: { value: PositionType; label: string }[] = [
    { value: "student", label: "Student" },
    { value: "professor", label: "Professor" },
    { value: "associate_professor", label: "Associate Professor" },
    { value: "assistant_professor", label: "Assistant Professor" },
    { value: "lecturer", label: "Lecturer" },
    { value: "lab_assistant", label: "Lab Assistant" },
    { value: "staff", label: "Staff" },
  ];

  const departments: { value: DepartmentType; label: string }[] = [
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "EEE", label: "Electrical & Electronic Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "CE", label: "Civil Engineering" },
    { value: "IPE", label: "Industrial & Production Engineering" },
    { value: "GCE", label: "Glass & Ceramic Engineering" },
    { value: "MTE", label: "Materials & Metallurgical Engineering" },
    { value: "ETE", label: "Electronics & Telecommunication Engineering" },
    { value: "CFPE", label: "Chemical & Food Process Engineering" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: {
      series?: number;
      position?: string;
      department?: string;
    } = {};

    if (year && !isNaN(Number(year))) {
      // Send the full year to the backend
      data.series = Number(year);
    }

    if (position) {
      data.position = position;
    }

    if (department) {
      data.department = department;
    }

    onSubmit(data);
  };

  const validateYear = (value: string) => {
    const yearNum = Number(value);
    return (
      !value || (!isNaN(yearNum) && yearNum >= 1960 && yearNum <= currentYear)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium" htmlFor="year">
              Admission Year
            </label>
            <Info
              className="h-3.5 w-3.5 text-muted-foreground cursor-help"
              title="Enter your full admission year (e.g., 2019). Your series will be determined by the last two digits."
            />
          </div>
          <Input
            id="year"
            type="number"
            placeholder="e.g. 2019"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1960"
            max={currentYear}
            step="1"
            className={!validateYear(year) ? "border-red-500" : ""}
          />
          {!validateYear(year) && (
            <p className="text-xs text-red-500">
              Please enter a valid year between 1960 and {currentYear}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Your admission year at RUET (last two digits will be your series)
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="position">
            Position
          </label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger id="position">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Your role at the university
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="department">
            Department
          </label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Your academic department
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="mt-2"
          disabled={
            (!validateYear(year) && year !== "") ||
            (!year && !position && !department)
          }
        >
          <SendHorizonal className="mr-2 h-4 w-4" />
          Submit for Verification
        </Button>
      </div>
    </form>
  );
};

export default VerificationForm;
