import { UserRole } from '@/features/users/data/enums/user-roles.enums';

export interface JWTPayload {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}
