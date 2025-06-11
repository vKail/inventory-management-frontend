// shared/components/layout/PageHeader.tsx
import { Button } from '@/shared/components/ui/Button';
import { PlusIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      {action && (
        <a href={action.href}>
          <Button>
            <PlusIcon size={16} className="mr-2" />
            {action.label}
          </Button>
        </a>
      )}
    </div>
  );
}