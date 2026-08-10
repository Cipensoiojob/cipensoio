import { redirect } from "next/navigation";

/** /admin → coda moderazione (evita 404 sul segmento vuoto). */
export default function AdminIndexPage() {
  redirect("/admin/moderazione");
}
