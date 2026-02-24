import SignalementsPage from "@/components/signalement/signalements-page";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import { redirect } from "next/navigation";

export default async function SignalementsPageSSR({
  params,
}: {
  params: Promise<{
    balId: string;
  }>;
}) {
  const { balId } = await params;

  if (!process.env.NEXT_PUBLIC_API_SIGNALEMENT) {
    redirect(`/bal/${balId}`);
  }

  const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

  try {
    const paginatedSignalements = await SignalementsService.getSignalements(
      100,
      undefined,
      [Signalement.status.PENDING],
      undefined,
      undefined,
      [baseLocale.commune]
    );

    return <SignalementsPage paginatedSignalements={paginatedSignalements} />;
  } catch (error) {
    console.error("Unable to load reports:", error);
    redirect(`/bal/${balId}`);
  }
}
