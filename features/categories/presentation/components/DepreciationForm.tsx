"use client";
import React, { useState } from 'react';

export const DepreciationForm = () => {
  const [usefulLife, setUsefulLife] = useState(0);
  const [depreciation, setDepreciation] = useState(0.00);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-2 text-left text-sm font-medium">Vida Útil (años)</th>
              <th className="border px-4 py-2 text-left text-sm font-medium">Depreciación (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={usefulLife}
                  onChange={(e) => setUsefulLife(Number(e.target.value))}
                  min="0"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={depreciation}
                  onChange={(e) => setDepreciation(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
	<div className="flex justify-end">
	<button
		type="button"
		className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
	>
		Guardar
	</button>
	</div>
    </div>
  );
};