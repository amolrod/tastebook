import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from '@/app/api/recipes/[id]/route';

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
const mockDelete = vi.fn();

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession
    },
    from: mockFrom
  }))
}));

describe('DELETE /api/recipes/[id]', () => {
  const validRecipeId = 'recipe-123';
  const userId = 'user-456';
  const mockRecipe = {
    id: validRecipeId,
    owner_id: userId
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup de variables de entorno
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    // Setup de cadena de mocks de Supabase
    mockFrom.mockReturnValue({
      select: mockSelect,
      delete: mockDelete
    });
    mockSelect.mockReturnValue({
      eq: mockEq
    });
    mockEq.mockReturnValue({
      eq: mockEq,
      maybeSingle: mockMaybeSingle
    });
    mockDelete.mockReturnValue({
      eq: mockEq
    });
  });

  it('debería retornar 503 si Supabase no está configurado', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe('Supabase no configurado');
  });

  it('debería retornar 401 si no hay sesión', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('No autenticado');
  });

  it('debería retornar 400 si el ID es inválido', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/', {
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: '' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('ID de receta inválido');
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
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });
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
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('No tienes permiso para eliminar esta receta');
  });

  it('debería retornar 500 si hay error al verificar la receta', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'Database error' }
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error al verificar receta');
  });

  it('debería retornar 500 si hay error al eliminar', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: mockRecipe,
      error: null
    });

    // Mock para que el delete falle
    const mockDeleteEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Delete failed' }
    });
    mockDelete.mockReturnValue({
      eq: mockDeleteEq
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Error al eliminar receta');
  });

  it('debería eliminar la receta exitosamente y retornar 204', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: mockRecipe,
      error: null
    });

    const mockDeleteEq = vi.fn().mockResolvedValue({
      data: null,
      error: null
    });
    mockDelete.mockReturnValue({
      eq: mockDeleteEq
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'DELETE'
    });

    const response = await DELETE(request, { params: { id: validRecipeId } });

    expect(response.status).toBe(204);
    expect(mockDelete).toHaveBeenCalled();
    // 204 No Content no debe tener body
    expect(response.body).toBeNull();
  });

  it('debería llamar a delete con el ID correcto', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    mockMaybeSingle.mockResolvedValue({
      data: mockRecipe,
      error: null
    });

    const mockDeleteEq = vi.fn().mockResolvedValue({
      data: null,
      error: null
    });
    mockDelete.mockReturnValue({
      eq: mockDeleteEq
    });

    const request = new NextRequest('http://localhost:3000/api/recipes/recipe-123', {
      method: 'DELETE'
    });

    await DELETE(request, { params: { id: validRecipeId } });

    expect(mockFrom).toHaveBeenCalledWith('recipes');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockDeleteEq).toHaveBeenCalledWith('id', validRecipeId);
  });
});
