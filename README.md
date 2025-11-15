# Sistema Integral de Gestión de Costos y Presupuestos para Construcción e Ingeniería

Sistema completo para la gestión de costos, presupuestos, análisis de costos unitarios (ACU) y cronogramas de proyectos de construcción e ingeniería.

## Características Principales

- **Gestión de Catálogos**: Insumos, partidas y proveedores
- **Análisis de Costos Unitarios (ACU)**: Construcción y cálculo automático de ACUs
- **Presupuestos**: Generación de presupuestos con metrados y cálculo automático
- **Reportes Profesionales**: Exportación a Excel y PDF
- **Especificaciones Técnicas**: Editor integrado para documentación
- **Cronogramas**: Planificación temporal con diagramas Gantt
- **Calendario Valorizado**: Distribución de costos en el tiempo

## Stack Tecnológico

### Backend
- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL
- **Cache**: Redis
- **ORM**: TypeORM
- **Documentación**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 con TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: Zustand
- **Tablas**: TanStack Table / AG-Grid
- **Gráficos**: Recharts

### DevOps
- **Contenedores**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest + React Testing Library

## Estructura del Proyecto

```
.
├── backend/          # API NestJS
├── frontend/         # Aplicación React
├── docker-compose.yml
├── docs/            # Documentación
└── scripts/         # Scripts de utilidad
```

## Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd Costos-y-Presupuestos-para-Construcci-n-e-Ingenier-a
```

2. Instalar dependencias:
```bash
npm install
```

3. Levantar servicios (PostgreSQL + Redis):
```bash
docker-compose up -d
```

4. Configurar variables de entorno:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

5. Ejecutar migraciones:
```bash
npm run backend:migrate
```

6. Iniciar aplicación en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## Roadmap de Desarrollo

### FASE 1: Fundamentos y Catálogos ✅
- [x] Configuración inicial
- [ ] Módulo de Insumos
- [ ] Módulo de Partidas
- [ ] Sistema de autenticación

### FASE 2: Motor de ACUs
- [ ] Construcción de ACUs
- [ ] Motor de cálculo
- [ ] Versionado de ACUs
- [ ] Plantillas de ACU

### FASE 3: Presupuestos y Proyectos
- [ ] Módulo de Proyectos
- [ ] Módulo de Metrados
- [ ] Motor de presupuesto
- [ ] Gastos generales y utilidades

### FASE 4: Reportes y Documentación
- [ ] Generador de reportes Excel/PDF
- [ ] Especificaciones técnicas
- [ ] Dashboard de proyectos

### FASE 5: Cronograma y Calendario Valorizado
- [ ] Módulo de cronograma (Gantt)
- [ ] Calendario valorizado
- [ ] Curva S de avance

### FASE 6: Funcionalidades Avanzadas
- [ ] Control de obra
- [ ] IA para sugerencias de ACUs
- [ ] OCR para extracción de metrados
- [ ] Integración BIM

## Documentación

Ver la carpeta `docs/` para documentación detallada:
- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Modelo de Datos](docs/DATABASE.md)
- [API Reference](docs/API.md)
- [Guía de Desarrollo](docs/DEVELOPMENT.md)

## Contribución

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de contribución.

## Licencia

Copyright © 2025 - Sistema de Gestión de Costos y Presupuestos
