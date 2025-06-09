"use client";

import { useEffect, useState } from "react";
import { InventoryCard } from "../components/inventory-card";
import { InventoryFilterBar } from "../components/inventory-filter-bar";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { InventoryListItem } from "../components/inventory-list-item";
import { InventoryTableView } from "../components/inventory-table-view";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Table as TableIcon, Plus, Barcode, PackageSearch } from "lucide-react";
import { useNavigateToAddProduct } from "@/features/inventory/hooks/use-navigate-to-add-product";
import { ScanProductModal } from "../components/scan-product-modal";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { toast } from "sonner";
import Loader from "@/shared/components/ui/Loader";
import { InventoryDetailsModal } from "../components/inventory-details-modal";
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { InventoryPaginator } from "../components/inventory-paginator";

export const InventoryView = () => {
  const store = useInventoryStore();
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { navigateToAddProduct } = useNavigateToAddProduct();

  useEffect(() => {
    store.getInventoryItems(1);
  }, []);

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const handleViewModeChange = (mode: "table" | "list" | "grid") => {
    store.setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    store.setPage(page);
  };

  const handleScan = () => {
    setScanModalOpen(true);
  };

  const handleScanResult = async (product: InventoryItem) => {
    setScanModalOpen(false);
    store.setSelectedItem(product);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    store.setSelectedItem(null);
  };

  if (store.error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Error al cargar el inventario</p>
          <p className="text-muted-foreground">{store.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">Operaciones</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/inventory">Productos en Inventario</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <div className="flex items-center gap-2">
          <div className="border rounded-md flex">
            <Button
              variant={store.viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleViewModeChange("table")}
              className="rounded-r-none"
            >
              <TableIcon size={18} />
            </Button>
            <Button
              variant={store.viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleViewModeChange("list")}
              className="rounded-none"
            >
              <List size={18} />
            </Button>
            <Button
              variant={store.viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleViewModeChange("grid")}
              className="rounded-l-none"
            >
              <Grid2X2 size={18} />
            </Button>
          </div>
          <Button
            onClick={() => handleScan()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Barcode size={18} />
            <span>Escanear</span>
          </Button>
          <Button
            onClick={navigateToAddProduct}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Registrar Producto</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full py-2 bg-white p-4 rounded-lg border shadow-sm">
        <InventoryFilterBar
          onFilterChange={(newFilters) => {
            store.setFilters(newFilters);
            store.applyFilters();
          }}
          onClear={() => store.clearFilters()}
        />
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        {store.viewMode === "table" && (
          <InventoryTableView
            items={store.filteredItems ?? []}
            onViewDetails={handleViewDetails}
          />
        )}

        {store.viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(store.filteredItems ?? []).map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onViewClick={() => handleViewDetails(item)}
              />
            ))}
          </div>
        )}

        {store.viewMode === "list" && (
          <div className="space-y-4">
            {(store.filteredItems ?? []).map((item) => (
              <InventoryListItem
                key={item.id}
                product={item}
                onViewClick={() => handleViewDetails(item)}
              />
            ))}
          </div>
        )}

        {(store.filteredItems?.length ?? 0) === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {(store.items?.length ?? 0) === 0
                ? "No hay productos en el inventario."
                : "No se encontraron productos que coincidan con los filtros."}
            </p>
          </div>
        )}

        {store.totalPages > 0 && (
          <div className="mt-6">
            <InventoryPaginator
              currentPage={store.currentPage}
              totalPages={store.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <ScanProductModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onEdit={handleScanResult}
      />

      <InventoryDetailsModal
        isOpen={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        product={store.selectedItem}
      />
    </div>
  );
};