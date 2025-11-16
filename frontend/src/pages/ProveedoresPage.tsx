import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  proveedoresService,
  Proveedor,
  CreateProveedorDto,
} from '../services/proveedores.service';
import { Plus, Edit, Trash2, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { ProveedorForm } from '../components/ProveedorForm';
import { useToast } from '../hooks/useToast';

export default function ProveedoresPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['proveedores'],
    queryFn: () => proveedoresService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProveedorDto) => proveedoresService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      toast.success('Proveedor creado exitosamente');
      setIsFormOpen(false);
      setEditingProveedor(undefined);
    },
    onError: () => {
      toast.error('Error al crear proveedor');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProveedorDto }) =>
      proveedoresService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      toast.success('Proveedor actualizado exitosamente');
      setIsFormOpen(false);
      setEditingProveedor(undefined);
    },
    onError: () => {
      toast.error('Error al actualizar proveedor');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => proveedoresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      toast.success('Proveedor eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar proveedor');
    },
  });

  const handleFormSubmit = (data: CreateProveedorDto) => {
    if (editingProveedor) {
      updateMutation.mutate({ id: editingProveedor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar el proveedor "${nombre}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const proveedoresActivos = data?.filter((p: Proveedor) => p.activo) || [];
  const proveedoresInactivos = data?.filter((p: Proveedor) => !p.activo) || [];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
          <p className="mt-2 text-gray-600">
            Administra la información de tus proveedores y contactos.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProveedor(undefined);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Proveedores</p>
              <p className="text-2xl font-semibold text-gray-900">{data?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Activos</p>
              <p className="text-2xl font-semibold text-green-600">{proveedoresActivos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-gray-600"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactivos</p>
              <p className="text-2xl font-semibold text-gray-600">{proveedoresInactivos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Cargando proveedores...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((proveedor: Proveedor) => (
            <div
              key={proveedor.id}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${
                !proveedor.activo ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{proveedor.nombre}</h3>
                    {proveedor.especialidad && (
                      <p className="text-sm text-gray-500 mt-1">{proveedor.especialidad}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      proveedor.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {proveedor.ruc && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span>RUC: {proveedor.ruc}</span>
                    </div>
                  )}
                  {proveedor.contacto && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Contacto:</span>
                      <span>{proveedor.contacto}</span>
                    </div>
                  )}
                  {proveedor.telefono && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{proveedor.telefono}</span>
                    </div>
                  )}
                  {proveedor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{proveedor.email}</span>
                    </div>
                  )}
                  {proveedor.direccion && (
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-2">{proveedor.direccion}</span>
                    </div>
                  )}
                </div>

                {proveedor.observaciones && (
                  <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                    <p className="line-clamp-3">{proveedor.observaciones}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(proveedor)}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(proveedor.id, proveedor.nombre)}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No hay proveedores registrados</p>
          <p className="text-gray-400 text-sm mb-6">
            Comienza agregando tu primer proveedor
          </p>
          <button
            onClick={() => {
              setEditingProveedor(undefined);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar Proveedor
          </button>
        </div>
      )}

      {/* Formulario de Proveedor */}
      <ProveedorForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProveedor(undefined);
        }}
        onSubmit={handleFormSubmit}
        proveedor={editingProveedor}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
