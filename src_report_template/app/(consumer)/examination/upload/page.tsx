import { ExaminationUploadForm } from "@/features/examination/components/examination-upload-form";

export const metadata = {
  title: "Wgrywanie Badania",
  description: "Wgraj dane badania do analizy",
};

export default function ExaminationUploadPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Wgraj Dane Badania
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Przetwarzanie Badania z AI
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Wgraj dane badania w formacie CSV, a nasza sztuczna inteligencja
              automatycznie:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-500 dark:text-gray-400">
              <li>Zidentyfikuje pytania i dane demograficzne</li>
              <li>Strukturyzuje i zorganizuje odpowiedzi</li>
              <li>Wygeneruje kompleksowe raporty z wnioskami</li>
              <li>Zapisze wszystkie dane do wykorzystania w przyszłości</li>
            </ul>
          </div>
          <ExaminationUploadForm />
        </div>
      </div>
    </div>
  );
}
