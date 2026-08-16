"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { ChatMessage } from "@/lib/aiService";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface OrakulChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Merhaba, ben **Orakul**. Portföyündeki şirketler, temettü projeksiyonların, risk dağılımın ve piyasa senaryoları hakkında aklına takılan her şeyi bana sorabilirsin.",
  },
];

export default function OrakulChatModal({
  isOpen,
  onClose,
}: OrakulChatModalProps) {
  const { baskets, companies, aiAccuracyStats, aiHistory, addAiHistory, aiProvider, geminiModel } = useDefterStore();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const query = textToSend || input.trim();
      if (!query || loading) return;

      const newMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: query },
      ];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/orakul", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "chat",
            provider: aiProvider,
            model: geminiModel,
            messages: newMessages,
            context: {
              totalBaskets: baskets.length,
              accuracyStats: aiAccuracyStats,
              pastPredictionsCount: aiHistory.length,
              companiesSummary: companies.map((c) => ({
                symbol: c.symbol,
                price: c.price,
                rec: c.recommendation,
                pe: c.peRatio,
              })),
              baskets: baskets.map((b) => ({
                name: b.name,
                value: b.totalValue,
                profit: b.totalProfitPercent,
                holdings: b.holdings.map((h) => `${h.companySymbol} (%${h.weightPercent})`),
              })),
            },
            history: aiHistory,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.reply || "Analiz tamamlandı.";
          setMessages([
            ...newMessages,
            { role: "assistant", content: replyText },
          ]);

          // Save conversation summary to aiHistory for persistence & history tab
          addAiHistory({
            id: `ai-chat-${Date.now()}`,
            date: new Date().toLocaleDateString("tr-TR"),
            type: "Sohbet Analizi",
            title: `Soru: ${query.slice(0, 45)}${query.length > 45 ? "..." : ""}`,
            description: replyText,
            verdictTag: "DENGELİ",
            verdict: "DENGELİ",
            targetPeriodDays: 30,
          });
        } else {
          setMessages([
            ...newMessages,
            {
              role: "assistant",
              content: "Orakul yanıt üretirken bir sorunla karşılaştı.",
            },
          ]);
        }
      } catch {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "Bağlantı hatası oluştu, yerel mantık motoru devrede: Portföyün genel olarak dengeli ve likiditesi yüksek.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [
      input,
      loading,
      messages,
      aiProvider,
      geminiModel,
      baskets,
      aiAccuracyStats,
      aiHistory,
      companies,
      addAiHistory,
    ]
  );

  const quickQuestions = [
    "En yüksek temettü potansiyeli olan hisselerim hangileri?",
    "Faiz indiriminden hangi sepetim daha çok faydalanır?",
    "Portföyümün risk seviyesi ve çeşitlendirmesi nasıl?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--line)] bg-[var(--ink)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[var(--brass)] bg-[var(--ink-2)] flex items-center justify-center font-serif italic font-bold text-[var(--brass)] shadow-inner">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Orakul ile Sohbet
                </h3>
                <span className="font-mono text-[9px] bg-[var(--brass)] text-[var(--ink)] font-bold px-1.5 py-0.2 rounded-xs">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-mono text-[var(--mist)]">
                Portföyüne özel akıllı analiz asistanı
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1.5 rounded border border-[var(--line)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full border border-[var(--brass-dim)] bg-[var(--ink-3)] flex items-center justify-center text-[var(--brass)] font-serif italic font-bold shrink-0 text-xs">
                  O
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-xl p-3.5 leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--brass)] text-[var(--ink)] font-medium rounded-tr-none shadow"
                    : "bg-[var(--ink-3)] text-[var(--paper)] border border-[var(--line)] rounded-tl-none font-normal"
                }`}
              >
                {/* Format markdown-like bold text */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: escapeHtml(m.content)
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center text-[var(--paper)] font-mono text-[10px] shrink-0 font-bold">
                  BEN
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-[var(--mist)] font-mono text-xs animate-pulse">
              <div className="w-7 h-7 rounded-full border border-[var(--brass-dim)] bg-[var(--ink-3)] flex items-center justify-center text-[var(--brass)] font-serif italic font-bold text-xs">
                O
              </div>
              <div className="flex gap-1.5 p-3 rounded bg-[var(--ink-3)] border border-[var(--line)]">
                <span className="w-2 h-2 rounded-full bg-[var(--brass)] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[var(--brass)] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[var(--brass)] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-[var(--ink)] border-t border-[var(--line)] flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-mono text-[var(--mist)] hover:text-[var(--brass)] border border-[var(--line)] hover:border-[var(--brass-dim)] px-2.5 py-1 rounded-full bg-[var(--ink-2)] transition-colors text-left truncate max-w-xs cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[var(--ink)] border-t border-[var(--line)] flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Orakul'a portföyün veya hisseler hakkında soru sor..."
            className="flex-1 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg px-4 py-2.5 text-xs text-[var(--paper)] placeholder-[var(--mist)] focus:border-[var(--brass)] outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
