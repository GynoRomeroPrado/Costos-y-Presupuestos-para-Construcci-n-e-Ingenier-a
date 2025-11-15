import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as puppeteer from 'puppeteer';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Metrado } from '../../metrados/entities/metrado.entity';

@Injectable()
export class ReportService {
  async generarPresupuestoExcel(
    proyecto: Proyecto,
    metrados: Metrado[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    // ========== HOJA 1: RESUMEN ==========
    const resumenSheet = workbook.addWorksheet('Resumen');
    this.crearHojaResumen(resumenSheet, proyecto);

    // ========== HOJA 2: PRESUPUESTO DETALLADO ==========
    const presupuestoSheet = workbook.addWorksheet('Presupuesto');
    this.crearHojaPresupuesto(presupuestoSheet, proyecto, metrados);

    // ========== HOJA 3: ANÁLISIS DE PRECIOS UNITARIOS ==========
    const acuSheet = workbook.addWorksheet('Análisis Precios');
    this.crearHojaACU(acuSheet, metrados);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private crearHojaResumen(sheet: ExcelJS.Worksheet, proyecto: Proyecto) {
    // Título
    sheet.mergeCells('A1:D1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'RESUMEN DE PRESUPUESTO';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 30;

    // Información del proyecto
    sheet.addRow([]);
    sheet.addRow(['PROYECTO:', proyecto.nombre]);
    sheet.addRow(['CLIENTE:', proyecto.cliente || 'N/A']);
    sheet.addRow(['UBICACIÓN:', proyecto.ubicacion || 'N/A']);
    sheet.addRow(['FECHA:', new Date().toLocaleDateString('es-PE')]);
    sheet.addRow([]);

    // Resumen de costos
    const headerRow = sheet.addRow(['CONCEPTO', 'MONTO', 'MONEDA', '%']);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true };

    const total = proyecto.presupuestoTotal;

    sheet.addRow([
      'Costo Directo',
      proyecto.costoDirecto,
      proyecto.monedaBase,
      ((proyecto.costoDirecto / total) * 100).toFixed(2) + '%',
    ]);

    sheet.addRow([
      'Gastos Generales',
      proyecto.gastosGenerales,
      proyecto.monedaBase,
      ((proyecto.gastosGenerales / total) * 100).toFixed(2) + '%',
    ]);

    sheet.addRow([
      'Utilidad',
      proyecto.utilidad,
      proyecto.monedaBase,
      ((proyecto.utilidad / total) * 100).toFixed(2) + '%',
    ]);

    sheet.addRow([
      'Subtotal',
      proyecto.subtotal,
      proyecto.monedaBase,
      '',
    ]);

    sheet.addRow([
      `IGV (${proyecto.igvPorcentaje}%)`,
      proyecto.igv,
      proyecto.monedaBase,
      '',
    ]);

    const totalRow = sheet.addRow([
      'PRESUPUESTO TOTAL',
      proyecto.presupuestoTotal,
      proyecto.monedaBase,
      '100%',
    ]);
    totalRow.font = { bold: true, size: 12 };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
    };

    // Formato de moneda
    sheet.getColumn(2).numFmt = '#,##0.00';
    sheet.getColumn(1).width = 30;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 10;
    sheet.getColumn(4).width = 10;
  }

  private crearHojaPresupuesto(
    sheet: ExcelJS.Worksheet,
    proyecto: Proyecto,
    metrados: Metrado[],
  ) {
    // Título
    sheet.mergeCells('A1:G1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `PRESUPUESTO - ${proyecto.nombre}`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    sheet.getRow(1).height = 25;

    sheet.addRow([]);

    // Encabezados
    const headerRow = sheet.addRow([
      'ITEM',
      'CÓDIGO',
      'DESCRIPCIÓN',
      'UND',
      'CANTIDAD',
      'P.U.',
      'PARCIAL',
    ]);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Agrupar por especialidad
    const metradosPorEspecialidad = this.agruparPorEspecialidad(metrados);

    let itemNumber = 1;
    let totalGeneral = 0;

    for (const [especialidad, items] of Object.entries(metradosPorEspecialidad)) {
      // Título de especialidad
      const especialidadRow = sheet.addRow([especialidad]);
      sheet.mergeCells(`A${especialidadRow.number}:G${especialidadRow.number}`);
      especialidadRow.font = { bold: true, size: 11 };
      especialidadRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' },
      };

      let subtotal = 0;

      for (const metrado of items) {
        sheet.addRow([
          itemNumber.toString().padStart(2, '0'),
          metrado.partida?.codigo || 'N/A',
          metrado.partida?.nombre || 'Sin descripción',
          metrado.unidadMedida,
          metrado.cantidad,
          metrado.costoUnitario,
          metrado.costoParcial,
        ]);

        subtotal += Number(metrado.costoParcial);
        itemNumber++;
      }

      // Subtotal de especialidad
      const subtotalRow = sheet.addRow([
        '',
        '',
        '',
        '',
        '',
        'SUBTOTAL:',
        subtotal,
      ]);
      subtotalRow.font = { bold: true };
      totalGeneral += subtotal;

      sheet.addRow([]);
    }

    // Total general
    const totalRow = sheet.addRow([
      '',
      '',
      '',
      '',
      '',
      'TOTAL COSTO DIRECTO:',
      totalGeneral,
    ]);
    totalRow.font = { bold: true, size: 12 };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
    };

    // Formato de columnas
    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 50;
    sheet.getColumn(4).width = 8;
    sheet.getColumn(5).width = 12;
    sheet.getColumn(6).width = 12;
    sheet.getColumn(7).width = 15;

    sheet.getColumn(5).numFmt = '#,##0.00';
    sheet.getColumn(6).numFmt = '#,##0.00';
    sheet.getColumn(7).numFmt = '#,##0.00';
  }

