"use server";

import {
  insertExamination,
  getExaminations as getExaminationsFromDb,
} from "../db/examination";
import { randomUUID } from "node:crypto";
import Papa from "papaparse";
import { FormValues } from "../components/examination-upload-form";

export async function uploadExamination(formData: FormValues) {
  // Parse the CSV file to JSON
  const csvText = await formData.file.text();

  const { data, errors } = Papa.parse(csvText, {
    header: true, // First row is headers
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (errors.length > 0) {
    throw new Error(`Error parsing CSV: ${errors?.[0]?.message}`);
  }

  // Store the parsed JSON data instead of the raw file
  const examination = await insertExamination({
    id: randomUUID(),
    name: formData.name,
    description: formData.description,
    type: "ENGAGEMENT",
    sourceData: data, // Using the parsed JSON data
  });

  return examination;
}

export async function getExaminations() {
  const examinations = await getExaminationsFromDb();
  return examinations;
}
