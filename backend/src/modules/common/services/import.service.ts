import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { InsumosService } from '../../insumos/insumos.service';
import { MetradosService } from '../../metrados/metrados.service';
import { InsumoTipo, Moneda } from '../../insumos/entities/insumo.entity';

@Injectable()
export class ImportService {
  constructor(
    private readonly insumosService: InsumosService,
    private readonly metradosService: MetradosService,
  ) {}

  async importarInsumosDesdeExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new BadRequestException('El archivo Excel no contiene hojas');
    }

    const insumos = [];
    const errores = [];

    // Iterar desde la fila 2 (asumiendo que la fila 1 es encabezado)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezado

      try {
        const codigo = row.getCell(1).value?.toString() || '';
        const nombre = row.getCell(2).value?.toString() || '';
        const unidadMedida = row.getCell(3).value?.toString() || '';
        const tipo = row.getCell(4).value?.toString() || 'material';
        const precioUnitario = Number(row.getCell(5).value) || 0;
        const moneda = row.getCell(6).value?.toString() || 'PEN';
        const observaciones = row.getCell(7).value?.toString() || '';

        if (!codigo || !nombre) {
          errores.push(`Fila ${rowNumber}: Código y nombre son requeridos`);
          return;
        }

        insumos.push({
          codigo,
          nombre,
          unidadMedida,
          tipo: this.mapearTipoInsumo(tipo),
          precioUnitario,
          moneda: this.mapearMoneda(moneda),
          observaciones,
          activo: true,
        });
      } catch (error) {
        errores.push(`Fila ${rowNumber}: ${error.message}`);
      }
    });

    if (insumos.length === 0) {
      throw new BadRequestException('No se encontraron insumos válidos en el archivo');
    }

    // Intentar crear los insumos
    const resultado = {
      total: insumos.length,
      exitosos: 0,
      fallidos: 0,
      errores: [...errores],
    };

    for (const insumoData of insumos) {
      try {
        await this.insumosService.create(insumoData);
        resultado.exitosos++;
      } catch (error) {
        resultado.fallidos++;
        resultado.errores.push(
          `${insumoData.codigo}: ${error.message}`,
        );
      }
    }

    return resultado;
  }

  async generarPlantillaInsumos(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Insumos');

    // Definir columnas
    worksheet.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 40 },
      { header: 'Unidad Medida', key: 'unidadMedida', width: 15 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Precio Unitario', key: 'precioUnitario', width: 15 },
      { header: 'Moneda', key: 'moneda', width: 10 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];

    // Estilo del encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Agregar filas de ejemplo
    worksheet.addRow({
      codigo: 'MAT-001',
      nombre: 'Cemento Portland Tipo I x 42.5kg',
      unidadMedida: 'BOL',
      tipo: 'material',
      precioUnitario: 25.50,
      moneda: 'PEN',
      observaciones: 'Ejemplo de material',
    });

    worksheet.addRow({
      codigo: 'MO-001',
      nombre: 'Operario',
      unidadMedida: 'HH',
      tipo: 'mano_obra',
      precioUnitario: 20.00,
      moneda: 'PEN',
      observaciones: 'Ejemplo de mano de obra',
    });

    worksheet.addRow({
      codigo: 'EQ-001',
      nombre: 'Mezcladora de concreto',
      unidadMedida: 'HM',
      tipo: 'equipo',
      precioUnitario: 15.00,
      moneda: 'PEN',
      observaciones: 'Ejemplo de equipo',
    });

    // Agregar instrucciones
    worksheet.addRow([]);
    const instruccionRow = worksheet.addRow([
      'INSTRUCCIONES:',
      'Tipos válidos: material, mano_obra, equipo, subcontrato',
      'Monedas válidas: PEN, USD, EUR',
    ]);
    instruccionRow.font = { italic: true, color: { argb: 'FF666666' } };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private mapearTipoInsumo(tipo: string): InsumoTipo {
    const tipoLower = tipo.toLowerCase().replace(/\s+/g, '_');
    switch (tipoLower) {
      case 'material':
        return InsumoTipo.MATERIAL;
      case 'mano_obra':
      case 'manoobra':
      case 'mano obra':
        return InsumoTipo.MANO_OBRA;
      case 'equipo':
        return InsumoTipo.EQUIPO;
      case 'subcontrato':
        return InsumoTipo.SUBCONTRATO;
      default:
        return InsumoTipo.MATERIAL;
    }
  }

  private mapearMoneda(moneda: string): Moneda {
    const monedaUpper = moneda.toUpperCase();
    switch (monedaUpper) {
      case 'PEN':
      case 'SOLES':
      case 'S/.':
        return Moneda.PEN;
      case 'USD':
      case 'DOLARES':
      case '$':
        return Moneda.USD;
      case 'EUR':
      case 'EUROS':
      case '€':
        return Moneda.EUR;
      default:
        return Moneda.PEN;
    }
  }

  async importarMetradosDesdeExcel(
    proyectoId: string,
    buffer: Buffer,
  ): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new BadRequestException('El archivo Excel no contiene hojas');
    }

    const metrados = [];
    const errores = [];

    // Iterar desde la fila 2 (asumiendo que la fila 1 es encabezado)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezado

      try {
        const partidaCodigo = row.getCell(1).value?.toString() || '';
        const agrupacion = row.getCell(2).value?.toString() || '';
        const cantidad = Number(row.getCell(3).value) || 0;
        const acuCodigo = row.getCell(4).value?.toString() || '';
        const observaciones = row.getCell(5).value?.toString() || '';

        if (!partidaCodigo || cantidad === 0) {
          errores.push(
            `Fila ${rowNumber}: Código de partida y cantidad son requeridos`,
          );
          return;
        }

        metrados.push({
          proyectoId,
          partidaCodigo,
          agrupacion,
          cantidad,
          acuCodigo: acuCodigo || null,
          observaciones,
        });
      } catch (error) {
        errores.push(`Fila ${rowNumber}: ${error.message}`);
      }
    });

    if (metrados.length === 0) {
      throw new BadRequestException(
        'No se encontraron metrados válidos en el archivo',
      );
    }

    // Intentar crear los metrados
    const resultado = {
      total: metrados.length,
      exitosos: 0,
      fallidos: 0,
      errores: [...errores],
    };

    for (const metradoData of metrados) {
      try {
        await this.metradosService.createFromImport(metradoData);
        resultado.exitosos++;
      } catch (error) {
        resultado.fallidos++;
        resultado.errores.push(
          `${metradoData.partidaCodigo}: ${error.message}`,
        );
      }
    }

    return resultado;
  }

  async generarPlantillaMetrados(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Metrados');

    // Definir columnas
    worksheet.columns = [
      { header: 'Código Partida', key: 'partidaCodigo', width: 20 },
      { header: 'Agrupación', key: 'agrupacion', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Código ACU (Opcional)', key: 'acuCodigo', width: 20 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
    ];

    // Estilo del encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Agregar filas de ejemplo
    worksheet.addRow({
      partidaCodigo: 'EST-01.01.01',
      agrupacion: 'OBRAS PRELIMINARES',
      cantidad: 120.50,
      acuCodigo: '',
      observaciones: 'Ejemplo de metrado - se asignará ACU más reciente',
    });

    worksheet.addRow({
      partidaCodigo: 'EST-02.01.01',
      agrupacion: 'ESTRUCTURAS',
      cantidad: 85.00,
      acuCodigo: 'ACU-EST-02-001',
      observaciones: 'Ejemplo con ACU específico',
    });

    // Agregar instrucciones
    worksheet.addRow([]);
    const instruccionRow = worksheet.addRow([
      'INSTRUCCIONES:',
      '1. El código de partida debe existir en la base de datos',
      '2. La cantidad debe ser mayor a 0',
      '3. Si no se especifica código ACU, se usará el más reciente de la partida',
      'La agrupación es opcional y sirve para organizar el presupuesto',
    ]);
    instruccionRow.font = { italic: true, color: { argb: 'FF666666' } };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
