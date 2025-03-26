"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Examination = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
};

type ExaminationData = {
  examination: Examination;
  surveyName: string;
};

export function ExaminationsList() {
  const [examinations, setExaminations] = useState<ExaminationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExaminations() {
      try {
        setLoading(true);
        const response = await fetch("/api/examinations");

        if (!response.ok) {
          throw new Error("Failed to fetch examinations");
        }

        const data = await response.json();
        setExaminations(data.examinations);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load examinations"
        );
        console.error("Error fetching examinations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchExaminations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading examinations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (examinations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You don&apos;t have any examinations yet.
        </p>
        <Link
          href="/surveys/upload"
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white inline-block"
        >
          Create Your First Examination
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {examinations.map((item) => (
          <li key={item.examination.id}>
            <Link
              href={`/surveys/examinations/${item.examination.id}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {item.examination.name}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {item.examination.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Survey: {item.surveyName}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Created:{" "}
                  {new Date(item.examination.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
