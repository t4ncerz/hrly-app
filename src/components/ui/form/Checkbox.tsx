"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";

export interface CheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Checkbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  className = "",
  disabled,
  ...props
}: CheckboxProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name, ...props });
  const { error } = fieldState;
  const id = `form-${name}`;

  return (
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          id={id}
          className={`form-checkbox ${
            disabled
              ? "disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              : ""
          } ${className}`}
          disabled={disabled}
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
        />
        {label && <span className="text-sm ml-2">{label}</span>}
      </label>
      {error?.message && (
        <div className="text-xs mt-1 text-red-500">{error.message}</div>
      )}
    </div>
  );
}
