"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Button } from "@/components/ui/button";

interface TFormField {
  name: string;
  control: any;
  label: string;
  type?: string;
  placeholder?: string;
  showPasswordToggle?: boolean;
}
const FormField: React.FC<TFormField> = ({
  name,
  control,
  label,
  type = "text",
  placeholder,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <label className="block text-base font-normal text-gray-800">
            {label}
          </label>
          <input
            {...field}
            type={inputType}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base placeholder:text-gray-400"
          />
          {fieldState.invalid && (
            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
          )}
          {showPasswordToggle && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id={`show-${name}`}
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label
                htmlFor={`show-${name}`}
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                Show Password
              </label>
            </div>
          )}
        </div>
      )}
    />
  );
};
type TFormWithoutControl = Omit<TFormField, "control">;

interface AuthFormProps {
  schema: any;
  defaultValues: any;
  onSubmit: any;
  fields: TFormWithoutControl[];
  submitText?: string;
  title?: string;
  footer?: any;
}
const AuthForm: React.FC<AuthFormProps> = ({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText = "Submit",
  title,
  footer,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-teal-600 p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-12">
        {title && (
          <h1 className="text-5xl font-normal text-gray-700 text-center mb-12">
            {title}
          </h1>
        )}

        <form className="space-y-6">
          {fields.map((field: TFormWithoutControl) => (
            <FormField
              key={field.name}
              name={field.name}
              control={form.control}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              showPasswordToggle={field.showPasswordToggle}
            />
          ))}

          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors duration-200 mt-8"
          >
            {submitText}
          </Button>
        </form>

        {footer && <div className="text-center mt-8 space-y-2">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthForm;
