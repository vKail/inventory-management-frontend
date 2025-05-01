import { useState, useEffect } from "react";
import { LoanCard } from "@/features/loans/presentation/components/loancard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ArrowDownUp, Grid2X2, List, Plus, Table } from "lucide-react";
import { UserRole, Loan, Product, User } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Datos de ejemplo para el prototipo
const demoLoans: Loan[] = [
  {
    id: "L001",
    productId: "1",
    product: {
      id: "1",
      barcode: "TEC-001",
      name: "MacBook Pro 16''",
      category: "technology",
      department: "computing",
      quantity: 5,
      status: "available",
      description: "MacBook Pro con chip M1 Pro, 16GB RAM, 512GB SSD",
      cost: 2499.99,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product,
    userId: "U001",
    user: {
      id: "U001",
      name: "Carlos Méndez",
      email: "cmendez@universidad.edu",
      role: UserRole.STUDENT,
      studentId: "A12345"
    } as User,
    startDate: new Date("2023-04-12"),
    dueDate: new Date("2023-04-19"),
    status: "active"
  },
  {
    id: "L002",
    productId: "2",
    product: {
      id: "2",
      barcode: "TEC-002",
      name: "Monitor Dell UltraSharp 27''",
      category: "electronics",
      department: "computing",
      quantity: 8,
      status: "available",
      description: "Monitor 4K IPS con USB-C",
      cost: 549.99,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product,
    userId: "U002",
    user: {
      id: "U002",
      name: "María Rodríguez",
      email: "mrodriguez@universidad.edu",
      role: UserRole.STUDENT,
      studentId: "A23456"
    } as User,
    startDate: new Date("2023-04-10"),
    dueDate: new Date("2023-04-17"),
    returnDate: new Date("2023-04-16"),
    status: "returned"
  },
  {
    id: "L003",
    productId: "3",
    product: {
      id: "3",
      barcode: "TEC-003",
      name: "Arduino Starter Kit",
      category: "electronics",
      department: "electronics",
      quantity: 15,
      status: "in_use",
      description: "Kit completo para principiantes con Arduino UNO",
      cost: 89.99,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product,
    userId: "U003",
    user: {
      id: "U003",
      name: "Juan Pérez",
      email: "jperez@universidad.edu",
      role: UserRole.STUDENT,
      studentId: "A34567"
    } as User,
    startDate: new Date("2023-04-08"),
    dueDate: new Date("2023-04-15"),
    status: "overdue"
  },
  {
    id: "L004",
    productId: "4",
    product: {
      id: "4",
      barcode: "TEC-004",
      name: "Raspberry Pi 4",
      category: "technology",
      department: "computing",
      quantity: 10,
      status: "available",
      description: "Raspberry Pi 4 Model B, 8GB RAM",
      cost: 75.99,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product,
    userId: "U004",
    user: {
      id: "U004",
      name: "Ana López",
      email: "alopez@universidad.edu",
      role: UserRole.TEACHER,
      department: "computing"
    } as User,
    startDate: new Date("2023-04-12"),
    dueDate: new Date("2023-04-26"),
    status: "active"
  }
];

export default function Loans() {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [allLoans, setAllLoans] = useState<Loan[]>(demoLoans);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>(demoLoans);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole;
    if (storedRole) {
      setUserRole(storedRole);
    }

    // En una app real, aquí cargaríamos los préstamos del usuario o todos los préstamos si es admin
    // Por ahora usamos los datos de ejemplo
  }, []);

  useEffect(() => {
    filterLoans(activeTab, searchQuery);
  }, [activeTab, searchQuery, allLoans]);

  const filterLoans = (tab: string, query: string) => {
    let filtered = [...allLoans];

    // Filtrar por estado
    if (tab !== "all") {
      filtered = filtered.filter(loan => loan.status === tab);
    }

    // Filtrar por búsqueda
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        loan => 
          loan.product?.name.toLowerCase().includes(lowerQuery) ||
          loan.product?.barcode.toLowerCase().includes(lowerQuery) ||
          loan.user?.name.toLowerCase().includes(lowerQuery) ||
          loan.user?.studentId?.toLowerCase().includes(lowerQuery) ||
          loan.id.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredLoans(filtered);
  };

  const handleReturn = (loan: Loan) => {
    // En una app real, aquí actualizaríamos el estado del préstamo
    const updatedLoans = allLoans.map(l => {
      if (l.id === loan.id) {
        return {
          ...l,
          status: "returned" as "active" | "returned" | "overdue",
          returnDate: new Date()
        };
      }
      return l;
    });
    
    setAllLoans(updatedLoans);
    alert(`Producto ${loan.product?.name} marcado como devuelto correctamente.`);
  };

  const renderGridView = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filteredLoans.map(loan => (
        <LoanCard
          key={loan.id}
          loan={loan}
          onReturnClick={handleReturn}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredLoans.map(loan => (
        <div key={loan.id} className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{loan.product?.name}</h3>
              <p className="text-sm text-gray-500">Código: {loan.product?.barcode}</p>
              <p className="text-sm">Usuario: {loan.user?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Inicio: {loan.startDate.toLocaleDateString()}</p>
              <p className="text-sm">Vencimiento: {loan.dueDate.toLocaleDateString()}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReturn(loan)}
                className="mt-2"
              >
                Devolver
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="border rounded-lg">
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLoans.map(loan => (
            <TableRow key={loan.id}>
              <TableCell>{loan.product?.name}</TableCell>
              <TableCell>{loan.product?.barcode}</TableCell>
              <TableCell>{loan.user?.name}</TableCell>
              <TableCell>{loan.startDate.toLocaleDateString()}</TableCell>
              <TableCell>{loan.dueDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  loan.status === 'active' ? 'bg-green-100 text-green-800' :
                  loan.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {loan.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReturn(loan)}
                >
                  Devolver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );

  return (
    <MainLayout title="Préstamos" userRole={userRole}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestión de préstamos</h2>
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

            {userRole === UserRole.ADMIN && (
              <Button onClick={() => navigate("/loans/new")} className="flex items-center gap-2">
                <Plus size={18} />
                <span>Registrar préstamo</span>
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-grow relative">
              <Input
                type="search"
                placeholder="Buscar por nombre, código o usuario..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex gap-2">
              <div className="w-40">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Más reciente</SelectItem>
                    <SelectItem value="date-asc">Más antiguo</SelectItem>
                    <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                    <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
              <TabsTrigger value="returned">Devueltos</TabsTrigger>
              <TabsTrigger value="overdue">Vencidos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No se encontraron préstamos que coincidan con los filtros</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {viewMode === "table" && renderTableView()}
          </>
        )}
      </div>
    </MainLayout>
  );
}
