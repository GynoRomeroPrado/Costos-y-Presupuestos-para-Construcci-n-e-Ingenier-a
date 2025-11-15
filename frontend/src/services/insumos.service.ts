import api from './api';

export interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  tipo: 'material' | 'mano_obra' | 'equipo' | 'subcontrato';
  precioUnitario: number;
  moneda: string;
  precioAnterior?: number;
  proveedor?: string;
  marca?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInsumoDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  tipo: 'material' | 'mano_obra' | 'equipo' | 'subcontrato';
  precioUnitario: number;
  moneda?: string;
  proveedor?: string;
  marca?: string;
}

export interface UpdateInsumoDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  unidadMedida?: string;
  tipo?: 'material' | 'mano_obra' | 'equipo' | 'subcontrato';
  precioUnitario?: number;
  moneda?: string;
  proveedor?: string;
  marca?: string;
  activo?: boolean;
}

export const insumosService = {
  async getAll(params?: {
    tipo?: string;
    search?: string;
    activo?: boolean;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/insumos', { params });
    return response.data;
  },

  async getById(id: string): Promise<Insumo> {
    const response = await api.get(`/insumos/${id}`);
    return response.data;
  },

  async create(data: CreateInsumoDto): Promise<Insumo> {
    const response = await api.post('/insumos', data);
    return response.data;
  },

  async update(id: string, data: UpdateInsumoDto): Promise<Insumo> {
    const response = await api.patch(`/insumos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/insumos/${id}`);
  },

  async hardDelete(id: string): Promise<void> {
    await api.delete(`/insumos/${id}/hard`);
  },

  async importar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/insumos/importar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async descargarPlantilla(): Promise<Blob> {
    const response = await api.get('/insumos/plantilla/descargar', {
      responseType: 'blob',
    });
    return response.data;
  },

  async getEstadisticas() {
    const response = await api.get('/insumos/estadisticas');
    return response.data;
  },

  async bulkCreate(insumos: CreateInsumoDto[]): Promise<Insumo[]> {
    const response = await api.post('/insumos/bulk', insumos);
    return response.data;
  },
};
