import type { Metadata } from 'next';

import { PasteRecipeDialog } from '@/components/recipe/paste-recipe-dialog';
import { RecipeList } from '@/components/recipe/recipe-list';

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
            Guarda recetas pegadas desde texto y organízalas en un solo lugar. Próximamente sincronizaremos por
            usuario con Supabase Auth.
          </p>
        </div>
        <PasteRecipeDialog />
      </header>
      <RecipeList />
    </div>
  );
}
