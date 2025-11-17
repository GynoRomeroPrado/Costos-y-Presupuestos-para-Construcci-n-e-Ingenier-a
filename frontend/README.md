# Sistema de Costos y Presupuestos para Construcción

Sistema completo para la gestión de costos, presupuestos y análisis de precios unitarios en proyectos de construcción e ingeniería.

## 📋 Características Principales

### Gestión de Datos Maestros
- **Insumos**: Gestión completa de materiales, mano de obra, equipos y subcontratos
  - Importación/exportación Excel
  - Búsqueda y filtrado por tipo
  - Historial de precios
  - Gestión de proveedores

- **Partidas**: Catálogo de partidas según especialidades CAPECO
  - 11 especialidades predefinidas
  - 15 unidades de medida estándar
  - Búsqueda por código/nombre
  - Filtrado por especialidad

- **ACU (Análisis de Costos Unitarios)**
  - Composición detallada de insumos por partida
  - Cálculo automático de costos
  - Versionamiento de análisis
  - Duplicación de ACUs
  - Desglose por tipo (materiales, mano de obra, equipos, subcontratos)

- **Proyectos**: Gestión integral de proyectos
  - Metrados y presupuestos
  - Cálculo automático con IGV y gastos generales
  - Soporta múltiples monedas (PEN, USD, EUR)
  - Estados de proyecto (activo, pausado, completado, cancelado)
  - Exportación a Excel y PDF

- **Proveedores**: Directorio de proveedores
  - Información de contacto completa
  - Especialidades
  - Estado activo/inactivo

### Módulos de Análisis

- **Dashboard**: Vista general del sistema
  - Estadísticas clave
  - Gráficos de distribución (Recharts)
  - Resumen financiero
  - Proyectos activos

- **Reportes**: Analíticas avanzadas
  - Presupuesto total y promedio
  - Distribución de costos por tipo
  - Top 10 proyectos
  - Proyectos creados (últimos 6 meses)
  - Tablas de resumen

- **Configuración**: Personalización del sistema
  - Información de empresa
  - Preferencias (moneda, IGV, formato de fecha)
  - Gestión de datos (exportar/importar)
  - Información del sistema

### Características de UX

- **Paginación**: Todas las tablas con paginación optimizada
  - 10 items por página por defecto
  - Navegación con números de página
  - Indicador de registros mostrados

- **Búsqueda y Filtros**
  - Búsqueda instantánea client-side
  - Filtros por tipo, especialidad, estado
  - Resultados en tiempo real

- **Skeleton Screens**
  - TableSkeleton para tablas
  - CardSkeleton para vistas de tarjetas
  - Animación de pulso
  - Mejor percepción de rendimiento

- **Notificaciones Toast**
  - Feedback inmediato de acciones
  - Tipos: success, error, info, warning
  - Auto-dismiss configurable

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **React 18** con TypeScript
- **Vite** - Build tool ultrarrápido
- **React Router** - Navegación SPA

### Estado y Datos
- **TanStack Query (React Query)** - Server state management
  - Caché inteligente (5 min stale time, 10 min GC)
  - Invalidación automática
  - Optimistic updates
- **Zustand** - Client state (toasts)

### UI/UX
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Iconos modernos
- **Recharts** - Gráficos y visualizaciones
- **date-fns** - Manipulación de fechas

### Utilidades
- **Axios** - Cliente HTTP
- **React Hook Form** - Gestión de formularios (recomendado para futuras mejoras)

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── AcuForm.tsx
│   │   ├── CardSkeleton.tsx
│   │   ├── InsumoForm.tsx
│   │   ├── MetradosEditor.tsx
│   │   ├── Pagination.tsx
│   │   ├── PartidaForm.tsx
│   │   ├── ProyectoDetailModal.tsx
│   │   ├── ProyectoForm.tsx
│   │   ├── ProveedorForm.tsx
│   │   ├── TableSkeleton.tsx
│   │   └── Toast.tsx
│   │
│   ├── pages/               # Páginas principales
│   │   ├── AcuPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── InsumosPage.tsx
│   │   ├── PartidasPage.tsx
│   │   ├── ProyectosPage.tsx
│   │   ├── ProveedoresPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── services/            # Servicios API
│   │   ├── acu.service.ts
│   │   ├── api.ts
│   │   ├── insumos.service.ts
│   │   ├── partidas.service.ts
│   │   ├── proyectos.service.ts
│   │   └── proveedores.service.ts
│   │
│   ├── hooks/               # Custom hooks
│   │   └── useToast.ts
│   │
│   ├── constants/           # Constantes del sistema
│   │   └── index.ts
│   │
│   ├── utils/               # Utilidades
│   │   ├── formatters.ts    # Formateo de datos
│   │   └── validators.ts    # Validaciones
│   │
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globales
│
├── public/                  # Archivos estáticos
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Backend API corriendo (NestJS)

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>

# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Configurar URL del API en .env
VITE_API_URL=http://localhost:3000
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:5173
```

### Producción

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📝 Configuración del Sistema

### Variables de Entorno

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Sistema de Costos y Presupuestos
```

### Configuración React Query

