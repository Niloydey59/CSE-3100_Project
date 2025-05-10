'use client';

import React from 'react';
import { Label } from '@/components/ui/label';

interface FileInputProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  required?: boolean;
  error?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  onChange,
  accept = 'image/*,.pdf',
  required = false,
  error,
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label className="text-sm font-medium text-accent-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <input
        type="file"
        onChange={onChange}
        accept={accept}
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FileInput;