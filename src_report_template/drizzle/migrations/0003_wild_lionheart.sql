ALTER TABLE "examinations" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "examinationId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_examinationId_examinations_id_fk" FOREIGN KEY ("examinationId") REFERENCES "public"."examinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "examinationIds";