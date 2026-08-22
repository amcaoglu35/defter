import { describe, it, expect } from "vitest";
import { runAutonomousScan, generateAiModelBaskets } from "./aiToolsService";

describe("aiToolsService — runAutonomousScan Tests", () => {
  it("generates requested number of scans with authentic quantitative metrics", async () => {
    const scans = await runAutonomousScan({ count: 5 });
    expect(scans.length).toBe(5);

    scans.forEach((scan) => {
      expect(scan.id).toBeDefined();
      expect(scan.symbol).toBeDefined();
      expect(scan.companyName).toBeDefined();
      expect(scan.verdict).toMatch(/GÜÇLÜ AL|AL|TUT|SAT|GÜÇLÜ SAT|NÖTR/);
      expect(scan.valuationScore).toBeGreaterThanOrEqual(25);
      expect(scan.valuationScore).toBeLessThanOrEqual(99);
      expect(scan.bullThesis).toBeDefined();
      expect(scan.bearThesis).toBeDefined();
      expect(scan.metricsSource).toBe("calculated");
    });
  });

  it("filters scans according to selected radar categories", async () => {
    const bist30Scans = await runAutonomousScan({ count: 4, category: "BIST30" });
    expect(bist30Scans.length).toBeGreaterThan(0);

    const dividendScans = await runAutonomousScan({ count: 4, category: "DIVIDEND" });
    expect(dividendScans.length).toBeGreaterThan(0);
    dividendScans.forEach((s) => {
      expect(s.dividendYield).toBeGreaterThanOrEqual(3.0);
    });

    const valueScans = await runAutonomousScan({ count: 4, category: "VALUE" });
    expect(valueScans.length).toBeGreaterThan(0);
  });

  it("supports continuous rotation by excluding recently scanned symbols", async () => {
    const firstBatch = await runAutonomousScan({ count: 3 });
    const firstSymbols = firstBatch.map((s) => s.symbol);

    const secondBatch = await runAutonomousScan({ count: 3, excludeSymbols: firstSymbols });
    const secondSymbols = secondBatch.map((s) => s.symbol);

    // Symbols in second batch should not collide with first batch if universe has enough stocks
    const overlap = secondSymbols.filter((sym) => firstSymbols.includes(sym));
    expect(overlap.length).toBe(0);
  });
});

describe("aiToolsService — generateAiModelBaskets Tests", () => {
  it("generates 6 institutional theme model baskets with strictly 100% total weight", async () => {
    const baskets = await generateAiModelBaskets();
    expect(baskets.length).toBe(6);

    baskets.forEach((basket) => {
      expect(basket.id).toBeDefined();
      expect(basket.theme).toBeDefined();
      expect(basket.summary).toBeDefined();
      expect(basket.allocation.length).toBeGreaterThanOrEqual(3);

      const totalWeight = basket.allocation.reduce((sum, a) => sum + a.weight, 0);
      expect(totalWeight).toBe(100);

      basket.allocation.forEach((alloc) => {
        expect(alloc.symbol).toBeDefined();
        expect(alloc.priceAtCreation).toBeGreaterThan(0);
        expect(alloc.weight).toBeGreaterThan(0);
      });
    });
  });

  it("populates financial metrics and Piotroski score on model portfolio holdings", async () => {
    const baskets = await generateAiModelBaskets();
    const deepValueBasket = baskets.find((b) => b.theme.includes("Derin Değer"));
    expect(deepValueBasket).toBeDefined();

    deepValueBasket?.allocation.forEach((item) => {
      expect(item.piotroskiFScore).toBeDefined();
      expect(item.piotroskiFScore).toBeGreaterThanOrEqual(0);
      expect(item.piotroskiFScore).toBeLessThanOrEqual(9);
    });
  });
});
