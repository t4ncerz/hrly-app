"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import Tooltip from "@/components/ui/tooltip";

export interface TextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  className?: string;
  tooltip?: string;
  supportingText?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}

export function TextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  className = "",
  tooltip,
  supportingText,
  disabled,
  required,
  rows = 3,
  ...props
}: TextAreaProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name, ...props });
  const { error } = fieldState;
  const id = `form-${name}`;

  return (
    <div>
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

      <textarea
        id={id}
        className={`form-textarea w-full ${
          error ? "border-red-300" : ""
        } ${className}`}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...field}
      />

      {error?.message && (
        <div className="text-xs mt-1 text-red-500">{error.message}</div>
      )}

      {supportingText && !error?.message && (
        <div className="text-xs mt-1">{supportingText}</div>
      )}
    </div>
  );
}
