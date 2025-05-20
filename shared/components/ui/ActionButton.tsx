// shared/components/ui/ActionButton.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: ReactNode;
  onClick: () => void;
  variant?: 'edit' | 'delete' | 'view';
  className?: string;
}

export function ActionButton({
  icon,
  onClick,
  variant = 'edit',
  className
}: ActionButtonProps) {
  const variantClasses = {
    edit: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
    delete: 'text-red-600 hover:text-red-800 hover:bg-red-50',
    view: 'text-green-600 hover:text-green-800 hover:bg-green-50'
  };

  return (
    <button
      className={cn(
        'p-1 rounded transition-colors',
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}