import { describe, it, expect, vi } from "vitest";
import {
  evaluatePendingOutcomesServerSide,
  computeServerSideAccuracyStats,
  computeConfidenceCalibration,
} from "./aiAccuracy";
import { computeUserPreferenceProfile } from "./userProfile";
import { SupabaseClient } from "@supabase/supabase-js";

describe("Orakul Faz 3: Sunucu Tarafı Karne Değerlendirme & Kişiselleştirme", () => {
  // -------------------------------------------------------------
  // 1. evaluatePendingOutcomesServerSide
  // -------------------------------------------------------------
  describe("evaluatePendingOutcomesServerSide", () => {
    it("correctly evaluates matured AL, SAT, TUT verdicts against actual price returns", async () => {
      const thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString();
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

      const mockHistory = [
        {
          id: "hist-al-win",
          symbol: "THYAO",
          verdict: "GÜÇLÜ AL",
          verdict_date: thirtyFiveDaysAgo,
          target_period_days: 30,
          price_at_verdict: 200,
          outcome_correct: null,
        },
        {
          id: "hist-al-loss",
          symbol: "THYAO",
          verdict: "AL",
          verdict_date: thirtyFiveDaysAgo,
          target_period_days: 30,
          price_at_verdict: 300,
          outcome_correct: null,
        },
        {
          id: "hist-sat-win",
          symbol: "ASELS",
          verdict: "SAT",
          verdict_date: thirtyFiveDaysAgo,
          target_period_days: 30,
          price_at_verdict: 80,
          outcome_correct: null,
        },
        {
          id: "hist-tut-win",
          symbol: "KCHOL",
          verdict: "TUT / DENGELİ",
          verdict_date: thirtyFiveDaysAgo,
          target_period_days: 30,
          price_at_verdict: 200,
          outcome_correct: null,
        },
        {
          id: "hist-immature",
          symbol: "THYAO",
          verdict: "AL",
          verdict_date: fiveDaysAgo, // Only 5 days passed (< 30 target)
          target_period_days: 30,
          price_at_verdict: 250,
          outcome_correct: null,
        },
      ];

      const mockCompanies = [
        { symbol: "THYAO", price: 250 }, // 200->250 (+25% AL win), 300->250 (-16.6% AL loss)
        { symbol: "ASELS", price: 60 },  // 80->60 (-25% SAT win)
        { symbol: "KCHOL", price: 204 }, // 200->204 (+2% TUT win within ±5%)
      ];

      const updateCalls: Array<{ id: string; payload: Record<string, unknown> }> = [];

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "ai_history") {
            return {
              select: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                  not: vi.fn().mockResolvedValue({ data: mockHistory, error: null }),
                }),
              }),
              update: vi.fn().mockImplementation((payload: Record<string, unknown>) => ({
                eq: vi.fn().mockImplementation((col: string, val: string) => {
                  updateCalls.push({ id: val, payload });
                  return Promise.resolve({ error: null });
                }),
              })),
            };
          }
          if (table === "companies") {
            return {
              select: vi.fn().mockResolvedValue({ data: mockCompanies, error: null }),
            };
          }
          return {};
        }),
      } as unknown as SupabaseClient;

      const result = await evaluatePendingOutcomesServerSide(mockSupabase);

      // Should evaluate exactly 4 items (skipping immature one)
      expect(result.evaluated).toBe(4);
      expect(updateCalls.length).toBe(4);

      // Verify AL win
      const alWin = updateCalls.find((c) => c.id === "hist-al-win");
      expect(alWin?.payload.outcome_correct).toBe(true);
      expect(alWin?.payload.price_after_period).toBe(250);

      // Verify AL loss
      const alLoss = updateCalls.find((c) => c.id === "hist-al-loss");
      expect(alLoss?.payload.outcome_correct).toBe(false);

      // Verify SAT win
      const satWin = updateCalls.find((c) => c.id === "hist-sat-win");
      expect(satWin?.payload.outcome_correct).toBe(true);

      // Verify TUT win
      const tutWin = updateCalls.find((c) => c.id === "hist-tut-win");
      expect(tutWin?.payload.outcome_correct).toBe(true);
    });
  });

  // -------------------------------------------------------------
  // 2. computeServerSideAccuracyStats
  // -------------------------------------------------------------
  describe("computeServerSideAccuracyStats", () => {
    it("computes authentic overall and directional accuracy statistics", async () => {
      const mockData = [
        { verdict: "AL", verdict_tag: "AL", outcome_correct: true },
        { verdict: "AL", verdict_tag: "AL", outcome_correct: true },
        { verdict: "AL", verdict_tag: "AL", outcome_correct: false },
        { verdict: "SAT", verdict_tag: "SAT", outcome_correct: true },
        { verdict: "TUT", verdict_tag: "TUT", outcome_correct: false },
      ];

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as unknown as SupabaseClient;

      const stats = await computeServerSideAccuracyStats(mockSupabase);
      expect(stats).not.toBeNull();
      expect(stats?.total).toBe(5);
      expect(stats?.correct).toBe(3);
      expect(stats?.accuracyRate).toBe(60.0);
      expect(stats?.alAccuracy).toBe(66.7);
      expect(stats?.satAccuracy).toBe(100.0);
      expect(stats?.tutAccuracy).toBe(0.0);
    });

    it("returns null when no evaluated history exists instead of fake default numbers", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      } as unknown as SupabaseClient;

      const stats = await computeServerSideAccuracyStats(mockSupabase);
      expect(stats).toBeNull();
    });
  });

  // -------------------------------------------------------------
  // 3. computeConfidenceCalibration
  // -------------------------------------------------------------
  describe("computeConfidenceCalibration", () => {
    it("detects overconfidence when high confidence predictions have low accuracy", async () => {
      const mockData = [
        { confidence: "%85", outcome_correct: false },
        { confidence: "%90", outcome_correct: false },
        { confidence: "%88", outcome_correct: false },
        { confidence: "%85", outcome_correct: true },
        { confidence: "%95", outcome_correct: false },
        { confidence: "%65", outcome_correct: true },
      ];

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as unknown as SupabaseClient;

      const calibration = await computeConfidenceCalibration(mockSupabase);
      expect(calibration.isOverconfident).toBe(true);
      expect(calibration.calibrationNote).toContain("Aşırı Özgüven Uyarısı");
      expect(calibration.tiers[0].accuracyRate).toBe(20.0); // 1 out of 5 correct
    });
  });

  // -------------------------------------------------------------
  // 4. computeUserPreferenceProfile
  // -------------------------------------------------------------
  describe("computeUserPreferenceProfile", () => {
    it("computes authentic sector bias, risk tolerance, and tone-only personalization context", async () => {
      const mockSettings = {
        orakulPersona: "temkinli_degeryatirimcisi",
      };

      const mockBaskets = [
        {
          id: "b1",
          total_value: 100000,
          basket_holdings: [
            { symbol: "THYAO", weight_percent: 50 },
            { symbol: "PGSUS", weight_percent: 20 },
            { symbol: "GARAN", weight_percent: 30 },
          ],
        },
      ];

      const mockCompanies = [
        { symbol: "THYAO", sector: "Havacılık", price: 300 },
        { symbol: "PGSUS", sector: "Havacılık", price: 200 },
        { symbol: "GARAN", sector: "Bankacılık", price: 100 },
      ];

      const mockHistory = [
        { symbol: "THYAO", verdict: "AL", persona_used: "temkinli_degeryatirimcisi" },
        { symbol: "AKBNK", verdict: "AL", persona_used: "temkinli_degeryatirimcisi" },
      ];

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "user_settings") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockSettings, error: null }),
                }),
              }),
            };
          }
          if (table === "baskets") {
            return {
              select: vi.fn().mockResolvedValue({ data: mockBaskets, error: null }),
            };
          }
          if (table === "companies") {
            return {
              select: vi.fn().mockResolvedValue({ data: mockCompanies, error: null }),
            };
          }
          if (table === "ai_history") {
            return {
              select: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: mockHistory, error: null }),
              }),
            };
          }
          return {};
        }),
      } as unknown as SupabaseClient;

      const profile = await computeUserPreferenceProfile(mockSupabase, "test_user");

      expect(profile.preferredPersona).toBe("temkinli_degeryatirimcisi");
      expect(profile.riskTolerance).toBe("yüksek"); // THYAO has 50% concentration (> 40%)
      expect(profile.sectorBias["Havacılık"]).toBe(70.0);
      expect(profile.sectorBias["Bankacılık"]).toBe(30.0);
      expect(profile.topHoldings).toContain("THYAO");
      expect(profile.verdictFollowRate).toBe(50.0); // 1 out of 2 ALs (THYAO) is in holdings
      expect(profile.personalizationContext).toContain("KULLANICI PROFİLİ");
      expect(profile.personalizationContext).toContain("asla finansal gerçekleri veya değerleme metriklerini kullanıcının önyargılarına göre değiştirme");
    });
  });
});
