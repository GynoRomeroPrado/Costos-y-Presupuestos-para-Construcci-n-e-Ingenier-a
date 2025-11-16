import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Insumo, CreateInsumoDto } from '../services/insumos.service';

interface InsumoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInsumoDto) => void;
  insumo?: Insumo;
  isLoading?: boolean;
}

export function InsumoForm({ isOpen, onClose, onSubmit, insumo, isLoading }: InsumoFormProps) {
  const [formData, setFormData] = useState<CreateInsumoDto>({
    codigo: '',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    tipo: 'material',
    precioUnitario: 0,
    moneda: 'PEN',
    proveedor: '',
    marca: '',
  });

  useEffect(() => {
    if (insumo) {
      setFormData({
        codigo: insumo.codigo,
        nombre: insumo.nombre,
        descripcion: insumo.descripcion || '',
        unidadMedida: insumo.unidadMedida,
        tipo: insumo.tipo,
        precioUnitario: insumo.precioUnitario,
        moneda: insumo.moneda,
        proveedor: insumo.proveedor || '',
        marca: insumo.marca || '',
      });
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        unidadMedida: '',
        tipo: 'material',
        precioUnitario: 0,
        moneda: 'PEN',
        proveedor: '',
        marca: '',
      });
    }
  }, [insumo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'precioUnitario' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={insumo ? 'Editar Insumo' : 'Nuevo Insumo'}
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
              placeholder="Ej: MAT-001"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="material">Material</option>
              <option value="mano_obra">Mano de Obra</option>
              <option value="equipo">Equipo</option>
              <option value="subcontrato">Subcontrato</option>
            </select>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Cemento Portland Tipo I"
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
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción detallada del insumo"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Unidad de Medida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: BOL, M3, KG"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="precioUnitario"
              value={formData.precioUnitario}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda
            </label>
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PEN">PEN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor
            </label>
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del proveedor"
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marca del producto"
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
            {isLoading ? 'Guardando...' : insumo ? 'Actualizar' : 'Crear Insumo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
