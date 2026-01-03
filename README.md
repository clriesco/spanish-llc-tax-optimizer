# SL Tax Optimizer 2026 📈

Este proyecto es una herramienta de simulación fiscal diseñada para encontrar el **"Punto Dulce" (Sweet Spot)** entre el Salario (IRPF) y el reparto de Dividendos (IS + Ahorro) para socios de Sociedades Limitadas en España.

## Características

- **Cálculo Preciso:** Utiliza los tramos de IRPF 2025/2026 (Estatal + Autonómico).
- **Optimización de Sociedades:** Calcula el impacto del 15% de Impuesto de Sociedades y la base del ahorro en dividendos.
- **Visualización Interactiva:** Gráficas interactivas de **Chart.js** que se generan automáticamente.
- **Sin Instalación:** Funciona directamente en el navegador, no requiere Node.js ni instalación de dependencias.
- **Salario Mínimo:** La simulación comienza desde el salario mínimo interprofesional (16.576€ en 2026).

## Uso

1. **Abre el archivo `index.html`** directamente en tu navegador:
   - Haz doble clic en el archivo `index.html`
   - O arrastra el archivo a tu navegador
   - O abre el archivo desde el menú de tu navegador (Archivo → Abrir)

2. **Configuración (opcional):**
   Si deseas modificar los parámetros de cálculo, edita las constantes al inicio del script en `index.html`:
   ```javascript
   const MIN_REVENUE = 20000;      // Ingresos mínimos a analizar
   const MAX_REVENUE = 120000;      // Ingresos máximos a analizar
   const REVENUE_STEP = 1000;       // Incremento de ingresos para el análisis
   const EXPENSES = 0;              // Gastos deducibles (en euros)
   const SALARY_STEP = 1000;        // Incremento del salario para la simulación
   ```

3. **Analiza los resultados:**
   - La gráfica principal muestra la comparativa entre Autónomo Normal y Autónomo Societario
   - La tabla comparativa muestra escenarios específicos (20.000€, 50.000€, 100.000€)
   - La segunda gráfica muestra el análisis detallado por nivel de salario
   - El **Punto Óptimo (Sweet Spot)** se muestra destacado y representa el salario que minimiza el total de impuestos

## Cómo Interpretar los Resultados

El "Punto Dulce" (Sweet Spot) es el salario donde la suma de todos los impuestos (IRPF + IS + Impuesto sobre Dividendos) es mínima. 

- **Salarios bajos**: Más beneficios empresariales → más IS y más impuesto sobre dividendos
- **Salarios altos**: Menos beneficios empresariales pero más IRPF (progresivo)
- **Punto Óptimo**: El equilibrio donde el coste marginal de aumentar el salario (IRPF) iguala o supera el ahorro de reducir beneficios (IS + Dividendos)

## Estructura del Proyecto

```
trap-focus-tax-optimizer/
├── index.html             # Archivo principal con toda la lógica y visualización
└── README.md              # Este archivo
```

## Requisitos Técnicos

- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Conexión a internet** (para cargar Chart.js desde CDN)

## Notas Importantes

- Los cálculos están basados en la legislación fiscal española para 2025/2026.
- Los tramos de IRPF incluyen las tasas estatales y autonómicas combinadas.
- El salario mínimo considerado es de 16.576€ anuales (2026).
- Este es un **simulador** y no constituye asesoramiento fiscal profesional. Consulta con un asesor fiscal para decisiones importantes.

## Solución de Problemas

### La gráfica no se muestra correctamente
Asegúrate de tener conexión a internet, ya que Chart.js se carga desde un CDN.

### Los resultados no parecen correctos
Verifica que las constantes de configuración en `index.html` estén correctamente ajustadas según tus necesidades.

## Licencia

ISC License

Copyright (c) 2026 - Charly López

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
