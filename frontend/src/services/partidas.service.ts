import api from './api';

export interface Partida {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  especialidad: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartidaDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  especialidad: string;
}

export interface UpdatePartidaDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  unidadMedida?: string;
  especialidad?: string;
  activo?: boolean;
}

export const partidasService = {
  async getAll(params?: {
    especialidad?: string;
    search?: string;
    activo?: boolean;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/partidas', { params });
    return response.data;
  },

  async getById(id: string): Promise<Partida> {
    const response = await api.get(`/partidas/${id}`);
    return response.data;
  },

  async create(data: CreatePartidaDto): Promise<Partida> {
    const response = await api.post('/partidas', data);
    return response.data;
  },

  async update(id: string, data: UpdatePartidaDto): Promise<Partida> {
    const response = await api.patch(`/partidas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/partidas/${id}`);
  },

  async hardDelete(id: string): Promise<void> {
    await api.delete(`/partidas/${id}/hard`);
  },

  async getEspecialidades(): Promise<string[]> {
    const response = await api.get('/partidas/especialidades');
    return response.data;
  },
};
