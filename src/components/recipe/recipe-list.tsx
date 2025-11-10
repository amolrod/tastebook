"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { FavoriteButton } from '@/components/recipe/favorite-button';
import type { RecipeRecord } from '@/lib/supabase/types';

export interface RecipeFilters {
  search?: string;
  maxDuration?: number;
  minServings?: number;
  tags?: string[];
  onlyFavorites?: boolean;
}

async function fetchRecipes(filters?: RecipeFilters): Promise<RecipeRecord[]> {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append('q', filters.search);
  }
  if (filters?.maxDuration) {
    params.append('maxDuration', filters.maxDuration.toString());
  }
  if (filters?.minServings) {
    params.append('minServings', filters.minServings.toString());
  }
  if (filters?.tags && filters.tags.length > 0) {
    params.append('tags', filters.tags.join(','));
  }
  if (filters?.onlyFavorites) {
    params.append('onlyFavorites', 'true');
  }

  const url = `/api/recipes${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Inicia sesión para ver tu recetario.');
    }
    throw new Error('No se pudieron cargar las recetas');
  }

  const payload = (await response.json()) as { recipes?: RecipeRecord[] };
  return payload.recipes ?? [];
}

function getRecipeHref(id: string): `/app/${string}` {
  return `/app/${id}`;
}

interface RecipeListProps {
  filters?: RecipeFilters;
}

export function RecipeList({ filters }: RecipeListProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => fetchRecipes(filters),
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Cargando recetas…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        {(error as Error).message}. Verifica la configuración de Supabase y recarga la página.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-6 text-center">
        <p className="text-sm text-neutral-600">Todavía no tienes recetas guardadas.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Usa el botón <span className="font-semibold">Pegar receta</span> para crear la primera, o vuelve a la
          <Link className="ml-1 text-brand underline" href="/">
            página principal
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((recipe) => {
        const preview = recipe.ingredients.slice(0, 3).join(', ');
        return (
          <Link
            key={recipe.id}
            href={getRecipeHref(recipe.id)}
            className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label={`Ver receta ${recipe.title}`}
          >
            <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <header className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-brand">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-1">
                  <FavoriteButton recipe={recipe} variant="compact" />
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {recipe.duration_minutes} min
                  </span>
                </div>
              </header>
              <p className="mt-3 text-sm text-neutral-600">
                {preview}
                {recipe.ingredients.length > 3 ? '…' : ''}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs uppercase tracking-wide text-neutral-500">
                    {tag}
                  </span>
                ))}
                {recipe.servings && (
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs uppercase tracking-wide text-neutral-500">
                    {recipe.servings} porciones
                  </span>
                )}
              </div>
              <footer className="mt-auto text-xs text-neutral-400">
                Guardada el {new Date(recipe.created_at).toLocaleDateString('es-ES')}
              </footer>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
