import { UserRole } from '@/features/users/data/enums/user-roles.enums';
import {
  Barcode,
  Boxes,
  CirclePlus,
  Home,
  List,
  MapPin,
  Package,
  PackageSearch,
  Palette,
  ShieldCheck,
  Tag,
  User,
  Users,
  Warehouse,
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
            title: 'Nuevo bien',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/inventory/add-product',
          },
        ],
      },
      {
        title: 'Prestamos',
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
            title: 'Nuevo prestamo',
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
            title: 'Nuevo usuario',
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
            title: 'Nueva categoría',
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
            title: 'Nueva color',
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
            title: 'Nueva condición',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/conditions/new',
          },
        ],
      },
      {
        title: 'Tipos de items',
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
            title: 'Nuevo tipo de item',
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
            title: 'Nueva ubicación',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/locations/new',
          },
        ],
      },
      {
        title: 'Almacenes',
        icon: Warehouse,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/warehouses',
          },
          {
            title: 'Nuevo almacén',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/warehouses/new',
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
            title: 'Nuevo material',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/materials/new',
          },
        ],
      },

      {
        title: 'Estados',
        icon: Package,
        roles: [UserRole.ADMIN, UserRole.TEACHER],
        subItems: [
          {
            title: 'Listar',
            icon: List,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/states',
          },
          {
            title: 'Nuevo estado',
            icon: CirclePlus,
            roles: [UserRole.ADMIN, UserRole.TEACHER],
            href: '/states/new',
          },
        ],
      },
    ],
  },
];
