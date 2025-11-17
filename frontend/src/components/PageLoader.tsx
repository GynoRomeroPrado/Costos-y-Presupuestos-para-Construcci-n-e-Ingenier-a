import { Loader2 } from 'lucide-react';

/**
 * Componente de carga para lazy loading de páginas
 */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

/**
 * Loader inline para suspense boundaries más pequeños
 */
export function InlineLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    </div>
  );
}
