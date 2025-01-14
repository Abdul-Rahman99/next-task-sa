"use client";

import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface FormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  defaultValues?: DefaultValues<z.infer<T>>;
  submitText?: string;
  isSubmitting?: boolean;
  children: (
    register: ReturnType<typeof useForm>["register"]
  ) => React.ReactNode;
}

export function Form<T extends z.ZodType>({
  schema,
  onSubmit,
  defaultValues,
  submitText = "Submit",
  isSubmitting = false,
  children,
}: FormProps<T>) {
  const { register, handleSubmit } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {children(register)}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : submitText}
      </button>
    </form>
  );
}
