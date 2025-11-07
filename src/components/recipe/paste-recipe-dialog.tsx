"use client";

import { type ChangeEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { parseRecipeFromText, type ParsedRecipe } from '@/lib/recipes/parse';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SAMPLE_RECIPE = `Bizcocho clásico

Ingredientes:
- 200 g de harina
- 150 g de azúcar
- 3 huevos
- 1 taza de leche

Elaboración:
1. Precalienta el horno a 180 °C.
2. Mezcla los ingredientes secos.
3. Añade los huevos y la leche.
4. Hornea durante 35 minutos.`;

export function PasteRecipeDialog() {
  const [text, setText] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [preview, setPreview] = useState<ParsedRecipe | null>(null);

  const isDisabled = text.trim().length === 0 || isBusy;

  const handleParse = () => {
    setIsBusy(true);
    try {
      const parsed = parseRecipeFromText(text);
      setPreview(parsed);
    } finally {
      setIsBusy(false);
    }
  };

  const handleUseSample = () => {
    setText(SAMPLE_RECIPE);
    setPreview(parseRecipeFromText(SAMPLE_RECIPE));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">Pegar receta</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pega tu receta en texto plano</DialogTitle>
          <DialogDescription>
            Pegamos desde WhatsApp, blogs o PDFs y extraemos título, ingredientes y pasos automáticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="raw-recipe">Texto de la receta</Label>
            <Button type="button" variant="ghost" size="sm" onClick={handleUseSample}>
              Probar con ejemplo
            </Button>
          </div>
          <Textarea
            id="raw-recipe"
            value={text}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value)}
            placeholder="Pega aquí la receta completa..."
            aria-describedby="paste-helper"
          />
          <p id="paste-helper" className="text-xs text-neutral-500">
            Detectamos secciones de ingredientes y pasos. Si no existen encabezados, usamos heurísticas para separar la receta.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setText('')} disabled={isBusy}>
              Limpiar
            </Button>
            <Button type="button" size="sm" onClick={handleParse} disabled={isDisabled}>
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Analizar receta'}
            </Button>
          </div>
          {preview && (
            <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Vista previa
              </h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed">
                <div>
                  <span className="font-semibold text-neutral-900">Título: </span>
                  <span>{preview.title}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs uppercase text-neutral-600">
                  <span className="rounded-full bg-white px-3 py-1 font-semibold shadow">
                    {preview.durationMinutes} min
                  </span>
                  {preview.servings && (
                    <span className="rounded-full bg-white px-3 py-1 font-semibold shadow">
                      {preview.servings} porciones
                    </span>
                  )}
                  {preview.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1 font-semibold shadow">
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Ingredientes</h4>
                  <ul className="mt-1 list-disc space-y-1 pl-6">
                    {preview.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Pasos</h4>
                  <ol className="mt-1 list-decimal space-y-1 pl-6">
                    {preview.steps.map((step, index) => (
                      <li key={index}>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
