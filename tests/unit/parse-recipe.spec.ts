import { describe, expect, it } from 'vitest';
import { parseRecipeFromText, __testing } from '@/lib/recipes/parse';

describe('parseRecipeFromText', () => {
  it('parses headings with servings and duration', () => {
    const input = `Tarta de queso clásica\n\nIngredientes:\n- 200 g de galletas\n- 100 g de mantequilla\n\nElaboración:\n1. Tritura las galletas.\n2. Hornea 30 min a 180 °C.\n\nRinde 8 porciones.`;

    const parsed = parseRecipeFromText(input);

    expect(parsed.title).toBe('Tarta de queso clásica');
    expect(parsed.ingredients).toHaveLength(2);
    expect(parsed.ingredients[0]).toBe('200 g de galletas');
    expect(parsed.steps).toHaveLength(2);
    expect(parsed.servings).toBe(8);
    expect(parsed.durationMinutes).toBe(30);
    expect(parsed.tags).toContain('horno');
  });

  it('infers structure without headings', () => {
    const input = `Brownie irresistible\n200 g chocolate negro\n150 g mantequilla\n3 huevos\n\nDerretir chocolate y mantequilla.\nMezclar con huevos y azúcar.\nHornear 25 min.`;

    const parsed = parseRecipeFromText(input);

    expect(parsed.ingredients.length).toBeGreaterThan(0);
    expect(parsed.steps.length).toBeGreaterThan(0);
    expect(parsed.durationMinutes).toBeLessThanOrEqual(30);
    expect(parsed.tags).toContain('postre');
    expect(parsed.tags).toContain('horno');
  });

  it('detects servings phrasing', () => {
    const input = `Crema de calabaza\nIngredientes:\n- 1 kg de calabaza\n\nPreparación:\n1. Cocer la calabaza.\n2. Triturar hasta obtener crema.\n\nPara 4 personas.`;

    const parsed = parseRecipeFromText(input);

    expect(parsed.servings).toBe(4);
  });

  it('computes mixed duration format', () => {
    const input = `Focaccia\nIngredientes:\n- 400 g harina\n\nElaboración:\n1. Amasar durante 15 min.\n2. Dejar reposar 1 h.\n3. Hornear 20 min a 200 grados.`;

    const parsed = parseRecipeFromText(input);

    expect(parsed.durationMinutes).toBe(95);
  });

  it('caps estimated duration between 10 and 90 minutes', () => {
    const fromShort = parseRecipeFromText('Zumo fresco\nExprimir naranjas.');
    const fromLong = parseRecipeFromText('Receta extensa\n' + new Array(40).fill('Paso adicional').join('\n'));

    expect(fromShort.durationMinutes).toBeGreaterThanOrEqual(10);
    expect(fromLong.durationMinutes).toBeLessThanOrEqual(90);
  });

  it('tags recipes as rápidas when duration is <= 30', () => {
    const parsed = parseRecipeFromText(`Ensalada express\nIngredientes:\n- Lechuga\n\nPreparación:\n1. Mezcla todo.\nListo en 10 min.`);

    expect(parsed.tags).toContain('rápida');
  });

  it('parses recipes with emoji headings and grouped sections', () => {
    const input = `🍜 Udon de secreto ibérico al curry rojo

🧂 Ingredientes
Base

300 g secreto ibérico, cortado en tiras finas
150 g udon noodles

Salsa
1½ cucharadas pasta de curry rojo tailandés
200 ml de caldo

🔥 Preparación paso a paso

Cocer los udon

Pon agua con una pizca de sal a hervir.
Cuece los udon según el envase.
Reserva.

Cocinar el secreto
Calienta aceite y dora el secreto ibérico.

Unir todo
Incorpora los udon y mezcla.

✅ Resultado
Listo para servir.`;

    const parsed = parseRecipeFromText(input);

    expect(parsed.title).toBe('🍜 Udon de secreto ibérico al curry rojo');
    expect(parsed.ingredients).toContain('Base');
    expect(parsed.ingredients).toContain('300 g secreto ibérico, cortado en tiras finas');
    expect(parsed.ingredients).toContain('Salsa');
    expect(parsed.ingredients).toContain('1½ cucharadas pasta de curry rojo tailandés');
    expect(parsed.steps[0]).toContain('Cocer los udon');
    expect(parsed.steps[0]).toContain('Pon agua con una pizca de sal a hervir.');
    expect(parsed.steps[1]).toContain('Cocinar el secreto');
    expect(parsed.steps[2]).toContain('Unir todo');
  });
});

describe('helpers', () => {
  it('collectSteps merges wrapped lines', () => {
    const raw = ['1. Mezcla', 'bien los ingredientes', '', '2. Hornea'];
    expect(__testing.collectSteps(raw)).toEqual(['Mezcla bien los ingredientes', 'Hornea']);
  });

  it('ingredient heuristic recognises units', () => {
    expect(__testing.isLikelyIngredient('• 200 g harina')).toBe(true);
    expect(__testing.isLikelyIngredient('Paso 1')).toBe(false);
  });

  it('extractDuration handles only minutes', () => {
    expect(__testing.extractDuration('Tardarás 45 min')).toBe(45);
  });
});
