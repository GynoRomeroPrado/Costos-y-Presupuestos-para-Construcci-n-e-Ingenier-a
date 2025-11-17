import { useQuery } from '@tanstack/react-query';
import { Package, ClipboardList, Calculator, FolderKanban, TrendingUp } from 'lucide-react';
import { proyectosService } from '../services/proyectos.service';
import { insumosService } from '../services/insumos.service';
import { partidasService } from '../services/partidas.service';
import { acuService } from '../services/acu.service';
import { queryKeys } from '../constants/queryKeys';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function HomePage() {
  const { data: proyectos, isLoading: loadingProyectos } = useQuery({
    queryKey: queryKeys.proyectos.all,
    queryFn: () => proyectosService.getAll({ limit: 100 }),
  });

  const { data: insumosData, isLoading: loadingInsumos } = useQuery({
    queryKey: queryKeys.insumos.all,
    queryFn: () => insumosService.getAll({ limit: 1000 }),
  });

  const { data: partidasData } = useQuery({
    queryKey: queryKeys.partidas.all,
    queryFn: () => partidasService.getAll({ limit: 1000 }),
  });

  const { data: acusData } = useQuery({
    queryKey: queryKeys.acu.all,
    queryFn: () => acuService.getAll({ limit: 1000 }),
  });

  const totalProyectos = proyectos?.total || 0;
  const totalInsumos = insumosData?.total || 0;
  const totalPartidas = partidasData?.total || 0;
  const totalAcus = acusData?.total || 0;
  const proyectosActivos =
    proyectos?.items?.filter((p: any) => p.estado === 'activo')?.length || 0;
  const presupuestoTotal =
    proyectos?.items?.reduce((sum: number, p: any) => sum + (p.presupuestoTotal || 0), 0) || 0;

  // Preparar datos para gráficos
  const insumosPorTipo = insumosData?.items?.reduce((acc: any, insumo: any) => {
    const tipo = insumo.tipo || 'otro';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  const insumosTipoData = Object.keys(insumosPorTipo || {}).map((tipo) => ({
    name:
      tipo === 'material'
        ? 'Materiales'
        : tipo === 'mano_obra'
        ? 'Mano de Obra'
        : tipo === 'equipo'
        ? 'Equipos'
        : tipo === 'subcontrato'
        ? 'Subcontratos'
        : tipo,
    cantidad: insumosPorTipo[tipo],
  }));

  const proyectosPorEstado = proyectos?.items?.reduce((acc: any, proyecto: any) => {
    const estado = proyecto.estado || 'sin_estado';
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const proyectosEstadoData = Object.keys(proyectosPorEstado || {}).map((estado) => ({
    name:
      estado === 'activo'
        ? 'Activos'
        : estado === 'finalizado'
        ? 'Finalizados'
        : estado === 'pausado'
        ? 'Pausados'
        : estado === 'cancelado'
        ? 'Cancelados'
        : estado,
    value: proyectosPorEstado[estado],
  }));

  const partidasPorEspecialidad = partidasData?.items?.reduce((acc: any, partida: any) => {
    const especialidad = partida.especialidad || 'Otros';
    acc[especialidad] = (acc[especialidad] || 0) + 1;
    return acc;
  }, {});

  const partidasEspecialidadData = Object.keys(partidasPorEspecialidad || {})
    .map((especialidad) => ({
      name: especialidad,
      cantidad: partidasPorEspecialidad[especialidad],
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const stats = [
    {
      name: 'Proyectos Activos',
      value: proyectosActivos.toString(),
      icon: FolderKanban,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Insumos',
      value: totalInsumos.toString(),
      icon: Package,
      color: 'bg-green-500',
    },
    {
      name: 'Total Partidas',
      value: totalPartidas.toString(),
      icon: ClipboardList,
      color: 'bg-purple-500',
    },
    {
      name: 'Total ACUs',
      value: totalAcus.toString(),
      icon: Calculator,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido al Sistema de Costos y Presupuestos
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona insumos, partidas, análisis de costos unitarios y proyectos de construcción.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Insumos por Tipo */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Insumos por Tipo
          </h2>
          {insumosTipoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insumosTipoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Proyectos por Estado */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Proyectos por Estado
          </h2>
          {proyectosEstadoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={proyectosEstadoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {proyectosEstadoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Top 5 Especialidades */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Especialidades
          </h2>
          {partidasEspecialidadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={partidasEspecialidadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Presupuesto Overview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen Financiero
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Presupuesto Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  S/{' '}
                  {presupuestoTotal.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Proyectos Activos</p>
                <p className="text-2xl font-bold text-green-600">{proyectosActivos}</p>
              </div>
              <FolderKanban className="h-12 w-12 text-green-600" />
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Recursos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalInsumos + totalPartidas + totalAcus}
                </p>
              </div>
              <Package className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Package className="h-8 w-8 text-primary-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Nuevo Insumo</div>
              <div className="text-sm text-gray-500">Agregar material, mano de obra o equipo</div>
            </div>
          </button>
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Calculator className="h-8 w-8 text-primary-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Nuevo ACU</div>
              <div className="text-sm text-gray-500">Crear análisis de costo unitario</div>
            </div>
          </button>
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <FolderKanban className="h-8 w-8 text-primary-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Nuevo Proyecto</div>
              <div className="text-sm text-gray-500">Iniciar presupuesto de obra</div>
            </div>
          </button>
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <ClipboardList className="h-8 w-8 text-primary-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Importar Datos</div>
              <div className="text-sm text-gray-500">Subir insumos desde Excel</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
