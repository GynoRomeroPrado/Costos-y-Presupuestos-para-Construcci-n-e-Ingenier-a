import { Package, ClipboardList, Calculator, FolderKanban } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { name: 'Insumos', value: '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Partidas', value: '0', icon: ClipboardList, color: 'bg-green-500' },
    { name: 'ACUs', value: '0', icon: Calculator, color: 'bg-purple-500' },
    { name: 'Proyectos', value: '0', icon: FolderKanban, color: 'bg-orange-500' },
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
