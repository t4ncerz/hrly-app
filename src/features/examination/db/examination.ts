import { ExaminationTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function getExaminations() {
  const examinations = await db.select().from(ExaminationTable);
  return examinations;
}

export async function insertExamination(
  data: typeof ExaminationTable.$inferInsert
) {
  const [newExamination] = await db
    .insert(ExaminationTable)
    .values(data)
    .returning();

  if (!newExamination) {
    throw new Error("Failed to create examination");
  }

  return newExamination;
}

export async function updateExamination(
  id: string,
  data: Partial<typeof ExaminationTable.$inferInsert>
) {
  const [updatedExamination] = await db
    .update(ExaminationTable)
    .set(data)
    .where(eq(ExaminationTable.id, id))
    .returning();

  if (!updatedExamination) {
    throw new Error("Failed to update examination");
  }

  return updatedExamination;
}

export async function deleteExamination(id: string) {
  const [deletedExamination] = await db
    .delete(ExaminationTable)
    .where(eq(ExaminationTable.id, id))
    .returning();

  if (!deletedExamination) {
    throw new Error("Failed to delete examination");
  }

  return deletedExamination;
}
