import { ReportCreateForm } from "@/features/reports/components/report-create-form";

export const metadata = {
  title: "Tworzenie Raportu",
  description: "Wygeneruj nowy raport analizy AI z danych badania",
};

export default function CreateReportPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Utwórz Nowy Raport
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Generowanie Raportów z AI
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Stwórz nowy raport na podstawie istniejących danych z badania:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-500 dark:text-gray-400">
              <li>Wybierz dane badania, które chcesz przeanalizować</li>
              <li>
                Nasza sztuczna inteligencja wygeneruje wnioski i rekomendacje
              </li>
              <li>Przeglądaj i udostępniaj swój raport natychmiast</li>
            </ul>
          </div>
          <ReportCreateForm />
        </div>
      </div>
    </div>
  );
}
