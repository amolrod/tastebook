'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useDeleteRecipe } from '@/lib/recipes/use-delete-recipe';
import type { RecipeRecord } from '@/lib/supabase/types';

interface DeleteRecipeButtonProps {
  recipe: RecipeRecord;
}

export function DeleteRecipeButton({ recipe }: DeleteRecipeButtonProps) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteRecipe();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: recipe.id });
      // El hook se encarga de la redirección
    } catch (error) {
      console.error('Error deleting recipe:', error);
      // TODO: Mostrar toast de error en fase posterior
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700">
          <Trash2 className="h-4 w-4" aria-hidden />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar receta?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar <strong>&quot;{recipe.title}&quot;</strong>. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
        {deleteMutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Error: {deleteMutation.error?.message || 'No se pudo eliminar la receta'}
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
