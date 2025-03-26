"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath,
  FormProvider,
} from "react-hook-form";
import Tooltip from "@/components/ui/tooltip";

// Form root component - wrapper around FormProvider
const Form = FormProvider;

// Input component
interface InputProps<
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

function Input<
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

// Select component
interface SelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

function Select<
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

// Checkbox component
interface CheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  className?: string;
  disabled?: boolean;
}

function Checkbox<
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

// Radio component
interface RadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

function Radio<
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
                value={option.value}
                checked={field.value === option.value}
                onChange={() => field.onChange(option.value)}
                onBlur={field.onBlur}
                disabled={disabled}
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

// TextArea component
interface TextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  tooltip?: string;
  supportingText?: string;
  disabled?: boolean;
  required?: boolean;
}

function TextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  className = "",
  rows = 3,
  tooltip,
  supportingText,
  disabled,
  required,
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
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
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

export { Form, Input, Select, Checkbox, Radio, TextArea };
