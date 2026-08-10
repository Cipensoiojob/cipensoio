"use server";

import { revalidatePath } from "next/cache";
import { updateListingStatus } from "@/lib/listings";
import {
  clearModeratorSession,
  isModeratorAuthenticated,
  setModeratorSession,
  verifyModerationPassword,
} from "@/lib/moderation";

export async function loginModerator(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = String(formData.get("password") ?? "");
  if (!verifyModerationPassword(password)) {
    return { error: "Password non valida." };
  }
  await setModeratorSession();
  return { error: null };
}

export async function logoutModerator(): Promise<void> {
  await clearModeratorSession();
}

export async function moderateListing(
  id: string,
  status: "published" | "rejected",
): Promise<{ ok: boolean; error: string | null }> {
  if (!(await isModeratorAuthenticated())) {
    return { ok: false, error: "Non autenticato." };
  }
  if (!id) return { ok: false, error: "ID mancante." };

  const result = await updateListingStatus(id, status);
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/persona-assistenza");
    revalidatePath("/pet-home");
    revalidatePath("/lavoro-tradizionale");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin/moderazione");
  }
  return result;
}
