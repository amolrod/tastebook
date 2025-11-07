import Link from 'next/link';

export default function PwaIosGuidePage() {
  return (
    <div className="container space-y-6 py-12">
      <h1 className="text-3xl font-semibold text-neutral-900">Instalar Tastebook en iPhone</h1>
      <p className="text-neutral-600">
        Sigue estos pasos para añadir la PWA de Tastebook a tu pantalla de inicio sin pasar por la App Store.
      </p>
      <ol className="space-y-4 text-neutral-700">
        <li>
          1. Abre <span className="font-semibold">https://tastebook.vercel.app</span> en Safari.
        </li>
        <li>2. Toca el icono de compartir y selecciona «Añadir a pantalla de inicio».</li>
        <li>3. Confirma el nombre y pulsa «Añadir». Tastebook aparecerá como app independiente.</li>
        <li>
          4. Para iOS 17+: en Ajustes → Safari, activa «Permitir instalar web apps» si está deshabilitado.
        </li>
      </ol>
      <p className="text-sm text-neutral-500">
  Consulta también la documentación técnica de{' '}
  <Link href="/docs/extraccion" className="underline">
          heurísticas de extracción
        </Link>
        .
      </p>
    </div>
  );
}
