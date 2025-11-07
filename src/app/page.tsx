import { PasteRecipeDialog } from '@/components/recipe/paste-recipe-dialog';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container grid gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand shadow">
          <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
          Pegar receta (beta)
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Copia. Pega. Obtén tu receta lista para editar en segundos.
        </h1>
        <p className="text-lg text-neutral-600">
          Nuestra heurística detecta ingredientes, pasos, porciones y duración al pegar cualquier texto desde blogs, WhatsApp o PDFs.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <PasteRecipeDialog />
          <Button variant="ghost" size="lg" asChild>
            <a href="/docs/extraccion">Ver documentación</a>
          </Button>
        </div>
        <ul className="grid gap-3 text-sm text-neutral-600 md:grid-cols-2">
          <li className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
            Etiquetamos recetas de horno y postres automáticamente.
          </li>
          <li className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
            Calculamos el tiempo estimado por paso (mín. 10, máx. 90 min).
          </li>
          <li className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
            Servimos tags "rápida" cuando una receta tarda ≤30 minutos.
          </li>
          <li className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
            Exporta a tu recetario multiusuario en Tastebook.
          </li>
        </ul>
      </section>
      <aside className="hidden h-full rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-6 shadow-inner lg:flex lg:flex-col lg:gap-4">
        <h2 className="text-lg font-semibold text-amber-800">Cómo funciona</h2>
        <ol className="list-decimal space-y-3 pl-4 text-sm text-amber-900/90">
          <li>Pega cualquier texto: soportamos encabezados y formatos mixtos.</li>
          <li>Analizamos la receta localmente (sin enviar datos a la nube).</li>
          <li>Generamos ingredientes, pasos y tags para tu recetario.</li>
          <li>Guarda, edita o comparte desde la app Tastebook.</li>
        </ol>
        <p className="mt-auto text-xs text-amber-700/80">
          Consulta <a href="/docs/extraccion" className="underline">la guía técnica</a> para ver los límites y casos especiales.
        </p>
      </aside>
    </div>
  );
}
