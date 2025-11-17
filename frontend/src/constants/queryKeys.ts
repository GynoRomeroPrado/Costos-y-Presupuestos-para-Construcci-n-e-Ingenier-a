/**
 * Query keys centralizados para React Query
 * Esto facilita la invalidación y gestión de caché
 */

export const queryKeys = {
  // Insumos
  insumos: {
    all: ['insumos'] as const,
    lists: () => [...queryKeys.insumos.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.insumos.lists(), filters] as const,
    details: () => [...queryKeys.insumos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.insumos.details(), id] as const,
    estadisticas: () => [...queryKeys.insumos.all, 'estadisticas'] as const,
  },

  // Partidas
  partidas: {
    all: ['partidas'] as const,
    lists: () => [...queryKeys.partidas.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.partidas.lists(), filters] as const,
    details: () => [...queryKeys.partidas.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.partidas.details(), id] as const,
    especialidades: () => [...queryKeys.partidas.all, 'especialidades'] as const,
  },

  // ACU
  acu: {
    all: ['acus'] as const,
    lists: () => [...queryKeys.acu.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.acu.lists(), filters] as const,
    details: () => [...queryKeys.acu.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.acu.details(), id] as const,
    estadisticas: () => [...queryKeys.acu.all, 'estadisticas'] as const,
  },

  // Proyectos
  proyectos: {
    all: ['proyectos'] as const,
    lists: () => [...queryKeys.proyectos.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.proyectos.lists(), filters] as const,
    details: () => [...queryKeys.proyectos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.proyectos.details(), id] as const,
    metrados: (proyectoId: string) =>
      [...queryKeys.proyectos.detail(proyectoId), 'metrados'] as const,
  },

  // Metrados
  metrados: {
    all: ['metrados'] as const,
    lists: () => [...queryKeys.metrados.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.metrados.lists(), filters] as const,
    details: () => [...queryKeys.metrados.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.metrados.details(), id] as const,
    byProyecto: (proyectoId: string) =>
      [...queryKeys.metrados.lists(), 'proyecto', proyectoId] as const,
  },

  // Proveedores
  proveedores: {
    all: ['proveedores'] as const,
    lists: () => [...queryKeys.proveedores.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.proveedores.lists(), filters] as const,
    details: () => [...queryKeys.proveedores.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.proveedores.details(), id] as const,
  },
} as const;

/**
 * Type helper para extraer el tipo de una query key
 */
export type QueryKey = typeof queryKeys;

/**
 * Helper para invalidar queries relacionadas
 */
export const queryInvalidations = {
  // Cuando se crea/actualiza un insumo, invalidar listas y estadísticas
  onInsumoMutate: () => [queryKeys.insumos.lists(), queryKeys.insumos.estadisticas()],

  // Cuando se crea/actualiza una partida, invalidar listas
  onPartidaMutate: () => [queryKeys.partidas.lists()],

  // Cuando se crea/actualiza un ACU, invalidar listas y estadísticas
  onAcuMutate: () => [queryKeys.acu.lists(), queryKeys.acu.estadisticas()],

  // Cuando se crea/actualiza un proyecto, invalidar listas y metrados relacionados
  onProyectoMutate: (proyectoId?: string) => {
    const keys: any[] = [queryKeys.proyectos.lists()];
    if (proyectoId) {
      keys.push(queryKeys.proyectos.metrados(proyectoId));
    }
    return keys;
  },

  // Cuando se crea/actualiza un metrado, invalidar proyecto relacionado
  onMetradoMutate: (proyectoId: string) => [
    queryKeys.metrados.byProyecto(proyectoId),
    queryKeys.proyectos.detail(proyectoId),
  ],

  // Cuando se crea/actualiza un proveedor, invalidar listas
  onProveedorMutate: () => [queryKeys.proveedores.lists()],
};
