import { branchMetadata, renderBranchPage } from "@/lib/branchPage";

export const metadata = branchMetadata("lavoro_tradizionale");

export default async function LavoroTradizionalePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderBranchPage("lavoro_tradizionale", searchParams);
}
