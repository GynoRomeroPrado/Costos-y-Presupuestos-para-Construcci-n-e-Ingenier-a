import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from './Modal';
import { CreateMetradoDto, metradosService } from '../services/metrados.service';
import { proyectosService } from '../services/proyectos.service';
import { partidasService } from '../services/partidas.service';
import { acuService } from '../services/acu.service';
import { Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface MetradosEditorProps {
  isOpen: boolean;
  onClose: () => void;
  proyectoIdProp?: string;
}

interface MetradoRow {
  tempId: string;
  partidaId: string;
  acuId: string;
  cantidad: number;
  agrupacion: string;
  observaciones: string;
}

export function MetradosEditor({ isOpen, onClose, proyectoIdProp }: MetradosEditorProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [proyectoId, setProyectoId] = useState(proyectoIdProp || '');
  const [metrados, setMetrados] = useState<MetradoRow[]>([]);

  // Fetch proyectos for dropdown
  const { data: proyectosData } = useQuery({
    queryKey: ['proyectos'],
    queryFn: () => proyectosService.getAll({ limit: 1000 }),
    enabled: isOpen && !proyectoIdProp,
  });

  // Fetch partidas for dropdown
  const { data: partidasData } = useQuery({
    queryKey: ['partidas'],
    queryFn: () => partidasService.getAll({ limit: 1000 }),
    enabled: isOpen,
  });

  // Fetch ACUs for dropdown
  const { data: acusData } = useQuery({
    queryKey: ['acus'],
    queryFn: () => acuService.getAll({ activo: true, limit: 1000 }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (proyectoIdProp) {
      setProyectoId(proyectoIdProp);
    }
  }, [proyectoIdProp]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      if (!proyectoIdProp) {
        setProyectoId('');
      }
      setMetrados([]);
    }
  }, [isOpen, proyectoIdProp]);

  const bulkCreateMutation = useMutation({
    mutationFn: (data: CreateMetradoDto[]) => metradosService.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrados'] });
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success(`${metrados.length} metrado(s) guardado(s) exitosamente`);
      onClose();
    },
    onError: () => {
      toast.error('Error al guardar metrados');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!proyectoId) {
      toast.error('Debes seleccionar un proyecto');
      return;
    }

    if (metrados.length === 0) {
      toast.error('Debes agregar al menos un metrado');
      return;
    }

    // Validate all rows
    const invalidRows = metrados.filter((m) => !m.partidaId || m.cantidad <= 0);
    if (invalidRows.length > 0) {
      toast.error('Todos los metrados deben tener partida y cantidad válida');
      return;
    }

    const data: CreateMetradoDto[] = metrados.map((m, index) => ({
      proyectoId,
      partidaId: m.partidaId,
      acuId: m.acuId || undefined,
      cantidad: m.cantidad,
      agrupacion: m.agrupacion || undefined,
      observaciones: m.observaciones || undefined,
      ordenVisualizacion: index + 1,
    }));

    bulkCreateMutation.mutate(data);
  };

  const addMetradoRow = () => {
    setMetrados([
      ...metrados,
      {
        tempId: Math.random().toString(36).substring(7),
        partidaId: '',
        acuId: '',
        cantidad: 0,
        agrupacion: '',
        observaciones: '',
      },
    ]);
  };

  const removeMetradoRow = (tempId: string) => {
    setMetrados(metrados.filter((m) => m.tempId !== tempId));
  };

  const updateMetradoRow = (tempId: string, field: keyof MetradoRow, value: any) => {
    setMetrados(
      metrados.map((m) => {
        if (m.tempId === tempId) {
          const updated = { ...m, [field]: value };

          // If partida changes, reset ACU
          if (field === 'partidaId') {
            updated.acuId = '';
          }

          return updated;
        }
        return m;
      })
    );
  };

  const getPartidaInfo = (partidaId: string) => {
    return partidasData?.items?.find((p: any) => p.id === partidaId);
  };

  const getAcuInfo = (acuId: string) => {
    return acusData?.items?.find((a: any) => a.id === acuId);
  };

  const getAvailableAcus = (partidaId: string) => {
    if (!partidaId || !acusData?.items) return [];
    return acusData.items.filter((a: any) => a.partidaId === partidaId);
  };

  const calculateCostoParcial = (row: MetradoRow) => {
    if (!row.acuId || !row.cantidad) return 0;
    const acu = getAcuInfo(row.acuId);
    return acu ? acu.costoUnitarioCalculado * row.cantidad : 0;
  };

  const getTotalCost = () => {
    return metrados.reduce((sum, row) => sum + calculateCostoParcial(row), 0);
  };

  const formatCurrency = (value: number) => {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editor de Metrados" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Proyecto */}
        {!proyectoIdProp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proyecto <span className="text-red-500">*</span>
            </label>
            <select
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar proyecto...</option>
              {proyectosData?.items?.map((proyecto: any) => (
                <option key={proyecto.id} value={proyecto.id}>
                  {proyecto.codigo} - {proyecto.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Total Metrados</p>
            <p className="text-lg font-semibold text-gray-900">{metrados.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Con ACU asignado</p>
            <p className="text-lg font-semibold text-gray-900">
              {metrados.filter((m) => m.acuId).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Costo Total Estimado</p>
            <p className="text-lg font-semibold text-green-700">{formatCurrency(getTotalCost())}</p>
          </div>
        </div>

        {/* Metrados Table */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Metrados <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addMetradoRow}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar Fila
            </button>
          </div>

          {metrados.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">
                No hay metrados agregados. Haz clic en "Agregar Fila" para comenzar.
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Partida
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      ACU
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Agrupación
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Observaciones
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Parcial
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Acc.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrados.map((row) => {
                    const partidaInfo = getPartidaInfo(row.partidaId);
                    const acusDisponibles = getAvailableAcus(row.partidaId);
                    const costoParcial = calculateCostoParcial(row);

                    return (
                      <tr key={row.tempId} className="hover:bg-gray-50">
                        <td className="px-2 py-2">
                          <select
                            value={row.partidaId}
                            onChange={(e) =>
                              updateMetradoRow(row.tempId, 'partidaId', e.target.value)
                            }
                            required
                            className="w-48 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar...</option>
                            {partidasData?.items?.map((partida: any) => (
                              <option key={partida.id} value={partida.id}>
                                {partida.codigo} - {partida.nombre.substring(0, 30)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={row.acuId}
                            onChange={(e) => updateMetradoRow(row.tempId, 'acuId', e.target.value)}
                            disabled={!row.partidaId}
                            className="w-32 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                          >
                            <option value="">Sin ACU</option>
                            {acusDisponibles.map((acu: any) => (
                              <option key={acu.id} value={acu.id}>
                                {acu.codigo} (v{acu.version})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={row.cantidad}
                            onChange={(e) =>
                              updateMetradoRow(
                                row.tempId,
                                'cantidad',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            required
                            step="0.01"
                            min="0"
                            className="w-24 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.agrupacion}
                            onChange={(e) =>
                              updateMetradoRow(row.tempId, 'agrupacion', e.target.value)
                            }
                            className="w-24 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Opcional"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.observaciones}
                            onChange={(e) =>
                              updateMetradoRow(row.tempId, 'observaciones', e.target.value)
                            }
                            className="w-32 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Opcional"
                          />
                        </td>
                        <td className="px-2 py-2 text-right text-xs font-semibold text-gray-900">
                          {costoParcial > 0 ? formatCurrency(costoParcial) : '-'}
                        </td>
                        <td className="px-2 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeMetradoRow(row.tempId)}
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
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {metrados.length > 0 && (
              <span>
                Total a guardar: <strong className="text-gray-900">{metrados.length}</strong>{' '}
                metrado(s)
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={bulkCreateMutation.isPending}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                bulkCreateMutation.isPending || metrados.length === 0 || !proyectoId
              }
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {bulkCreateMutation.isPending
                ? 'Guardando...'
                : `Guardar ${metrados.length} Metrado(s)`}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
