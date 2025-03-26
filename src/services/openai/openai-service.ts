import { ExaminationTable, ReportContent } from "@/drizzle/schema";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import { env } from "@/data/env/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Helper function to load templates
async function loadPromptTemplate(
  templateName: string,
  language = "pl"
): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "services",
    "openai",
    "prompt-templates",
    `${templateName}`,
    language,
    "prompt.md"
  );
  try {
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load prompt template: ${templateName}`);
  }
}

/**
 * Generates a report based on examination data
 */
export async function generateReport(
  examinations: (typeof ExaminationTable.$inferSelect)[]
): Promise<ReportContent> {
  try {
    // Load the report prompt template
    const promptTemplate = await loadPromptTemplate("engagement-raport");

    // Prepare examination data for the prompt
    const examinationData = examinations.map((exam) => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      type: exam.type,
      sourceData: exam.sourceData,
    }));

    // Get current date for the report metadata
    const currentDate = new Date().toISOString().split("T")[0];

    // Build complete prompt with actual data
    const prompt = promptTemplate.replace(
      "{{EXAMINATION_DATA}}",
      JSON.stringify(examinationData, null, 2)
    );

    console.log("Sending prompt to OpenAI...");

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert survey analyst specializing in employee engagement and satisfaction.
          Analyze survey data and generate comprehensive, insightful reports with actionable recommendations.
          Your response MUST be in valid JSON format matching the ReportContent type structure.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    console.log("Response:", response);

    // Extract and parse the content
    const jsonContent = response.choices[0]?.message?.content;

    if (!jsonContent) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response
    let content: ReportContent;
    try {
      content = JSON.parse(jsonContent);

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
      console.error("Error parsing OpenAI response:", error);
      throw new Error("Failed to parse report content from OpenAI response");
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
