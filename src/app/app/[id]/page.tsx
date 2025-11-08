import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Clock, FileText, Tags, Users } from 'lucide-react';
import { cache } from 'react';

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
  const createdAt = new Date(recipe.created_at).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
  const updatedAt = new Date(recipe.updated_at).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  return (
    <div className="container space-y-8 py-10">
      <BackLink />
      <header className="space-y-4">
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
            <Clock className="h-3 w-3" aria-hidden />
            {recipe.duration_minutes} min
          </span>
          {recipe.servings ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
              <Users className="h-3 w-3" aria-hidden />
              {recipe.servings} porciones
            </span>
          ) : null}
          {recipe.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
              <Tags className="h-3 w-3" aria-hidden />
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{recipe.title}</h1>
        <p className="text-sm text-neutral-500">
          Guardada el {createdAt}
          {recipe.updated_at !== recipe.created_at ? ` · Actualizada el ${updatedAt}` : ''}
        </p>
      </header>
      <section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Ingredientes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-relaxed text-neutral-700">
              {recipe.ingredients.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Pasos</h2>
            <ol className="mt-3 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-neutral-700">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
        {recipe.source_text ? (
          <aside className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
              <FileText className="h-4 w-4" aria-hidden />
              Texto original
            </h2>
            <p className="text-xs text-neutral-500">
              Conservamos el texto tal cual lo pegaste para que puedas consultarlo o repetir la extracción más adelante.
            </p>
            <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-700">
              {recipe.source_text}
            </pre>
          </aside>
        ) : null}
      </section>
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
