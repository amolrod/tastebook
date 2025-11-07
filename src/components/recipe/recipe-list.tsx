"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import type { RecipeRecord } from '@/lib/supabase/types';

async function fetchRecipes(): Promise<RecipeRecord[]> {
  const response = await fetch('/api/recipes', {
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

export function RecipeList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
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
      {data.map((recipe) => (
        <article key={recipe.id} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">{recipe.title}</h3>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {recipe.duration_minutes} min
            </span>
          </header>
          <p className="mt-3 text-sm text-neutral-600">
            {recipe.ingredients.slice(0, 3).join(', ')}
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
      ))}
    </div>
  );
}
