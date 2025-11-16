import { useState } from 'react';
import {
  Building2,
  DollarSign,
  Database,
  Save,
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface CompanySettings {
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
}

interface SystemPreferences {
  monedaDefecto: string;
  igvDefecto: number;
  itemsPorPagina: number;
  formatoFecha: string;
}

export default function SettingsPage() {
  const toast = useToast();

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
  });

  const [systemPreferences, setSystemPreferences] = useState<SystemPreferences>({
    monedaDefecto: 'PEN',
    igvDefecto: 18,
    itemsPorPagina: 10,
    formatoFecha: 'dd/MM/yyyy',
  });

  const handleCompanyChange = (field: keyof CompanySettings, value: string) => {
    setCompanySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: keyof SystemPreferences, value: string | number) => {
    setSystemPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCompanySettings = () => {
    // TODO: Implement API call to save company settings
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
    toast.success('Configuración de empresa guardada exitosamente');
  };

  const handleSaveSystemPreferences = () => {
    // TODO: Implement API call to save system preferences
    localStorage.setItem('systemPreferences', JSON.stringify(systemPreferences));
    toast.success('Preferencias del sistema guardadas exitosamente');
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    toast.success('Exportación de datos iniciada');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement data import functionality
      toast.success(`Importando datos desde ${file.name}`);
    }
  };

  const handleClearCache = () => {
    if (confirm('¿Estás seguro de limpiar el caché? Esto puede mejorar el rendimiento.')) {
      localStorage.clear();
      toast.success('Caché limpiado exitosamente');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="mt-2 text-gray-600">
          Gestiona la configuración de tu empresa y preferencias del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Información de la Empresa
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={companySettings.nombre}
                onChange={(e) => handleCompanyChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Constructora ABC S.A.C."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
              <input
                type="text"
                value={companySettings.ruc}
                onChange={(e) => handleCompanyChange('ruc', e.target.value)}
                maxLength={11}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={companySettings.direccion}
                onChange={(e) => handleCompanyChange('direccion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Av. Principal 123, Lima"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={companySettings.telefono}
                onChange={(e) => handleCompanyChange('telefono', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+51 999 999 999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={companySettings.email}
                onChange={(e) => handleCompanyChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contacto@empresa.com"
              />
            </div>

            <button
              onClick={handleSaveCompanySettings}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Información
            </button>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-purple-600" />
              Preferencias del Sistema
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda por Defecto
              </label>
              <select
                value={systemPreferences.monedaDefecto}
                onChange={(e) => handlePreferenceChange('monedaDefecto', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PEN">Soles Peruanos (S/)</option>
                <option value="USD">Dólares Americanos ($)</option>
                <option value="EUR">Euros (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IGV por Defecto (%)
              </label>
              <input
                type="number"
                value={systemPreferences.igvDefecto}
                onChange={(e) => handlePreferenceChange('igvDefecto', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items por Página
              </label>
              <select
                value={systemPreferences.itemsPorPagina}
                onChange={(e) => handlePreferenceChange('itemsPorPagina', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5 items</option>
                <option value="10">10 items</option>
                <option value="20">20 items</option>
                <option value="50">50 items</option>
                <option value="100">100 items</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato de Fecha
              </label>
              <select
                value={systemPreferences.formatoFecha}
                onChange={(e) => handlePreferenceChange('formatoFecha', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              </select>
            </div>

            <button
              onClick={handleSaveSystemPreferences}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Preferencias
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="h-5 w-5 mr-2 text-green-600" />
              Gestión de Datos
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-100 rounded-full mb-4">
                    <Download className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Exportar Datos
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Exporta todos los datos del sistema a un archivo JSON
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-green-100 rounded-full mb-4">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Importar Datos
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Importa datos desde un archivo JSON previamente exportado
                  </p>
                  <label className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-600 rounded-md text-sm font-medium text-green-600 hover:bg-green-50 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-red-500 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-red-100 rounded-full mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Limpiar Caché</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Limpia el caché del navegador para mejorar el rendimiento
                  </p>
                  <button
                    onClick={handleClearCache}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Información del Sistema</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Versión del Sistema</p>
                <p className="text-lg font-semibold text-gray-900">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Última Actualización</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('es-PE')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entorno</p>
                <p className="text-lg font-semibold text-gray-900">
                  {import.meta.env.MODE === 'production' ? 'Producción' : 'Desarrollo'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
