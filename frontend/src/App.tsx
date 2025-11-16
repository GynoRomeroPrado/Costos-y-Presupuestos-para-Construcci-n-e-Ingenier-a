import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Package, ClipboardList, Calculator, FolderKanban, Settings } from 'lucide-react';
import { ToastContainer } from '@/components/Toast';
import { useToastStore } from '@/hooks/useToast';

// Pages (to be created)
import HomePage from '@/pages/HomePage';
import InsumosPage from '@/pages/InsumosPage';
import PartidasPage from '@/pages/PartidasPage';
import AcuPage from '@/pages/AcuPage';
import ProyectosPage from '@/pages/ProyectosPage';

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
                </div>
              </div>
              <div className="flex items-center">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/insumos" element={<InsumosPage />} />
            <Route path="/partidas" element={<PartidasPage />} />
            <Route path="/acu" element={<AcuPage />} />
            <Route path="/proyectos" element={<ProyectosPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
