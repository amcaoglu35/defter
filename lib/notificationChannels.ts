/**
 * Defter — External Notification Distribution Channels
 * Delivers daily market briefings and high-priority portfolio risk alerts
 * via Telegram Bot API and Resend Email REST API.
 */

export interface ChannelDispatchResult {
  telegramSent: boolean;
  emailSent: boolean;
  errors: string[];
}

/**
 * Sends a Markdown-formatted message to a Telegram chat via Bot API.
 */
export async function sendTelegramMessage(
  chatId: string,
  botToken: string,
  text: string
): Promise<boolean> {
  if (!chatId || !botToken || !text) return false;

  try {
    const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.warn("[NotificationChannel] Telegram API error:", errJson);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[NotificationChannel] Failed to dispatch Telegram message:", err);
    return false;
  }
}

/**
 * Sends an HTML/text report email using Resend REST API.
 */
export async function sendEmailReport(
  to: string,
  subject: string,
  htmlBody: string,
  resendApiKey?: string
): Promise<boolean> {
  const apiKey = resendApiKey?.trim() || process.env.RESEND_API_KEY?.trim();
  if (!to || !apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Defter Finans <onboarding@resend.dev>",
        to: [to.trim()],
        subject: subject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.warn("[NotificationChannel] Resend Email error:", errJson);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[NotificationChannel] Failed to dispatch Email report:", err);
    return false;
  }
}

/**
 * Automatic dispatcher for Cron jobs and daily briefings.
 * Fails silently if env variables are not configured (Fail-safe).
 */
export async function dispatchDailyReportToChannels(report: {
  title: string;
  markdownText: string;
  htmlBody?: string;
}): Promise<ChannelDispatchResult> {
  const result: ChannelDispatchResult = {
    telegramSent: false,
    emailSent: false,
    errors: [],
  };

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const emailTo = process.env.REPORT_EMAIL_TO?.trim();

  // 1. Dispatch to Telegram if configured
  if (telegramToken && telegramChatId) {
    try {
      const telegramText = `🏛️ *DEFTER — ${report.title.toUpperCase()}*\n\n${report.markdownText}\n\n_📌 Bu rapor Defter Orakul Yapay Zeka motoru tarafından otomatik olarak üretilmiştir._`;
      const sent = await sendTelegramMessage(telegramChatId, telegramToken, telegramText);
      result.telegramSent = sent;
    } catch (e) {
      result.errors.push(`Telegram: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // 2. Dispatch to Email if configured
  if (resendApiKey && emailTo) {
    try {
      const html =
        report.htmlBody ||
        `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #13171f; color: #e5e7eb; padding: 24px; border-radius: 12px; border: 1px solid #2a3342;">
          <h2 style="color: #c9a24b; font-family: Georgia, serif; margin-top: 0; border-bottom: 1px solid #2a3342; padding-bottom: 12px;">🏛️ Defter — ${report.title}</h2>
          <div style="line-height: 1.6; font-size: 14px; color: #d1d5db; white-space: pre-wrap;">${report.markdownText}</div>
          <hr style="border: 0; border-top: 1px solid #2a3342; margin: 24px 0 12px;" />
          <p style="font-size: 11px; color: #8a909a; font-family: monospace;">📌 Bu e-posta Defter Kişisel Yatırım Takip Sistemi tarafından otomatik olarak gönderilmiştir.</p>
        </div>
      `;
      const sent = await sendEmailReport(emailTo, `Defter: ${report.title}`, html, resendApiKey);
      result.emailSent = sent;
    } catch (e) {
      result.errors.push(`Email: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return result;
}
