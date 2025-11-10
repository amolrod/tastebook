import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteRecipeInput {
  id: string;
}

async function deleteRecipe(input: DeleteRecipeInput): Promise<void> {
  const response = await fetch(`/api/recipes/${input.id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorData.error || 'Error al eliminar receta');
  }

  // 204 No Content no tiene body
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      // Invalidar cache de lista de recetas
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      // Mostrar toast de éxito
      toast.success('Receta eliminada');
      // Redirigir a la lista de recetas
      router.push('/app');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar la receta');
    }
  });
}
