import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partidasService, Partida } from '../services/partidas.service';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function PartidasPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [especialidadFilter, setEspecialidadFilter] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['partidas', especialidadFilter],
    queryFn: () => partidasService.getAll({ especialidad: especialidadFilter || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => partidasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida eliminada exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar partida');
    },
  });

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar la partida "${nombre}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Partidas</h1>
          <p className="mt-2 text-gray-600">
            Administra partidas de obra por especialidad.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Nueva Partida
        </button>
      </div>

      <div className="mb-4">
        <select
          value={especialidadFilter}
          onChange={(e) => setEspecialidadFilter(e.target.value)}
          className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las especialidades</option>
          <option value="OBRAS PRELIMINARES">Obras Preliminares</option>
          <option value="MOVIMIENTO DE TIERRAS">Movimiento de Tierras</option>
          <option value="CONCRETO SIMPLE">Concreto Simple</option>
          <option value="CONCRETO ARMADO">Concreto Armado</option>
          <option value="ALBAÑILERÍA">Albañilería</option>
          <option value="PISOS Y PAVIMENTOS">Pisos y Pavimentos</option>
          <option value="REVESTIMIENTOS">Revestimientos</option>
          <option value="INST. SANITARIAS">Instalaciones Sanitarias</option>
          <option value="INST. ELÉCTRICAS">Instalaciones Eléctricas</option>
          <option value="CARPINTERÍA MADERA">Carpintería de Madera</option>
          <option value="PINTURA">Pintura</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Cargando partidas...</p>
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.items?.map((partida: Partida) => (
                <tr key={partida.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {partida.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{partida.nombre}</div>
                      {partida.descripcion && (
                        <div className="text-gray-500 text-xs truncate max-w-md">
                          {partida.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {partida.especialidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partida.unidadMedida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Ver Detalle">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Editar">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(partida.id, partida.nombre)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!data?.items || data.items.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay partidas registradas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
