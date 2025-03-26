import { ReportDisplay } from "@/features/reports/components/report-display";

import { redirect } from "next/navigation";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    redirect("/login");
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <ReportDisplay reportId={id} />
    </div>
  );
}