  private crearHojaACU(sheet: ExcelJS.Worksheet, metrados: Metrado[]) {
    // Título
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'ANÁLISIS DE PRECIOS UNITARIOS';
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    sheet.addRow([]);

    for (const metrado of metrados) {
      if (!metrado.acu) continue;

      // Título del ACU
      sheet.addRow([
        `PARTIDA: ${metrado.partida?.codigo || ''} - ${metrado.partida?.nombre || ''}`,
      ]);
      sheet.addRow(['Rendimiento:', metrado.acu.rendimiento, metrado.unidadMedida]);
      sheet.addRow([]);

      // Encabezados de insumos
      const headerRow = sheet.addRow([
        'Código',
        'Descripción',
        'Und',
        'Cantidad',
        'P.U.',
        'Parcial',
      ]);
      headerRow.font = { bold: true };

      // Insumos
      if (metrado.acu.acuInsumos) {
        for (const acuInsumo of metrado.acu.acuInsumos) {
          sheet.addRow([
            acuInsumo.insumo?.codigo || '',
            acuInsumo.insumo?.nombre || '',
            acuInsumo.insumo?.unidadMedida || '',
            acuInsumo.cantidad,
            acuInsumo.precioUnitarioSnapshot,
            acuInsumo.costoParcial,
          ]);
        }
      }

      // Total del ACU
      const totalRow = sheet.addRow([
        '',
        '',
        '',
        '',
        'COSTO UNITARIO:',
        metrado.acu.costoUnitarioCalculado,
      ]);
      totalRow.font = { bold: true };

      sheet.addRow([]);
      sheet.addRow([]);
    }

    // Formato de columnas
    sheet.getColumn(1).width = 12;
    sheet.getColumn(2).width = 40;
    sheet.getColumn(3).width = 8;
    sheet.getColumn(4).width = 12;
    sheet.getColumn(5).width = 12;
    sheet.getColumn(6).width = 15;

    sheet.getColumn(4).numFmt = '#,##0.0000';
    sheet.getColumn(5).numFmt = '#,##0.00';
    sheet.getColumn(6).numFmt = '#,##0.00';
  }

  private agruparPorEspecialidad(metrados: Metrado[]): Record<string, Metrado[]> {
    const grupos: Record<string, Metrado[]> = {};

    for (const metrado of metrados) {
      const especialidad = metrado.partida?.especialidad || metrado.agrupacion || 'GENERAL';
      if (!grupos[especialidad]) {
        grupos[especialidad] = [];
      }
      grupos[especialidad].push(metrado);
    }

    return grupos;
  }

