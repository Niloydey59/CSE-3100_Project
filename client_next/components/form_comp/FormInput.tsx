'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  error
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label className="text-sm font-medium text-accent-foreground dark:text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FormInput;
