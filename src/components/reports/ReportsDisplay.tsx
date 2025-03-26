"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface ReportsDisplayProps {
  examinationId: string;
}

type Examination = {
  id: number;
  name: string;
  surveyId: number;
};

type Survey = {
  id: number;
  name: string;
};

type Report = {
  id: number;
  name: string;
  content: { report: string };
  createdAt: string;
};

export function ReportsDisplay({ examinationId }: ReportsDisplayProps) {
  const [examination, setExamination] = useState<Examination | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch examination and survey data
        const examinationResponse = await fetch(
          `/api/examinations/${examinationId}`
        );
        if (!examinationResponse.ok) {
          if (examinationResponse.status === 404) {
            router.push("/404");
            return;
          }
          throw new Error("Failed to fetch examination");
        }

        const { examination, survey } = await examinationResponse.json();
        setExamination(examination);
        setSurvey(survey);

        // Fetch reports data
        const reportsResponse = await fetch(
          `/api/examinations/${examinationId}/reports`
        );
        if (!reportsResponse.ok) {
          throw new Error("Failed to fetch reports");
        }

        const { reports } = await reportsResponse.json();
        setReports(reports);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (examinationId) {
      fetchData();
    }
  }, [examinationId, router]);

  const generateReport = async () => {
    try {
      setGeneratingReport(true);

      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examinationId: parseInt(examinationId) }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      // Refresh reports list
      const reportsResponse = await fetch(
        `/api/examinations/${examinationId}/reports`
      );
      if (!reportsResponse.ok) {
        throw new Error("Failed to fetch reports");
      }

      const { reports } = await reportsResponse.json();
      setReports(reports);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">No Reports Available</h1>
        <p>There are no reports generated for this examination yet.</p>
        <button
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          onClick={generateReport}
          disabled={generatingReport}
        >
          {generatingReport ? "Generating..." : "Generate New Report"}
        </button>
      </div>
    );
  }

  // Display the most recent report
  const latestReport = reports[0];
  if (!latestReport) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">No Reports Available</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{survey?.name} Report</h1>
        <button
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          onClick={generateReport}
          disabled={generatingReport}
        >
          {generatingReport ? "Generating..." : "Generate New Report"}
        </button>
      </div>

      <div>
        <div>
          <div>{latestReport.name}</div>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date(latestReport.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <div className="prose max-w-none">
            <ReactMarkdown>
              {latestReport.content.report || "No content available"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
