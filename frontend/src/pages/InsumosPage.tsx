import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insumosService, Insumo, CreateInsumoDto } from '../services/insumos.service';
import { Download, Upload, Plus, Eye, Trash2, Edit, Search } from 'lucide-react';
import { InsumoForm } from '../components/InsumoForm';
import { useToast } from '../hooks/useToast';

export default function InsumosPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['insumos', tipoFilter],
    queryFn: () => insumosService.getAll({ tipo: tipoFilter || undefined }),
  });

  // Filter data on client side for search
  const filteredData = data?.items?.filter((insumo: Insumo) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      insumo.codigo.toLowerCase().includes(search) ||
      insumo.nombre.toLowerCase().includes(search) ||
      insumo.descripcion?.toLowerCase().includes(search)
    );
  });

  const importarMutation = useMutation({
    mutationFn: (file: File) => insumosService.importar(file),
    onSuccess: (data) => {
      alert(
        `Importación completada:\n✓ Exitosos: ${data.exitosos}\n✗ Fallidos: ${data.fallidos}\nTotal: ${data.total}`
      );
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      setShowImportModal(false);
      setImportFile(null);
    },
    onError: (error: any) => {
      alert(`Error en la importación: ${error.response?.data?.message || error.message}`);
    },
  });

  const descargarPlantillaMutation = useMutation({
    mutationFn: () => insumosService.descargarPlantilla(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_insumos.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInsumoDto) => insumosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo creado exitosamente');
      setIsFormOpen(false);
      setEditingInsumo(undefined);
    },
    onError: () => {
      toast.error('Error al crear insumo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateInsumoDto }) =>
      insumosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo actualizado exitosamente');
      setIsFormOpen(false);
      setEditingInsumo(undefined);
    },
    onError: () => {
      toast.error('Error al actualizar insumo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => insumosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar insumo');
    },
  });

  const handleFormSubmit = (data: CreateInsumoDto) => {
    if (editingInsumo) {
      updateMutation.mutate({ id: editingInsumo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (insumo: Insumo) => {
    setEditingInsumo(insumo);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar el insumo "${nombre}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleImportSubmit = () => {
    if (importFile) {
      importarMutation.mutate(importFile);
    }
  };

  const formatCurrency = (value: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : moneda === 'EUR' ? '€' : 'S/';
    return `${symbol} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      material: 'Material',
      mano_obra: 'Mano de Obra',
      equipo: 'Equipo',
      subcontrato: 'Subcontrato',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Insumos</h1>
          <p className="mt-2 text-gray-600">
            Administra materiales, mano de obra, equipos y subcontratos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-5 w-5 mr-2" />
            Importar Excel
          </button>
          <button
            onClick={() => {
              setEditingInsumo(undefined);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Insumo
          </button>
        </div>
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
            placeholder="Buscar por código, nombre o descripción..."
          />
        </div>
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">Todos los tipos</option>
          <option value="material">Materiales</option>
          <option value="mano_obra">Mano de Obra</option>
          <option value="equipo">Equipos</option>
          <option value="subcontrato">Subcontratos</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Cargando insumos...</p>
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
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData?.map((insumo: Insumo) => (
                <tr key={insumo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {insumo.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{insumo.nombre}</div>
                      {insumo.descripcion && (
                        <div className="text-gray-500 text-xs truncate max-w-md">
                          {insumo.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(
                        insumo.tipo
                      )}`}
                    >
                      {getTipoLabel(insumo.tipo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {insumo.unidadMedida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(insumo.precioUnitario, insumo.moneda)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Ver Detalle">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(insumo)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(insumo.id, insumo.nombre)}
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

          {(!filteredData || filteredData.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm || tipoFilter
                  ? 'No se encontraron insumos con los filtros aplicados'
                  : 'No hay insumos registrados'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Importación */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Importar Insumos desde Excel
              </h3>

              <div className="mb-4">
                <button
                  onClick={() => descargarPlantillaMutation.mutate()}
                  disabled={descargarPlantillaMutation.isPending}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla Excel
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo Excel
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>Nota:</strong> El archivo debe contener las columnas: Código, Nombre,
                  Unidad, Tipo, Precio, Moneda, Proveedor (opcional), Marca (opcional), Descripción
                  (opcional).
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleImportSubmit}
                  disabled={!importFile || importarMutation.isPending}
                  className="flex-1 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importarMutation.isPending ? 'Importando...' : 'Importar'}
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="flex-1 inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Insumo */}
      <InsumoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingInsumo(undefined);
        }}
        onSubmit={handleFormSubmit}
        insumo={editingInsumo}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
