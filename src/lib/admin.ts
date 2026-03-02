import { auth } from "@/lib/auth";

/**
 * Check if the current user is authenticated and has ADMIN role.
 * Returns the session if admin, null otherwise.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}
