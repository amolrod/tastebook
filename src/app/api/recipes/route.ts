import { NextResponse } from 'next/server';
import { z } from 'zod';

import { parseRecipeFromText } from '@/lib/recipes/parse';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import type { NewRecipePayload, RecipeRecord } from '@/lib/supabase/types';

const requestSchema = z.object({
  title: z.string().min(1),
  ingredients: z.array(z.string().min(1)).min(1),
  steps: z.array(z.string().min(1)).min(1),
  servings: z.number().int().min(1).max(20).nullable().optional(),
  durationMinutes: z.number().int().min(1).max(600),
  tags: z.array(z.string().min(1)).max(10),
  sourceText: z.string().min(1).optional()
});

const DEMO_OWNER_ID = '00000000-0000-0000-0000-000000000000';

export async function GET() {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ recipes: [], message: 'Supabase no configurado' }, { status: 200 });
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipes: (data ?? []) as RecipeRecord[] });
}

export async function POST(request: Request) {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  let parsedBody: z.infer<typeof requestSchema>;
  try {
    parsedBody = requestSchema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Validación fallida', details: error }, { status: 422 });
  }

  const payload: NewRecipePayload = {
    title: parsedBody.title,
    ingredients: parsedBody.ingredients,
    steps: parsedBody.steps,
    servings: parsedBody.servings ?? null,
    durationMinutes: parsedBody.durationMinutes,
    tags: parsedBody.tags,
    sourceText: parsedBody.sourceText ?? null
  };

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      title: payload.title,
      ingredients: payload.ingredients,
      steps: payload.steps,
      servings: payload.servings,
      duration_minutes: payload.durationMinutes,
      tags: payload.tags,
      source_text: payload.sourceText,
      owner_id: DEMO_OWNER_ID
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipe: data as RecipeRecord }, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });
  }
  const FormSchema = z.object({ text: z.string().min(1) });
  const body = await request.json().catch(() => null);
  const result = FormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  const parsed = parseRecipeFromText(result.data.text);
  return NextResponse.json({ parsed });
}
