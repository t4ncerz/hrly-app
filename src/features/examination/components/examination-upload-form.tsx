"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form, Input, TextArea } from "@/components/form/form";
import { uploadExamination } from "../actions/examination";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Survey name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ExaminationUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { control, handleSubmit } = methods;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  async function onSubmit(data: FormValues) {
    if (!file) {
      setError("Please upload a file");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", data.name);
      formData.append("description", data.description || "");

      await uploadExamination(formData);
      router.push(`/`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1" htmlFor="file">
              Upload CSV File <span className="text-red-500">*</span>
            </label>
            <input
              id="file"
              className="form-input w-full"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Upload a CSV or Excel file with survey data
            </p>
          </div>

          {error && (
            <div className="bg-red-50 p-3 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          >
            {isLoading ? "Processing..." : "Process Survey Data"}
          </button>
        </form>
      </Form>
    </div>
  );
}

export default ExaminationUploadForm;
