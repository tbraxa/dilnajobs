"use client";

import { useMemo, useState } from "react";

function money(value: number) {
  return `${new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(value)} Kč`;
}

export function NetSalaryCalculator() {
  const [gross, setGross] = useState(45000);

  const calculation = useMemo(() => {
    const safeGross = Math.max(0, Number.isFinite(gross) ? gross : 0);
    const social = Math.round(safeGross * 0.071);
    const health = Math.round(safeGross * 0.045);
    const taxBeforeCredit = Math.round(safeGross * 0.15);
    const tax = Math.max(0, taxBeforeCredit - 2570);
    return {
      social,
      health,
      tax,
      net: Math.max(0, safeGross - social - health - tax),
    };
  }, [gross]);

  return (
    <div className="fj-live-calculator">
      <label className="fj-form-field">
        <span>Hrubá měsíční mzda</span>
        <input
          type="number"
          min="0"
          step="500"
          value={gross}
          onChange={(event) => setGross(Number(event.target.value))}
          inputMode="numeric"
        />
      </label>
      <div className="fj-live-calculator-result">
        <span>Orientační čistá mzda</span>
        <strong>{money(calculation.net)}</strong>
      </div>
      <dl>
        <div><dt>Sociální pojištění</dt><dd>{money(calculation.social)}</dd></div>
        <div><dt>Zdravotní pojištění</dt><dd>{money(calculation.health)}</dd></div>
        <div><dt>Daň po základní slevě</dt><dd>{money(calculation.tax)}</dd></div>
      </dl>
      <p>Orientační výpočet pro zaměstnance se základní slevou na poplatníka. Nejde o daňové poradenství.</p>
    </div>
  );
}
