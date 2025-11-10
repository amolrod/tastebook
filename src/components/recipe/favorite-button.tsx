'use client';

import { Star } from 'lucide-react';
import { useToggleFavorite } from '@/lib/recipes/use-toggle-favorite';
import type { RecipeRecord } from '@/lib/supabase/types';

interface FavoriteButtonProps {
  recipe: RecipeRecord;
  variant?: 'default' | 'compact';
}

export function FavoriteButton({ recipe, variant = 'default' }: FavoriteButtonProps) {
  const toggleMutation = useToggleFavorite();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación si está dentro de un Link
    e.stopPropagation();

    toggleMutation.mutate({ id: recipe.id });
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={toggleMutation.isPending}
        className="group/fav rounded-full p-2 transition hover:bg-neutral-100 disabled:opacity-50"
        aria-label={recipe.is_favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <Star
          className={`h-4 w-4 transition ${
            recipe.is_favorite
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-neutral-400 group-hover/fav:text-yellow-400'
          }`}
          aria-hidden
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition disabled:opacity-50 ${
        recipe.is_favorite
          ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-yellow-300 hover:text-yellow-700'
      }`}
      aria-label={recipe.is_favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <Star
        className={`h-4 w-4 transition ${recipe.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
        aria-hidden
      />
      {recipe.is_favorite ? 'Favorito' : 'Marcar favorito'}
    </button>
  );
}
