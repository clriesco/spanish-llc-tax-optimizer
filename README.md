# SL Tax Optimizer 2026 📈

Este proyecto es una herramienta de simulación fiscal diseñada para encontrar el **"Punto Dulce" (Sweet Spot)** entre el Salario (IRPF) y el reparto de Dividendos (IS + Ahorro) para socios de Sociedades Limitadas en España.

## Características

- **Cálculo Preciso:** Utiliza los tramos de IRPF 2025/2026 (Estatal + Autonómico).
- **Optimización de Sociedades:** Calcula el impacto del 15% de Impuesto de Sociedades y la base del ahorro en dividendos.
- **Visualización:** Genera automáticamente un archivo `index.html` con una gráfica interactiva de **Chart.js**.
- **Salario Mínimo:** La simulación comienza desde el salario mínimo interprofesional (16.576€ en 2026).

## Instalación

Requiere [Node.js](https://nodejs.org/) instalado (versión 16 o superior recomendada).

1. Clonar o descargar el proyecto:
   ```bash
   git clone https://github.com/clriesco/spanish-llc-tax-optimizer
   cd spanish-llc-tax-optimizer
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

   Esto instalará automáticamente:
   - `typescript` - Compilador de TypeScript
   - `ts-node` - Ejecutor de TypeScript para Node.js
   - `@types/node` - Definiciones de tipos para Node.js

## Configuración

Antes de ejecutar el programa, debes configurar las variables según tu situación fiscal. Abre el archivo `src/index.ts` y modifica las siguientes constantes al principio del archivo:

```typescript
const REVENUE = 50000;        // Ingresos totales de la empresa (en euros)
const EXPENSES = 1000;         // Gastos deducibles (en euros)
const SALARY_STEP = 1000;      // Incremento del salario para la simulación (en euros)
const CORPORATE_TAX_RATE = 0.15; // Tipo de Impuesto de Sociedades (15% para nuevas empresas, 23% para establecidas)
```

### Variables de Configuración

- **REVENUE**: Ingresos totales anuales de tu Sociedad Limitada (en euros).
- **EXPENSES**: Gastos deducibles anuales de la empresa (en euros).
- **SALARY_STEP**: Incremento del salario para cada punto de la simulación. Un valor menor (ej: 500) dará más precisión pero generará más puntos en la gráfica.
- **CORPORATE_TAX_RATE**: Tipo de Impuesto de Sociedades aplicable:
  - `0.15` (15%) - Para nuevas empresas durante los primeros años
  - `0.23` (23%) - Tipo general para empresas establecidas

## Uso

1. **Configura las variables** en `src/index.ts` según tu situación (ver sección anterior).

2. **Ejecuta el programa**:
   ```bash
   npm start
   ```
   
   O alternativamente:
   ```bash
   ts-node src/index.ts
   ```

3. **Abre el archivo generado**:
   El programa generará un archivo `index.html` en la raíz del proyecto. Ábrelo en tu navegador:
   ```bash
   open index.html
   ```
   
   O simplemente haz doble clic en el archivo `index.html` desde tu explorador de archivos.

4. **Analiza los resultados**:
   - La gráfica muestra tres líneas:
     - **IRPF (Salario)**: Impuesto sobre la renta según el salario
     - **IS + Impuesto Dividendos**: Suma de Impuesto de Sociedades e impuesto sobre dividendos
     - **TOTAL IMPUESTOS**: Suma total de todos los impuestos
   - El **Punto Óptimo (Sweet Spot)** se muestra destacado y representa el salario que minimiza el total de impuestos.

## Cómo Interpretar los Resultados

El "Punto Dulce" (Sweet Spot) es el salario donde la suma de todos los impuestos (IRPF + IS + Impuesto sobre Dividendos) es mínima. 

- **Salarios bajos**: Más beneficios empresariales → más IS y más impuesto sobre dividendos
- **Salarios altos**: Menos beneficios empresariales pero más IRPF (progresivo)
- **Punto Óptimo**: El equilibrio donde el coste marginal de aumentar el salario (IRPF) iguala o supera el ahorro de reducir beneficios (IS + Dividendos)

## Estructura del Proyecto

```
spanish-llc-tax-optimizer/
├── src/
│   └── index.ts          # Código principal con la lógica de cálculo
├── index.html             # Archivo generado con la visualización (se crea al ejecutar)
├── package.json           # Dependencias y scripts del proyecto
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Este archivo
```

## Requisitos Técnicos

- Node.js 16+ 
- npm o yarn
- Navegador web moderno (para visualizar el HTML generado)

## Notas Importantes

- Los cálculos están basados en la legislación fiscal española para 2025/2026.
- Los tramos de IRPF incluyen las tasas estatales y autonómicas combinadas.
- El salario mínimo considerado es de 16.576€ anuales (2026).
- Este es un **simulador** y no constituye asesoramiento fiscal profesional. Consulta con un asesor fiscal para decisiones importantes.

## Solución de Problemas

### Error: "Cannot find module 'fs'"
Ejecuta `npm install` para instalar las dependencias necesarias.

### La gráfica no se muestra correctamente
Asegúrate de tener conexión a internet, ya que Chart.js se carga desde un CDN.

### Los resultados no parecen correctos
Verifica que las variables `REVENUE` y `EXPENSES` estén correctamente configuradas en `src/index.ts`.

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
