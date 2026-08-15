import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { generateDailyBriefing } from "@/lib/aiService";
import { MOCK_COMPANIES, MOCK_BASKETS } from "@/lib/mockData";

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
    let companies = MOCK_COMPANIES;
    let baskets = MOCK_BASKETS;
    let userName = "Defter Sahibi";

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

      if (dbCompanies && dbCompanies.length > 0) companies = dbCompanies as any;
      if (dbBaskets && dbBaskets.length > 0) baskets = dbBaskets as any;
      if (dbSettings?.user_name) userName = dbSettings.user_name;
    }

    const totalVal = baskets.reduce((sum, b: any) => sum + (b.total_value || b.totalValue || 0), 0) || 500000;
    const totalCost = baskets.reduce((sum, b: any) => sum + (b.total_cost || b.totalCost || 0), 0) || 450000;

    const briefing = await generateDailyBriefing({
      userName,
      totalValue: totalVal,
      totalProfit: totalVal - totalCost,
      dailyChangePct: 1.45,
      basketsCount: baskets.length,
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

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      greeting: briefing.greeting,
      executiveSummary: briefing.executiveSummary,
    });
  } catch (error) {
    console.error("[Cron Orakul Daily Error]:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Bilinmeyen cron hatası" },
      { status: 500 }
    );
  }
}
