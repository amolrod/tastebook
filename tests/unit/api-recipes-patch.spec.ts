import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from '@/app/api/recipes/[id]/route';

// Mock de next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  }))
}));

// Mock de Supabase
const mockGetSession = vi.fn();
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockUpdate = vi.fn();
const mockSingle = vi.fn();

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession
    },
    from: mockFrom
  }))
}));

describe('PATCH /api/recipes/[id]', () => {
  const validRecipeId = 'recipe-123';
  const userId = 'user-456';
  const mockRecipe = {
    id: validRecipeId,
    owner_id: userId,
    title: 'Receta Original',
    ingredients: ['Ingrediente 1', 'Ingrediente 2'],
    steps: ['Paso 1', 'Paso 2'],
    servings: 4,
    duration_minutes: 30,
    tags: ['tag1', 'tag2'],
    source_text: 'Texto original',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const validUpdateData = {
    title: 'Receta Actualizada',
    ingredients: ['Nuevo ingrediente'],
    steps: ['Nuevo paso'],
    servings: 6,
    duration_minutes: 45,
    tags: ['nuevo-tag']
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup de variables de entorno
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    // Setup de cadena de mocks de Supabase por defecto
    const mockSelectChain = {
      eq: mockEq
    };

    const mockEqChain = {
      eq: mockEq,
      maybeSingle: mockMaybeSingle,
      select: mockSelect,
      single: mockSingle
    };

    mockFrom.mockReturnValue({
      select: mockSelect,
      update: mockUpdate
    });
    mockSelect.mockReturnValue(mockSelectChain);
    mockEq.mockReturnValue(mockEqChain);
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockSingle
        })
      })
    });
    mockSingle.mockResolvedValue({
      data: { ...mockRecipe, ...validUpdateData },
      error: null
    });
  });

  it('debería retornar 503 si Supabase no está configurado', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(validUpdateData)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe('Supabase no configurado');
  });

  it('debería retornar 401 si no hay sesión', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(validUpdateData)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('No autenticado');
  });

  it('debería retornar 400 si el ID es inválido', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/', {
      method: 'PATCH',
      body: JSON.stringify(validUpdateData)
    });

    const response = await PATCH(request, { params: { id: '' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('ID de receta inválido');
  });

  it('debería retornar 400 si el body no es JSON válido', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: 'invalid json'
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('JSON inválido');
  });

  it('debería retornar 422 si la validación falla', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

    const invalidData = {
      title: '', // Título vacío - inválido
      ingredients: [],
      steps: [],
      duration_minutes: 0
    };

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(invalidData)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.error).toBe('Validación fallida');
    expect(data.details).toBeDefined();
  });

  it('debería retornar 404 si la receta no existe', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(validUpdateData)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Receta no encontrada');
  });

  it('debería retornar 403 si el usuario no es el dueño', async () => {
    const otherUserId = 'other-user';
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: otherUserId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: { ...mockRecipe, owner_id: userId },
      error: null
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(validUpdateData)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('No tienes permiso para editar esta receta');
  });

  it('debería actualizar la receta exitosamente', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: mockRecipe,
      error: null
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(validUpdateData)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recipe).toBeDefined();
    expect(data.recipe.title).toBe(validUpdateData.title);
    expect(mockUpdate).toHaveBeenCalledWith({
      title: validUpdateData.title,
      ingredients: validUpdateData.ingredients,
      steps: validUpdateData.steps,
      servings: validUpdateData.servings,
      duration_minutes: validUpdateData.duration_minutes,
      tags: validUpdateData.tags
    });
  });

  it('debería aceptar servings como null', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: mockRecipe,
      error: null
    });

    const dataWithoutServings = {
      ...validUpdateData,
      servings: null
    };

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(dataWithoutServings)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    
    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        servings: null
      })
    );
  });

  it('debería validar límites de duración', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

    const invalidDuration = {
      ...validUpdateData,
      duration_minutes: 700 // Máximo 600
    };

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(invalidDuration)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.error).toBe('Validación fallida');
  });

  it('debería validar límites de porciones', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

    const invalidServings = {
      ...validUpdateData,
      servings: 25 // Máximo 20
    };

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'PATCH',
      body: JSON.stringify(invalidServings)
    });

    const response = await PATCH(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.error).toBe('Validación fallida');
  });
});
