import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { formatApiError } from "@/lib/rateLimit";

/**
 * GET /api/sync
 * Fetches all database records via Supabase Admin (service_role) securely on server.
 */
export async function GET() {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: "Supabase Admin (SUPABASE_SERVICE_ROLE_KEY) sunucu tarafında tanımlı değil.",
    });
  }

  try {
    const [
      { data: companies },
      { data: dbBaskets },
      { data: transactions },
      { data: ipos },
      { data: aiHistory },
      { data: notifications },
    ] = await Promise.all([
      supabaseAdmin.from("companies").select("*"),
      supabaseAdmin.from("baskets").select("*, basket_holdings(*)"),
      supabaseAdmin.from("transactions").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("ipos").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("ai_history").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("notifications").select("*").order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      success: true,
      configured: true,
      data: {
        companies: companies || [],
        baskets: dbBaskets || [],
        transactions: transactions || [],
        ipos: ipos || [],
        aiHistory: aiHistory || [],
        notifications: notifications || [],
      },
    });
  } catch (error: unknown) {
    return formatApiError(error, "Veri senkronizasyonu sırasında sunucu hatası oluştu.");
  }
}

/**
 * POST /api/sync
 * Handles secure database mutations via Supabase Admin (service_role) on server.
 */
export async function POST(req: Request) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: "Supabase Admin sunucuda yapılandırılmamış.",
    });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === "add_company") {
      const { error } = await supabaseAdmin.from("companies").upsert({
        id: payload.id,
        symbol: payload.symbol,
        name: payload.name,
        sector: payload.sector,
        exchange: payload.exchange,
        asset_class: payload.assetClass,
        index_tag: payload.indexTag,
        price: payload.price,
        currency: payload.currency,
        daily_change: payload.dailyChange,
        pe_ratio: payload.peRatio,
        pb_ratio: payload.pbRatio,
        dividend_yield: payload.dividendYield,
        market_cap: payload.marketCap,
        beta: payload.beta,
        recommendation: payload.recommendation,
        in_watchlist: payload.inWatchlist,
        description: payload.description,
      }, { onConflict: "symbol" });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "update_company") {
      const { symbol, ...updates } = payload;
      const dbPayload: Record<string, unknown> = {};
      if (updates.price !== undefined) dbPayload.price = updates.price;
      if (updates.dailyChange !== undefined) dbPayload.daily_change = updates.dailyChange;
      if (updates.recommendation !== undefined) dbPayload.recommendation = updates.recommendation;
      if (updates.inWatchlist !== undefined) dbPayload.in_watchlist = updates.inWatchlist;

      const { error } = await supabaseAdmin.from("companies").update(dbPayload).eq("symbol", symbol);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "delete_company") {
      const { error } = await supabaseAdmin.from("companies").delete().eq("symbol", payload.symbol);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "create_basket") {
      const { basket } = payload;
      const { error: bErr } = await supabaseAdmin.from("baskets").insert({
        id: basket.id,
        name: basket.name,
        subtitle: basket.subtitle,
        risk_level: basket.riskLevel,
        risk_color: basket.riskColor,
        total_value: basket.totalValue,
        total_cost: basket.totalCost,
        daily_change: basket.dailyChange,
        total_profit_percent: basket.totalProfitPercent,
        description: basket.description,
        ai_note: basket.aiNote,
      });

      if (bErr) throw bErr;

      if (basket.holdings && basket.holdings.length > 0) {
        const holdingsPayload = basket.holdings.map((h: { companySymbol: string; weightPercent: number; quantity: number; avgCost: number }) => ({
          basket_id: basket.id,
          company_symbol: h.companySymbol,
          weight_percent: h.weightPercent,
          quantity: h.quantity,
          avg_cost: h.avgCost,
        }));
        const { error: hErr } = await supabaseAdmin.from("basket_holdings").insert(holdingsPayload);
        if (hErr) throw hErr;
      }

      return NextResponse.json({ success: true });
    }

    if (action === "update_basket") {
      const { basket } = payload;
      const { error } = await supabaseAdmin.from("baskets").upsert({
        id: basket.id,
        name: basket.name,
        subtitle: basket.subtitle,
        risk_level: basket.riskLevel,
        risk_color: basket.riskColor,
        total_value: basket.totalValue,
        total_cost: basket.totalCost,
        daily_change: basket.dailyChange,
        total_profit_percent: basket.totalProfitPercent,
        description: basket.description,
        ai_note: basket.aiNote,
      }, { onConflict: "id" });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "delete_basket") {
      const { id } = payload;
      const { error } = await supabaseAdmin.from("baskets").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "upsert_holding" || action === "update_basket_holding") {
      const { basketId, companySymbol, weightPercent, quantity, avgCost } = payload;
      if (quantity <= 0) {
        const { error } = await supabaseAdmin
          .from("basket_holdings")
          .delete()
          .eq("basket_id", basketId)
          .eq("company_symbol", companySymbol);
        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin.from("basket_holdings").upsert({
          basket_id: basketId,
          company_symbol: companySymbol,
          weight_percent: weightPercent || 0,
          quantity: quantity,
          avg_cost: avgCost,
        }, { onConflict: "basket_id,company_symbol" });
        if (error) throw error;
      }
      return NextResponse.json({ success: true });
    }

    if (action === "delete_holding") {
      const { basketId, companySymbol } = payload;
      const { error } = await supabaseAdmin
        .from("basket_holdings")
        .delete()
        .eq("basket_id", basketId)
        .eq("company_symbol", companySymbol);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "add_transaction") {
      const { error } = await supabaseAdmin.from("transactions").insert({
        id: payload.id,
        company_symbol: payload.companySymbol,
        type: payload.type,
        quantity: payload.quantity,
        price: payload.price,
        total_amount: payload.totalAmount,
        date: payload.date,
        note: payload.note,
      });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "evaluate_ai_outcome") {
      const { error } = await supabaseAdmin.from("ai_history").update({
        outcome_correct: payload.outcomeCorrect,
        price_after_period: payload.priceAfterPeriod,
        outcome_checked_at: payload.outcomeCheckedAt,
      }).eq("id", payload.id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "mark_notifications_read") {
      const { error } = await supabaseAdmin.from("notifications").update({ read: true }).neq("read", true);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "update_user_settings") {
      try {
        await supabaseAdmin.from("user_settings").upsert({
          id: "default_user",
          user_name: payload.userName,
          currency: payload.currency,
          price_alerts: payload.priceAlerts,
          ipo_alerts: payload.ipoAlerts,
          dividend_alerts: payload.dividendAlerts,
          oracle_alerts: payload.oracleAlerts,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      } catch (err) {
        console.warn("[Sync] user_settings sync warning:", err);
      }
      return NextResponse.json({ success: true });
    }

    if (action === "add_ai_history") {
      try {
        await supabaseAdmin.from("ai_history").insert({
          id: payload.id,
          type: payload.type,
          title: payload.title,
          description: payload.description,
          verdict_tag: payload.verdictTag || payload.verdictTag,
          verdict: payload.verdict,
          symbol: payload.symbol,
          verdict_date: payload.date || new Date().toISOString().split("T")[0],
          target_period_days: payload.targetPeriodDays || 30,
        });
      } catch (err) {
        console.warn("[Sync] ai_history insert warning:", err);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Geçersiz aksiyon türü." }, { status: 400 });
  } catch (error: unknown) {
    return formatApiError(error, "Veri işleme sırasında bir hata oluştu.");
  }
}
