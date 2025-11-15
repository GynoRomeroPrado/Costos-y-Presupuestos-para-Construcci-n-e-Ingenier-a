import api from './api';

export interface Acu {
  id: string;
  codigo: string;
  partidaId: string;
  version: number;
  rendimiento: number;
  costoUnitarioCalculado: number;
  costoMateriales: number;
  costoManoObra: number;
  costoEquipo: number;
  costoSubcontrato: number;
  cuadrilla?: any;
  observaciones?: string;
  activo: boolean;
  partida?: {
    id: string;
    codigo: string;
    nombre: string;
    unidadMedida: string;
  };
  acuInsumos?: AcuInsumo[];
  createdAt: string;
  updatedAt: string;
}

export interface AcuInsumo {
  id?: string;
  insumoId: string;
  cantidad: number;
  desperdicio: number;
  precioUnitarioSnapshot: number;
  costoParcial: number;
  insumo?: {
    id: string;
    codigo: string;
    nombre: string;
    unidadMedida: string;
    tipo: string;
    precioUnitario: number;
  };
}

export interface CreateAcuDto {
  partidaId: string;
  rendimiento: number;
  cuadrilla?: any;
  observaciones?: string;
  insumos: {
    insumoId: string;
    cantidad: number;
    desperdicio?: number;
  }[];
}

export interface UpdateAcuDto {
  rendimiento?: number;
  cuadrilla?: any;
  observaciones?: string;
  activo?: boolean;
}

export interface AddInsumoDto {
  insumoId: string;
  cantidad: number;
  desperdicio?: number;
}

export const acuService = {
  async getAll(params?: { partidaId?: string; activo?: boolean; page?: number; limit?: number }) {
    const response = await api.get('/acu', { params });
    return response.data;
  },

  async getById(id: string): Promise<Acu> {
    const response = await api.get(`/acu/${id}`);
    return response.data;
  },

  async create(data: CreateAcuDto): Promise<Acu> {
    const response = await api.post('/acu', data);
    return response.data;
  },

  async update(id: string, data: UpdateAcuDto): Promise<Acu> {
    const response = await api.patch(`/acu/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/acu/${id}`);
  },

  async agregarInsumo(id: string, insumo: AddInsumoDto): Promise<Acu> {
    const response = await api.post(`/acu/${id}/insumos`, insumo);
    return response.data;
  },

  async actualizarInsumo(id: string, insumoId: string, data: { cantidad?: number; desperdicio?: number }): Promise<Acu> {
    const response = await api.patch(`/acu/${id}/insumos/${insumoId}`, data);
    return response.data;
  },

  async eliminarInsumo(id: string, insumoId: string): Promise<void> {
    await api.delete(`/acu/${id}/insumos/${insumoId}`);
  },

  async calcular(id: string): Promise<Acu> {
    const response = await api.post(`/acu/${id}/calcular`);
    return response.data;
  },

  async duplicar(id: string): Promise<Acu> {
    const response = await api.post(`/acu/${id}/duplicar`);
    return response.data;
  },

  async desactivar(id: string): Promise<Acu> {
    const response = await api.patch(`/acu/${id}/desactivar`);
    return response.data;
  },

  async getEstadisticas() {
    const response = await api.get('/acu/estadisticas');
    return response.data;
  },
};
