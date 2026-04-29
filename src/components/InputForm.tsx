'use client';

import { useState } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

export interface FormData {
  [key: string]: string;
}

interface InputFormProps {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  fields: FormField[];
  submitLabel?: string;
}

export default function InputForm({
  onSubmit,
  loading,
  fields,
  submitLabel = 'Submit',
}: InputFormProps) {
  const [formData, setFormData] = useState<FormData>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-3 ml-1">
            {field.label}
            {field.required && <span className="text-rose-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' && (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.rows || 5}
              className={`nb-input text-sm leading-relaxed ${errors[field.name] ? 'border-rose-500' : ''}`}
            />
          )}

          {field.type === 'select' && (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`nb-input text-sm ${errors[field.name] ? 'border-rose-500' : ''}`}
            >
              <option value="">SELECT {field.label.toUpperCase()}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {field.type === 'text' && (
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`nb-input text-sm ${errors[field.name] ? 'border-rose-500' : ''}`}
            />
          )}

          {errors[field.name] && (
            <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="nb-button w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            WORKING...
          </span>
        ) : submitLabel}
      </button>
    </form>
  );
}