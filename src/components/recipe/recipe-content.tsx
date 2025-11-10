'use client';

import { Clock, FileText, Tags, Users } from 'lucide-react';
import { RecipeEditForm } from '@/components/recipe/recipe-edit-form';
import { DeleteRecipeButton } from '@/components/recipe/delete-recipe-button';
import { FavoriteButton } from '@/components/recipe/favorite-button';
import type { RecipeRecord } from '@/lib/supabase/types';

interface RecipeContentProps {
  recipe: RecipeRecord;
}

export function RecipeContent({ recipe }: RecipeContentProps) {
  const createdAt = new Date(recipe.created_at).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
  const updatedAt = new Date(recipe.updated_at).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  return (
    <>
      <header className="space-y-4">
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
            <Clock className="h-3 w-3" aria-hidden />
            {recipe.duration_minutes} min
          </span>
          {recipe.servings ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
              <Users className="h-3 w-3" aria-hidden />
              {recipe.servings} porciones
            </span>
          ) : null}
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600"
            >
              <Tags className="h-3 w-3" aria-hidden />
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{recipe.title}</h1>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">
            Guardada el {createdAt}
            {recipe.updated_at !== recipe.created_at ? ` · Actualizada el ${updatedAt}` : ''}
          </p>
          <div className="flex gap-2">
            <FavoriteButton recipe={recipe} variant="default" />
            <RecipeEditForm recipe={recipe} />
            <DeleteRecipeButton recipe={recipe} />
          </div>
        </div>
      </header>

      <section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Ingredientes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed text-neutral-700">
              {recipe.ingredients.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Pasos</h2>
            <ol className="mt-3 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-neutral-700">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
        {recipe.source_text ? (
          <aside className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
              <FileText className="h-4 w-4" aria-hidden />
              Texto original
            </h2>
            <p className="text-xs text-neutral-500">
              Conservamos el texto tal cual lo pegaste para que puedas consultarlo o repetir la extracción más tarde.
            </p>
            <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-700">
              {recipe.source_text}
            </pre>
          </aside>
        ) : null}
      </section>
    </>
  );
}
