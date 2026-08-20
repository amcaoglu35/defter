"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";
import { useDefterStore } from "@/lib/store";

export function OrakulCopilotChat() {
  const { companies, baskets, aiApiKey, aiProvider, geminiModel } = useDefterStore();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Merhaba! Ben Orakul Yapay Zeka Finansal Asistanınızım. Portföyünüz, BIST hisseleri, bilanço yorumları veya strateji tercihleriniz hakkında istediğiniz soruyu sorabilirsiniz.",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isServerAiActive, setIsServerAiActive] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    let isCancelled = false;
    fetch("/api/orakul")
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.success) {
          setIsServerAiActive(Boolean(data.isRealAiActive));
        }
      })
      .catch(() => {
        if (!isCancelled) setIsServerAiActive(false);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const isRealAi = Boolean((aiApiKey && aiApiKey.trim().length > 5) || isServerAiActive);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    setInputMsg("");
    const nextMessages = [...messages, { role: "user" as const, content: userText }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const portfolioSummary = `Kullanıcı Portföyü: ${baskets.length} adet sepet var. Hisseler: ${companies
        .slice(0, 5)
        .map((c) => `${c.symbol} (${c.price} ₺)`)
        .join(", ")}.`;

      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          messages: nextMessages,
          context: {
            portfolioSummary,
            companies: companies.slice(0, 20),
            baskets,
          },
          provider: aiProvider,
          model: geminiModel,
          apiKey: aiApiKey, // Kişisel anahtar varsa öncelikli, yoksa sunucu env / cookie devreye girer
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        const errJson = await res.json().catch(() => null);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              errJson?.error ||
              "Üzgünüm, yanıt oluşturulurken bir sorun oluştu. Lütfen bağlantınızı ve API ayarlarınızı kontrol edin.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Üzgünüm, yanıt oluşturulurken bir ağ hatası meydana geldi. Lütfen internet bağlantınızı kontrol edin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-xl flex flex-col h-[520px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              💬 Orakul Copilot Finansal Sohbet Asistanı
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              OpenBB Copilot &amp; FinGPT Tabanlı İnteraktif Yapay Zeka Ajanı
            </p>
          </div>
        </div>

        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 border ${
            isRealAi
              ? "text-[var(--brass)] bg-[var(--brass-glow)] border-[var(--brass-dim)]"
              : "text-[var(--mist)] bg-[var(--ink-3)] border-[var(--line)]"
          }`}
        >
          <Sparkles className="w-3 h-3 text-[var(--brass)]" />
          <span>{isRealAi ? "Canlı AI Ajanı" : "Şablon Asistanı"}</span>
        </span>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[11px] ${
                m.role === "user"
                  ? "bg-[var(--ink-3)] border-[var(--brass)] text-[var(--brass)]"
                  : "bg-[rgba(91,140,123,0.2)] border-[var(--verdigris)] text-[var(--verdigris)]"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--brass)] text-[var(--ink)] font-semibold font-sans text-xs shadow"
                  : "bg-[var(--ink-3)] text-[var(--paper)] border border-[var(--line)] font-sans text-xs whitespace-pre-wrap"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-[var(--brass)] font-mono text-xs animate-pulse p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Orakul Copilot düşünüyor...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2 shrink-0 pt-2 border-t border-[var(--line)]">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Orakul Copilot'a bir finansal soru sorun... (örn: THYAO adil değeri ne?)"
          className="flex-1 bg-[var(--ink-3)] border border-[var(--brass-dim)] text-[var(--paper)] text-xs font-mono px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[var(--brass)]"
        />
        <button
          type="submit"
          disabled={loading || !inputMsg.trim()}
          className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gönder</span>
        </button>
      </form>
    </div>
  );
}
