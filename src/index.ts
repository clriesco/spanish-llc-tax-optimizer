import * as fs from "fs";

const REVENUE = 50000;
const EXPENSES = 1000;
const SALARY_STEP = 1000;

/**
 * Corporate tax rate for SMEs (Small and Medium Enterprises) in Spain.
 */
const CORPORATE_TAX_RATE = 0.15;

/**
 * Minimum annual salary in Spain (2026).
 */
const MINIMUM_SALARY = 16576;

/**
 * Represents a tax bracket with an upper limit and corresponding tax rate.
 * @interface TaxBracket
 */
interface TaxBracket {
  /** Upper limit of the tax bracket in euros */
  limit: number;
  /** Tax rate as a decimal (e.g., 0.18 for 18%) */
  rate: number;
}

/**
 * Represents the result of a tax calculation for a given salary.
 * @interface TaxCalculationResult
 */
interface TaxCalculationResult {
  /** Salary amount in euros */
  salary: number;
  /** Income tax (IRPF) amount in euros */
  irpf: number;
  /** Corporate tax (IS) amount in euros */
  corporateTax: number;
  /** Dividend tax amount in euros */
  dividendTax: number;
  /** Sum of corporate tax and dividend tax */
  citAndDiv: number;
  /** Total tax burden (IRPF + Corporate Tax + Dividend Tax) */
  total: number;
}

/**
 * IRPF tax brackets for 2025/2026 (State + Regional rates combined).
 * These brackets follow a progressive tax system where each portion of income
 * is taxed at its corresponding bracket rate.
 */
const IRPF_BRACKETS: TaxBracket[] = [
  { limit: 12450, rate: 0.18 },
  { limit: 13362, rate: 0.205 },
  { limit: 19004, rate: 0.227 },
  { limit: 20200, rate: 0.248 },
  { limit: 35200, rate: 0.278 },
  { limit: 35425, rate: 0.313 },
  { limit: 57320, rate: 0.359 },
  { limit: 60000, rate: 0.39 },
  { limit: 300000, rate: 0.43 },
  { limit: Infinity, rate: 0.45 },
];

/**
 * Savings tax brackets for dividends (Base del Ahorro).
 * - First 6,000€: 19%
 * - 6,001€ to 50,000€: 21%
 * - Above 50,000€: 23%
 */
const SAVINGS_TAX_BRACKETS = {
  FIRST_BRACKET_LIMIT: 6000,
  FIRST_BRACKET_RATE: 0.19,
  SECOND_BRACKET_LIMIT: 50000,
  SECOND_BRACKET_RATE: 0.21,
  THIRD_BRACKET_RATE: 0.23,
};

/**
 * Calculates the progressive income tax (IRPF) for a given salary.
 * This function correctly applies the progressive bracket system where each
 * portion of income is taxed at its corresponding bracket rate.
 *
 * @param {number} salary - The salary amount in euros
 * @returns {number} The total IRPF tax amount in euros
 */
