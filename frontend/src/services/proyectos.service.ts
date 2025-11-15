import api from './api';

export interface Proyecto {
  id: string;
  codigo: string;
  nombre: string;
  cliente?: string;
  ubicacion?: string;
  descripcion?: string;
  monedaBase: string;
  igvPorcentaje: number;
  costoDirecto: number;
  gastosGenerales: number;
  utilidad: number;
  subtotal: number;
  igv: number;
  presupuestoTotal: number;
  gastosGeneralesList: GastoGeneral[];
  estado: string;
  fechaInicio?: string;
  fechaFin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GastoGeneral {
  id?: string;
  concepto: string;
  tipo: 'fijo' | 'porcentaje';
  monto?: number;
  porcentaje?: number;
}

export interface CreateProyectoDto {
  codigo: string;
  nombre: string;
  cliente?: string;
  ubicacion?: string;
  descripcion?: string;
  monedaBase?: string;
  igvPorcentaje?: number;
  utilidad?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface UpdateProyectoDto {
  codigo?: string;
  nombre?: string;
  cliente?: string;
  ubicacion?: string;
  descripcion?: string;
  monedaBase?: string;
  igvPorcentaje?: number;
  utilidad?: number;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export const proyectosService = {
  async getAll(params?: { page?: number; limit?: number }) {
    const response = await api.get('/proyectos', { params });
    return response.data;
  },

  async getById(id: string): Promise<Proyecto> {
    const response = await api.get(`/proyectos/${id}`);
    return response.data;
  },

  async create(data: CreateProyectoDto): Promise<Proyecto> {
    const response = await api.post('/proyectos', data);
    return response.data;
  },

  async update(id: string, data: UpdateProyectoDto): Promise<Proyecto> {
    const response = await api.patch(`/proyectos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/proyectos/${id}`);
  },

  async calcularPresupuesto(id: string): Promise<Proyecto> {
    const response = await api.post(`/proyectos/${id}/calcular`);
    return response.data;
  },

  async agregarGastoGeneral(id: string, gasto: GastoGeneral): Promise<Proyecto> {
    const response = await api.post(`/proyectos/${id}/gastos`, gasto);
    return response.data;
  },

  async eliminarGastoGeneral(id: string, gastoId: string): Promise<void> {
    await api.delete(`/proyectos/${id}/gastos/${gastoId}`);
  },

  async descargarExcel(id: string): Promise<Blob> {
    const response = await api.get(`/proyectos/${id}/reporte/excel`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async descargarPDF(id: string): Promise<Blob> {
    const response = await api.get(`/proyectos/${id}/reporte/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async importarMetrados(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/proyectos/${id}/metrados/importar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async descargarPlantillaMetrados(): Promise<Blob> {
    const response = await api.get('/proyectos/plantilla/metrados', {
      responseType: 'blob',
    });
    return response.data;
  },
};
