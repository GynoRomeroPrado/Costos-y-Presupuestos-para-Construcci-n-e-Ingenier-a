import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proyectosService, Proyecto, CreateProyectoDto } from '../services/proyectos.service';
import { Download, FileSpreadsheet, FileText, Upload, Plus, Eye, Trash2, Edit, List } from 'lucide-react';
import { format } from 'date-fns';
import { ProyectoForm } from '../components/ProyectoForm';
import { MetradosEditor } from '../components/MetradosEditor';
import { ProyectoDetailModal } from '../components/ProyectoDetailModal';
import { useToast } from '../hooks/useToast';

export default function ProyectosPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | undefined>();
  const [isMetradosEditorOpen, setIsMetradosEditorOpen] = useState(false);
  const [metradosProyectoId, setMetradosProyectoId] = useState<string>('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailProyecto, setDetailProyecto] = useState<Proyecto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['proyectos'],
    queryFn: () => proyectosService.getAll(),
  });

  const descargarExcelMutation = useMutation({
    mutationFn: (id: string) => proyectosService.descargarExcel(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presupuesto_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const descargarPDFMutation = useMutation({
    mutationFn: (id: string) => proyectosService.descargarPDF(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presupuesto_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const importarMetradosMutation = useMutation({
    mutationFn: ({ proyectoId, file }: { proyectoId: string; file: File }) =>
      proyectosService.importarMetrados(proyectoId, file),
    onSuccess: (data) => {
      alert(
        `Importación completada:\n✓ Exitosos: ${data.exitosos}\n✗ Fallidos: ${data.fallidos}\nTotal: ${data.total}`
      );
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      setShowImportModal(false);
      setImportFile(null);
    },
  });

  const descargarPlantillaMutation = useMutation({
    mutationFn: () => proyectosService.descargarPlantillaMetrados(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_metrados.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProyectoDto) => proyectosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto creado exitosamente');
      setIsFormOpen(false);
      setEditingProyecto(undefined);
    },
    onError: () => {
      toast.error('Error al crear proyecto');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProyectoDto }) =>
      proyectosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto actualizado exitosamente');
      setIsFormOpen(false);
      setEditingProyecto(undefined);
    },
    onError: () => {
      toast.error('Error al actualizar proyecto');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => proyectosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar proyecto');
    },
  });

  const handleFormSubmit = (data: CreateProyectoDto) => {
    if (editingProyecto) {
      updateMutation.mutate({ id: editingProyecto.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (proyecto: Proyecto) => {
    setEditingProyecto(proyecto);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar el proyecto "${nombre}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleImportSubmit = () => {
    if (selectedProyecto && importFile) {
      importarMetradosMutation.mutate({
        proyectoId: selectedProyecto.id,
        file: importFile,
      });
    }
  };

  const formatCurrency = (value: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : moneda === 'EUR' ? '€' : 'S/';
    return `${symbol} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <p className="mt-2 text-gray-600">
            Administra proyectos, metrados y presupuestos.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProyecto(undefined);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Cargando proyectos...</p>
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
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto Total
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
              {data?.items?.map((proyecto: Proyecto) => (
                <tr key={proyecto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proyecto.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proyecto.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.cliente || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(proyecto.presupuestoTotal, proyecto.monedaBase)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        proyecto.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {proyecto.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => descargarExcelMutation.mutate(proyecto.id)}
                        disabled={descargarExcelMutation.isPending}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Descargar Excel"
                      >
                        <FileSpreadsheet className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => descargarPDFMutation.mutate(proyecto.id)}
                        disabled={descargarPDFMutation.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Descargar PDF"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProyecto(proyecto);
                          setShowImportModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Importar Metrados"
                      >
                        <Upload className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setMetradosProyectoId(proyecto.id);
                          setIsMetradosEditorOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editor de Metrados"
                      >
                        <List className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDetailProyecto(proyecto);
                          setIsDetailOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Ver Detalles"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(proyecto)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proyecto.id, proyecto.nombre)}
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
              <p className="text-gray-500">No hay proyectos registrados</p>
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
                Importar Metrados - {selectedProyecto?.nombre}
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

              <div className="flex gap-2">
                <button
                  onClick={handleImportSubmit}
                  disabled={!importFile || importarMetradosMutation.isPending}
                  className="flex-1 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importarMetradosMutation.isPending ? 'Importando...' : 'Importar'}
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

      {/* Formulario de Proyecto */}
      <ProyectoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProyecto(undefined);
        }}
        onSubmit={handleFormSubmit}
        proyecto={editingProyecto}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Editor de Metrados */}
      <MetradosEditor
        isOpen={isMetradosEditorOpen}
        onClose={() => {
          setIsMetradosEditorOpen(false);
          setMetradosProyectoId('');
        }}
        proyectoIdProp={metradosProyectoId}
      />

      {/* Detalle del Proyecto */}
      <ProyectoDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailProyecto(null);
        }}
        proyecto={detailProyecto}
      />
    </div>
  );
}
