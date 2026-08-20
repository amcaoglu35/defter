import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { generateDailyBriefing } from "@/lib/aiService";
import { MOCK_COMPANIES, MOCK_BASKETS } from "@/lib/mockData";
import { dispatchDailyReportToChannels } from "@/lib/notificationChannels";

export async function GET(req: Request) {
  return handleDailyCron(req);
}

export async function POST(req: Request) {
  return handleDailyCron(req);
}

async function handleDailyCron(req: Request) {
  // Optional CRON_SECRET verification for secure cloud execution
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim (Invalid CRON_SECRET)" }, { status: 401 });
  }

  try {
    type RowRecord = Record<string, unknown>;

    const initialCompanies = MOCK_COMPANIES;
    const initialBaskets = MOCK_BASKETS;
    let userName = "Defter Sahibi";

    const dbRows: { companies: RowRecord[]; baskets: RowRecord[] } = {
      companies: initialCompanies.map((c) => c as unknown as RowRecord),
      baskets: initialBaskets.map((b) => b as unknown as RowRecord),
    };

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const [
        { data: dbCompanies },
        { data: dbBaskets },
        { data: dbSettings },
      ] = await Promise.all([
        supabaseAdmin.from("companies").select("*"),
        supabaseAdmin.from("baskets").select("*, basket_holdings(*)"),
        supabaseAdmin.from("user_settings").select("*").eq("id", "default_user").single(),
      ]);

      if (dbCompanies && dbCompanies.length > 0)
        dbRows.companies = dbCompanies as unknown as RowRecord[];
      if (dbBaskets && dbBaskets.length > 0)
        dbRows.baskets = dbBaskets as unknown as RowRecord[];
      if (dbSettings?.user_name) userName = String(dbSettings.user_name);
    }

    const totalVal = dbRows.baskets.reduce((sum, b) => sum + (Number(b["total_value"]) || Number(b["totalValue"]) || 0), 0) || 500000;
    const totalCost = dbRows.baskets.reduce((sum, b) => sum + (Number(b["total_cost"]) || Number(b["totalCost"]) || 0), 0) || 450000;

    // Calculate dynamic weighted daily change and holdingsSummary
    const holdingsMap = new Map<string, { symbol: string; dailyChange: number; weight: number }>();
    let weightedChangeSum = 0;
    for (const b of dbRows.baskets) {
      const bHoldings = (b["basket_holdings"] || b["holdings"] || []) as RowRecord[];
      const bVal = Number(b["total_value"]) || Number(b["totalValue"]) || 0;
      for (const h of bHoldings) {
        const sym = String(h["company_symbol"] || h["companySymbol"] || "");
        const weightPct = Number(h["weight_percent"] || h["weightPercent"]) || 0;
        const co = dbRows.companies.find((c) => c["symbol"] === sym);
        const dailyChange = Number(co?.["daily_change"] ?? co?.["dailyChange"]) || 0;
        const effectiveWeight = weightPct * (bVal / (totalVal || 1));
        weightedChangeSum += dailyChange * (weightPct / 100) * (bVal / (totalVal || 1));

        const existing = holdingsMap.get(sym);
        if (existing) {
          existing.weight += effectiveWeight;
        } else {
          holdingsMap.set(sym, {
            symbol: sym,
            dailyChange,
            weight: effectiveWeight,
          });
        }
      }
    }

    const briefing = await generateDailyBriefing({
      userName,
      totalValue: totalVal,
      totalProfit: totalVal - totalCost,
      dailyChangePct: parseFloat(weightedChangeSum.toFixed(2)),
      bistDailyChangePct: 1.42,
      basketsCount: dbRows.baskets.length,
      holdingsSummary: Array.from(holdingsMap.values()),
    });

    // Save generated briefing to ai_history if database is connected
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const historyId = `ai-brief-${Date.now()}`;
        await supabaseAdmin.from("ai_history").insert({
          id: historyId,
          type: "Sohbet Analizi",
          title: `${briefing.greeting} — Günlük Kapanış Brifingi`,
          description: briefing.executiveSummary.slice(0, 280),
          verdict_tag: "DENGELİ",
          verdict: "DENGELİ",
          symbol: "BIST",
          verdict_date: new Date().toISOString().split("T")[0],
          target_period_days: 1,
          provider: "Gemini / Cron",
          model: "gemini-2.5-flash",
        });
      } catch (e) {
        console.warn("[Cron] ai_history save warning:", e);
      }

      // Dispatch in-app notification
      try {
        const notifId = `notif-brief-${Date.now()}`;
        await supabaseAdmin.from("notifications").insert({
          id: notifId,
          title: "Orakul Kapanış Brifingi Hazır ☕",
          message: `${briefing.greeting}, bugünkü portföy ve BIST kapanış değerlendirmeniz hazırlandı.`,
          related_company_symbol: "BIST",
          read: false,
        });
      } catch (e) {
        console.warn("[Cron] notification save warning:", e);
      }
    }

    // Dispatch to external channels (Telegram / Email) if configured in environment
    const channelDispatch = await dispatchDailyReportToChannels({
      title: "Günlük Piyasa & Portföy Kapanış Brifingi",
      markdownText: `*${briefing.greeting}*\n\n${briefing.executiveSummary}\n\n*Taktiksel İpucu:* ${briefing.tacticalTip || "Disiplinli nakit akışı ve risk yönetimi."}`,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      greeting: briefing.greeting,
      executiveSummary: briefing.executiveSummary,
      channelDispatch,
    });
  } catch (err: unknown) {
    console.error("[Cron Orakul Daily Error]:", err);
    return NextResponse.json(
      { success: false, error: (err instanceof Error ? err.message : String(err)) || "Bilinmeyen cron hatası" },
      { status: 500 }
    );
  }
}
