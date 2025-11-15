import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { acuService, Acu } from '../services/acu.service';
import { partidasService } from '../services/partidas.service';
import { insumosService } from '../services/insumos.service';
import { Plus, Eye, Copy, Power, Calculator } from 'lucide-react';

export default function AcuPage() {
  const queryClient = useQueryClient();
  const [selectedAcu, setSelectedAcu] = useState<Acu | null>(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['acus'],
    queryFn: () => acuService.getAll(),
  });

  const { data: partidas } = useQuery({
    queryKey: ['partidas'],
    queryFn: () => partidasService.getAll(),
  });

  const duplicarMutation = useMutation({
    mutationFn: (id: string) => acuService.duplicar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acus'] });
      alert('ACU duplicado exitosamente');
    },
  });

  const desactivarMutation = useMutation({
    mutationFn: (id: string) => acuService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acus'] });
      alert('ACU desactivado');
    },
  });

  const calcularMutation = useMutation({
    mutationFn: (id: string) => acuService.calcular(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acus'] });
      if (selectedAcu) {
        setShowDetalle(false);
        setTimeout(() => setShowDetalle(true), 100);
      }
    },
  });

  const formatCurrency = (value: number) => {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'material':
        return 'bg-blue-100 text-blue-800';
      case 'mano_obra':
        return 'bg-green-100 text-green-800';
      case 'equipo':
        return 'bg-yellow-100 text-yellow-800';
      case 'subcontrato':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Costos Unitarios (ACU)</h1>
          <p className="mt-2 text-gray-600">
            Gestiona análisis de costos unitarios y composiciones de partidas.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo ACU
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Cargando ACUs...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo Unitario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.items?.map((acu: Acu) => (
                <tr key={acu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {acu.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{acu.partida?.codigo}</div>
                      <div className="text-gray-500 text-xs">{acu.partida?.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    v{acu.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {acu.rendimiento} {acu.partida?.unidadMedida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(acu.costoUnitarioCalculado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        acu.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {acu.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedAcu(acu);
                          setShowDetalle(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver Detalle"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => calcularMutation.mutate(acu.id)}
                        disabled={calcularMutation.isPending}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Recalcular"
                      >
                        <Calculator className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => duplicarMutation.mutate(acu.id)}
                        disabled={duplicarMutation.isPending}
                        className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                        title="Duplicar"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => desactivarMutation.mutate(acu.id)}
                        disabled={!acu.activo || desactivarMutation.isPending}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        title="Desactivar"
                      >
                        <Power className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!data?.items || data.items.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay ACUs registrados</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalle */}
      {showDetalle && selectedAcu && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-5/6 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Detalle ACU - {selectedAcu.codigo}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Partida</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAcu.partida?.codigo} - {selectedAcu.partida?.nombre}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rendimiento</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAcu.rendimiento} {selectedAcu.partida?.unidadMedida}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Versión</label>
                  <p className="mt-1 text-sm text-gray-900">v{selectedAcu.version}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAcu.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Composición de Insumos</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Código
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Tipo
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Cantidad
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        P.U.
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Parcial
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedAcu.acuInsumos?.map((acuInsumo) => (
                      <tr key={acuInsumo.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {acuInsumo.insumo?.codigo}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {acuInsumo.insumo?.nombre}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(
                              acuInsumo.insumo?.tipo || ''
                            )}`}
                          >
                            {acuInsumo.insumo?.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900">
                          {acuInsumo.cantidad.toFixed(4)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900">
                          {formatCurrency(acuInsumo.precioUnitarioSnapshot)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                          {formatCurrency(acuInsumo.costoParcial)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Materiales:</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(selectedAcu.costoMateriales)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Mano de Obra:</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(selectedAcu.costoManoObra)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Equipo:</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(selectedAcu.costoEquipo)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Subcontrato:</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(selectedAcu.costoSubcontrato)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t">
                  <span className="text-base font-bold text-gray-900">COSTO UNITARIO:</span>
                  <span className="text-base font-bold text-gray-900">
                    {formatCurrency(selectedAcu.costoUnitarioCalculado)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetalle(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
