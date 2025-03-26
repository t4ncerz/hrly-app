import { UserTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [UserTable.clerkUserId],
      set: data,
    });

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  return newUser;
}

export async function updateUser(data: Partial<typeof UserTable.$inferInsert>) {
  if (!data.clerkUserId) {
    throw new Error("User ID is required");
  }

  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.clerkUserId, data.clerkUserId))
    .returning();

  if (!updatedUser) {
    throw new Error("Failed to update user");
  }

  return updatedUser;
}

export async function deleteUser(clerkUserId: string) {
  const [deletedUser] = await db
    .update(UserTable)
    .set({
      deletedAt: new Date(),
      email: "redacted@deleted.com",
      name: "Deleted User",
      imageUrl: "https://example.com/deleted-user.png",
      clerkUserId: clerkUserId,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
}
