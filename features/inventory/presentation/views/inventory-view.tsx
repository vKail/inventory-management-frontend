// features/inventory/presentation/views/inventory-view.tsx
"use client";

import { useEffect, useState } from "react";
import { InventoryCard } from "../components/inventory-card";
import { InventoryFilterBar } from "../components/inventory-filter-bar";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { InventoryListItem } from "../components/inventory-list-item";
import { InventoryTableView } from "../components/inventory-table-view";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Table, ArrowDownUp, Plus } from "lucide-react";
import { useNavigateToAddProduct } from "@/features/inventory/hooks/use-navigate-to-add-product";

export const InventoryView = () => {
  const {
    filteredItems,
    isLoading,
    error,
    fetchItems,
  } = useInventoryStore();

  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const { navigateToAddProduct } = useNavigateToAddProduct();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (isLoading) return <div>Cargando inventario...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos en Inventario</h1>
        
        <div className="flex items-center gap-2">
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid2X2 size={18} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List size={18} />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <Table size={18} />
            </Button>
          </div>
          
          <Button 
            onClick={navigateToAddProduct}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Registrar Producto</span>
          </Button>
        </div>
      </div>

      <InventoryFilterBar
        onFilterChange={(newFilters) => {
          useInventoryStore.getState().setFilters(newFilters);
          useInventoryStore.getState().applyFilters();
        }}
        onClear={() => useInventoryStore.getState().clearFilters()}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === 'table' ? (
        <InventoryTableView
          items={filteredItems}
          onViewClick={(item) => console.log("Ver detalles", item)}
          onLoanClick={(item) => console.log("Solicitar", item)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <InventoryCard 
              key={item.id} 
              item={item}
              onViewClick={() => console.log("Ver detalles", item)}
              onLoanClick={() => console.log("Solicitar", item)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <InventoryListItem 
              key={item.id} 
              product={item} 
              viewMode={viewMode} 
            />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No se encontraron productos que coincidan con los filtros
          </p>
        </div>
      )}
    </div>
  );
};