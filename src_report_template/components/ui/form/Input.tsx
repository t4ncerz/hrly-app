"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import Tooltip from "@/components/ui/tooltip";

export interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  supportingText?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Input<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  tooltip,
  prefix,
  suffix,
  icon,
  supportingText,
  disabled,
  required,
  ...props
}: InputProps<TFieldValues, TName>) {
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

      <div className="relative">
        {prefix && (
          <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium px-3">
              {prefix}
            </span>
          </div>
        )}

        {icon && (
          <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={type}
          className={`form-input w-full 
            ${prefix ? "pl-12" : ""} 
            ${suffix ? "pr-8" : ""} 
            ${icon ? "pl-9" : ""} 
            ${error ? "border-red-300" : ""} 
            ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          {...field}
        />

        {suffix && (
          <div className="absolute inset-0 left-auto flex items-center pointer-events-none">
            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium px-3">
              {suffix}
            </span>
          </div>
        )}
      </div>

      {error?.message && (
        <div className="text-xs mt-1 text-red-500">{error.message}</div>
      )}

      {supportingText && !error?.message && (
        <div className="text-xs mt-1">{supportingText}</div>
      )}
    </div>
  );
}
