import { NextResponse } from "next/server";
import {
  generateOrakulRecipe,
  generateCompanyAnalysis,
  askOrakulChat,
} from "@/lib/aiService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload, messages, context, history, apiKey, provider } = body;

    if (type === "recipe") {
      const recipe = await generateOrakulRecipe(payload, apiKey, provider);
      return NextResponse.json({ success: true, data: recipe });
    }

    if (type === "chat") {
      const reply = await askOrakulChat(
        messages || [],
        context || {},
        apiKey,
        provider
      );
      return NextResponse.json({ success: true, reply });
    }

    if (type === "company_analysis") {
      const analysis = await generateCompanyAnalysis(
        payload,
        history || [],
        apiKey,
        provider
      );
      return NextResponse.json({
        success: true,
        data: analysis,
      });
    }

    return NextResponse.json(
      { success: false, error: "Geçersiz işlem türü" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Orakul API hatası" },
      { status: 500 }
    );
  }
}
