"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const DepreciationForm = () => {
  const [usefulLife, setUsefulLife] = useState(0);
  const [depreciation, setDepreciation] = useState(0.00);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vida Útil (años)</TableHead>
              <TableHead>Depreciación (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input
                  type="number"
                  value={usefulLife}
                  onChange={(e) => setUsefulLife(Number(e.target.value))}
                  min="0"
                  placeholder="Ingrese la vida útil"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={depreciation}
                  onChange={(e) => setDepreciation(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  placeholder="Ingrese el porcentaje"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-red-600 hover:bg-red-700"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};