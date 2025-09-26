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
  name: z.string().min(1, "Nazwa badania jest wymagana"),
  description: z.string().optional(),
  file: z
    .instanceof(File, { message: "Proszę wgrać plik" })
    .refine((file) => file !== undefined, { message: "Proszę wgrać plik" }),
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
      setError(e instanceof Error ? e.message : "Wystąpił błąd");
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
            label="Nazwa Badania"
            placeholder="Badanie Satysfakcji Pracowników 2023"
            required
          />

          <TextArea
            control={control}
            name="description"
            label="Opis (Opcjonalny)"
            placeholder="Wyniki corocznego badania satysfakcji pracowników"
            rows={3}
          />

          <FileInput
            control={control}
            name="file"
            label="Wgraj Plik Badania"
            accept=".csv,.xlsx,.xls"
            supportingText="Wgraj plik CSV lub Excel z danymi badania"
            required
          />

          {error && (
            <div className="bg-red-50 p-3 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isLoading ? "Przetwarzanie..." : "Przetwórz Dane Badania"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
