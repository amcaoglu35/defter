import { NextResponse } from "next/server";
import { runMultiAgentCommitteeDebate } from "@/lib/multiAgentEngine";
import { getClientIp, checkRateLimit, createRateLimitResponse, formatApiError } from "@/lib/rateLimit";
import { Company } from "@/lib/mockData";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`ai-tools:agent-debate:${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await req.json();
    const { company, priceHistoryCloses, provider, model, apiKey } = body as {
      company: Company;
      priceHistoryCloses?: number[];
      provider?: string;
      model?: string;
      apiKey?: string;
    };

    if (!company || !company.symbol) {
      return NextResponse.json(
        { success: false, error: "Geçersiz şirket verisi veya eksik sembol" },
        { status: 400 }
      );
    }

    const headerKey = req.headers.get("x-gemini-key")?.trim();
    const cookieHeader = req.headers.get("cookie") || "";
    const cookieMatch = cookieHeader.match(/(?:^|; )\s*defter_ai_key\s*=\s*([^;]+)/);
    const cookieKey = cookieMatch ? decodeURIComponent(cookieMatch[1]).trim() : undefined;
    const effectiveKey = apiKey || headerKey || (cookieKey && cookieKey.length > 5 ? cookieKey : undefined);

    const report = await runMultiAgentCommitteeDebate(
      company,
      priceHistoryCloses || [],
      effectiveKey,
      provider || "gemini",
      model
    );

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: unknown) {
    return formatApiError(error, "10 Ajanlı Yatırım Komitesi münazarası sırasında bir hata oluştu.");
  }
}
