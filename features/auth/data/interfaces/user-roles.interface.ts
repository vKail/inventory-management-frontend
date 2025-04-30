import { Department } from "@/features/departments/data/enums/department.enum";
import { UserRole } from "@/features/users/data/enums/user-roles.enums";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  studentId?: string;
}
