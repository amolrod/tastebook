import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';

import type { RecipeRecord } from '@/lib/supabase/types';

const updateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Título muy largo'),
  ingredients: z
    .array(z.string().min(1, 'Ingrediente no puede estar vacío'))
    .min(1, 'Debe haber al menos un ingrediente')
    .max(50, 'Máximo 50 ingredientes'),
  steps: z
    .array(z.string().min(1, 'Paso no puede estar vacío'))
    .min(1, 'Debe haber al menos un paso')
    .max(30, 'Máximo 30 pasos'),
  servings: z
    .number()
    .int('Porciones debe ser entero')
    .min(1, 'Mínimo 1 porción')
    .max(20, 'Máximo 20 porciones')
    .nullable()
    .optional(),
  duration_minutes: z
    .number()
    .int('Duración debe ser entero')
    .min(1, 'Mínimo 1 minuto')
    .max(600, 'Máximo 600 minutos'),
  tags: z
    .array(z.string().min(1, 'Tag no puede estar vacío'))
    .max(10, 'Máximo 10 tags')
});

interface RouteContext {
  params: {
    id: string;
  };
}

function hasSupabaseConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function PATCH(request: Request, context: RouteContext) {
  // 1. Validar configuración de Supabase
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });
  }

  // 2. Verificar autenticación
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // 3. Validar ID de receta
  const { id } = context.params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID de receta inválido' }, { status: 400 });
  }

  // 4. Parsear y validar body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  let validatedData: z.infer<typeof updateSchema>;
  try {
    validatedData = updateSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validación fallida',
          details: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 422 }
      );
    }
    return NextResponse.json({ error: 'Error de validación' }, { status: 422 });
  }

  // 5. Verificar que la receta existe y pertenece al usuario (RLS se encarga, pero validamos primero)
  const { data: existingRecipe, error: fetchError } = await supabase
    .from('recipes')
    .select('id, owner_id')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: 'Error al verificar receta' }, { status: 500 });
  }

  if (!existingRecipe) {
    return NextResponse.json({ error: 'Receta no encontrada' }, { status: 404 });
  }

  if (existingRecipe.owner_id !== session.user.id) {
    return NextResponse.json({ error: 'No tienes permiso para editar esta receta' }, { status: 403 });
  }

  // 6. Actualizar receta
  const { data: updatedRecipe, error: updateError } = await supabase
    .from('recipes')
    .update({
      title: validatedData.title,
      ingredients: validatedData.ingredients,
      steps: validatedData.steps,
      servings: validatedData.servings ?? null,
      duration_minutes: validatedData.duration_minutes,
      tags: validatedData.tags
      // updated_at se actualiza automáticamente por el trigger
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating recipe:', updateError);
    return NextResponse.json({ error: 'Error al actualizar receta' }, { status: 500 });
  }

  return NextResponse.json({ recipe: updatedRecipe as RecipeRecord }, { status: 200 });
}
