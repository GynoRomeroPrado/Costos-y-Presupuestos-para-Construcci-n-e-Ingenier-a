import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { proyectosService } from '../services/proyectos.service';
import { insumosService } from '../services/insumos.service';
import { partidasService } from '../services/partidas.service';
import { acuService } from '../services/acu.service';
import { proveedoresService } from '../services/proveedores.service';
import { formatCurrency } from '@/utils';
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

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch all data
  const { data: proyectos } = useQuery({
    queryKey: ['proyectos-reports'],
    queryFn: () => proyectosService.getAll({ limit: 1000 }),
  });

  const { data: insumosData } = useQuery({
    queryKey: ['insumos-reports'],
    queryFn: () => insumosService.getAll({ limit: 5000 }),
  });

  const { data: partidasData } = useQuery({
    queryKey: ['partidas-reports'],
    queryFn: () => partidasService.getAll({ limit: 5000 }),
  });

  const { data: acusData } = useQuery({
    queryKey: ['acus-reports'],
    queryFn: () => acuService.getAll({ limit: 5000 }),
  });

  const { data: proveedores } = useQuery({
    queryKey: ['proveedores-reports'],
    queryFn: () => proveedoresService.getAll(),
  });

  // Calculations
  const totalProyectos = proyectos?.items?.length || 0;
  const proyectosActivos = proyectos?.items?.filter((p: any) => p.estado === 'activo')?.length || 0;
  const presupuestoTotal =
    proyectos?.items?.reduce((sum: number, p: any) => sum + (p.presupuestoTotal || 0), 0) || 0;
  const presupuestoPromedio = totalProyectos > 0 ? presupuestoTotal / totalProyectos : 0;

  const totalInsumos = insumosData?.items?.length || 0;
  const totalPartidas = partidasData?.items?.length || 0;
  const totalAcus = acusData?.items?.length || 0;
  const totalProveedores = proveedores?.length || 0;

  // Proyectos por mes (últimos 6 meses)
  const proyectosPorMes = proyectos?.items?.reduce((acc: any, proyecto: any) => {
    if (!proyecto.createdAt) return acc;
    const date = new Date(proyecto.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  const proyectosMesData = Object.entries(proyectosPorMes || {})
    .map(([mes, cantidad]) => ({
      mes,
      cantidad,
    }))
    .slice(-6);

  // Costos por tipo de insumo
  const costosPorTipo = acusData?.items?.reduce((acc: any, acu: any) => {
    acc.materiales = (acc.materiales || 0) + (acu.costoMateriales || 0);
    acc.manoObra = (acc.manoObra || 0) + (acu.costoManoObra || 0);
    acc.equipos = (acc.equipos || 0) + (acu.costoEquipo || 0);
    acc.subcontratos = (acc.subcontratos || 0) + (acu.costoSubcontrato || 0);
    return acc;
  }, {});

  const costosTipoData = [
    { name: 'Materiales', value: costosPorTipo?.materiales || 0 },
    { name: 'Mano de Obra', value: costosPorTipo?.manoObra || 0 },
    { name: 'Equipos', value: costosPorTipo?.equipos || 0 },
    { name: 'Subcontratos', value: costosPorTipo?.subcontratos || 0 },
  ].filter((item) => item.value > 0);

  // Top 10 proyectos por presupuesto
  const topProyectos = proyectos?.items
    ?.sort((a: any, b: any) => b.presupuestoTotal - a.presupuestoTotal)
    .slice(0, 10)
    .map((p: any) => ({
      nombre: p.nombre.substring(0, 20),
      presupuesto: p.presupuestoTotal,
    }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Analíticas</h1>
        <p className="mt-2 text-gray-600">
          Visualiza estadísticas consolidadas y genera reportes del sistema.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Filtros de Período
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Presupuesto Total</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {formatCurrency(presupuestoTotal)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">De {totalProyectos} proyectos</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Presupuesto Promedio</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(presupuestoPromedio)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Por proyecto</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proyectos Activos</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{proyectosActivos}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {totalProyectos > 0
              ? `${((proyectosActivos / totalProyectos) * 100).toFixed(0)}% del total`
              : '0% del total'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Recursos</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {totalInsumos + totalPartidas + totalAcus}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {totalInsumos} insumos, {totalPartidas} partidas, {totalAcus} ACUs
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Proyectos por Mes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Proyectos Creados (Últimos 6 meses)
          </h2>
          {proyectosMesData && proyectosMesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={proyectosMesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cantidad" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Costos por Tipo */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Costos por Tipo
          </h2>
          {costosTipoData && costosTipoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costosTipoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costosTipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Top 10 Proyectos */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top 10 Proyectos por Presupuesto
          </h2>
          {topProyectos && topProyectos.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topProyectos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={150} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="presupuesto" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Recursos</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Insumos</span>
              <span className="text-lg font-semibold text-gray-900">{totalInsumos}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Partidas</span>
              <span className="text-lg font-semibold text-gray-900">{totalPartidas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total ACUs</span>
              <span className="text-lg font-semibold text-gray-900">{totalAcus}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Proveedores</span>
              <span className="text-lg font-semibold text-gray-900">{totalProveedores}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Total Proyectos</span>
              <span className="text-lg font-semibold text-blue-900">{totalProyectos}</span>
            </div>
          </div>
        </div>

        {/* Project Status Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h2>
          <div className="space-y-3">
            {proyectos?.items?.reduce((acc: any, proyecto: any) => {
              const estado = proyecto.estado || 'sin_estado';
              acc[estado] = (acc[estado] || 0) + 1;
              return acc;
            }, {}) &&
              Object.entries(
                proyectos?.items?.reduce((acc: any, proyecto: any) => {
                  const estado = proyecto.estado || 'sin_estado';
                  acc[estado] = (acc[estado] || 0) + 1;
                  return acc;
                }, {}) || {}
              ).map(([estado, cantidad]: any) => (
                <div
                  key={estado}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full mr-3 ${
                        estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : estado === 'finalizado'
                          ? 'bg-blue-100 text-blue-800'
                          : estado === 'pausado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {estado}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{cantidad}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
