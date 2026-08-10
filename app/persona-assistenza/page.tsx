import { branchMetadata, renderBranchPage } from "@/lib/branchPage";

export const metadata = branchMetadata("persona_assistenza");

export default async function PersonaAssistenzaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderBranchPage("persona_assistenza", searchParams);
}
