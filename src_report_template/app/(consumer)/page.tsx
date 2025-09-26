import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExaminationHome() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Wgraj Dane Badania
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Wgraj dane badania w formacie CSV i pozwól naszej sztucznej
            inteligencji je przeanalizować.
          </p>
          <Link href="/examination/upload">
            <Button variant="primary">Wgraj Badanie</Button>
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Utwórz Raport
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Utwórz nowy raport na podstawie istniejących danych badania.
          </p>
          <Link href="/reports/create">
            <Button variant="primary">Utwórz Nowy Raport</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
