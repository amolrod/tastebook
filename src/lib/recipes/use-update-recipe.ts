import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { RecipeRecord } from '@/lib/supabase/types';

interface UpdateRecipeInput {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  servings?: number | null;
  duration_minutes: number;
  tags: string[];
}

interface UpdateRecipeResponse {
  recipe: RecipeRecord;
}

interface UpdateRecipeError {
  error: string;
  details?: Array<{ path: string; message: string }>;
}

async function updateRecipe(input: UpdateRecipeInput): Promise<RecipeRecord> {
  const { id, ...data } = input;

  const response = await fetch(`/api/recipes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData: UpdateRecipeError = await response.json();
    throw new Error(errorData.error || 'Error al actualizar receta');
  }

  const result: UpdateRecipeResponse = await response.json();
  return result.recipe;
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: (updatedRecipe) => {
      // Invalidar cache de lista de recetas
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      // Invalidar cache de la receta específica
      queryClient.invalidateQueries({ queryKey: ['recipe', updatedRecipe.id] });

      toast.success('Cambios guardados');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al guardar los cambios');
    }
  });
}
