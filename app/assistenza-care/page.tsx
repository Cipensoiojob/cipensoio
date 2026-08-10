import { renderVerticalPage, verticalMetadata } from "@/lib/verticalPage";

export const metadata = verticalMetadata("assistenza-care");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return renderVerticalPage("assistenza-care", searchParams);
}
