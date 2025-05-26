import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stateService } from '../services/state.service';
import { CreateStateDTO, State, UpdateStateDTO, PaginatedStates } from '../interfaces/state.interface';
import { toast } from 'react-hot-toast';

const initialPaginatedState: PaginatedStates = {
    records: [],
    total: 0,
    limit: 10,
    page: 1,
    pages: 0
};

export const useStates = (page = 1, limit = 10) => {
    const queryClient = useQueryClient();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

    const { data: states = initialPaginatedState, isLoading, error } = useQuery({
        queryKey: ['states', page, limit],
        queryFn: () => stateService.getStates(page, limit),
        initialData: initialPaginatedState,
        retry: 1,
        onError: (error: Error) => {
            toast.error(`Error al cargar los estados: ${error.message}`);
        }
    });

    const { mutate: createState, isLoading: isCreating } = useMutation({
        mutationFn: (newState: CreateStateDTO) => stateService.createState(newState),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            toast.success('Estado creado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(`Error al crear el estado: ${error.message}`);
        },
    });

    const { mutate: updateState, isLoading: isUpdating } = useMutation({
        mutationFn: ({ id, state }: { id: number; state: UpdateStateDTO }) =>
            stateService.updateState(id, state),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            toast.success('Estado actualizado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(`Error al actualizar el estado: ${error.message}`);
        },
    });

    const { mutate: deleteState, isLoading: isDeleting } = useMutation({
        mutationFn: (id: number) => stateService.deleteState(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            toast.success('Estado eliminado exitosamente');
            setIsDeleteModalOpen(false);
            setSelectedStateId(null);
        },
        onError: (error: Error) => {
            toast.error(`Error al eliminar el estado: ${error.message}`);
            setIsDeleteModalOpen(false);
            setSelectedStateId(null);
        },
    });

    const handleDeleteClick = (id: number) => {
        setSelectedStateId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedStateId) {
            deleteState(selectedStateId);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedStateId(null);
    };

    return {
        states,
        isLoading: isLoading || isCreating || isUpdating || isDeleting,
        isDeleting,
        error,
        createState,
        updateState,
        deleteState: handleDeleteClick,
        isDeleteModalOpen,
        handleDeleteConfirm,
        handleDeleteCancel,
    };
}; 