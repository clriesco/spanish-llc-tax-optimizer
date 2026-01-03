# AI Context: Tax Optimization Engine (Spain 2026)

## Project Goal
Find the exact mathematical point where the sum of (Income Tax + Corporate Tax + Dividend Tax) is at its minimum for a single-shareholder SL (Limited Company).

## Domain Logic & Rules
- **Income Tax (IRPF):** Must follow a progressive bracket logic (not a flat rate).
- **Corporate Tax (IS):** Fixed at 15% for SMEs (Pymes).
- **Dividend Tax:** Follows the "Base del Ahorro" (19%, 21%, 23%).
- **Sweet Spot Definition:** The salary point where the marginal cost of IRPF exceeds the combined cost of Corporate Tax + Dividend Tax.

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
- `calculateIRPF()`: A loop-based function to handle progressive tax brackets correctly.
- `calculateSavingsTax()`: Logic for dividend taxation.
- `calculateOptimalSalaryForMinTaxes()`: Finds the salary that minimizes total taxes.
- `calculateAutonomoSocietarioScenario()`: Calculates the optimal split between autónomo and SL revenue.
- Chart.js is loaded from CDN and charts are generated dynamically on page load.

## Instructions for the AI
When modifying this code, always ensure the progressive nature of the taxes is preserved. Do not apply a single percentage to the total amount. Any change in the revenue range should automatically trigger a recalculation of the "Sweet Spot" when the page loads. All calculations happen client-side in the browser.
