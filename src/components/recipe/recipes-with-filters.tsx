'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { RecipeList, type RecipeFilters as RecipeListFilters } from '@/components/recipe/recipe-list';
import { RecipeFiltersBar, type RecipeFilters } from '@/components/recipe/recipe-filters-bar';

export function RecipesWithFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inicializar filtros desde URL
  const [filters, setFilters] = useState<RecipeFilters>(() => ({
    search: searchParams.get('q') || '',
    maxDuration: searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration')!, 10) : undefined,
    minServings: searchParams.get('minServings') ? parseInt(searchParams.get('minServings')!, 10) : undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || []
  }));

  const handleFiltersChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);

    // Actualizar URL
    const params = new URLSearchParams();
    if (newFilters.search) {
      params.set('q', newFilters.search);
    }
    if (newFilters.maxDuration) {
      params.set('maxDuration', newFilters.maxDuration.toString());
    }
    if (newFilters.minServings) {
      params.set('minServings', newFilters.minServings.toString());
    }
    if (newFilters.tags.length > 0) {
      params.set('tags', newFilters.tags.join(','));
    }

    const queryString = params.toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newUrl = (queryString ? `${pathname}?${queryString}` : pathname) as any;
    router.replace(newUrl, { scroll: false });
  };

  // Convertir filtros al formato de RecipeList
  const recipeListFilters: RecipeListFilters = {
    search: filters.search || undefined,
    maxDuration: filters.maxDuration,
    minServings: filters.minServings,
    tags: filters.tags.length > 0 ? filters.tags : undefined
  };

  return (
    <div className="space-y-6">
      <RecipeFiltersBar filters={filters} onFiltersChange={handleFiltersChange} />
      <RecipeList filters={recipeListFilters} />
    </div>
  );
}
