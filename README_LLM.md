# AI Context: Tax Optimization Engine (Spain 2026)

## Project Goal
Find the exact mathematical point where the sum of (Income Tax + Corporate Tax + Dividend Tax) is at its minimum for a single-shareholder SL (Limited Company). The application provides an interactive interface with sliders to adjust key parameters and automatically calculates the optimal salary/dividend split.

## Domain Logic & Rules
- **Income Tax (IRPF):** Must follow a progressive bracket logic (not a flat rate).
- **Corporate Tax (IS):** User-adjustable via slider (0-30%), default 15% for SMEs (Pymes). Retrieved via `getCorporateTaxRate()` function.
- **Dividend Tax:** Follows the "Base del Ahorro" (19%, 21%, 23%).
- **Sweet Spot Definition:** The salary point where the marginal cost of IRPF exceeds the combined cost of Corporate Tax + Dividend Tax.
- **Input Parameters:**
  - **Corporate Tax Rate:** Slider (0-30%, step 0.1%, default 15%)
  - **Estimated Revenue:** Slider (20,000€ - 200,000€, step 1,000€, default 100,000€)
  - **Operational Costs:** Slider (0€ - 20,000€, step 100€, default 1,000€)

## Technical Stack
- **Language:** JavaScript (vanilla, no frameworks).
- **Execution:** Directly in the browser (no build step required).
- **Visualization:** Chart.js (loaded from CDN).
- **File:** `index.html` (standalone HTML file with embedded JavaScript).

## Calculation Table (IRPF 2025/2026 Applied)
| Range (From-To) | Total Rate (State + Regional) |
| :--- | :--- |
| 0€ - 12.450€ | 18.00% |
| 12.450€ - 13.362€ | 20.50% |
| 13.362€ - 19.004€ | 22.70% |
| 19.004€ - 20.200€ | 24.80% |
| 20.200€ - 35.200€ | 27.80% |
| 35.200€ - 35.425€ | 31.30% |
| 35.425€ - 57.320€ | 35.90% |
| 57.320€ - 60.000€ | 39.00% |
| 60.000€ - 300.000€ | 43.00% |

## Current Code Architecture
- All calculation logic is embedded in `index.html` as JavaScript.
- **Input Management:**
  - Three interactive sliders: `corporateTaxRate`, `estimatedRevenue`, `operationalCosts`
  - Slider values are displayed in real-time and trigger recalculation via event listeners
  - `getCorporateTaxRate()`: Retrieves corporate tax rate from slider (converts percentage to decimal)
- **Core Calculation Functions:**
  - `calculateIRPF()`: A loop-based function to handle progressive tax brackets correctly.
  - `calculateSavingsTax()`: Logic for dividend taxation.
  - `calculateOptimalSalaryForMinTaxes(revenue, operationalCosts, salaryStep, minSalary)`: Finds the salary that minimizes total taxes for given revenue and operational costs.
  - `calculateAutonomoSocietarioScenario()`: Calculates the optimal split between autónomo and SL revenue.
- **UI Update Functions:**
  - `updateOptimalAllocationPanel()`: Main panel that displays optimal salary/dividend split, tax breakdown, and net final amount
  - `updateCalculations()`: Triggers recalculation of charts and tables when sliders change
  - Event listeners on sliders call update functions with debouncing to prevent excessive recalculations
- **Display Components:**
  - `optimalAllocationPanel`: Shows "Reparto Óptimo" with input data, optimal allocation, tax breakdown, and net final
  - `breakEvenPanel`: Shows break-even analysis
  - `sweetSpotPanel`: Shows sweet spot comparison table
  - Chart.js is loaded from CDN and charts are generated dynamically on page load

## Instructions for the AI
When modifying this code, always ensure the progressive nature of the taxes is preserved. Do not apply a single percentage to the total amount. 

**Key Considerations:**
- The corporate tax rate is now dynamic (from slider), not hardcoded. Always use `getCorporateTaxRate()` instead of a constant.
- Operational costs are dynamic (from slider), not hardcoded. Use the `operationalCosts` parameter passed to calculation functions.
- When reading slider values, use `??` (nullish coalescing) instead of `||` to properly handle zero values (e.g., `parseFloat(input.value) ?? defaultValue`).
- Slider changes trigger `updateOptimalAllocationPanel()` which recalculates the optimal salary and all tax components.
- The `profitBeforeIS` calculation is: `estimatedRevenue - operationalCosts - optimalSalary` (operational costs are already subtracted in `netBeforeTax`).
- All calculations happen client-side in the browser. Be mindful of performance when implementing analytical searches (ternary/binary search) - consider debouncing and limiting iteration ranges.
- The optimal allocation panel displays:
  - **Datos de Entrada:** Estimated Revenue, Operational Costs, Net Before Tax
  - **Reparto Óptimo:** Optimal Administrator Salary, Dividends
  - **Desglose de Impuestos:** IRPF (on salary), Corporate Tax, Dividend Tax, TOTAL TAXES
  - **Neto Final en el Bolsillo:** Final net amount (salary net + dividends net)
