import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Proyecto, CreateProyectoDto } from '../services/proyectos.service';

interface ProyectoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProyectoDto) => void;
  proyecto?: Proyecto;
  isLoading?: boolean;
}

export function ProyectoForm({ isOpen, onClose, onSubmit, proyecto, isLoading }: ProyectoFormProps) {
  const [formData, setFormData] = useState<CreateProyectoDto>({
    codigo: '',
    nombre: '',
    cliente: '',
    ubicacion: '',
    descripcion: '',
    monedaBase: 'PEN',
    igvPorcentaje: 18,
    utilidad: 0,
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => {
    if (proyecto) {
      setFormData({
        codigo: proyecto.codigo,
        nombre: proyecto.nombre,
        cliente: proyecto.cliente || '',
        ubicacion: proyecto.ubicacion || '',
        descripcion: proyecto.descripcion || '',
        monedaBase: proyecto.monedaBase,
        igvPorcentaje: proyecto.igvPorcentaje,
        utilidad: proyecto.utilidad,
        fechaInicio: proyecto.fechaInicio ? proyecto.fechaInicio.split('T')[0] : '',
        fechaFin: proyecto.fechaFin ? proyecto.fechaFin.split('T')[0] : '',
      });
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        cliente: '',
        ubicacion: '',
        descripcion: '',
        monedaBase: 'PEN',
        igvPorcentaje: 18,
        utilidad: 0,
        fechaInicio: '',
        fechaFin: '',
      });
    }
  }, [proyecto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['igvPorcentaje', 'utilidad'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: PROY-2024-001"
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda Base
            </label>
            <select
              name="monedaBase"
              value={formData.monedaBase}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PEN">Soles (PEN)</option>
              <option value="USD">Dólares (USD)</option>
              <option value="EUR">Euros (EUR)</option>
            </select>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Construcción de Edificio Multifamiliar"
          />
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del cliente"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dirección o ubicación de la obra"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción general del proyecto"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* IGV % */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IGV (%)
            </label>
            <input
              type="number"
              name="igvPorcentaje"
              value={formData.igvPorcentaje}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Utilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Utilidad
            </label>
            <input
              type="number"
              name="utilidad"
              value={formData.utilidad}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : proyecto ? 'Actualizar' : 'Crear Proyecto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
