'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface RecipeFilters {
  search: string;
  maxDuration?: number;
  minServings?: number;
  tags: string[];
  onlyFavorites?: boolean;
}

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
}

const DURATION_OPTIONS = [
  { value: 30, label: 'Rápidas (≤30 min)' },
  { value: 60, label: 'Medias (≤60 min)' },
  { value: 120, label: 'Elaboradas (≤2h)' }
];

const SERVINGS_OPTIONS = [
  { value: 1, label: '1+ personas' },
  { value: 2, label: '2+ personas' },
  { value: 4, label: '4+ personas' },
  { value: 6, label: '6+ personas' }
];

export function RecipeFiltersBar({ filters, onFiltersChange }: RecipeFiltersProps) {
  const hasActiveFilters =
    filters.maxDuration || filters.minServings || filters.tags.length > 0 || filters.onlyFavorites;

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleDurationChange = (value: number) => {
    onFiltersChange({
      ...filters,
      maxDuration: filters.maxDuration === value ? undefined : value
    });
  };

  const handleServingsChange = (value: number) => {
    onFiltersChange({
      ...filters,
      minServings: filters.minServings === value ? undefined : value
    });
  };

  const handleFavoritesToggle = () => {
    onFiltersChange({
      ...filters,
      onlyFavorites: !filters.onlyFavorites
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: filters.search, // Mantener búsqueda
      maxDuration: undefined,
      minServings: undefined,
      tags: [],
      onlyFavorites: false
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      search: '',
      maxDuration: undefined,
      minServings: undefined,
      tags: [],
      onlyFavorites: false
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Búsqueda principal */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-semibold">
          Buscar recetas
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <Input
            id="search"
            type="search"
            placeholder="Busca por nombre..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtro de favoritos */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Mostrar solo</Label>
        <button
          type="button"
          onClick={handleFavoritesToggle}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
            filters.onlyFavorites
              ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-yellow-300 hover:text-yellow-700'
          }`}
        >
          ⭐ Favoritos
        </button>
      </div>

      {/* Filtros de duración */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Tiempo de preparación</Label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleDurationChange(option.value)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                filters.maxDuration === option.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand hover:text-brand'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros de porciones */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Porciones</Label>
        <div className="flex flex-wrap gap-2">
          {SERVINGS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleServingsChange(option.value)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                filters.minServings === option.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand hover:text-brand'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      {(hasActiveFilters || filters.search) && (
        <div className="flex gap-2 border-t border-neutral-100 pt-4">
          {hasActiveFilters && (
            <Button type="button" variant="outline" size="sm" onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          )}
          {(hasActiveFilters || filters.search) && (
            <Button type="button" variant="outline" size="sm" onClick={handleClearAll}>
              Limpiar todo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
