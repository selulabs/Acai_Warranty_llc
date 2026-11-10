import type { ReactNode } from 'react';

export function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-[16px] text-black placeholder:text-neutral-400 transition-colors duration-200 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-100 ${
    hasError ? 'border-error-500 bg-error-50' : 'border-neutral-300 hover:border-neutral-400'
  }`;
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}

export default function FormField({ id, label, error, optional, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-black">
        {label}
        {optional ? <span className="ml-1 font-normal text-neutral-500">(optional)</span> : <span className="ml-1 text-secondary-600" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-2 text-sm font-medium text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}
