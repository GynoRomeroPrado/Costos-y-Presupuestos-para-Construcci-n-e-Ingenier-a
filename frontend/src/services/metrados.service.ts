import api from './api';

export interface Metrado {
  id: string;
  proyectoId: string;
  partidaId: string;
  acuId?: string;
  cantidad: number;
  unidadMedida: string;
  costoUnitario: number;
  costoParcial: number;
  agrupacion?: string;
  observaciones?: string;
  ordenVisualizacion: number;
  partida?: {
    id: string;
    codigo: string;
    nombre: string;
    especialidad: string;
  };
  acu?: {
    id: string;
    codigo: string;
    version: number;
    costoUnitarioCalculado: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetradoDto {
  proyectoId: string;
  partidaId: string;
  acuId?: string;
  cantidad: number;
  agrupacion?: string;
  observaciones?: string;
  ordenVisualizacion?: number;
}

export interface UpdateMetradoDto {
  cantidad?: number;
  acuId?: string;
  agrupacion?: string;
  observaciones?: string;
  ordenVisualizacion?: number;
}

export const metradosService = {
  async getAll(params?: { proyectoId?: string; page?: number; limit?: number }) {
    const response = await api.get('/metrados', { params });
    return response.data;
  },

  async getByProyecto(proyectoId: string): Promise<Metrado[]> {
    const response = await api.get(`/metrados/proyecto/${proyectoId}`);
    return response.data;
  },

  async getById(id: string): Promise<Metrado> {
    const response = await api.get(`/metrados/${id}`);
    return response.data;
  },

  async create(data: CreateMetradoDto): Promise<Metrado> {
    const response = await api.post('/metrados', data);
    return response.data;
  },

  async update(id: string, data: UpdateMetradoDto): Promise<Metrado> {
    const response = await api.patch(`/metrados/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/metrados/${id}`);
  },

  async recalcular(id: string): Promise<Metrado> {
    const response = await api.post(`/metrados/${id}/recalcular`);
    return response.data;
  },

  async bulkCreate(metrados: CreateMetradoDto[]): Promise<Metrado[]> {
    const response = await api.post('/metrados/bulk', metrados);
    return response.data;
  },
};
