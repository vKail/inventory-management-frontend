import { type FC } from 'react';
import CategoryFormView from '@/features/categories/presentation/views/category-form-view';

interface PageProps {
  params: {
    id: string;
  };
}

const CategoryFormEdit: FC<PageProps> = ({ params }) => {
  return <CategoryFormView id={params.id} />;
};

export default CategoryFormEdit;
