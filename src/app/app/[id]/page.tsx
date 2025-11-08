import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft } from 'lucide-react';
import { cache } from 'react';

import { RecipeContent } from '@/components/recipe/recipe-content';
import type { RecipeRecord } from '@/lib/supabase/types';

interface PageProps {
  params: {
    id: string;
  };
}

type RecipeFetchResult =
  | { status: 'no-env' }
  | { status: 'unauthenticated' }
  | { status: 'not-found' }
  | { status: 'ok'; recipe: RecipeRecord };

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

const fetchRecipe = cache(async (id: string): Promise<RecipeFetchResult> => {
  if (!hasSupabaseConfig()) {
    return { status: 'no-env' };
  }

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return { status: 'unauthenticated' };
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .eq('owner_id', session.user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return { status: 'not-found' };
  }

  return { status: 'ok', recipe: data as RecipeRecord };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await fetchRecipe(params.id);
  if (result.status === 'ok') {
    return {
      title: result.recipe.title
    };
  }
  return { title: 'Receta' };
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const result = await fetchRecipe(params.id);

  if (result.status === 'no-env') {
    return (
      <div className="container space-y-6 py-10">
        <BackLink />
        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Configura las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para ver los detalles de tus recetas.
        </div>
      </div>
    );
  }

  if (result.status === 'unauthenticated') {
    redirect('/login');
  }

  if (result.status === 'not-found') {
    notFound();
  }

  const { recipe } = result;

  return (
    <div className="container space-y-8 py-10">
      <BackLink />
      <RecipeContent recipe={recipe} />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/app"
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm transition hover:-translate-y-0.5 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Volver al recetario
    </Link>
  );
}
