import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { KnowledgeBaseEntry, KnowledgeBaseMap } from "./types";

function parseRecommendations(recString: string): string[] {
  if (!recString) return [];
  // Recommendations are often numbered, e.g., "1. Do this. 2. Do that."
  // Split by number followed by a dot and optional whitespace.
  return recString
    .split(/\d\.\s?/)
    .map((rec) => rec.trim())
    .filter(Boolean);
}

function parseKnowledgeBaseCSV(csvFile: string): KnowledgeBaseMap {
  const knowledgeBase: KnowledgeBaseMap = new Map();

  Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    complete: (results) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.data.forEach((row: any) => {
        // The first column header has some extra characters, let's find it reliably.
        const factorKey = Object.keys(row).find(
          (k) => k.includes("Czynniki") || k === "Czynniki"
        );
        const factor = factorKey ? row[factorKey]?.trim() : undefined;

        if (factor) {
          const entry: KnowledgeBaseEntry = {
            factor: factor,
            area: row["Większe zbiory czynników"]?.trim() || "",
            factor_definition: row["Definicja czynnika"]?.trim() || "",
            scale_1_level: row["Skala: 1"]?.trim() || "",
            scale_1_definition: row["definicja skali 1. "]?.trim() || "",
            scale_1_recommendations: parseRecommendations(
              row["Rekomendacje poziom 1."] || ""
            ),
            scale_2_level: row["Skala: 2"]?.trim() || "",
            scale_2_definition: row["definicja skali: 2"]?.trim() || "",
            scale_2_recommendations: parseRecommendations(
              row["Rekomendacje poziom 2."] || ""
            ),
            scale_3_level: row["skala: 3"]?.trim() || "",
            scale_3_definition: row["definicja skali: 3"]?.trim() || "",
            scale_3_recommendations: parseRecommendations(
              row["Rekomendacje poziom 3."] || ""
            ),
            scale_4_level: row["skala: 4"]?.trim() || "",
            scale_4_definition: row["definicja skali 4"]?.trim() || "",
            scale_4_recommendations: parseRecommendations(
              row["Rekomendacje poziom 4. "] || ""
            ),
            scale_5_level: row["skala: 5"]?.trim() || "",
            scale_5_definition: row["definicja skali: 5"]?.trim() || "",
            scale_5_recommendations: parseRecommendations(
              row["Rekomendacje poziom 5. "] || ""
            ),
            business_impact: row["Wpływ na biznes"]?.trim() || "",
            employee_attitude:
              row["Co to oznacza (postawa pracownika)?"]?.trim() || "",
            linked_indicators: row["Wskaźniki połączone"]?.trim() || "",
            recommendations: row["rekomendacje"]?.trim() || "",
          };
          knowledgeBase.set(factor, entry);
        }
      });
    },
  });

  return knowledgeBase;
}

export async function loadKnowledgeBaseAsync(
  baseUrl?: string
): Promise<KnowledgeBaseMap> {
  const resolvedBaseUrl =
    baseUrl ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL);
  if (resolvedBaseUrl) {
    try {
      const res = await fetch(`${resolvedBaseUrl}/data/czynniki.csv`, {
        next: { revalidate: 60 * 60 * 24 },
      } as RequestInit);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const csv = await res.text();
      return parseKnowledgeBaseCSV(csv);
    } catch {}
  }
  // Fallback to file system for local development
  const csvFilePath = path.join(process.cwd(), "public/data/czynniki.csv");
  const csvFile = fs.readFileSync(csvFilePath, "utf8");
  return parseKnowledgeBaseCSV(csvFile);
}
