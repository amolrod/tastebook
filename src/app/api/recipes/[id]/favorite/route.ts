import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import type { RecipeRecord } from '@/lib/supabase/types';

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

  // 4. Obtener receta actual para verificar ownership y estado de favorito
  const { data: existingRecipe, error: fetchError } = await supabase
    .from('recipes')
    .select('id, owner_id, is_favorite')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching recipe:', fetchError);
    // Si el error es por columna inexistente, dar mensaje más claro
    if (fetchError.message?.includes('is_favorite')) {
      return NextResponse.json(
        { error: 'La columna is_favorite no existe. Ejecuta la migración 0002_add_is_favorite.sql' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Error al verificar receta' }, { status: 500 });
  }

  if (!existingRecipe) {
    return NextResponse.json({ error: 'Receta no encontrada' }, { status: 404 });
  }

  if (existingRecipe.owner_id !== session.user.id) {
    return NextResponse.json({ error: 'No tienes permiso para modificar esta receta' }, { status: 403 });
  }

  // 5. Toggle is_favorite
  const newFavoriteState = !(existingRecipe.is_favorite ?? false);

  const { data: updatedRecipe, error: updateError } = await supabase
    .from('recipes')
    .update({ is_favorite: newFavoriteState })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error toggling favorite:', updateError);
    return NextResponse.json({ error: 'Error al actualizar favorito' }, { status: 500 });
  }

  return NextResponse.json({ recipe: updatedRecipe as RecipeRecord }, { status: 200 });
}
