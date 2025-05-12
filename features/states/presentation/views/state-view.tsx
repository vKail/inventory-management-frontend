"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StateTable from "../components/state-table";
import StateFilter from "../components/state-filter";
import StatePagination from "../components/state-pagination";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStates } from "../../data/services/state.service";

// Mock data (puedes reemplazarlo por llamada a API luego)
interface State {
  id: number;
  name: string;
  description: string;
  requiresMaintenance: boolean;
  active: boolean;
}

export default function StateView() {
  const router = useRouter();
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maintenanceFilter, setMaintenanceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => { 
    async function fetchStates() {
      try {
        setLoading(true);
        const res = await getStates(page, pageSize);
        setStates(res.records);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStates();
  }, [page]);


  const filteredStates = states.filter((state) =>
    (!search ||
      state.name.toLowerCase().includes(search.toLowerCase()) ||
      state.description.toLowerCase().includes(search.toLowerCase())) &&
    (maintenanceFilter === "all" ||
      (maintenanceFilter === "required" && state.requiresMaintenance) ||
      (maintenanceFilter === "not_required" && !state.requiresMaintenance)) &&
    (statusFilter === "all" ||
      (statusFilter === "active" && state.active) ||
      (statusFilter === "inactive" && !state.active))
  );

  const totalPages = Math.max(1, Math.ceil(filteredStates.length / pageSize));
  const paginatedStates = filteredStates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, maintenanceFilter, statusFilter]);

const handleEdit = (id: number) => {
  router.push(`/states/form?id=${id}`);
};


  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este estado?")) {
      setStates(states.filter((state) => state.id !== id));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-6 md:px-12 w-full">
      {/* Breadcrumbs */}
      <div className="mb-2 w-[1200px] mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">
                Configuración
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <AlertCircle className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Estados</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-2xl font-bold tracking-tight">Lista de Estados</h2>
        <p className="text-muted-foreground">
          Todos los estados registrados en el sistema
        </p>
      </div>

      <Card className="w-[1200px] mx-auto">
  <CardHeader className="px-4 md:px-8 pb-0">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <StateFilter
        search={search}
        onSearchChange={setSearch}
        maintenanceFilter={maintenanceFilter}
        onMaintenanceChange={setMaintenanceFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

  
      <Button onClick={() => router.push("/states/form")}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Estado
      </Button>
    </div>
    <hr className="border-t border-muted" />
  </CardHeader>

  <CardContent className="px-4 md:px-8 pb-6">
    <StateTable
      data={paginatedStates}
      loading={loading}
  
      onEdit={(id) => router.push(`/states/form?id=${id}`)}
      onDelete={handleDelete}
    />
    <StatePagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  </CardContent>
</Card>

    </div>
  );
}
