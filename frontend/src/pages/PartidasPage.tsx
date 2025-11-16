import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partidasService, Partida, CreatePartidaDto } from '../services/partidas.service';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import { PartidaForm } from '../components/PartidaForm';
import { useToast } from '../hooks/useToast';

export default function PartidasPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [especialidadFilter, setEspecialidadFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartida, setEditingPartida] = useState<Partida | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['partidas', especialidadFilter, searchTerm],
    queryFn: () =>
      partidasService.getAll({
        especialidad: especialidadFilter || undefined,
        search: searchTerm || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePartidaDto) => partidasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida creada exitosamente');
      setIsFormOpen(false);
      setEditingPartida(undefined);
    },
    onError: () => {
      toast.error('Error al crear partida');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePartidaDto }) =>
      partidasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida actualizada exitosamente');
      setIsFormOpen(false);
      setEditingPartida(undefined);
    },
    onError: () => {
      toast.error('Error al actualizar partida');
    },
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

  const handleFormSubmit = (data: CreatePartidaDto) => {
    if (editingPartida) {
      updateMutation.mutate({ id: editingPartida.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (partida: Partida) => {
    setEditingPartida(partida);
    setIsFormOpen(true);
  };

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
        <button
          onClick={() => {
            setEditingPartida(undefined);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Partida
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar por código o nombre..."
          />
        </div>
        <select
          value={especialidadFilter}
          onChange={(e) => setEspecialidadFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las especialidades</option>
          <option value="Obras Preliminares">Obras Preliminares</option>
          <option value="Movimiento de Tierras">Movimiento de Tierras</option>
          <option value="Obras de Concreto Simple">Obras de Concreto Simple</option>
          <option value="Obras de Concreto Armado">Obras de Concreto Armado</option>
          <option value="Estructuras Metálicas">Estructuras Metálicas</option>
          <option value="Arquitectura">Arquitectura</option>
          <option value="Instalaciones Sanitarias">Instalaciones Sanitarias</option>
          <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
          <option value="Instalaciones Mecánicas">Instalaciones Mecánicas</option>
          <option value="Acabados">Acabados</option>
          <option value="Varios">Varios</option>
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
                      <button
                        onClick={() => handleEdit(partida)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Editar"
                      >
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

      {/* Formulario de Partida */}
      <PartidaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPartida(undefined);
        }}
        onSubmit={handleFormSubmit}
        partida={editingPartida}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
