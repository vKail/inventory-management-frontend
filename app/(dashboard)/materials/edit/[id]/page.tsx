import EditMaterialView from "@/features/materials/presentation/views/EditMaterialView";

interface Props {
  params: {
    id: string;
  };
}

export default function EditMaterialPage({ params }: Props) {
  return <EditMaterialView materialId={params.id} />;
}
