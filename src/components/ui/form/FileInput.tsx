"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import Tooltip from "@/components/ui/tooltip";

export interface FileInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  className?: string;
  tooltip?: string;
  accept?: string;
  supportingText?: string;
  disabled?: boolean;
  required?: boolean;
  uploadText?: string;
  uploadIcon?: React.ReactNode;
}

export function FileInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  className = "",
  tooltip,
  accept = ".png,.jpg,.jpeg,.pdf",
  supportingText = "We accept PNG, JPEG, and PDF files.",
  disabled,
  required,
  uploadText,
  uploadIcon = (
    <svg
      className="inline-flex fill-gray-400 dark:fill-gray-500 mb-3"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 4c-.3 0-.5.1-.7.3L1.6 10 3 11.4l4-4V16h2V7.4l4 4 1.4-1.4-5.7-5.7C8.5 4.1 8.3 4 8 4ZM1 2h14V0H1v2Z" />
    </svg>
  ),
  ...props
}: FileInputProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name, ...props });
  const { error } = fieldState;
  const id = `form-${name}`;
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    field.onChange(file);
    setFileName(file ? file.name : null);
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium mb-1" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {tooltip && (
            <Tooltip className="ml-2" bg="dark" size="md">
              <div className="text-sm text-gray-200">{tooltip}</div>
            </Tooltip>
          )}
        </div>
      )}

      <div className="rounded-sm bg-gray-100 dark:bg-gray-700/30 border border-dashed border-gray-300 dark:border-gray-700/60 text-center px-5 py-8">
        {uploadIcon}
        <label
          htmlFor={id}
          className="block text-sm text-gray-500 dark:text-gray-400 italic cursor-pointer"
        >
          {fileName ? fileName : uploadText || supportingText}
        </label>
        <input
          className="sr-only"
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          onBlur={field.onBlur}
        />
      </div>

      {error?.message && (
        <div className="text-xs mt-1 text-red-500">{error.message}</div>
      )}
    </div>
  );
}
