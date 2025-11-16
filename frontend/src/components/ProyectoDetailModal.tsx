import { useQuery } from '@tanstack/react-query';
import { Modal } from './Modal';
import { Proyecto } from '../services/proyectos.service';
import { metradosService } from '../services/metrados.service';
import { Calendar, DollarSign, MapPin, User, FileText, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProyectoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
}

export function ProyectoDetailModal({ isOpen, onClose, proyecto }: ProyectoDetailModalProps) {
  const { data: metrados } = useQuery({
    queryKey: ['metrados', proyecto?.id],
    queryFn: () => (proyecto ? metradosService.getByProyecto(proyecto.id) : Promise.resolve([])),
    enabled: isOpen && !!proyecto,
  });

  if (!proyecto) return null;

  const formatCurrency = (value: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : moneda === 'EUR' ? '€' : 'S/';
    return `${symbol} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  const totalMetrados = metrados?.length || 0;
  const costoDirecto = metrados?.reduce((sum, m) => sum + m.costoParcial, 0) || 0;
  const gastosGenerales = (costoDirecto * (proyecto.igvPorcentaje / 100)) || 0;
  const utilidad = (costoDirecto * (proyecto.utilidad / 100)) || 0;
  const subtotal = costoDirecto + gastosGenerales + utilidad;
  const igv = subtotal * 0.18;
  const presupuestoTotal = subtotal + igv;

  const metradosPorEspecialidad = metrados?.reduce((acc: any, metrado) => {
    const especialidad = metrado.partida?.especialidad || 'Sin especialidad';
    if (!acc[especialidad]) {
      acc[especialidad] = {
        cantidad: 0,
        costo: 0,
      };
    }
    acc[especialidad].cantidad += 1;
    acc[especialidad].costo += metrado.costoParcial;
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Proyecto" size="2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{proyecto.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1">Código: {proyecto.codigo}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                proyecto.estado === 'activo'
                  ? 'bg-green-100 text-green-800'
                  : proyecto.estado === 'finalizado'
                  ? 'bg-blue-100 text-blue-800'
                  : proyecto.estado === 'pausado'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {proyecto.estado}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Cliente</p>
              <p className="text-sm text-gray-900">{proyecto.cliente || 'No especificado'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Ubicación</p>
              <p className="text-sm text-gray-900">{proyecto.ubicacion || 'No especificado'}</p>
            </div>
          </div>

          {proyecto.fechaInicio && (
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
                <p className="text-sm text-gray-900">{formatDate(proyecto.fechaInicio)}</p>
              </div>
            </div>
          )}

          {proyecto.fechaFin && (
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Fin</p>
                <p className="text-sm text-gray-900">{formatDate(proyecto.fechaFin)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {proyecto.descripcion && (
          <div className="border-t pt-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Descripción</p>
                <p className="text-sm text-gray-700">{proyecto.descripcion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Resumen Financiero
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Costo Directo</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(costoDirecto, proyecto.monedaBase)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Gastos Generales ({proyecto.igvPorcentaje}%)</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(gastosGenerales, proyecto.monedaBase)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Utilidad ({proyecto.utilidad}%)</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(utilidad, proyecto.monedaBase)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-600 mb-1 font-medium">Presupuesto Total (con IGV)</p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency(proyecto.presupuestoTotal, proyecto.monedaBase)}
              </p>
            </div>
          </div>
        </div>

        {/* Metrados Summary */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Resumen de Metrados
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total de Partidas</span>
              <span className="text-lg font-semibold text-purple-700">{totalMetrados}</span>
            </div>

            {metradosPorEspecialidad && Object.keys(metradosPorEspecialidad).length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Por Especialidad:</p>
                <div className="space-y-2">
                  {Object.entries(metradosPorEspecialidad)
                    .sort(([, a]: any, [, b]: any) => b.costo - a.costo)
                    .map(([especialidad, data]: any) => (
                      <div
                        key={especialidad}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-700">{especialidad}</span>
                          <span className="text-xs text-gray-500 ml-2">({data.cantidad} partidas)</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.costo, proyecto.monedaBase)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
