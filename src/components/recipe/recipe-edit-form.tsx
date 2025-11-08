'use client';

import { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateRecipe } from '@/lib/recipes/use-update-recipe';
import type { RecipeRecord } from '@/lib/supabase/types';

interface RecipeEditFormProps {
  recipe: RecipeRecord;
}

export function RecipeEditForm({ recipe }: RecipeEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: recipe.title,
    ingredients: recipe.ingredients.join('\n'),
    steps: recipe.steps.join('\n'),
    servings: recipe.servings?.toString() ?? '',
    duration_minutes: recipe.duration_minutes.toString(),
    tags: recipe.tags.join(', ')
  });

  const updateMutation = useUpdateRecipe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: recipe.id,
        title: formData.title,
        ingredients: formData.ingredients.split('\n').filter((line) => line.trim()),
        steps: formData.steps.split('\n').filter((line) => line.trim()),
        servings: formData.servings ? parseInt(formData.servings, 10) : null,
        duration_minutes: parseInt(formData.duration_minutes, 10),
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      // TODO: Mostrar toast de error en fase posterior
    }
  };

  const handleCancel = () => {
    setFormData({
      title: recipe.title,
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n'),
      servings: recipe.servings?.toString() ?? '',
      duration_minutes: recipe.duration_minutes.toString(),
      tags: recipe.tags.join(', ')
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        onClick={() => setIsEditing(true)}
        variant="outline"
        size="sm"
        className="inline-flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" aria-hidden />
        Editar receta
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          maxLength={200}
          disabled={updateMutation.isPending}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration_minutes">Duración (minutos)</Label>
          <Input
            id="duration_minutes"
            type="number"
            min={1}
            max={600}
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            required
            disabled={updateMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="servings">Porciones (opcional)</Label>
          <Input
            id="servings"
            type="number"
            min={1}
            max={20}
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
            disabled={updateMutation.isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separados por comas)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="vegetariano, rápido, saludable"
          disabled={updateMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredientes (uno por línea)</Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          required
          rows={8}
          className="font-mono text-sm"
          disabled={updateMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="steps">Pasos (uno por línea)</Label>
        <Textarea
          id="steps"
          value={formData.steps}
          onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          required
          rows={10}
          className="font-mono text-sm"
          disabled={updateMutation.isPending}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2">
          <Check className="h-4 w-4" aria-hidden />
          {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2"
        >
          <X className="h-4 w-4" aria-hidden />
          Cancelar
        </Button>
      </div>

      {updateMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error al guardar: {updateMutation.error?.message || 'Inténtalo de nuevo'}
        </div>
      )}
    </form>
  );
}
