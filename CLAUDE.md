# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spanish LLC Tax Optimizer - an interactive tax simulation tool for Spanish Limited Companies (Sociedades Limitadas) that finds the optimal salary/dividend split to minimize total taxes. The "Sweet Spot" is where the marginal cost of IRPF exceeds the combined cost of Corporate Tax + Dividend Tax.

## Development

**No build system required.** Open `index.html` directly in a browser.

The entire application is a single file (`index.html`, ~1,610 lines) containing CSS, HTML, and JavaScript. External dependency: Chart.js 4.4.0 loaded from CDN.

## Architecture

### Single-File Structure
- **Lines 8-198:** CSS styles
- **Lines 200-234:** HTML markup (minimal - most UI is JavaScript-rendered)
- **Lines 236-1610:** JavaScript calculation and UI logic

### Core Calculation Functions
- `calculateIRPF(salary)` - Progressive income tax (IRPF 2025/2026)
- `calculateSavingsTax(amount)` - Dividend tax (Base del Ahorro: 19%, 21%, 23%)
- `calculateRETA(annualNetIncome)` - Self-employed contributions (RETA brackets)
- `calculateRETAForAutonomoSocietario(salary)` - RETA for SL administrator based on salary
- `calculateOptimalSalaryForMinTaxes(revenue, operationalCosts, salaryStep, minSalary)` - 3-phase optimization algorithm (includes RETA)
- `calculateAutonomoScenario(revenue, expenses)` - Self-employed scenario
- `calculateOptimalSLScenario(revenue, expenses)` - Limited company scenario

### Input Sliders
- Corporate Tax Rate: 0-30% (default 15%)
- Estimated Revenue: €20K-€200K (default €100K)
- Operational Costs: €0-€20K (default €1K)

### Constants
- `MINIMUM_SALARY = 16,576€` (2026 minimum wage)
- `SL_OPERATIONAL_COSTS.TOTAL = 950€` (€600 accounting + €350 commercial)

## Critical Development Rules

1. **Always use `getCorporateTaxRate()`** - Never hardcode corporate tax rates; the value comes from the slider.

2. **Preserve progressive tax logic** - IRPF uses progressive brackets, not flat rates. Never apply a single percentage to the total amount.

3. **Include RETA for autónomo societario** - In SL scenarios, the administrator (>25% owner) must pay RETA. Use `calculateRETAForAutonomoSocietario(salary)` and include it in total tax calculations and net liquid calculations.

4. **Handle zero values correctly** - Use `??` (nullish coalescing) instead of `||` when reading slider values to properly handle zero: `parseFloat(input.value) ?? defaultValue`

5. **Currency formatting** - Use `Intl.NumberFormat("es-ES")` for Spanish formatting. Round calculations to 2 decimal places.

6. **Chart.js memory management** - Destroy chart instances before recreation to prevent memory leaks.

## IRPF Tax Brackets (2025/2026)

| Range | Rate |
|-------|------|
| 0€ - 12,450€ | 18.00% |
| 12,450€ - 13,362€ | 20.50% |
| 13,362€ - 19,004€ | 22.70% |
| 19,004€ - 20,200€ | 24.80% |
| 20,200€ - 35,200€ | 27.80% |
| 35,200€ - 35,425€ | 31.30% |
| 35,425€ - 57,320€ | 35.90% |
| 57,320€ - 60,000€ | 39.00% |
| 60,000€ - 300,000€ | 43.00% |

## Testing Changes

Test with multiple revenue levels to verify:
- Tax bracket boundary calculations
- Optimal salary finder across different scenarios
- Chart rendering after slider changes
