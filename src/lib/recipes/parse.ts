const INGREDIENT_HEADINGS = [
  /^ingredientes?\b/i,
  /^para\s+la\s+masa/i,
  /^para\s+el\s+relleno/i
];

const STEP_HEADINGS = [
  /^elaboraci[oó]n\b/i,
  /^preparaci[oó]n\b/i,
  /^pasos?\b/i,
  /^instrucciones?\b/i
];

const INGREDIENT_UNIT_PATTERN =
  /\b(kg|kilogramos?|g|gramos?|mg|miligramos?|l|litros?|ml|mililitros?|taza[s]?|cucharadas?|cucharaditas?|cdas?\.?|cditas?\.?|pizca|pizcas|unidad(?:es)?|dientes?)\b/i;

const STEP_NUMBER_PATTERN = /^\s*(\d+|\d+\.|[-•*])\s+/;

export interface ParsedRecipe {
  title: string;
  ingredients: string[];
  steps: string[];
  servings?: number;
  durationMinutes: number;
  tags: string[];
}

export function parseRecipeFromText(input: string): ParsedRecipe {
  const text = input.replace(/\r\n?/g, '\n').trim();
  if (!text) {
    return {
      title: 'Receta sin título',
      ingredients: [],
      steps: [],
      durationMinutes: 10,
      tags: []
    };
  }

  const lines = text.split('\n').map((line) => line.trim());
  const nonEmptyLines = lines.filter((line) => line.length > 0);

  const title = extractTitle(nonEmptyLines);
  const servings = extractServings(text);
  const durationMinutes = extractDuration(text);
  const { ingredients, steps } = extractSections(lines);
  const inferredDuration = durationMinutes ?? estimateDuration(steps.length);
  const finalDuration = clamp(inferredDuration, 10, 90);
  const tags = inferTags(text, finalDuration);

  return {
    title,
    ingredients,
    steps,
    servings: servings ?? undefined,
    durationMinutes: finalDuration,
    tags
  };
}

function extractTitle(lines: string[]): string {
  return lines.at(0) ?? 'Receta sin título';
}

function extractSections(lines: string[]): { ingredients: string[]; steps: string[] } {
  const ingredientsIndex = findHeadingIndex(lines, INGREDIENT_HEADINGS);
  const stepsIndex = findHeadingIndex(lines, STEP_HEADINGS);

  if (ingredientsIndex !== -1) {
    const rawIngredients = collectList(lines.slice(ingredientsIndex + 1, stepsIndex === -1 ? undefined : stepsIndex));
    const rawSteps = collectSteps(
      stepsIndex !== -1
        ? lines.slice(stepsIndex + 1)
        : lines.slice(Math.max(ingredientsIndex + 1 + rawIngredients.length, ingredientsIndex + 1))
    );
    return {
      ingredients: rawIngredients,
      steps: rawSteps
    };
  }

  // Heuristic fallback when headings are missing
  const inferredIngredients: string[] = [];
  const inferredSteps: string[] = [];
  let collectingIngredients = true;

  for (const line of lines) {
    if (!line) {
      if (collectingIngredients && inferredIngredients.length > 0) {
        collectingIngredients = false;
      }
      continue;
    }
    if (collectingIngredients && isLikelyIngredient(line)) {
      inferredIngredients.push(cleanBullet(line));
      continue;
    }
    collectingIngredients = false;
    inferredSteps.push(line);
  }

  const fallbackSplitIndex = Math.max(1, Math.floor(lines.length / 2));

  return {
    ingredients:
      inferredIngredients.length > 0 ? inferredIngredients : collectList(lines.slice(0, fallbackSplitIndex)),
    steps: collectSteps(inferredSteps.length > 0 ? inferredSteps : lines.slice(fallbackSplitIndex))
  };
}

function collectList(lines: string[]): string[] {
  const items: string[] = [];
  for (const line of lines) {
    if (!line) {
      if (items.length > 0) {
        break;
      }
      continue;
    }
    if (STEP_HEADINGS.some((matcher) => matcher.test(normalizeHeading(line)))) {
      break;
    }
    if (INGREDIENT_HEADINGS.some((matcher) => matcher.test(normalizeHeading(line)))) {
      continue;
    }
    if (!isLikelyIngredient(line)) {
      if (items.length > 0) {
        break;
      }
      continue;
    }
    items.push(cleanBullet(line));
  }
  return items;
}

function collectSteps(lines: string[]): string[] {
  const steps: string[] = [];
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    steps.push(buffer.join(' ').replace(/\s+/g, ' ').trim());
    buffer = [];
  };

  for (const line of lines) {
    if (!line) {
      flushBuffer();
      continue;
    }
    if (STEP_HEADINGS.some((matcher) => matcher.test(normalizeHeading(line)))) {
      flushBuffer();
      continue;
    }
    if (STEP_NUMBER_PATTERN.test(line) && buffer.length > 0) {
      flushBuffer();
    }
    buffer.push(cleanBullet(line));
  }
  flushBuffer();

  return steps;
}

function findHeadingIndex(lines: string[], patterns: RegExp[]): number {
  return lines.findIndex((line) => patterns.some((matcher) => matcher.test(normalizeHeading(line))));
}

function normalizeHeading(value: string): string {
  return value.replace(/[:：]/g, '').trim().toLowerCase();
}

function isLikelyIngredient(line: string): boolean {
  const normalized = line.toLowerCase();
  if (STEP_HEADINGS.some((matcher) => matcher.test(normalized))) {
    return false;
  }
  return (
    /^[-•*]/.test(line) ||
    /^\d+\s/.test(line) ||
    /^\d+\/\d+/.test(line) ||
    INGREDIENT_UNIT_PATTERN.test(line) ||
    /(al gusto|c\/n)/i.test(line) ||
    /(cucharad[ao]|pizca|rodajas?|rebanadas?|fileteada)/i.test(line)
  );
}

function cleanBullet(line: string): string {
  return line.replace(/^[-•*]\s*/, '').replace(/^\d+[.)]?\s*/, '').trim();
}

function extractServings(text: string): number | null {
  const match = text.match(/\b(?:para|rinde|salen)\s+(\d{1,2})\s+(?:porciones?|personas|raciones?)\b/i);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

function extractDuration(text: string): number | null {
  const hoursMatch = text.match(/(\d{1,2})\s*(?:h|hora(?:s)?)/i);
  const minutesMatches = text.matchAll(/(\d{1,2})\s*(?:min|minutos?)/gi);

  let totalMinutes = 0;
  if (hoursMatch) {
    totalMinutes += Number.parseInt(hoursMatch[1], 10) * 60;
  }

  for (const match of minutesMatches) {
    totalMinutes += Number.parseInt(match[1], 10);
  }

  if (totalMinutes === 0) {
    return null;
  }
  return totalMinutes;
}

function estimateDuration(stepCount: number): number {
  if (stepCount <= 0) return 10;
  return stepCount * 5;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function inferTags(text: string, durationMinutes: number): string[] {
  const lowerText = text.toLowerCase();
  const tags = new Set<string>();

  if (/horno|hornear|°c|grados\s*c\b/.test(lowerText)) {
    tags.add('horno');
  }
  if (/postre|brownie|bizcocho|galleta|tarta|merengue|mousse/.test(lowerText)) {
    tags.add('postre');
  }
  if (durationMinutes <= 30) {
    tags.add('rápida');
  }

  return Array.from(tags);
}

export const __testing = {
  extractServings,
  extractDuration,
  isLikelyIngredient,
  collectList,
  collectSteps,
  inferTags,
  estimateDuration
};
