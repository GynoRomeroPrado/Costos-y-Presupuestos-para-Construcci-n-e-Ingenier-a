import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedInitialData(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ========== USUARIOS ==========
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryRunner.query(`
      INSERT INTO users (username, email, password, nombre, apellido, role)
      VALUES
        ('admin', 'admin@costos.com', '${hashedPassword}', 'Administrador', 'Sistema', 'admin'),
        ('ingeniero', 'ingeniero@costos.com', '${hashedPassword}', 'Juan', 'Pérez', 'ingeniero_costos'),
        ('proyectista', 'proyectista@costos.com', '${hashedPassword}', 'María', 'García', 'proyectista')
    `);

    // ========== PROVEEDORES ==========
    await queryRunner.query(`
      INSERT INTO proveedores (codigo, nombre, ruc, contacto, telefono, email)
      VALUES
        ('PROV-001', 'Aceros Arequipa S.A.', '20100128056', 'Carlos Mendoza', '01-2158000', 'ventas@acerosarequipa.com'),
        ('PROV-002', 'Cemento Sol S.A.', '20512147171', 'Ana Torres', '01-4114100', 'comercial@cementosol.com'),
        ('PROV-003', 'Maestro Perú S.A.', '20100016681', 'Roberto Silva', '080-800-8030', 'ventas@maestro.com.pe'),
        ('PROV-004', 'Sodimac Perú S.A.', '20112273922', 'Laura Vega', '01-6189898', 'corporativo@sodimac.com.pe')
    `);

    // ========== INSUMOS - MATERIALES ==========
    await queryRunner.query(`
      INSERT INTO insumos (codigo, nombre, descripcion, unidadMedida, tipo, precioUnitario, moneda, proveedor)
      VALUES
        -- Materiales
        ('MAT-001', 'Cemento Portland Tipo I x 42.5kg', 'Cemento Portland Tipo I ASTM C-150', 'BOL', 'material', 24.50, 'PEN', 'Cemento Sol S.A.'),
        ('MAT-002', 'Arena Gruesa', 'Arena gruesa para concreto', 'M3', 'material', 45.00, 'PEN', 'Maestro Perú S.A.'),
        ('MAT-003', 'Piedra Chancada 1/2"', 'Piedra chancada de 1/2 pulgada', 'M3', 'material', 55.00, 'PEN', 'Maestro Perú S.A.'),
        ('MAT-004', 'Fierro Corrugado 3/8"', 'Acero corrugado grado 60', 'KG', 'material', 3.20, 'PEN', 'Aceros Arequipa S.A.'),
        ('MAT-005', 'Fierro Corrugado 1/2"', 'Acero corrugado grado 60', 'KG', 'material', 3.15, 'PEN', 'Aceros Arequipa S.A.'),
        ('MAT-006', 'Ladrillo KK 18 huecos', 'Ladrillo King Kong 18 huecos', 'UND', 'material', 0.85, 'PEN', 'Sodimac Perú S.A.'),
        ('MAT-007', 'Madera Tornillo 2" x 3" x 10 pies', 'Madera tornillo habilitada', 'P2', 'material', 5.50, 'PEN', 'Maestro Perú S.A.'),
        ('MAT-008', 'Clavos con cabeza 3"', 'Clavos de acero con cabeza', 'KG', 'material', 4.20, 'PEN', 'Sodimac Perú S.A.'),
        ('MAT-009', 'Alambre Negro N° 8', 'Alambre negro recocido', 'KG', 'material', 3.80, 'PEN', 'Sodimac Perú S.A.'),
        ('MAT-010', 'Tubería PVC 1/2" SAP', 'Tubería PVC SAP presión 10 bar', 'M', 'material', 2.50, 'PEN', 'Maestro Perú S.A.'),
        ('MAT-011', 'Pintura Látex Interior', 'Pintura látex para interiores', 'GL', 'material', 45.00, 'PEN', 'Sodimac Perú S.A.'),
        ('MAT-012', 'Mayólica 30x30 cm', 'Mayólica cerámico esmaltado', 'M2', 'material', 15.50, 'PEN', 'Sodimac Perú S.A.')
    `);

    // ========== INSUMOS - MANO DE OBRA ==========
    await queryRunner.query(`
      INSERT INTO insumos (codigo, nombre, descripcion, unidadMedida, tipo, precioUnitario, moneda)
      VALUES
        ('MO-001', 'Operario', 'Obrero calificado', 'HH', 'mano_obra', 18.50, 'PEN'),
        ('MO-002', 'Oficial', 'Obrero semi-calificado', 'HH', 'mano_obra', 15.00, 'PEN'),
        ('MO-003', 'Peón', 'Obrero no calificado', 'HH', 'mano_obra', 12.50, 'PEN'),
        ('MO-004', 'Capataz', 'Supervisor de cuadrilla', 'HH', 'mano_obra', 22.00, 'PEN'),
        ('MO-005', 'Maestro de Obra', 'Encargado técnico de obra', 'HH', 'mano_obra', 25.00, 'PEN'),
        ('MO-006', 'Operador de Equipo Liviano', 'Operador de maquinaria menor', 'HH', 'mano_obra', 20.00, 'PEN'),
        ('MO-007', 'Operador de Equipo Pesado', 'Operador de maquinaria pesada', 'HH', 'mano_obra', 24.00, 'PEN'),
        ('MO-008', 'Fierrero', 'Especialista en fierrería', 'HH', 'mano_obra', 19.00, 'PEN'),
        ('MO-009', 'Carpintero', 'Especialista en carpintería', 'HH', 'mano_obra', 19.00, 'PEN'),
        ('MO-010', 'Gasfitero', 'Especialista en gasfitería', 'HH', 'mano_obra', 19.50, 'PEN'),
        ('MO-011', 'Electricista', 'Especialista en electricidad', 'HH', 'mano_obra', 19.50, 'PEN'),
        ('MO-012', 'Pintor', 'Especialista en pintura', 'HH', 'mano_obra', 17.00, 'PEN')
    `);

    // ========== INSUMOS - EQUIPOS ==========
    await queryRunner.query(`
      INSERT INTO insumos (codigo, nombre, descripcion, unidadMedida, tipo, precioUnitario, moneda)
      VALUES
        ('EQ-001', 'Mezcladora de Concreto 9-11 p3', 'Mezcladora de concreto', 'HM', 'equipo', 12.00, 'PEN'),
        ('EQ-002', 'Vibrador de Concreto 4HP 1.35"', 'Vibrador de concreto', 'HM', 'equipo', 8.00, 'PEN'),
        ('EQ-003', 'Compactador Vibratorio Tipo Plancha', 'Compactador vibratorio', 'HM', 'equipo', 15.00, 'PEN'),
        ('EQ-004', 'Herramientas Manuales', 'Herramientas manuales diversas', '%MO', 'equipo', 5.00, 'PEN'),
        ('EQ-005', 'Andamio Metálico', 'Andamio tubular metálico', 'M2/DIA', 'equipo', 2.50, 'PEN'),
        ('EQ-006', 'Winche Eléctrico 500kg', 'Winche para elevación', 'HM', 'equipo', 18.00, 'PEN'),
        ('EQ-007', 'Cortadora de Cerámica', 'Cortadora de mayólica y cerámica', 'HM', 'equipo', 6.00, 'PEN'),
        ('EQ-008', 'Sierra Circular', 'Sierra circular para madera', 'HM', 'equipo', 8.50, 'PEN'),
        ('EQ-009', 'Taladro Percutor', 'Taladro percutor eléctrico', 'HM', 'equipo', 5.00, 'PEN'),
        ('EQ-010', 'Cizalla para Fierro', 'Cizalla manual para corte de fierro', 'HM', 'equipo', 7.00, 'PEN')
    `);

    // ========== INSUMOS - SUBCONTRATOS ==========
    await queryRunner.query(`
      INSERT INTO insumos (codigo, nombre, descripcion, unidadMedida, tipo, precioUnitario, moneda)
      VALUES
        ('SUB-001', 'Ensayo de Resistencia de Concreto', 'Ensayo de probetas de concreto', 'UND', 'subcontrato', 35.00, 'PEN'),
        ('SUB-002', 'Topografía - Replanteo', 'Servicio de replanteo topográfico', 'DIA', 'subcontrato', 450.00, 'PEN'),
        ('SUB-003', 'Alquiler de Grúa Torre', 'Alquiler de grúa torre con operador', 'DIA', 'subcontrato', 850.00, 'PEN'),
        ('SUB-004', 'Eliminación de Desmonte', 'Eliminación de material excedente', 'M3', 'subcontrato', 18.00, 'PEN')
    `);

    // ========== PARTIDAS ==========
    await queryRunner.query(`
      INSERT INTO partidas (codigo, nombre, descripcion, unidadMedida, especialidad)
      VALUES
        -- OBRAS PRELIMINARES
        ('OE.01.01', 'Limpieza de Terreno Manual', 'Limpieza manual del terreno', 'M2', 'OBRAS PRELIMINARES'),
        ('OE.01.02', 'Trazo, Niveles y Replanteo', 'Trazo y replanteo inicial', 'M2', 'OBRAS PRELIMINARES'),
        ('OE.01.03', 'Cartel de Obra 3.60 x 2.40m', 'Cartel de identificación de obra', 'UND', 'OBRAS PRELIMINARES'),

        -- MOVIMIENTO DE TIERRAS
        ('OE.02.01', 'Excavación de Zapatas', 'Excavación manual de zapatas', 'M3', 'MOVIMIENTO DE TIERRAS'),
        ('OE.02.02', 'Eliminación de Material Excedente', 'Eliminación de desmonte', 'M3', 'MOVIMIENTO DE TIERRAS'),
        ('OE.02.03', 'Relleno Compactado con Material Propio', 'Relleno y compactación', 'M3', 'MOVIMIENTO DE TIERRAS'),

        -- CONCRETO SIMPLE
        ('OE.03.01', 'Solado de 4" Mezcla 1:12 Cemento-Hormigón', 'Solado para cimientos', 'M2', 'CONCRETO SIMPLE'),
        ('OE.03.02', 'Cimientos Corridos Mezcla 1:10+30%PG', 'Cimientos de concreto ciclópeo', 'M3', 'CONCRETO SIMPLE'),

        -- CONCRETO ARMADO
        ('OE.04.01', 'Concreto f\'c=210 kg/cm2 en Columnas', 'Concreto premezclado en columnas', 'M3', 'CONCRETO ARMADO'),
        ('OE.04.02', 'Concreto f\'c=210 kg/cm2 en Vigas', 'Concreto premezclado en vigas', 'M3', 'CONCRETO ARMADO'),
        ('OE.04.03', 'Concreto f\'c=210 kg/cm2 en Losa Aligerada', 'Concreto en losas', 'M3', 'CONCRETO ARMADO'),
        ('OE.04.04', 'Encofrado y Desencofrado de Columnas', 'Encofrado de columnas', 'M2', 'CONCRETO ARMADO'),
        ('OE.04.05', 'Encofrado y Desencofrado de Vigas', 'Encofrado de vigas', 'M2', 'CONCRETO ARMADO'),
        ('OE.04.06', 'Acero de Refuerzo fy=4200 kg/cm2', 'Acero corrugado habilitado y colocado', 'KG', 'CONCRETO ARMADO'),

        -- ALBAÑILERÍA
        ('AR.01.01', 'Muro de Ladrillo KK Soga con Mezcla 1:5', 'Asentado de ladrillo', 'M2', 'ALBAÑILERÍA'),
        ('AR.01.02', 'Tarrajeo en Muros Interiores', 'Tarrajeo mezcla 1:5', 'M2', 'ALBAÑILERÍA'),
        ('AR.01.03', 'Tarrajeo en Muros Exteriores', 'Tarrajeo mezcla 1:5', 'M2', 'ALBAÑILERÍA'),
        ('AR.01.04', 'Tarrajeo en Cielos Rasos', 'Tarrajeo en techos', 'M2', 'ALBAÑILERÍA'),

        -- PISOS Y PAVIMENTOS
        ('AR.02.01', 'Contrapiso de 40mm', 'Contrapiso mezcla 1:5', 'M2', 'PISOS Y PAVIMENTOS'),
        ('AR.02.02', 'Piso de Cerámico 30x30cm', 'Instalación de cerámico', 'M2', 'PISOS Y PAVIMENTOS'),
        ('AR.02.03', 'Zócalo de Cerámico h=10cm', 'Zócalo cerámico', 'ML', 'PISOS Y PAVIMENTOS'),

        -- REVESTIMIENTOS
        ('AR.03.01', 'Enchape con Mayólica 30x30cm', 'Enchape de muros', 'M2', 'REVESTIMIENTOS'),

        -- INSTALACIONES SANITARIAS
        ('IS.01.01', 'Salida de Agua Fría con Tubería PVC 1/2"', 'Punto de agua fría', 'PTO', 'INST. SANITARIAS'),
        ('IS.01.02', 'Salida de Desagüe con Tubería PVC 2"', 'Punto de desagüe', 'PTO', 'INST. SANITARIAS'),
        ('IS.01.03', 'Red de Distribución Tubería PVC 1/2"', 'Red de distribución de agua', 'ML', 'INST. SANITARIAS'),

        -- INSTALACIONES ELÉCTRICAS
        ('IE.01.01', 'Salida de Techo (Centro de Luz)', 'Punto de centro de luz', 'PTO', 'INST. ELÉCTRICAS'),
        ('IE.01.02', 'Salida para Tomacorriente Doble con PVC', 'Tomacorriente doble', 'PTO', 'INST. ELÉCTRICAS'),
        ('IE.01.03', 'Cableado con Cable THW 2.5mm2', 'Cableado eléctrico', 'ML', 'INST. ELÉCTRICAS'),

        -- CARPINTERÍA DE MADERA
        ('CM.01.01', 'Puerta Contraplacada de 0.90 x 2.10m', 'Puerta de madera', 'UND', 'CARPINTERÍA MADERA'),
        ('CM.01.02', 'Ventana de Madera Cedro con Vidrio', 'Ventana de madera', 'M2', 'CARPINTERÍA MADERA'),

        -- PINTURA
        ('PT.01.01', 'Pintura Látex en Muros Interiores 2 Manos', 'Pintura interior', 'M2', 'PINTURA'),
        ('PT.01.02', 'Pintura Látex en Muros Exteriores 2 Manos', 'Pintura exterior', 'M2', 'PINTURA'),
        ('PT.01.03', 'Pintura Látex en Cielos Rasos 2 Manos', 'Pintura en techos', 'M2', 'PINTURA')
    `);

    await queryRunner.commitTransaction();
    console.log('✅ Datos iniciales cargados exitosamente');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error al cargar datos iniciales:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
