import { ExaminationTable, GenerationContent } from "@/drizzle/schema";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/data/env/server";

// Initialize Google Generative AI client
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Helper function to load templates from Vercel Blob
async function loadPromptTemplate(): Promise<string> {
  try {
    // Fetch the template from Vercel Blob
    const response = await fetch(
      "https://tsh79vfw57xlyjcz.public.blob.vercel-storage.com/prompt-mCyCX6t54UPfkknmDksXURiSCA575t.md"
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch template: ${response.status} ${response.statusText}`
      );
    }

    return await response.text();
  } catch (error) {
    console.error(`Error loading template:`, error);
    throw new Error(`Failed to load prompt template`);
  }
}

/**
 * Generates a report based on examination data
 */
export async function generateReport(
  examinations: (typeof ExaminationTable.$inferSelect)[]
): Promise<GenerationContent> {
  try {
    // Load the report prompt template
    const promptTemplate = await loadPromptTemplate();

    // Prepare examination data for the prompt
    const examinationData = examinations.map((exam) => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      type: exam.type,
      sourceData: exam.extractedData,
    }));

    // Get current date for the report metadata
    const currentDate = new Date().toISOString().split("T")[0];

    // Build complete prompt with actual data
    const prompt = promptTemplate.replace(
      "{{EXAMINATION_DATA}}",
      JSON.stringify(examinationData, null, 2)
    );

    console.log("Sending prompt to Gemini...");

    console.log(prompt);

    // Send the request to Gemini with the properly formatted schema
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const response = result.text;

    if (!response) {
      throw new Error("No content received from Gemini");
    }

    // Parse the JSON response
    let content: GenerationContent;

    console.log(response);
    try {
      content = JSON.parse(response);

      // Add metadata if missing
      if (!content.metadata) {
        content.metadata = {
          reportType: "ENGAGEMENT",
          generatedAt: currentDate || "",
          version: "1.0",
          surveyName:
            examinations[0]?.name || "Raport zaangażowania pracowników",
        };
      }

      return content;
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      throw new Error("Failed to parse report content from Gemini response");
    }
  } catch (error) {
    console.error("Error generating report:", error);
    // Return a fallback report in case of errors
    return {
      title: "Raport błędu",
      executiveSummary: "Wystąpił problem podczas generowania raportu.",
      sections: [
        {
          title: "Błąd generowania raportu",
          content: `Wystąpił problem podczas generowania raportu: ${
            error instanceof Error ? error.message : String(error)
          }`,
          type: "summary",
          order: 1,
        },
      ],
      metadata: {
        reportType: "ENGAGEMENT",
        generatedAt: new Date().toISOString(),
        version: "1.0",
        surveyName: examinations[0]?.name || "Raport zaangażowania pracowników",
      },
    };
  }
}
