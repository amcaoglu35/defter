import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { GoogleGenAI } from "@google/genai";
import { MOCK_COMPANIES, AiModelBasket } from "@/lib/mockData";

export async function GET(req: Request) {
  return handleAutoBasket(req);
}

export async function POST(req: Request) {
  return handleAutoBasket(req);
}

async function handleAutoBasket(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    let companyPool = MOCK_COMPANIES;
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data: dbCompanies } = await supabaseAdmin.from("companies").select("*");
      if (dbCompanies && dbCompanies.length > 0) {
        companyPool = dbCompanies as any;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const themes = [
      {
        theme: "🤖 AI Değer Avcısı (Düşük F/K & Güçlü Bilanço)",
        criteria: "Düşük F/K çarpanı ve nakit akışı güçlü şirketler",
        filter: (c: any) => (c.peRatio || 15) < 10 && (c.price || 0) > 0,
      },
      {
        theme: "🚀 AI Büyüme & İhracat Liderleri",
        criteria: "İhracat gücü ve sanayi üretimi yüksek dinamik hisseler",
        filter: (c: any) => ["Sanayi & Üretim", "Otomotiv", "Havacılık", "Teknoloji"].includes(c.sector),
      },
      {
        theme: "🛡️ AI Temettü Kalesi & Nakit Akışı",
        criteria: "Yüksek ve istikrarlı temettü verimi sunan defansif varlıklar",
        filter: (c: any) => (c.dividendYield || 0) > 3.0,
      },
    ];

    const generatedBaskets: AiModelBasket[] = [];

    for (const item of themes) {
      const filtered = companyPool.filter(item.filter);
      const poolToUse = filtered.length >= 4 ? filtered : companyPool;
      const shuffled = [...poolToUse].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);

      let summary = `${item.theme} stratejisi, mevcut piyasa çarpanlarına göre optimize edilmiş 4 şirketten oluşmaktadır.`;
      
      if (ai) {
        try {
          const prompt = `Sen portföy yöneticisi yapay zekasın. "${item.theme}" başlığı altında seçilen hisseler: ${selected.map((c) => `${c.name} (${c.symbol})`).join(", ")}.
Bu sepet için yatırımcılara 1-2 cümlelik profesyonel stratejik gerekçe (summary) yaz. Türkçe olsun.`;
          const resp = await ai.models.generateContent({
            model,
            contents: prompt,
          });
          if (resp.text?.trim()) {
            summary = resp.text.trim();
          }
        } catch (e) {
          console.warn("[AutoBasket LLM Error]:", e);
        }
      }

      const equalWeight = Math.round(100 / selected.length);
      const allocation = selected.map((c, idx) => {
        const weight = idx === 0 ? 100 - equalWeight * (selected.length - 1) : equalWeight;
        return {
          symbol: c.symbol,
          name: c.name,
          weight,
          priceAtCreation: c.price || 100,
          priceNow: c.price || 100,
          returnPct: 0,
        };
      });

      const basket: AiModelBasket = {
        id: `aimodel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        theme: item.theme,
        createdAt: new Date().toISOString(),
        horizon: 30,
        allocation,
        totalReturnPct: 0,
        benchmarkReturnPct: 0,
        alpha: 0,
        status: "active",
        provider: ai ? "Google Gemini" : "Otonom Algoritma",
        model: ai ? model : "Defter Portfolio Engine",
        summary,
      };

      generatedBaskets.push(basket);
    }

    return NextResponse.json({
      success: true,
      baskets: generatedBaskets,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Autonomous Auto-Basket Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Otonom sepet oluşturma hatası" },
      { status: 500 }
    );
  }
}
