import { ReportCreateForm } from "@/features/reports/components/report-create-form";

export const metadata = {
  title: "Create Report",
  description: "Generate a new AI analysis report from your examination data",
};

export default function CreateReportPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Report
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Report Generation
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create a new report from your existing examination data:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-500 dark:text-gray-400">
              <li>Select the examination data you want to analyze</li>
              <li>Our AI will generate insights and recommendations</li>
              <li>View and share your report instantly</li>
            </ul>
          </div>
          <ReportCreateForm />
        </div>
      </div>
    </div>
  );
}
