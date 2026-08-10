import { branchMetadata, renderBranchPage } from "@/lib/branchPage";

export const metadata = branchMetadata("pet_home");

export default async function PetHomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderBranchPage("pet_home", searchParams);
}
