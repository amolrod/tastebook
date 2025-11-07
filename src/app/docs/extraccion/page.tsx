import Link from 'next/link';

export default function ExtractionDocPage() {
  return (
    <div className="container space-y-6 py-12">
      <h1 className="text-3xl font-semibold text-neutral-900">Algoritmo de extracción</h1>
      <p className="text-neutral-600">
        Resumen de las heurísticas usadas por `parseRecipeFromText` para dividir título, ingredientes, pasos, porciones, duración y etiquetas.
      </p>
      <section className="space-y-4 text-neutral-700">
        <h2 className="text-xl font-semibold">Puntos clave</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Soportamos encabezados “Ingredientes”, “Elaboración/Preparación/Pasos”.</li>
          <li>Detectamos unidades comunes en español (g, ml, taza, cda, pizca, etc.).</li>
          <li>Si no hay encabezados, inferimos ingredientes por viñetas o unidades y estimamos duración (5 min/paso).</li>
          <li>Etiquetas automáticas: horno, postre, rápida.</li>
        </ul>
      </section>
      <p className="text-sm text-neutral-500">
        Consulta la versión completa en el repositorio (`docs/EXTRACCION.md`).
      </p>
      <Link className="inline-flex items-center gap-2 text-brand underline" href="/docs/pwa-ios">
        Guía PWA iOS
      </Link>
    </div>
  );
}
