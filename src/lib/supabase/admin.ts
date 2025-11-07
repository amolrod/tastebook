// Obsoleto: el uso del service role fue reemplazado por `createRouteHandlerClient`
// con políticas RLS en los endpoints API.
// Mantenemos un stub para evitar breaking changes en imports legacy.

export function getAdminSupabaseClient() {
  return null;
}
