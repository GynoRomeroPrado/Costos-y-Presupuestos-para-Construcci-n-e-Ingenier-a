import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from './Modal';
import { CreateAcuDto } from '../services/acu.service';
import { partidasService } from '../services/partidas.service';
import { insumosService } from '../services/insumos.service';
import { Plus, Trash2 } from 'lucide-react';

interface AcuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAcuDto) => void;
  isLoading?: boolean;
}

interface InsumoRow {
  tempId: string;
  insumoId: string;
  cantidad: number;
  desperdicio: number;
}

export function AcuForm({ isOpen, onClose, onSubmit, isLoading }: AcuFormProps) {
  const [partidaId, setPartidaId] = useState('');
  const [rendimiento, setRendimiento] = useState(1);
  const [observaciones, setObservaciones] = useState('');
  const [insumos, setInsumos] = useState<InsumoRow[]>([]);

  // Fetch partidas for dropdown
  const { data: partidasData } = useQuery({
    queryKey: ['partidas'],
    queryFn: () => partidasService.getAll({ limit: 1000 }),
    enabled: isOpen,
  });

  // Fetch insumos for dropdown
  const { data: insumosData } = useQuery({
    queryKey: ['insumos'],
    queryFn: () => insumosService.getAll({ limit: 1000 }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      setPartidaId('');
      setRendimiento(1);
      setObservaciones('');
      setInsumos([]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (insumos.length === 0) {
      alert('Debes agregar al menos un insumo');
      return;
    }

    const data: CreateAcuDto = {
      partidaId,
      rendimiento,
      observaciones: observaciones || undefined,
      insumos: insumos.map(({ insumoId, cantidad, desperdicio }) => ({
        insumoId,
        cantidad,
        desperdicio,
      })),
    };

    onSubmit(data);
  };

  const addInsumoRow = () => {
    setInsumos([
      ...insumos,
      {
        tempId: Math.random().toString(36).substring(7),
        insumoId: '',
        cantidad: 0,
        desperdicio: 0,
      },
    ]);
  };

  const removeInsumoRow = (tempId: string) => {
    setInsumos(insumos.filter((i) => i.tempId !== tempId));
  };

  const updateInsumoRow = (tempId: string, field: keyof InsumoRow, value: any) => {
    setInsumos(
      insumos.map((i) =>
        i.tempId === tempId ? { ...i, [field]: value } : i
      )
    );
  };

  const getInsumoInfo = (insumoId: string) => {
    return insumosData?.items?.find((i: any) => i.id === insumoId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Análisis de Costo Unitario"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Partida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partida <span className="text-red-500">*</span>
          </label>
          <select
            value={partidaId}
            onChange={(e) => setPartidaId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar partida...</option>
            {partidasData?.items?.map((partida: any) => (
              <option key={partida.id} value={partida.id}>
                {partida.codigo} - {partida.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Rendimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rendimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={rendimiento}
              onChange={(e) => setRendimiento(parseFloat(e.target.value) || 1)}
              required
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unidades producidas por jornada
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total de Insumos
            </label>
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium">
              {insumos.length} insumo(s)
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones adicionales sobre el ACU"
          />
        </div>

        {/* Insumos Table */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Insumos <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addInsumoRow}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar Insumo
            </button>
          </div>

          {insumos.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">
                No hay insumos agregados. Haz clic en "Agregar Insumo" para comenzar.
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Insumo
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Unidad
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Desperdicio (%)
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {insumos.map((row) => {
                    const insumoInfo = getInsumoInfo(row.insumoId);
                    return (
                      <tr key={row.tempId}>
                        <td className="px-3 py-2">
                          <select
                            value={row.insumoId}
                            onChange={(e) =>
                              updateInsumoRow(row.tempId, 'insumoId', e.target.value)
                            }
                            required
                            className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar...</option>
                            {insumosData?.items?.map((insumo: any) => (
                              <option key={insumo.id} value={insumo.id}>
                                {insumo.codigo} - {insumo.nombre}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {insumoInfo?.unidadMedida || '-'}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={row.cantidad}
                            onChange={(e) =>
                              updateInsumoRow(
                                row.tempId,
                                'cantidad',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            required
                            step="0.0001"
                            min="0"
                            className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={row.desperdicio}
                            onChange={(e) =>
                              updateInsumoRow(
                                row.tempId,
                                'desperdicio',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            step="0.01"
                            min="0"
                            max="100"
                            className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeInsumoRow(row.tempId)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
            disabled={isLoading || insumos.length === 0 || !partidaId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creando...' : 'Crear ACU'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
