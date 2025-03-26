import Link from "next/link";

export default function ExaminationHome() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upload Examination Data
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Upload your CSV examination data and let our AI analyze it for you.
          </p>
          <Link
            href="/examination/upload"
            className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white inline-block"
          >
            Upload Examination
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Reports
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            View and manage your recent reports.
          </p>
          <Link
            href="/reports/create"
            className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white inline-block"
          >
            Create New Report
          </Link>
        </div>
      </div>
    </div>
  );
}
