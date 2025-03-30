"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Form, Input, TextArea, Select } from "@/components/ui/form";
import { createReport } from "../actions/reports";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getExaminations } from "@/features/examination/actions/examination";
import { useRouter } from "next/navigation";

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Nazwa raportu jest wymagana"),
  description: z.string().optional(),
  examinationId: z.string().min(1, "Proszę wybrać badanie"),
});

type FormValues = z.infer<typeof formSchema>;

type Examination = {
  id: string;
  name: string;
};

export function ReportCreateForm() {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingExaminations, setFetchingExaminations] = useState(true);
  const router = useRouter();

  // Fetch examinations for dropdown
  useEffect(() => {
    async function fetchExaminations() {
      try {
        const examinations = await getExaminations();
        setExaminations(examinations);
      } catch (err) {
        console.error("Error fetching examinations:", err);
        setError("Nie udało się załadować badań. Spróbuj ponownie.");
      } finally {
        setFetchingExaminations(false);
      }
    }

    fetchExaminations();
  }, []);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      examinationId: "",
    },
  });

  const { control, handleSubmit } = methods;

  async function onSubmit(data: FormValues) {
    setError(null);
    setIsLoading(true);

    try {
      console.log(data);
      const report = await createReport({
        examinationId: data.examinationId,
        name: data.name,
      });

      router.push(`/reports/${report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  }

  if (fetchingExaminations) {
    return <div>Ładowanie badań...</div>;
  }

  return (
    <div className="w-full max-w-2xl">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            control={control}
            name="name"
            label="Nazwa Raportu"
            placeholder="Analiza Satysfakcji Pracowników Q2"
            required
          />

          <TextArea
            control={control}
            name="description"
            label="Opis (Opcjonalny)"
            placeholder="Raport analizujący wyniki ankiety satysfakcji pracowników za Q2"
            rows={3}
          />

          <Select
            control={control}
            name="examinationId"
            label="Wybierz Badanie"
            required
            options={examinations.map((exam) => ({
              value: exam.id,
              label: exam.name,
            }))}
          />

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
            {isLoading ? "Generowanie Raportu..." : "Generuj Raport"}
          </button>
        </form>
      </Form>
    </div>
  );
}

export default ReportCreateForm;
