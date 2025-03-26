"use server";

import {
  insertExamination,
  getExaminations as getExaminationsFromDb,
} from "../db/examination";
import { randomUUID } from "node:crypto";
import Papa from "papaparse";

export async function uploadExamination(formData: FormData) {
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Parse the CSV file to JSON
  const csvText = await file.text();

  const { data, errors } = Papa.parse(csvText, {
    header: true, // First row is headers
    skipEmptyLines: true,
    dynamicTyping: true, // Convert numeric values to numbers
  });

  if (errors.length > 0) {
    throw new Error(`Error parsing CSV: ${errors?.[0]?.message}`);
  }

  // Store the parsed JSON data instead of the raw file
  const examination = await insertExamination({
    id: randomUUID(),
    name,
    description,
    type: "ENGAGEMENT",
    sourceData: data, // Using the parsed JSON data
  });

  return examination;
}

export async function getExaminations() {
  const examinations = await getExaminationsFromDb();
  return examinations;
}
