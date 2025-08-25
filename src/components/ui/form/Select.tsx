"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";

export interface SelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export function Select<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  className = "",
  disabled,
  required,
  placeholder = "Wybierz...",
  ...props
}: SelectProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name, ...props });
  const { error } = fieldState;
  const id = `form-${name}`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`form-select w-full ${
          error ? "border-red-300" : ""
        } ${className}`}
        disabled={disabled}
        {...field}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error?.message && (
        <div className="text-xs mt-1 text-red-500">{error.message}</div>
      )}
    </div>
  );
}