function calculateIRPF(salary: number): number {
  if (salary <= 0) return 0;

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of IRPF_BRACKETS) {
    if (salary > bracket.limit) {
      // Apply the bracket rate to the full bracket range
      tax += (bracket.limit - previousLimit) * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      // Apply the bracket rate to the remaining amount
      tax += (salary - previousLimit) * bracket.rate;
      break;
    }
  }
  return Math.round(tax * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculates the savings tax (Base del Ahorro) for dividend income.
 * This follows the progressive bracket system for dividend taxation.
 *
 * @param {number} amount - The dividend amount in euros
 * @returns {number} The total savings tax amount in euros
 */
function calculateSavingsTax(amount: number): number {
  if (amount <= 0) return 0;

  const {
    FIRST_BRACKET_LIMIT,
    FIRST_BRACKET_RATE,
    SECOND_BRACKET_LIMIT,
    SECOND_BRACKET_RATE,
    THIRD_BRACKET_RATE,
  } = SAVINGS_TAX_BRACKETS;

  if (amount <= FIRST_BRACKET_LIMIT) {
    return amount * FIRST_BRACKET_RATE;
  }

  if (amount <= SECOND_BRACKET_LIMIT) {
    return (
      FIRST_BRACKET_LIMIT * FIRST_BRACKET_RATE +
      (amount - FIRST_BRACKET_LIMIT) * SECOND_BRACKET_RATE
    );
  }

  return (
    FIRST_BRACKET_LIMIT * FIRST_BRACKET_RATE +
    (SECOND_BRACKET_LIMIT - FIRST_BRACKET_LIMIT) * SECOND_BRACKET_RATE +
    (amount - SECOND_BRACKET_LIMIT) * THIRD_BRACKET_RATE
  );
}

/**
 * Formats a number as currency with thousand separators.
 *
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates all tax scenarios for different salary levels.
 *
 * @param {number} revenue - Total revenue in euros
 * @param {number} expenses - Total expenses in euros
 * @param {number} step - Salary increment step in euros (default: 1000)
 * @param {number} minSalary - Minimum salary to start calculations from (default: MINIMUM_SALARY)
 * @returns {TaxCalculationResult[]} Array of tax calculation results
 */
function calculateTaxScenarios(
  revenue: number,
  expenses: number,
  step: number = 1000,
  minSalary: number = MINIMUM_SALARY
): TaxCalculationResult[] {
  const netBeforeTax = revenue - expenses;
  const results: TaxCalculationResult[] = [];

  // Start from minimum salary and ensure we don't exceed net before tax
  const startSalary = Math.max(minSalary, 0);
  const maxSalary = netBeforeTax;

  for (let salary = startSalary; salary <= maxSalary; salary += step) {
    const irpf = calculateIRPF(salary);
    const profitBeforeIS = netBeforeTax - salary;
    const corporateTax = profitBeforeIS * CORPORATE_TAX_RATE;
    const dividends = profitBeforeIS - corporateTax;
    const dividendTax = calculateSavingsTax(dividends);

    results.push({
      salary,
      irpf,
      corporateTax: Math.round(corporateTax * 100) / 100,
      dividendTax: Math.round(dividendTax * 100) / 100,
      citAndDiv: Math.round((corporateTax + dividendTax) * 100) / 100,
      total: Math.round((irpf + corporateTax + dividendTax) * 100) / 100,
    });
  }

  return results;
}

/**
 * Finds the salary level that minimizes the total tax burden.
 *
 * @param {TaxCalculationResult[]} results - Array of tax calculation results
 * @returns {TaxCalculationResult} The result with the minimum total tax
 */
function findSweetSpot(results: TaxCalculationResult[]): TaxCalculationResult {
  if (results.length === 0) {
    throw new Error("No results provided to find sweet spot");
  }

  return results.reduce(
    (min, r) => (r.total < min.total ? r : min),
    results[0]
  );
}

/**
 * Generates an HTML file with an interactive Chart.js visualization.
 *
 * @param {TaxCalculationResult[]} results - Array of tax calculation results
 * @param {TaxCalculationResult} sweetSpot - The optimal salary point
 * @param {number} revenue - Total revenue for display
 * @param {number} expenses - Total expenses for display
 * @returns {string} HTML content as a string
 */
function generateHTML(
  results: TaxCalculationResult[],
  sweetSpot: TaxCalculationResult,
  revenue: number,
  expenses: number
): string {
  const netBeforeTax = revenue - expenses;
  const salaryLabels = results.map((r) => r.salary);
  const irpfData = results.map((r) => r.irpf);
  const citAndDivData = results.map((r) => r.citAndDiv);
  const totalData = results.map((r) => r.total);

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Sweet Spot Optimizer 2026</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 30px;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 2em;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9em;
        }
        .info-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .info-item {
            text-align: center;
        }
        .info-label {
            font-size: 0.85em;
            color: #666;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 1.3em;
            font-weight: bold;
            color: #333;
        }
        .sweet-spot {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #4bc0c0 0%, #44a08d 100%);
            border-radius: 8px;
            color: white;
        }
        .sweet-spot h2 {
            font-size: 1.5em;
            margin-bottom: 10px;
        }
        .sweet-spot .salary {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .sweet-spot .details {
            font-size: 0.9em;
            opacity: 0.9;
            margin-top: 15px;
        }
        .chart-container {
            position: relative;
            height: 500px;
            margin-top: 30px;
        }
        canvas {
            max-height: 500px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📈 Tax Sweet Spot Optimizer 2026</h1>
        <p class="subtitle">Optimización fiscal para Sociedades Limitadas en España</p>
        
        <div class="info-panel">
            <div class="info-item">
                <div class="info-label">Ingresos</div>
                <div class="info-value">${formatCurrency(revenue)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Gastos</div>
                <div class="info-value">${formatCurrency(expenses)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Beneficio Neto</div>
                <div class="info-value">${formatCurrency(netBeforeTax)}</div>
            </div>
        </div>

        <div class="sweet-spot">
            <h2>💰 Punto Óptimo (Sweet Spot)</h2>
            <div class="salary">${formatCurrency(sweetSpot.salary)}</div>
            <div class="details">
                <div>IRPF: ${formatCurrency(sweetSpot.irpf)}</div>
                <div>IS + Impuesto Dividendos: ${formatCurrency(
                  sweetSpot.citAndDiv
                )}</div>
                <div><strong>Total Impuestos: ${formatCurrency(
                  sweetSpot.total
                )}</strong></div>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="taxChart"></canvas>
        </div>
    </div>

    <script>
        const ctx = document.getElementById('taxChart').getContext('2d');
        const salaryLabels = ${JSON.stringify(salaryLabels)};
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: salaryLabels,
                datasets: [
                    {
                        label: 'IRPF (Salario)',
                        data: ${JSON.stringify(irpfData)},
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'IS + Impuesto Dividendos',
                        data: ${JSON.stringify(citAndDivData)},
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'TOTAL IMPUESTOS',
                        data: ${JSON.stringify(totalData)},
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis de Impuestos por Nivel de Salario',
                        font: {
                            size: 18
                        },
                        padding: 20
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Salario (€)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value, index, ticks) {
                                // Get the actual salary value from labels array
                                // When Chart.js does auto-skip, we need to get the value from the label
                                if (index < salaryLabels.length) {
                                    const salaryValue = salaryLabels[index];
                                    return new Intl.NumberFormat('es-ES', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(salaryValue) + '€';
                                }
                                // Fallback: try to format the value directly
                                if (typeof value === 'number') {
                                    return new Intl.NumberFormat('es-ES', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(value) + '€';
                                }
                                return '';
                            },
                            maxTicksLimit: 20,
                            autoSkip: true,
                            autoSkipPadding: 10
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Impuestos (€)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('es-ES').format(value) + '€';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    </script>
</body>
</html>`;
}

// Main execution

const results = calculateTaxScenarios(REVENUE, EXPENSES, SALARY_STEP);
const sweetSpot = findSweetSpot(results);

const htmlContent = generateHTML(results, sweetSpot, REVENUE, EXPENSES);

try {
  fs.writeFileSync("index.html", htmlContent, "utf-8");
  console.log("✅ Fichero index.html generado exitosamente.");
  console.log(
    `💰 Punto óptimo encontrado: ${formatCurrency(sweetSpot.salary)}`
  );
  console.log(
    `📊 Total de impuestos en el punto óptimo: ${formatCurrency(
      sweetSpot.total
    )}`
  );
  console.log(
    "\n📈 Abre index.html en tu navegador para ver la visualización."
  );
} catch (error) {
  console.error("❌ Error al generar el archivo HTML:", error);
  process.exit(1);
}
