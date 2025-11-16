import api from './api';

export interface Proveedor {
  id: string;
  nombre: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  especialidad?: string;
  observaciones?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProveedorDto {
  nombre: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  especialidad?: string;
  observaciones?: string;
  activo?: boolean;
}

export interface UpdateProveedorDto {
  nombre?: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  especialidad?: string;
  observaciones?: string;
  activo?: boolean;
}

export const proveedoresService = {
  async getAll(): Promise<Proveedor[]> {
    const response = await api.get('/proveedores');
    return response.data;
  },

  async getById(id: string): Promise<Proveedor> {
    const response = await api.get(`/proveedores/${id}`);
    return response.data;
  },

  async create(data: CreateProveedorDto): Promise<Proveedor> {
    const response = await api.post('/proveedores', data);
    return response.data;
  },

  async update(id: string, data: UpdateProveedorDto): Promise<Proveedor> {
    const response = await api.patch(`/proveedores/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/proveedores/${id}`);
  },
};
