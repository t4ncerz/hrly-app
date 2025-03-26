import { ReportDisplay } from "@/features/reports/components/report-display";

type ReportDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto">
      <ReportDisplay reportId={params.id} />
    </div>
  );
}
