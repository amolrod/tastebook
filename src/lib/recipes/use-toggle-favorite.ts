import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RecipeRecord } from '@/lib/supabase/types';

interface ToggleFavoriteInput {
  id: string;
}

interface ToggleFavoriteResponse {
  recipe: RecipeRecord;
}

async function toggleFavorite(input: ToggleFavoriteInput): Promise<RecipeRecord> {
  const response = await fetch(`/api/recipes/${input.id}/favorite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorData.error || 'Error al actualizar favorito');
  }

  const result: ToggleFavoriteResponse = await response.json();
  return result.recipe;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (variables) => {
      // Cancelar queries en curso para evitar que sobrescriban la actualización optimista
      await queryClient.cancelQueries({ queryKey: ['recipes'] });
      await queryClient.cancelQueries({ queryKey: ['recipe', variables.id] });

      // Snapshot del estado anterior
      const previousRecipes = queryClient.getQueryData(['recipes']);
      const previousRecipe = queryClient.getQueryData(['recipe', variables.id]);

      // Actualización optimista en la lista
      queryClient.setQueryData(['recipes'], (old: unknown) => {
        if (!old) return old;
        const recipes = (old as { recipes?: RecipeRecord[] }).recipes || (old as RecipeRecord[]);
        if (!Array.isArray(recipes)) return old;

        return recipes.map((recipe: RecipeRecord) =>
          recipe.id === variables.id ? { ...recipe, is_favorite: !recipe.is_favorite } : recipe
        );
      });

      // Actualización optimista en el detalle
      queryClient.setQueryData(['recipe', variables.id], (old: RecipeRecord | undefined) => {
        if (!old) return old;
        return { ...old, is_favorite: !old.is_favorite };
      });

      return { previousRecipes, previousRecipe };
    },
    onError: (error, variables, context) => {
      // Rollback en caso de error
      if (context?.previousRecipes) {
        queryClient.setQueryData(['recipes'], context.previousRecipes);
      }
      if (context?.previousRecipe) {
        queryClient.setQueryData(['recipe', variables.id], context.previousRecipe);
      }
    },
    onSuccess: (updatedRecipe) => {
      // Invalidar para refrescar con datos del servidor
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', updatedRecipe.id] });
    }
  });
}
