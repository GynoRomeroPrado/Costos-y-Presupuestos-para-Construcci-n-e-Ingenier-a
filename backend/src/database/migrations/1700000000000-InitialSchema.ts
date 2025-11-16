import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'ingeniero_costos', 'proyectista', 'visualizador')
    `);
    await queryRunner.query(`
      CREATE TYPE "insumo_tipo_enum" AS ENUM('material', 'mano_obra', 'equipo', 'subcontrato')
    `);
    await queryRunner.query(`
      CREATE TYPE "insumo_moneda_enum" AS ENUM('PEN', 'USD', 'EUR')
    `);
    await queryRunner.query(`
      CREATE TYPE "proyecto_estado_enum" AS ENUM('borrador', 'activo', 'cerrado', 'archivado')
    `);
    await queryRunner.query(`
      CREATE TYPE "gasto_tipo_enum" AS ENUM('fijo', 'porcentaje')
    `);

    // Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" varchar NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "apellido" varchar NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'visualizador',
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Proveedores table
    await queryRunner.query(`
      CREATE TABLE "proveedores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "ruc" varchar,
        "contacto" varchar,
        "telefono" varchar,
        "email" varchar,
        "direccion" varchar,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_proveedores_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_proveedores" PRIMARY KEY ("id")
      )
    `);

    // Insumos table
    await queryRunner.query(`
      CREATE TABLE "insumos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "descripcion" text,
        "unidadMedida" varchar NOT NULL,
        "tipo" "insumo_tipo_enum" NOT NULL,
        "precioUnitario" decimal(10,2) NOT NULL,
        "moneda" "insumo_moneda_enum" NOT NULL DEFAULT 'PEN',
        "precioAnterior" decimal(10,2),
        "fechaCambioPrecio" TIMESTAMP,
        "proveedor" varchar,
        "marca" varchar,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_insumos_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_insumos" PRIMARY KEY ("id")
      )
    `);

    // Partidas table
    await queryRunner.query(`
      CREATE TABLE "partidas" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "descripcion" text,
        "unidadMedida" varchar NOT NULL,
        "especialidad" varchar NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_partidas_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_partidas" PRIMARY KEY ("id")
      )
    `);

    // ACUs table
    await queryRunner.query(`
      CREATE TABLE "acus" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar NOT NULL,
        "partidaId" uuid NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "rendimiento" decimal(10,4) NOT NULL,
        "costoUnitarioCalculado" decimal(10,2) NOT NULL DEFAULT 0,
        "costoMateriales" decimal(10,2) NOT NULL DEFAULT 0,
        "costoManoObra" decimal(10,2) NOT NULL DEFAULT 0,
        "costoEquipo" decimal(10,2) NOT NULL DEFAULT 0,
        "costoSubcontrato" decimal(10,2) NOT NULL DEFAULT 0,
        "cuadrilla" jsonb,
        "observaciones" text,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_acus_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_acus" PRIMARY KEY ("id")
      )
    `);

    // ACU-Insumos relationship table
    await queryRunner.query(`
      CREATE TABLE "acu_insumos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "acuId" uuid NOT NULL,
        "insumoId" uuid NOT NULL,
        "cantidad" decimal(10,4) NOT NULL,
        "desperdicio" decimal(5,2) NOT NULL DEFAULT 0,
        "precioUnitarioSnapshot" decimal(10,2) NOT NULL,
        "costoParcial" decimal(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_acu_insumos" PRIMARY KEY ("id")
      )
    `);

    // Proyectos table
    await queryRunner.query(`
      CREATE TABLE "proyectos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "cliente" varchar,
        "ubicacion" varchar,
        "descripcion" text,
        "monedaBase" varchar NOT NULL DEFAULT 'PEN',
        "igvPorcentaje" decimal(5,2) NOT NULL DEFAULT 18.00,
        "costoDirecto" decimal(12,2) NOT NULL DEFAULT 0,
        "gastosGenerales" decimal(12,2) NOT NULL DEFAULT 0,
        "utilidad" decimal(12,2) NOT NULL DEFAULT 0,
        "subtotal" decimal(12,2) NOT NULL DEFAULT 0,
        "igv" decimal(12,2) NOT NULL DEFAULT 0,
        "presupuestoTotal" decimal(12,2) NOT NULL DEFAULT 0,
        "estado" "proyecto_estado_enum" NOT NULL DEFAULT 'borrador',
        "fechaInicio" TIMESTAMP,
        "fechaFin" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_proyectos_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_proyectos" PRIMARY KEY ("id")
      )
    `);

    // Gastos Generales table
    await queryRunner.query(`
      CREATE TABLE "gastos_generales" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "proyectoId" uuid NOT NULL,
        "concepto" varchar NOT NULL,
        "tipo" "gasto_tipo_enum" NOT NULL,
        "monto" decimal(10,2),
        "porcentaje" decimal(5,2),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gastos_generales" PRIMARY KEY ("id")
      )
    `);

    // Metrados table
    await queryRunner.query(`
      CREATE TABLE "metrados" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "proyectoId" uuid NOT NULL,
        "partidaId" uuid NOT NULL,
        "acuId" uuid,
        "cantidad" decimal(10,4) NOT NULL,
        "unidadMedida" varchar NOT NULL,
        "costoUnitario" decimal(10,2) NOT NULL,
        "costoParcial" decimal(10,2) NOT NULL,
        "agrupacion" varchar,
        "observaciones" text,
        "ordenVisualizacion" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_metrados" PRIMARY KEY ("id")
      )
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "acus" ADD CONSTRAINT "FK_acus_partida"
      FOREIGN KEY ("partidaId") REFERENCES "partidas"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "acu_insumos" ADD CONSTRAINT "FK_acu_insumos_acu"
      FOREIGN KEY ("acuId") REFERENCES "acus"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "acu_insumos" ADD CONSTRAINT "FK_acu_insumos_insumo"
      FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "gastos_generales" ADD CONSTRAINT "FK_gastos_generales_proyecto"
      FOREIGN KEY ("proyectoId") REFERENCES "proyectos"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "metrados" ADD CONSTRAINT "FK_metrados_proyecto"
      FOREIGN KEY ("proyectoId") REFERENCES "proyectos"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "metrados" ADD CONSTRAINT "FK_metrados_partida"
      FOREIGN KEY ("partidaId") REFERENCES "partidas"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "metrados" ADD CONSTRAINT "FK_metrados_acu"
      FOREIGN KEY ("acuId") REFERENCES "acus"("id") ON DELETE SET NULL
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_acus_partida" ON "acus" ("partidaId")`);
    await queryRunner.query(`CREATE INDEX "IDX_acus_activo" ON "acus" ("activo")`);
    await queryRunner.query(`CREATE INDEX "IDX_acu_insumos_acu" ON "acu_insumos" ("acuId")`);
    await queryRunner.query(`CREATE INDEX "IDX_acu_insumos_insumo" ON "acu_insumos" ("insumoId")`);
    await queryRunner.query(`CREATE INDEX "IDX_metrados_proyecto" ON "metrados" ("proyectoId")`);
    await queryRunner.query(`CREATE INDEX "IDX_metrados_partida" ON "metrados" ("partidaId")`);
    await queryRunner.query(`CREATE INDEX "IDX_metrados_acu" ON "metrados" ("acuId")`);
    await queryRunner.query(`CREATE INDEX "IDX_insumos_tipo" ON "insumos" ("tipo")`);
    await queryRunner.query(`CREATE INDEX "IDX_partidas_especialidad" ON "partidas" ("especialidad")`);
    await queryRunner.query(`CREATE INDEX "IDX_proyectos_estado" ON "proyectos" ("estado")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_proyectos_estado"`);
    await queryRunner.query(`DROP INDEX "IDX_partidas_especialidad"`);
    await queryRunner.query(`DROP INDEX "IDX_insumos_tipo"`);
    await queryRunner.query(`DROP INDEX "IDX_metrados_acu"`);
    await queryRunner.query(`DROP INDEX "IDX_metrados_partida"`);
    await queryRunner.query(`DROP INDEX "IDX_metrados_proyecto"`);
    await queryRunner.query(`DROP INDEX "IDX_acu_insumos_insumo"`);
    await queryRunner.query(`DROP INDEX "IDX_acu_insumos_acu"`);
    await queryRunner.query(`DROP INDEX "IDX_acus_activo"`);
    await queryRunner.query(`DROP INDEX "IDX_acus_partida"`);

    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE "metrados" DROP CONSTRAINT "FK_metrados_acu"`);
    await queryRunner.query(`ALTER TABLE "metrados" DROP CONSTRAINT "FK_metrados_partida"`);
    await queryRunner.query(`ALTER TABLE "metrados" DROP CONSTRAINT "FK_metrados_proyecto"`);
    await queryRunner.query(`ALTER TABLE "gastos_generales" DROP CONSTRAINT "FK_gastos_generales_proyecto"`);
    await queryRunner.query(`ALTER TABLE "acu_insumos" DROP CONSTRAINT "FK_acu_insumos_insumo"`);
    await queryRunner.query(`ALTER TABLE "acu_insumos" DROP CONSTRAINT "FK_acu_insumos_acu"`);
    await queryRunner.query(`ALTER TABLE "acus" DROP CONSTRAINT "FK_acus_partida"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "metrados"`);
    await queryRunner.query(`DROP TABLE "gastos_generales"`);
    await queryRunner.query(`DROP TABLE "proyectos"`);
    await queryRunner.query(`DROP TABLE "acu_insumos"`);
    await queryRunner.query(`DROP TABLE "acus"`);
    await queryRunner.query(`DROP TABLE "partidas"`);
    await queryRunner.query(`DROP TABLE "insumos"`);
    await queryRunner.query(`DROP TABLE "proveedores"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "gasto_tipo_enum"`);
    await queryRunner.query(`DROP TYPE "proyecto_estado_enum"`);
    await queryRunner.query(`DROP TYPE "insumo_moneda_enum"`);
    await queryRunner.query(`DROP TYPE "insumo_tipo_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
