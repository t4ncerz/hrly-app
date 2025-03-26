import { ExaminationUploadForm } from "@/features/examination/components/examination-upload-form";

export const metadata = {
  title: "Upload Examination",
  description: "Upload and process examination data using AI",
};

export default function ExaminationUploadPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Upload Examination Data
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Examination Processing
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload your CSV examination data and our AI will automatically:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-500 dark:text-gray-400">
              <li>Identify questions and demographics</li>
              <li>Structure and organize responses</li>
              <li>Generate comprehensive reports with insights</li>
              <li>Store all data for future reference</li>
            </ul>
          </div>
          <ExaminationUploadForm />
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            How It Works
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-500 dark:text-gray-400">
            <li>Upload your CSV file with survey responses</li>
            <li>Our AI processes and maps the data to our system</li>
            <li>View results in the examination page</li>
            <li>Generate AI-powered reports with actionable insights</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
