"use client";

import React from "react";
import { Printer, Download, FileText } from "lucide-react";

interface AiReportPdfExporterProps {
  title: string;
  subtitle?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export function AiReportPdfExporter({ title, subtitle, contentRef }: AiReportPdfExporterProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-[var(--ink-2)] hover:bg-[var(--ink-3)] border border-[var(--brass-dim)] text-[var(--brass)] font-mono text-xs px-3.5 py-2 rounded flex items-center gap-2 transition-all cursor-pointer shadow"
      title={`${title} belgesini mühürlü kurumsal PDF olarak yazdır veya indir`}
    >
      <Printer className="w-3.5 h-3.5" />
      <span>PDF Raporu İndir</span>
    </button>
  );
}
