"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";

export interface RadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

export function Radio<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  className = "",
  disabled,
  ...props
}: RadioProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name, ...props });
  const { error } = fieldState;
  const groupName = `form-${name}`;

  return (
    <div>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="flex flex-wrap items-center -m-3">
        {options.map((option) => (
          <div key={option.value} className="m-3">
            <label className="flex items-center">
              <input
                type="radio"
                name={groupName}
                className={`form-radio ${
                  disabled
                    ? "disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    : ""
                } ${className}`}
                disabled={disabled}
                value={option.value}
                checked={field.value === option.value}
                onChange={() => field.onChange(option.value)}
                onBlur={field.onBlur}
              />
              <span className="text-sm ml-2">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
      {error?.message && (
        <div className="text-xs mt-1 text-red-500">{error.message}</div>
      )}
    </div>
  );
}
