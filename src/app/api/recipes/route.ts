import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';

import { parseRecipeFromText } from '@/lib/recipes/parse';
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

export async function GET(request: Request) {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });
  }
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // Parsear query params
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q');
  const maxDuration = searchParams.get('maxDuration');
  const minServings = searchParams.get('minServings');
  const tagsParam = searchParams.get('tags');

  // Construir query base
  let query = supabase
    .from('recipes')
    .select('*')
    .eq('owner_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  // Aplicar filtros
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (maxDuration) {
    const maxDurationNum = parseInt(maxDuration, 10);
    if (!isNaN(maxDurationNum)) {
      query = query.lte('duration_minutes', maxDurationNum);
    }
  }

  if (minServings) {
    const minServingsNum = parseInt(minServings, 10);
    if (!isNaN(minServingsNum)) {
      query = query.gte('servings', minServingsNum);
    }
  }

  if (tagsParam) {
    const tags = tagsParam.split(',').filter(Boolean);
    if (tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipes: (data ?? []) as RecipeRecord[] });
}

export async function POST(request: Request) {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });
  }
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
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
      owner_id: session.user.id
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipe: data as RecipeRecord }, { status: 201 });
}

export async function PUT(request: Request) {
  const FormSchema = z.object({ text: z.string().min(1) });
  const body = await request.json().catch(() => null);
  const result = FormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  const parsed = parseRecipeFromText(result.data.text);
  return NextResponse.json({ parsed });
}
