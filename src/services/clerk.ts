import { UserRole } from "@/drizzle/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  const client = await clerkClient();
  const { id, clerkUserId, role } = user;

  return client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      dbId: id,
      role,
    },
  });
}
