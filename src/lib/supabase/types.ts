export interface RecipeRecord {
  id: string;
  owner_id: string | null;
  title: string;
  ingredients: string[];
  steps: string[];
  servings: number | null;
  duration_minutes: number;
  tags: string[];
  source_text: string | null;
  created_at: string;
  updated_at: string;
}

export type NewRecipePayload = {
  title: string;
  ingredients: string[];
  steps: string[];
  servings?: number | null;
  durationMinutes: number;
  tags: string[];
  sourceText?: string | null;
};
