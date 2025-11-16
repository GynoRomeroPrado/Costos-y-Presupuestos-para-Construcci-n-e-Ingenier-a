import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { CreatePartidaDto, Partida } from '../services/partidas.service';

interface PartidaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePartidaDto) => void;
  partida?: Partida;
  isLoading?: boolean;
}

const ESPECIALIDADES = [
  'Obras Preliminares',
  'Movimiento de Tierras',
  'Obras de Concreto Simple',
  'Obras de Concreto Armado',
  'Estructuras Metálicas',
  'Arquitectura',
  'Instalaciones Sanitarias',
  'Instalaciones Eléctricas',
  'Instalaciones Mecánicas',
  'Acabados',
  'Varios',
];

const UNIDADES_MEDIDA = [
  'm',
  'm2',
  'm3',
  'kg',
  'tn',
  'und',
  'pza',
  'glb',
  'ml',
  'día',
  'hh',
  'hm',
  'lt',
  'gal',
  'bls',
];

export function PartidaForm({ isOpen, onClose, onSubmit, partida, isLoading }: PartidaFormProps) {
  const [formData, setFormData] = useState<CreatePartidaDto>({
    codigo: '',
    nombre: '',
    descripcion: '',
    unidadMedida: 'm',
    especialidad: 'Obras Preliminares',
  });

  useEffect(() => {
    if (partida) {
      setFormData({
        codigo: partida.codigo,
        nombre: partida.nombre,
        descripcion: partida.descripcion || '',
        unidadMedida: partida.unidadMedida,
        especialidad: partida.especialidad,
      });
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        unidadMedida: 'm',
        especialidad: 'Obras Preliminares',
      });
    }
  }, [partida, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={partida ? 'Editar Partida' : 'Nueva Partida'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Ej: 01.01.01"
          />
          <p className="text-xs text-gray-500 mt-1">
            Código de partida según estructura CAPECO o propia
          </p>
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
            placeholder="Ej: Limpieza de terreno manual"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Unidad de Medida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad de Medida <span className="text-red-500">*</span>
            </label>
            <select
              name="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UNIDADES_MEDIDA.map((unidad) => (
                <option key={unidad} value={unidad}>
                  {unidad}
                </option>
              ))}
            </select>
          </div>

          {/* Especialidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad <span className="text-red-500">*</span>
            </label>
            <select
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ESPECIALIDADES.map((especialidad) => (
                <option key={especialidad} value={especialidad}>
                  {especialidad}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción detallada de la partida (opcional)"
          />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : partida ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
