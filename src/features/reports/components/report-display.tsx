"use client";

import { useEffect, useState } from "react";
import { ReportTable } from "@/drizzle/schema";
import { getReport } from "../actions/reports";

interface ReportDisplayProps {
  reportId: string;
}

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded-lg shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`px-6 py-4 border-b ${className}`}>{children}</div>;

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;

const Badge = ({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "success";
}) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-800",
    secondary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Accordion components
const Accordion = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`divide-y divide-gray-200 ${className}`}>{children}</div>;

const AccordionItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`py-2 ${className}`}>{children}</div>;

const AccordionTrigger = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    className={`flex w-full items-center justify-between py-3 px-2 text-left font-medium hover:bg-gray-50 rounded ${className}`}
    onClick={(e) => {
      const content = e.currentTarget.nextElementSibling;
      if (content) {
        content.classList.toggle("hidden");
      }
    }}
  >
    {children}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 transition-transform duration-200"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
);

const AccordionContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`px-2 py-3 hidden ${className}`}>{children}</div>;

export function ReportDisplay({ reportId }: ReportDisplayProps) {
  const [report, setReport] = useState<typeof ReportTable.$inferSelect | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(report);

  useEffect(() => {
    async function fetchReport() {
      try {
        const reportData = await getReport(reportId);
        setReport(reportData);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error || !report) {
    return (
      <div className="p-4 text-red-500">
        Error: {error || "Report not found"}
      </div>
    );
  }

  const { content } = report;

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          <span>{content.metadata?.dateGenerated || ""}</span>
          {content.metadata?.sampleSize && (
            <span>• {content.metadata.sampleSize}</span>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Streszczenie wykonawcze</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{content.executiveSummary}</p>
        </CardContent>
      </Card>

      {/* Report Sections */}
      <div className="space-y-8">
        {content?.sections?.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {section.content && (
                <div className="mb-6 whitespace-pre-line">
                  {section.content}
                </div>
              )}

              {/* Render subsections if they exist */}
              {section.subsections && section.subsections.length > 0 && (
                <div className="mt-4">
                  {section.title === "Analiza kategorii" ? (
                    <AnalysisCategories subsections={section.subsections} />
                  ) : (
                    <div className="space-y-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="border-t pt-4">
                          <h4 className="text-lg font-medium mb-2">
                            {subsection.title}
                          </h4>
                          <p className="whitespace-pre-line">
                            {subsection.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Render prioritized actions if they exist */}
              {section.prioritizedActions &&
                section.prioritizedActions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-3">
                      Działania priorytetowe
                    </h4>
                    <div className="space-y-3">
                      {section.prioritizedActions.map((action, actionIndex) => (
                        <Card key={actionIndex} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{action.action}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {action.impact}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  variant={getPriorityVariant(action.priority)}
                                >
                                  {action.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {action.timeline}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper component for analysis categories
function AnalysisCategories({ subsections }: { subsections: any[] }) {
  return (
    <Accordion className="w-full">
      {subsections.map((category, index) => (
        <AccordionItem key={index}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center w-full">
              <span className="flex-1 text-left">{category.title}</span>
              {category.score && (
                <Badge
                  className="ml-2"
                  variant={getScoreVariant(category.score)}
                >
                  {category.score.toFixed(1)}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-2 space-y-4">
              {category.content && (
                <p className="whitespace-pre-line">{category.content}</p>
              )}

              {/* Strengths */}
              {category.strengths && category.strengths.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Mocne strony:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {category.strengths.map((strength: string, i: number) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {category.improvements && category.improvements.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Obszary do poprawy:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {category.improvements.map(
                      (improvement: string, i: number) => (
                        <li key={i}>{improvement}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {category.recommendations &&
                category.recommendations.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Rekomendacje:</h5>
                    <ul className="list-disc pl-5 space-y-1">
                      {category.recommendations.map(
                        (recommendation: string, i: number) => (
                          <li key={i}>{recommendation}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// Helper function to get variant based on score
function getScoreVariant(
  score: number
): "default" | "destructive" | "outline" | "secondary" | "success" {
  if (score >= 4) return "success";
  if (score >= 3.5) return "secondary";
  if (score >= 3) return "outline";
  if (score >= 2) return "default";
  return "destructive";
}

// Helper function to get variant based on priority
function getPriorityVariant(
  priority: string
): "default" | "destructive" | "outline" | "secondary" {
  const normalizedPriority = priority.toLowerCase();
  if (normalizedPriority.includes("wysok")) return "destructive";
  if (normalizedPriority.includes("średn")) return "secondary";
  if (normalizedPriority.includes("nisk")) return "outline";
  return "default";
}

// Skeleton loader for report
function ReportSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-8 max-w-4xl">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 w-1/3 mx-auto" />
      </div>

      <Skeleton className="h-40 w-full" />

      <div className="space-y-8">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
