# 🚀 Instrucciones para Levantar el Sistema

## 📋 Requisitos Previos

- **Node.js** 18+ (recomendado 20.x)
- **npm** o **yarn**
- **Docker** y **Docker Compose**
- **PostgreSQL** 15+ (si no usas Docker)

---

## 🗄️ 1. Levantar Base de Datos con Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps

# Deberías ver:
# - postgres (puerto 5432)
# - redis (puerto 6379)
```

---

## 🔧 2. Configurar Backend

### Instalar dependencias
```bash
cd backend
npm install
```

### Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend/`:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=costos_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# API
PORT=3001
API_PREFIX=api

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Ejecutar migraciones
```bash
cd backend
npm run migration:run
```

**Deberías ver:**
```
query: SELECT * FROM current_schema()
query: SELECT version()
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'migrations'
...
Migration InitialSchema1700000000000 has been executed successfully.
```

### Cargar datos de ejemplo (SEEDS)
```bash
cd backend
npm run seed
```

**Deberías ver:**
```
🌱 Iniciando carga de datos...
✅ Conexión a base de datos establecida
✅ Datos iniciales cargados exitosamente
✅ Seeds completados exitosamente
```

### Levantar el servidor
```bash
cd backend
npm run start:dev
```

**El backend estará disponible en:**
- API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api/docs

---

## 💻 3. Configurar Frontend

### Instalar dependencias
```bash
cd frontend
npm install
```

### Configurar variables de entorno
Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api
```

### Levantar el servidor de desarrollo
```bash
cd frontend
npm run dev
```

**El frontend estará disponible en:**
- http://localhost:3000

---

## 👤 4. Credenciales de Acceso

Los seeds crearon 3 usuarios de prueba:

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| admin | admin@costos.com | admin123 | Administrador |
| ingeniero | ingeniero@costos.com | admin123 | Ingeniero de Costos |
| proyectista | proyectista@costos.com | admin123 | Proyectista |

---

## 📊 5. Datos de Ejemplo Cargados

### Proveedores (4)
- Aceros Arequipa S.A.
- Cemento Sol S.A.
- Maestro Perú S.A.
- Sodimac Perú S.A.

### Insumos (40+)
- **12 Materiales**: Cemento, Arena, Piedra, Fierro, Ladrillo, etc.
- **12 Mano de Obra**: Operario, Oficial, Peón, Capataz, Especialistas
- **10 Equipos**: Mezcladora, Vibrador, Andamios, Herramientas
- **4 Subcontratos**: Ensayos, Topografía, Eliminación

### Partidas (32)
Organizadas por especialidad:
- Obras Preliminares (3)
- Movimiento de Tierras (3)
- Concreto Simple (2)
- Concreto Armado (6)
- Albañilería (4)
- Pisos y Pavimentos (3)
- Revestimientos (1)
- Instalaciones Sanitarias (3)
- Instalaciones Eléctricas (3)
- Carpintería de Madera (2)
- Pintura (3)

---

## 🎯 6. Primeros Pasos en el Sistema

### Opción A: Usar Datos de Ejemplo
1. **Login**: Usa cualquiera de las credenciales arriba
2. **Explorar Insumos**: Ve a "Insumos" para ver el catálogo cargado
3. **Ver Partidas**: Ve a "Partidas" y filtra por especialidad
4. **Crear ACU**: Ve a "ACU" > "Nuevo ACU"
5. **Crear Proyecto**: Ve a "Proyectos" > "Nuevo Proyecto"

### Opción B: Importar tus Propios Datos
1. **Descargar Plantilla**: Ve a "Insumos" > "Importar Excel" > "Descargar Plantilla"
2. **Llenar Plantilla**: Completa el archivo Excel con tus datos
3. **Importar**: Sube el archivo desde "Insumos" > "Importar Excel"

---

## 📝 7. Funcionalidades Disponibles

### ✅ Completamente Funcional
- ✅ CRUD de Insumos (con importación Excel)
- ✅ CRUD de Partidas (con filtros)
- ✅ CRUD de Proyectos
- ✅ Gestión de ACUs (Análisis de Costos Unitarios)
- ✅ Gestión de Metrados
- ✅ Cálculo automático de presupuestos
- ✅ Reportes Excel (3 hojas: Resumen, Presupuesto, ACU)
- ✅ Reportes PDF profesionales
- ✅ Importación masiva de insumos y metrados
- ✅ Dashboard con estadísticas
- ✅ Sistema de notificaciones toast

### 🚧 En Desarrollo
- Formulario completo de creación de ACU (solo lectura por ahora)
- Editor de metrados tipo spreadsheet
- Gráficos estadísticos avanzados

---

## 🛠️ 8. Scripts Útiles

### Backend
```bash
# Desarrollo
npm run start:dev          # Servidor con hot-reload

# Producción
npm run build              # Compilar
npm run start:prod         # Ejecutar compilado

# Base de Datos
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir última migración
npm run seed               # Cargar datos de ejemplo

# Tests
npm run test               # Unit tests
npm run test:e2e           # E2E tests
```

### Frontend
```bash
# Desarrollo
npm run dev                # Servidor dev con Vite

# Producción
npm run build              # Compilar para producción
npm run preview            # Preview de build

# Linting
npm run lint               # Verificar código
```

---

## 🔍 9. Verificar Instalación

### Base de Datos
```bash
# Conectar a PostgreSQL
docker exec -it costos-postgres psql -U postgres -d costos_db

# Verificar tablas
\dt

# Deberías ver: users, proveedores, insumos, partidas, acus, acu_insumos, proyectos, gastos_generales, metrados, migrations

# Verificar datos
SELECT COUNT(*) FROM insumos;    # Debería retornar ~40
SELECT COUNT(*) FROM partidas;   # Debería retornar 32
SELECT COUNT(*) FROM users;      # Debería retornar 3

# Salir
\q
```

### API (Backend)
```bash
# Test de health check (si existe)
curl http://localhost:3001/api

# Ver documentación Swagger
# Abre en navegador: http://localhost:3001/api/docs
```

### Frontend
```bash
# Debería abrir automáticamente en:
# http://localhost:3000
```

---

## ❗ 10. Solución de Problemas

### Error: Puerto 5432 ya en uso
```bash
# Detener servicios de PostgreSQL local
sudo systemctl stop postgresql

# O cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"  # Usar puerto 5433 externamente
```

### Error: Cannot connect to database
```bash
# Verificar que Docker esté corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar servicios
docker-compose down
docker-compose up -d
```

### Error en migraciones
```bash
# Limpiar y volver a crear
docker-compose down -v  # Elimina volúmenes
docker-compose up -d
cd backend
npm run migration:run
npm run seed
```

### Puppeteer no funciona (PDF)
```bash
# Instalar dependencias de Chrome (Linux)
sudo apt-get install -y \
  libnss3 libxss1 libasound2 libatk-bridge2.0-0 \
  libgtk-3-0 libgbm1

# macOS - generalmente funciona out of the box
# Windows - asegúrate de tener Visual C++ Redistributable
```

---

## 📚 11. Recursos

- **Swagger API Docs**: http://localhost:3001/api/docs
- **DESARROLLO.md**: Estado actual del desarrollo
- **README.md**: Documentación general del proyecto

---

## 🎉 12. ¡Todo Listo!

Si llegaste hasta aquí, tu sistema debería estar completamente funcional.

**Siguiente paso**: Abre http://localhost:3000 y comienza a explorar! 🚀

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del backend: `cd backend && npm run start:dev`
2. Revisa los logs de Docker: `docker-compose logs`
3. Verifica que todas las variables de entorno estén configuradas
