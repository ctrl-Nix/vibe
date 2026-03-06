// File location: src/components/InputForm.tsx
// Reusable form component

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' && (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.rows || 5}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}

          {field.type === 'select' && (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {field.label}</option>
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}

          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Processing...' : submitLabel}
      </button>
    </form>
  );
}