import fs from "fs";
import path from "path";
import Papa from "papaparse";
import {
  EngagementSatisfactionEntry,
  EngagementSatisfactionMap,
} from "./engagement-satisfaction-types";

function parseRecommendations(recString: string): string[] {
  if (!recString) return [];
  // Recommendations are often numbered, e.g., "1. Do this. 2. Do that."
  // Split by number followed by a dot and optional whitespace.
  return recString
    .split(/\d\.\s?/)
    .map((rec) => rec.trim())
    .filter(Boolean);
}

export function loadEngagementSatisfactionBase(): EngagementSatisfactionMap {
  const csvFilePath = path.join(
    process.cwd(),
    "src/services/gemini/engagement-and-satisfaction.csv"
  );
  const csvFile = fs.readFileSync(csvFilePath, "utf8");

  const engagementSatisfactionBase: EngagementSatisfactionMap = new Map();

  Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    complete: (results) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.data.forEach((row: any) => {
        const area = row["Obszar"]?.trim();

        if (area && (area === "Satysfakcja" || area === "Zaangażowanie")) {
          const entry: EngagementSatisfactionEntry = {
            area: area,
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
            scale_4_definition: row["definicja skali: 4"]?.trim() || "",
            scale_4_recommendations: parseRecommendations(
              row["Rekomendacje poziom 4. "] || ""
            ),
            scale_5_level: row["skala: 5"]?.trim() || "",
            scale_5_definition: row["definicja skali: 5"]?.trim() || "",
            scale_5_recommendations: parseRecommendations(
              row["Rekomendacje poziom 5. "] || ""
            ),
            general_description:
              row["Ogólny opis min. i max. skali"]?.trim() || "",
            linked_indicators: row["Wskaźniki połączone"]?.trim() || "",
            area_definition:
              row["Definicja zbiorów (kolumny A) "]?.trim() || "",
          };
          engagementSatisfactionBase.set(area, entry);
        }
      });
    },
  });

  return engagementSatisfactionBase;
}
