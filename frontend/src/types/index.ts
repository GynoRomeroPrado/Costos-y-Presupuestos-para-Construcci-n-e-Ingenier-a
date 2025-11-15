// Tipos comunes del sistema

export enum InsumoTipo {
  MATERIAL = 'material',
  MANO_OBRA = 'mano_obra',
  EQUIPO = 'equipo',
  SUBCONTRATO = 'subcontrato',
}

export enum Moneda {
  PEN = 'PEN',
  USD = 'USD',
  EUR = 'EUR',
}

export enum ProyectoEstado {
  BORRADOR = 'borrador',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

export enum UserRole {
  ADMIN = 'admin',
  INGENIERO_COSTOS = 'ingeniero_costos',
  PROYECTISTA = 'proyectista',
  VISUALIZADOR = 'visualizador',
}

export interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  tipo: InsumoTipo;
  precioUnitario: number;
  moneda: Moneda;
  proveedorId?: string;
  activo: boolean;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partida {
  id: string;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  especialidad?: string;
  descripcion?: string;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Proyecto {
  id: string;
  nombre: string;
  cliente?: string;
  ubicacion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado: ProyectoEstado;
  descripcion?: string;
  monedaBase: Moneda;
  costoDirecto: number;
  gastosGenerales: number;
  utilidad: number;
  presupuestoTotal: number;
  createdAt: Date;
  updatedAt: Date;
}
