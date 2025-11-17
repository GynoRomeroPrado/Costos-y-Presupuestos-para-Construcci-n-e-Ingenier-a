import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Home, Package, ClipboardList, Calculator, FolderKanban, Truck, FileText, Settings } from 'lucide-react';
import { ToastContainer } from '@/components/Toast';
import { PageLoader } from '@/components/PageLoader';
import { useToastStore } from '@/hooks/useToast';

// Lazy load pages for code splitting and better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const InsumosPage = lazy(() => import('@/pages/InsumosPage'));
const PartidasPage = lazy(() => import('@/pages/PartidasPage'));
const AcuPage = lazy(() => import('@/pages/AcuPage'));
const ProyectosPage = lazy(() => import('@/pages/ProyectosPage'));
const ProveedoresPage = lazy(() => import('@/pages/ProveedoresPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer toasts={toasts} onClose={removeToast} />
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-primary-600">
                    Sistema de Costos y Presupuestos
                  </h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Inicio
                  </Link>
                  <Link
                    to="/insumos"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Insumos
                  </Link>
                  <Link
                    to="/partidas"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Partidas
                  </Link>
                  <Link
                    to="/acu"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    ACU
                  </Link>
                  <Link
                    to="/proyectos"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <FolderKanban className="w-4 h-4 mr-2" />
                    Proyectos
                  </Link>
                  <Link
                    to="/proveedores"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Proveedores
                  </Link>
                  <Link
                    to="/reportes"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Reportes
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  to="/configuracion"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  title="Configuración"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/insumos" element={<InsumosPage />} />
              <Route path="/partidas" element={<PartidasPage />} />
              <Route path="/acu" element={<AcuPage />} />
              <Route path="/proyectos" element={<ProyectosPage />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              <Route path="/reportes" element={<ReportsPage />} />
              <Route path="/configuracion" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
