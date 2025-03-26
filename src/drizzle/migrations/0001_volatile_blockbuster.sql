ALTER TABLE "reports" DROP CONSTRAINT "reports_examinationId_examinations_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "examinationIds" uuid[] NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "examinationId";