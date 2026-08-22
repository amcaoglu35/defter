"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart2,
  Scale,
  Coins,
  BrainCircuit,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";

interface OrakulCopilotChatProps {
  onSelectSymbol?: (symbol: string) => void;
}

export function OrakulCopilotChat({ onSelectSymbol }: OrakulCopilotChatProps) {
  const { companies, baskets, aiHistory, aiApiKey, aiProvider, geminiModel } = useDefterStore();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; timestamp?: string }>>([
    {
      role: "assistant",
      content:
        "### 🏛️ Orakul Copilot Finansal Danışmanınıza Hoş Geldiniz\n\nBen Defter platformunun Baş Yapay Zeka Portföy ve Piyasa Stratejistiyim. Stanford Piotroski skorları, Graham içsel değerleme, DuPont analizi ve modern portföy teorisi modelleriyle donatıldım.\n\n**Ne hakkında konuşmak istersiniz?** Aşağıdaki hızlı komutları seçebilir veya aklınıza gelen herhangi bir hisse/strateji sorusunu sorabilirsiniz.",
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isServerAiActive, setIsServerAiActive] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
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

  // 8 Hızlı Aksiyon & Analiz Şablonları
  const quickActions = [
    {
      icon: <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />,
      label: "Portföyümün Sağlık Analizi",
      prompt: "Portföyümün risk, çeşitlendirme ve genel sağlık durumunu analiz eder misin?",
    },
    {
      icon: <Scale className="w-3.5 h-3.5 text-amber-400" />,
      label: "THYAO vs PGSUS Kıyasla",
      prompt: "THYAO ve PGSUS şirketlerini F/K, PD/DD, kârlılık ve çarpan bazında karşılaştırır mısın?",
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-[var(--brass)]" />,
      label: "Kelepir Değer Hisseleri",
      prompt: "Defter kütüğünde F/K oranı en düşük ve kelepir seviyedeki sağlam sanayi hisseleri hangileri?",
    },
    {
      icon: <Coins className="w-3.5 h-3.5 text-yellow-400" />,
      label: "Yüksek Temettü Şampiyonları",
      prompt: "En yüksek kâr payı ve temettü verimine sahip BIST şirketlerini listeler misin?",
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />,
      label: "Enflasyon Kalkanı & Altın",
      prompt: "Yüksek enflasyon ve kur dalgalanmalarına karşı portföyümü nasıl korumalıyım?",
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-rose-400" />,
      label: "Analist Hedef Fiyatları",
      prompt: "Kurumsal analist konsensüsüne göre en yüksek getiri potansiyeli sunan hisseler hangileri?",
    },
    {
      icon: <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />,
      label: "Geçmiş AI İsabet Karnem",
      prompt: "Orakul yapay zekasının geçmiş AL/SAT/TUT tahminlerindeki doğrulanmış isabet oranı nedir?",
    },
    {
      icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
      label: "BIST 30 Değerleme Özeti",
      prompt: "BIST 30 lokomotif şirketlerinin genel değerleme durumu ve risk dengesi nasıl?",
    },
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = typeof customText === "string" ? customText : inputMsg;
    if (!textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    if (!customText) setInputMsg("");

    const timestamp = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const nextMessages = [...messages, { role: "user" as const, content: userText, timestamp }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      // 1. Zenginleştirilmiş Portföy Bağlamı Oluştur
      let totalPortfolioVal = 0;
      let totalPortfolioCost = 0;
      baskets.forEach((b) => {
        totalPortfolioVal += b.totalValue || 0;
        totalPortfolioCost += b.totalCost || 0;
      });
      const netProfit = totalPortfolioVal - totalPortfolioCost;
      const profitPct = totalPortfolioCost > 0 ? parseFloat(((netProfit / totalPortfolioCost) * 100).toFixed(2)) : 0;

      const portfolioSummary = `Toplam Portföy Değeri: ${totalPortfolioVal.toLocaleString("tr-TR")} ₺, Toplam Maliyet: ${totalPortfolioCost.toLocaleString("tr-TR")} ₺, Net Kâr/Zarar: %${profitPct} (${netProfit.toLocaleString("tr-TR")} ₺). Aktif Sepet Sayısı: ${baskets.length}.`;

      // 2. Geçmiş Karne Özeti
      const evaluatedHistory = aiHistory.filter((h) => typeof h.outcomeCorrect === "boolean");
      const accurateCount = evaluatedHistory.filter((h) => h.outcomeCorrect === true).length;
      const accuracyRate = evaluatedHistory.length > 0 ? parseFloat(((accurateCount / evaluatedHistory.length) * 100).toFixed(1)) : undefined;

      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            portfolioSummary,
            totalValue: totalPortfolioVal,
            totalCost: totalPortfolioCost,
            profitPercent: profitPct,
            companies: companies.slice(0, 100),
            baskets,
            accuracyStats: {
              total: evaluatedHistory.length,
              correct: accurateCount,
              accuracyRate,
            },
          },
          provider: aiProvider,
          model: geminiModel,
          apiKey: aiApiKey,
        }),
      });

      const assistantTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: assistantTime }]);
      } else {
        const errJson = await res.json().catch(() => null);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              errJson?.error ||
              "Üzgünüm, yanıt oluşturulurken bir sorun oluştu. Lütfen bağlantınızı ve API ayarlarınızı kontrol edin.",
            timestamp: assistantTime,
          },
        ]);
      }
    } catch {
      const assistantTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Üzgünüm, yanıt oluşturulurken bir ağ hatası meydana geldi. Lütfen internet bağlantınızı kontrol edin.",
          timestamp: assistantTime,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Sohbet geçmişi temizlendi. Yeni bir soru veya hisse analiziyle devam edebilirsiniz.",
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Zengin Markdown ve Tablo / Sembol Render Fonksiyonu
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const flushTable = (keyPrefix: string) => {
      if (tableRows.length === 0) return;
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1).filter((r) => !r.every((c) => c.trim().match(/^:?-+:?$/)));

      elements.push(
        <div key={`${keyPrefix}-table`} className="overflow-x-auto my-3 rounded-lg border border-[var(--line)] bg-[var(--ink-2)]">
          <table className="w-full text-left font-mono text-[11px] divide-y divide-[var(--line)]">
            <thead className="bg-[var(--ink-3)] text-[var(--brass)] font-bold">
              <tr>
                {headerRow.map((col, cIdx) => (
                  <th key={cIdx} className="p-2.5 whitespace-nowrap">
                    {renderInlineFormatting(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]/50 text-[var(--paper)]">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[var(--ink-3)]/60 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 whitespace-nowrap">
                      {renderInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    };

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();

      // Tablo Satırı Tespiti
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        inTable = true;
        const cols = trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cols);
        return;
      } else if (inTable) {
        flushTable(`flush-${lineIdx}`);
      }

      // Başlıklar
      if (trimmed.startsWith("### ")) {
        elements.push(
          <h4 key={lineIdx} className="font-serif text-sm font-bold text-[var(--paper)] mt-3 mb-1.5 flex items-center gap-1.5 text-[var(--brass)]">
            {renderInlineFormatting(trimmed.replace("### ", ""))}
          </h4>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h3 key={lineIdx} className="font-serif text-base font-bold text-[var(--paper)] mt-3.5 mb-2 text-[var(--brass)]">
            {renderInlineFormatting(trimmed.replace("## ", ""))}
          </h3>
        );
      } else if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5 text-xs text-[var(--paper)] leading-relaxed">
            <span className="text-[var(--brass)] font-bold">•</span>
            <div className="flex-1">{renderInlineFormatting(trimmed.replace(/^[•\-]\s*/, ""))}</div>
          </div>
        );
      } else if (trimmed.length === 0) {
        elements.push(<div key={lineIdx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={lineIdx} className="text-xs text-[var(--paper)] leading-relaxed font-sans">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable("final-table");
    }

    return elements;
  };

  // Sembol ve Kalın Metin Biçimlendirici (Tıklanabilir Şirket Rozetleri)
  const renderInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\$[A-Z0-9]+)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const raw = part.slice(2, -2);
        // Sembol kontrolü (örn: **$THYAO** veya **THYAO**)
        const cleanSym = raw.replace(/^\$/, "").trim();
        const isStockSymbol = companies.some((c) => c.symbol.toUpperCase() === cleanSym.toUpperCase());

        if (isStockSymbol && onSelectSymbol) {
          return (
            <button
              key={pIdx}
              type="button"
              onClick={() => onSelectSymbol(cleanSym.toUpperCase())}
              className="inline-flex items-center gap-1 font-mono font-bold text-[var(--brass)] bg-[var(--brass-glow)] hover:bg-[var(--brass)] hover:text-[var(--ink)] px-1.5 py-0.2 rounded border border-[var(--brass-dim)] transition-all cursor-pointer mx-0.5 text-[11px]"
              title={`${cleanSym} için Şirket Teşhisi sekmesine git`}
            >
              <span>${cleanSym}</span>
            </button>
          );
        }
        return (
          <strong key={pIdx} className="font-bold text-[var(--paper)]">
            {raw}
          </strong>
        );
      }

      if (part.startsWith("$")) {
        const cleanSym = part.slice(1).trim();
        const isStockSymbol = companies.some((c) => c.symbol.toUpperCase() === cleanSym.toUpperCase());

        if (isStockSymbol && onSelectSymbol) {
          return (
            <button
              key={pIdx}
              type="button"
              onClick={() => onSelectSymbol(cleanSym.toUpperCase())}
              className="inline-flex items-center gap-1 font-mono font-bold text-[var(--brass)] bg-[var(--brass-glow)] hover:bg-[var(--brass)] hover:text-[var(--ink)] px-1.5 py-0.2 rounded border border-[var(--brass-dim)] transition-all cursor-pointer mx-0.5 text-[11px]"
              title={`${cleanSym} için Şirket Teşhisi sekmesine git`}
            >
              <span>${cleanSym}</span>
            </button>
          );
        }
        return (
          <span key={pIdx} className="font-mono font-bold text-[var(--brass)]">
            {part}
          </span>
        );
      }

      return part;
    });
  };

  return (
    <div
      className={`bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded ? "h-[800px]" : "h-[580px]"
      }`}
    >
      {/* 1. Header & Controls */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3.5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-[var(--paper)]">
                💬 Orakul Copilot
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)] font-bold">
                FINANCIAL AI ADVISOR
              </span>
            </div>
            <p className="text-[11px] text-[var(--mist)] font-sans">
              Kantitatif Portföy Teşhisi, İkili Karşılaştırma &amp; Gerçek Borsa Modelleri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Connection Status Badge */}
          <span
            className={`font-mono text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 border ${
              isRealAi
                ? "text-[var(--brass)] bg-[var(--brass-glow)] border-[var(--brass-dim)]"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
            }`}
          >
            <Sparkles className="w-3 h-3 text-[var(--brass)]" />
            <span>{isRealAi ? "Canlı LLM Ajanı" : "Deterministik Quant Motoru"}</span>
          </span>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--brass-dim)] transition-all cursor-pointer"
            title={isExpanded ? "Küçült" : "Genişlet"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Chat */}
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-[var(--mist)] hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer"
            title="Sohbeti Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Messages Stream Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-[11px] ${
                m.role === "user"
                  ? "bg-[var(--ink-3)] border-[var(--brass)] text-[var(--brass)]"
                  : "bg-[rgba(91,140,123,0.2)] border-[var(--verdigris)] text-[var(--verdigris)]"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`space-y-1 max-w-[88%] ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`p-3.5 rounded-xl leading-relaxed shadow-md ${
                  m.role === "user"
                    ? "bg-[var(--brass)] text-[var(--ink)] font-semibold font-sans text-xs"
                    : "bg-[var(--ink-3)] text-[var(--paper)] border border-[var(--line)] font-sans text-xs space-y-1"
                }`}
              >
                {m.role === "user" ? m.content : renderFormattedContent(m.content)}
              </div>

              {/* Timestamp and Copy Action */}
              <div
                className={`flex items-center gap-2 px-1 text-[10px] text-[var(--mist)] font-mono ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span>{m.timestamp || ""}</span>
                {m.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.content, idx)}
                    className="hover:text-[var(--brass)] cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 bg-[var(--ink-3)] border border-[var(--brass-dim)] p-3 rounded-xl text-[var(--brass)] font-mono text-xs animate-pulse max-w-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--brass)] shrink-0" />
            <span>Orakul Copilot finansal verileri ve bilanço modellerini hesaplıyor...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Quick Action Chips Bar */}
      <div className="pt-2 border-t border-[var(--line)]/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {quickActions.map((act, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => handleSend(act.prompt)}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--paper)] text-[11px] font-mono shrink-0 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 shrink-0 pt-1">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Orakul Copilot'a sorun... (örn: THYAO ve PGSUS kıyasla, Portföyümün sağlık durumu ne?)"
          className="flex-1 bg-[var(--ink-3)] border border-[var(--line)] focus:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-3.5 py-2.5 rounded-lg focus:outline-none shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !inputMsg.trim()}
          className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-transform active:scale-95 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono text-xs">Gönder</span>
        </button>
      </form>
    </div>
  );
}
