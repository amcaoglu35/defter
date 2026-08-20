import { NextResponse } from "next/server";
import { sendTelegramMessage, sendEmailReport } from "@/lib/notificationChannels";
import { getClientIp, checkRateLimit, createRateLimitResponse, formatApiError } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`notifications:test-channel:${clientIp}`, 5, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await req.json();
    const { channel, telegramBotToken, telegramChatId, resendApiKey, emailTo } = body as {
      channel: "telegram" | "email";
      telegramBotToken?: string;
      telegramChatId?: string;
      resendApiKey?: string;
      emailTo?: string;
    };

    if (channel === "telegram") {
      const token = telegramBotToken?.trim() || process.env.TELEGRAM_BOT_TOKEN?.trim();
      const chatId = telegramChatId?.trim() || process.env.TELEGRAM_CHAT_ID?.trim();

      if (!token || !chatId) {
        return NextResponse.json(
          {
            success: false,
            error: "Telegram Bot Token ve Chat ID parametreleri eksik. Lütfen kutuları doldurun veya .env dosyasına ekleyin.",
          },
          { status: 400 }
        );
      }

      const testMsg = `🏛️ *DEFTER — Canlı Telegram Bağlantı Testi*\n\n✅ Tebrikler! Defter yatırım takip sisteminiz Telegram kanalınıza başarıyla bağlandı.\n\n_Saat: ${new Date().toLocaleTimeString("tr-TR")}_`;
      const sent = await sendTelegramMessage(chatId, token, testMsg);

      if (!sent) {
        return NextResponse.json(
          {
            success: false,
            error: "Telegram API mesajı iletemedi. Bot Token ve Chat ID'nizi ve botu /start ile başlattığınızı kontrol edin.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Telegram test mesajı başarıyla iletildi! Sohbetinizi kontrol edin.",
      });
    }

    if (channel === "email") {
      const apiKey = resendApiKey?.trim() || process.env.RESEND_API_KEY?.trim();
      const to = emailTo?.trim() || process.env.REPORT_EMAIL_TO?.trim();

      if (!apiKey || !to) {
        return NextResponse.json(
          {
            success: false,
            error: "Resend API Anahtarı veya Hedef E-posta adresi eksik.",
          },
          { status: 400 }
        );
      }

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 550px; margin: 0 auto; background: #13171f; color: #e5e7eb; padding: 24px; border-radius: 12px; border: 1px solid #2a3342;">
          <h2 style="color: #c9a24b; margin-top: 0; border-bottom: 1px solid #2a3342; padding-bottom: 12px;">🏛️ Defter — E-posta Bildirim Testi</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">
            Tebrikler! Defter otomatik e-posta raporlama kanalınız başarıyla yapılandırıldı. Günlük brifingler ve haftalık kasa mektupları bu adrese iletilecektir.
          </p>
          <hr style="border: 0; border-top: 1px solid #2a3342; margin: 20px 0;" />
          <p style="font-size: 11px; color: #8a909a; font-family: monospace;">Tarih: ${new Date().toLocaleString("tr-TR")}</p>
        </div>
      `;

      const sent = await sendEmailReport(to, "Defter: Bağlantı Test Mesajı", html, apiKey);

      if (!sent) {
        return NextResponse.json(
          {
            success: false,
            error: "Resend API e-posta gönderimini tamamlayamadı. API anahtarınızı ve alan adı doğrulamanızı kontrol edin.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${to} adresine test e-postası başarıyla gönderildi!`,
      });
    }

    return NextResponse.json({ success: false, error: "Geçersiz bildirim kanalı" }, { status: 400 });
  } catch (error: unknown) {
    return formatApiError(error, "Bildirim kanalı testi sırasında bir hata oluştu.");
  }
}
