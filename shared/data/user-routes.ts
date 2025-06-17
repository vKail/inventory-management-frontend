import { UserRole } from '@/features/users/data/enums/user-roles.enums';

export const userRoutes = {
  '/(dashboard)/inventory/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/loans/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/categories/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/users/:path': [UserRole.ADMIN],
  '/(dashboard)/colors/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/conditions/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/items-types/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/locations/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/materials/:path': [UserRole.ADMIN, UserRole.MANAGER],
  '/(dashboard)/states/:path': [UserRole.ADMIN, UserRole.MANAGER],
};
