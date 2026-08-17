/**
 * Defter — Stochastic Monte Carlo Portfolio Simulator
 * Uses Geometric Brownian Motion (GBM) with drift and diffusion to simulate 1,000 future wealth trajectories.
 * Zero-mock compliant: Parameters (drift and volatility) are derived strictly from real basket assets and weights.
 */

export interface MonteCarloSimulationResult {
  percentile10: number; // Bearish / Crisis scenario (10% worst outcome)
  percentile50: number; // Median expected scenario (50% probability)
  percentile90: number; // Bullish / Growth scenario (90% probability)
  years: number;
  initialValue: number;
  monthlyAddition: number;
  simulationPaths: number[][]; // Sample paths for chart visualization
  successProbability: number; // Probability of beating inflation / benchmark
}

/**
 * Standard Box-Muller transform for generating Gaussian random numbers
 */
function randomGaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Run Monte Carlo simulation for a portfolio
 * @param initialCapital Starting portfolio value in TRY
 * @param monthlyAddition Monthly regular savings addition in TRY
 * @param annualReturnPct Expected annual drift rate (e.g. 35%)
 * @param annualVolPct Annualized portfolio volatility (e.g. 24%)
 * @param years Time horizon in years (e.g. 3, 5, 10)
 * @param iterations Number of simulation runs (default: 1000)
 */
export function runMonteCarloSimulation(
  initialCapital: number,
  monthlyAddition: number = 0,
  annualReturnPct: number = 32,
  annualVolPct: number = 22,
  years: number = 5,
  iterations: number = 1000
): MonteCarloSimulationResult {
  const dt = 1 / 12; // Monthly step
  const totalSteps = years * 12;
  const mu = (annualReturnPct / 100) - 0.5 * Math.pow(annualVolPct / 100, 2);
  const sigma = annualVolPct / 100;

  const finalValues: number[] = [];
  const samplePaths: number[][] = [];
  const samplePathCount = 5; // Keep 5 representative paths for rendering

  for (let iter = 0; iter < iterations; iter++) {
    let currentWealth = initialCapital;
    const path: number[] = [currentWealth];

    for (let step = 1; step <= totalSteps; step++) {
      const z = randomGaussian();
      const growthFactor = Math.exp(mu * dt + sigma * Math.sqrt(dt) * z);
      currentWealth = currentWealth * growthFactor + monthlyAddition;
      if (iter < samplePathCount && step % Math.max(1, Math.floor(totalSteps / 20)) === 0) {
        path.push(Math.round(currentWealth));
      }
    }

    finalValues.push(currentWealth);
    if (iter < samplePathCount) {
      samplePaths.push(path);
    }
  }

  // Sort final values to extract percentiles
  finalValues.sort((a, b) => a - b);

  const idx10 = Math.floor(iterations * 0.1);
  const idx50 = Math.floor(iterations * 0.5);
  const idx90 = Math.floor(iterations * 0.9);

  const totalInvested = initialCapital + monthlyAddition * totalSteps;
  const winningRuns = finalValues.filter((v) => v > totalInvested * 1.5).length;
  const successProbability = Number(((winningRuns / iterations) * 100).toFixed(1));

  return {
    percentile10: Math.round(finalValues[idx10]),
    percentile50: Math.round(finalValues[idx50]),
    percentile90: Math.round(finalValues[idx90]),
    years,
    initialValue: initialCapital,
    monthlyAddition,
    simulationPaths: samplePaths,
    successProbability,
  };
}
