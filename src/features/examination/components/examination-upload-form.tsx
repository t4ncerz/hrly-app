"use client";

import { useForm } from "react-hook-form";
import { Form, Input, TextArea, FileInput } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadExamination } from "../actions/examination";

const formSchema = z.object({
  name: z.string().min(1, "Survey name is required"),
  description: z.string().optional(),
  file: z
    .instanceof(File, { message: "Please upload a file" })
    .refine((file) => file !== undefined, { message: "Please upload a file" }),
});

export type FormValues = z.infer<typeof formSchema>;

export function ExaminationUploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      file: undefined,
    },
  });

  const { control, handleSubmit } = methods;

  async function onSubmit(formValues: FormValues) {
    if (!formValues.file) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await uploadExamination(formValues);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Upload Survey Data</h2>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            control={control}
            name="name"
            label="Survey Name"
            placeholder="Employee Satisfaction 2023"
            required
          />

          <TextArea
            control={control}
            name="description"
            label="Description (Optional)"
            placeholder="Annual employee satisfaction survey results"
            rows={3}
          />

          <FileInput
            control={control}
            name="file"
            label="Upload Survey File"
            accept=".csv,.xlsx,.xls"
            supportingText="Upload a CSV or Excel file with survey data"
            required
          />

          {error && (
            <div className="bg-red-50 p-3 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isLoading ? "Processing..." : "Process Survey Data"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
