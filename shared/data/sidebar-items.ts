import { UserRole } from '@/features/users/data/enums/user-roles.enums';
import {
  Boxes,
  CirclePlus,
  List,
  MapPin,
  Package,
  PackageSearch,
  Palette,
  ShieldCheck,
  Tag,
  User,
  Users,
  AlertCircle,
  File,
} from 'lucide-react';

export const sidebarItems = [
  {
    group: 'Operaciones',
    items: [
      {
        title: 'Inventario',
        icon: PackageSearch,
        roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
            href: '/inventory',
          },
          {
            title: 'Nuevo Item',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/inventory/new',
          },
        ],
      },
      {
        title: 'Préstamos',
        icon: Users,
        roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
            href: '/loans',
          },
          {
            title: 'Nuevo Préstamo',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/loans/new',
          },
        ],
      },
    ],
  },
  {
    group: 'Administración',
    items: [
      {
        title: 'Usuarios',
        icon: User,
        roles: [UserRole.ADMIN],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN],
            href: '/users',
          },
          {
            title: 'Nuevo Usuario',
            icon: CirclePlus,
            roles: [UserRole.ADMIN],
            href: '/users/new',
          },
        ],
      },
    ],
  },
  {
    group: 'Configuración',
    items: [
      {
        title: 'Categorías',
        icon: Tag,
        roles: [UserRole.ADMIN],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN],
            href: '/categories',
          },
          {
            title: 'Nueva Categoría',
            icon: CirclePlus,
            roles: [UserRole.ADMIN],
            href: '/categories/new',
          },
        ],
      },
      {
        title: 'Colores',
        icon: Palette,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/colors',
          },
          {
            title: 'Nuevo Color',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/colors/new',
          },
        ],
      },
      {
        title: 'Condiciones',
        icon: ShieldCheck,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/conditions',
          },
          {
            title: 'Nueva Condición',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/conditions/new',
          },
        ],
      },
      {
        title: 'Tipos de items',
        icon: Boxes,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/item-types',
          },
          {
            title: 'Nuevo Tipo de item',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/item-types/new',
          },
        ],
      },
      {
        title: 'Ubicaciones',
        icon: MapPin,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/locations',
          },
          {
            title: 'Nueva Ubicación',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/locations/new',
          },
        ],
      },
      {
        title: 'Actas',
        icon: File,
        roles: [UserRole.ADMIN],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN],
            href: '/certificates',
          },
          {
            title: 'Nueva Acta',
            icon: CirclePlus,
            roles: [UserRole.ADMIN],
            href: '/certificates/new',
          },
        ],
      },
      {
        title: 'Materiales',
        icon: Package,
        roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
            href: '/materials',
          },
          {
            title: 'Nuevo Material',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/materials/new',
          },
        ],
      },
      {
        title: 'Estados',
        icon: AlertCircle,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/states',
          },
          {
            title: 'Nuevo Estado',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/states/new',
          },
        ],
      },
    ],
  },
];