  async generarPresupuestoPDF(
    proyecto: Proyecto,
    metrados: Metrado[],
  ): Promise<Buffer> {
    const html = this.generarHTMLPresupuesto(proyecto, metrados);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        printBackground: true,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private generarHTMLPresupuesto(proyecto: Proyecto, metrados: Metrado[]): string {
    const metradosPorEspecialidad = this.agruparPorEspecialidad(metrados);

    let tablaPresupuesto = '';
    let itemNumber = 1;
    let totalGeneral = 0;

    for (const [especialidad, items] of Object.entries(metradosPorEspecialidad)) {
      tablaPresupuesto += `
        <tr class="especialidad-row">
          <td colspan="7"><strong>${especialidad}</strong></td>
        </tr>
      `;

      let subtotal = 0;
      for (const metrado of items) {
        const parcial = Number(metrado.costoParcial);
        subtotal += parcial;

        tablaPresupuesto += `
          <tr>
            <td style="text-align: center;">${itemNumber.toString().padStart(2, '0')}</td>
            <td>${metrado.partida?.codigo || 'N/A'}</td>
            <td>${metrado.partida?.nombre || 'Sin descripción'}</td>
            <td style="text-align: center;">${metrado.unidadMedida}</td>
            <td style="text-align: right;">${Number(metrado.cantidad).toFixed(2)}</td>
            <td style="text-align: right;">${Number(metrado.costoUnitario).toFixed(2)}</td>
            <td style="text-align: right;">${parcial.toFixed(2)}</td>
          </tr>
        `;
        itemNumber++;
      }

      tablaPresupuesto += `
        <tr class="subtotal-row">
          <td colspan="6" style="text-align: right;"><strong>SUBTOTAL ${especialidad}:</strong></td>
          <td style="text-align: right;"><strong>${subtotal.toFixed(2)}</strong></td>
        </tr>
      `;

      totalGeneral += subtotal;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            margin: 0;
            padding: 0;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .header h1 {
            margin: 5px 0;
            font-size: 18pt;
          }
          .info-proyecto {
            margin-bottom: 15px;
          }
          .info-proyecto table {
            width: 100%;
            border-collapse: collapse;
          }
          .info-proyecto td {
            padding: 3px 5px;
          }
          .info-proyecto td:first-child {
            font-weight: bold;
            width: 120px;
          }
          table.presupuesto {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table.presupuesto th {
            background-color: #4472C4;
            color: white;
            padding: 8px 5px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #333;
          }
          table.presupuesto td {
            padding: 5px;
            border: 1px solid #ccc;
          }
          .especialidad-row td {
            background-color: #E7E6E6;
            font-weight: bold;
            padding: 6px 5px;
          }
          .subtotal-row td {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .total-row td {
            background-color: #FFFF00;
            font-weight: bold;
            font-size: 11pt;
            padding: 8px 5px;
          }
          .resumen-box {
            width: 100%;
            margin-top: 20px;
            border: 2px solid #333;
            padding: 10px;
          }
          .resumen-box table {
            width: 100%;
            border-collapse: collapse;
          }
          .resumen-box td {
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .resumen-box td:first-child {
            font-weight: bold;
            width: 60%;
          }
          .resumen-box td:nth-child(2) {
            text-align: right;
            width: 30%;
          }
          .resumen-box .total-final {
            background-color: #FFFF00;
            font-size: 12pt;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PRESUPUESTO DE OBRA</h1>
          <p style="margin: 5px 0;">${proyecto.nombre}</p>
        </div>

        <div class="info-proyecto">
          <table>
            <tr>
              <td>CLIENTE:</td>
              <td>${proyecto.cliente || 'N/A'}</td>
            </tr>
            <tr>
              <td>UBICACIÓN:</td>
              <td>${proyecto.ubicacion || 'N/A'}</td>
            </tr>
            <tr>
              <td>FECHA:</td>
              <td>${new Date().toLocaleDateString('es-PE')}</td>
            </tr>
            <tr>
              <td>MONEDA:</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
          </table>
        </div>

        <table class="presupuesto">
          <thead>
            <tr>
              <th style="width: 5%;">ITEM</th>
              <th style="width: 10%;">CÓDIGO</th>
              <th style="width: 40%;">DESCRIPCIÓN</th>
              <th style="width: 7%;">UND</th>
              <th style="width: 10%;">CANTIDAD</th>
              <th style="width: 12%;">P.U.</th>
              <th style="width: 16%;">PARCIAL</th>
            </tr>
          </thead>
          <tbody>
            ${tablaPresupuesto}
            <tr class="total-row">
              <td colspan="6" style="text-align: right;">TOTAL COSTO DIRECTO:</td>
              <td style="text-align: right;">${totalGeneral.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="resumen-box">
          <h3 style="margin-top: 0;">RESUMEN DEL PRESUPUESTO</h3>
          <table>
            <tr>
              <td>Costo Directo</td>
              <td>${Number(proyecto.costoDirecto).toFixed(2)}</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
            <tr>
              <td>Gastos Generales</td>
              <td>${Number(proyecto.gastosGenerales).toFixed(2)}</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
            <tr>
              <td>Utilidad</td>
              <td>${Number(proyecto.utilidad).toFixed(2)}</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
            <tr>
              <td>Subtotal</td>
              <td>${Number(proyecto.subtotal).toFixed(2)}</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
            <tr>
              <td>IGV (${proyecto.igvPorcentaje}%)</td>
              <td>${Number(proyecto.igv).toFixed(2)}</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
            <tr class="total-final">
              <td>PRESUPUESTO TOTAL</td>
              <td>${Number(proyecto.presupuestoTotal).toFixed(2)}</td>
              <td>${proyecto.monedaBase}</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  }
}
