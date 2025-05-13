'use client';

import { RegisterForm } from '../components/register-form';
import { Card } from '@/components/ui/card';

export const RegisterView = () => {
  return (
    <div className="px-8 py-6">
      <Card className="p-6">
        <RegisterForm />
      </Card>
    </div>
  );
};