Las opciones de caché están optimizadas en `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,  // 5 minutos
      gcTime: 10 * 60 * 1000,     // 10 minutos
    },
  },
});
```

## 🎨 Personalización

### Constantes del Sistema

Edita `src/constants/index.ts` para cambiar:
- Tamaños de paginación
- Monedas soportadas
- Especialidades
- Unidades de medida
- Tipos de insumo
- Estados de proyecto

### Temas y Estilos

El sistema usa TailwindCSS. Personaliza `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... más colores
        },
      },
    },
  },
};
```

## 📊 Guía de Uso

### Flujo de Trabajo Típico

1. **Configurar Datos Maestros**
   - Importar/crear insumos
   - Crear partidas por especialidad
   - Registrar proveedores

2. **Crear Análisis de Costos (ACU)**
   - Seleccionar partida
   - Agregar composición de insumos
   - Definir rendimientos
   - Sistema calcula automáticamente

3. **Gestionar Proyectos**
   - Crear proyecto con datos generales
   - Agregar metrados usando editor bulk
   - Asignar ACUs a metrados
   - Sistema calcula presupuesto total

4. **Generar Reportes**
   - Exportar presupuestos a Excel/PDF
   - Visualizar analíticas en dashboard
   - Revisar reportes consolidados

## 🔧 Custom Hooks

El sistema incluye hooks personalizados para funcionalidades comunes:

### Storage Hooks

```typescript
import { useLocalStorage, useSessionStorage } from '@/hooks';

// Persistencia con localStorage (sincronizado entre pestañas)
const [user, setUser, removeUser] = useLocalStorage('user', { name: '' });

// Persistencia con sessionStorage
const [filters, setFilters, clearFilters] = useSessionStorage('filters', {});
```

### Pagination Hook

```typescript
import { usePagination, useLocalPagination } from '@/hooks';

// Para paginación server-side
const {
  currentPage,
  goToPage,
  nextPage,
  previousPage,
  canGoNext,
  canGoPrevious,
  totalPages
} = usePagination({
  initialPage: 1,
  pageSize: 10,
  totalItems: 100
});

// Para paginación client-side
const { items, currentPage, goToPage } = useLocalPagination(allItems, {
  pageSize: 10
});
```

### Search & Filter Hooks

```typescript
import { useSearch, useFilter, useSearchAndFilter } from '@/hooks';

// Búsqueda con debounce
const { searchTerm, setSearchTerm, filteredItems } = useSearch(items, {
  searchFields: ['nombre', 'codigo'],
  debounceMs: 300
});

// Filtrado por criterios
const filtered = useFilter(items, { tipo: 'material', activo: true });

// Búsqueda + Filtrado combinado
const { filteredItems, totalItems } = useSearchAndFilter(
  items,
  { searchFields: ['nombre'] },
  { tipo: 'material' }
);
```

### Performance Hooks

```typescript
import {
  usePerformance,
  useWhyDidYouUpdate,
  useLoadingTime,
  useDebounce
} from '@/hooks';

// Medir performance de componente
usePerformance('MyComponent');

// Detectar re-renders innecesarios (solo dev)
useWhyDidYouUpdate('MyComponent', props);

// Medir tiempo de carga
useLoadingTime('DataFetch', isLoading);

// Debounce de valores
const debouncedSearch = useDebounce(searchTerm, 500);
```

## 🔧 Utilidades Disponibles

### Formatters

```typescript
import { formatCurrency, getTipoColor, formatPercentage } from '@/utils';

formatCurrency(1500.50, 'PEN');  // "S/ 1,500.50"
getTipoColor('material');         // "bg-blue-100 text-blue-800"
formatPercentage(18);             // "18.00%"
```

### Validators

```typescript
import { validateRUC, validateEmail, validatePositive } from '@/utils/validators';

validateRUC('20123456789');      // true/false
validateEmail('user@example.com'); // true/false
validatePositive(100);            // true
```

## 🐛 Debugging

### React Query Devtools

Descomentar en `src/main.tsx` para habilitar devtools:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// En el render:
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Console Logs

Buscar por `console.log` para debugs temporales (eliminar en producción).

## 🔐 Seguridad

- **Validación client-side**: Todas las entradas son validadas
- **Sanitización**: Datos sanitizados antes de enviar al backend
- **CORS**: Configurado en el backend
- **TypeScript**: Tipos estrictos para prevenir errores

## 📈 Optimizaciones de Rendimiento

- ✅ Code splitting con React.lazy (futuro)
- ✅ Caché inteligente con React Query
- ✅ Skeleton screens para perceived performance
- ✅ Paginación para grandes datasets
- ✅ Client-side filtering para búsquedas instantáneas
- ✅ Optimistic updates en mutations

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: Add amazing feature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Formato, puntos y comas, etc
- `refactor:` Refactorización de código
- `perf:` Mejoras de rendimiento
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

## 📄 Licencia

Este proyecto es privado y propietario.

## 👥 Equipo de Desarrollo

Desarrollado para gestión de costos en construcción e ingeniería.

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0
**Última actualización**: 2025
**Estado**: En Desarrollo Activo
