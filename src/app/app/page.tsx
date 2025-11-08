import type { Metadata } from 'next';

import { PasteRecipeDialog } from '@/components/recipe/paste-recipe-dialog';
import { RecipesWithFilters } from '@/components/recipe/recipes-with-filters';

export const metadata: Metadata = {
  title: 'Recetario'
};

export default function AppPage() {
  return (
    <div className="container space-y-10 py-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Tu recetario</h1>
          <p className="text-sm text-neutral-600">
            Busca, filtra y organiza tus recetas en un solo lugar.
          </p>
        </div>
        <PasteRecipeDialog />
      </header>
      <RecipesWithFilters />
    </div>
  );
}
