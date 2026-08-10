import { renderVerticalPage, verticalMetadata } from "@/lib/verticalPage";

export const metadata = verticalMetadata("pet-sitter");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderVerticalPage("pet-sitter", searchParams);
}
