import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateGastoGeneralDto } from './dto/create-gasto-general.dto';
import { ReportService } from '../common/services/report.service';
import { ImportService } from '../common/services/import.service';
import { MetradosService } from '../metrados/metrados.service';

@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(
    private readonly proyectosService: ProyectosService,
    private readonly reportService: ReportService,
    private readonly importService: ImportService,
    private readonly metradosService: MetradosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos' })
  findAll(@Query() query: any) {
    return this.proyectosService.findAll(query);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de proyectos' })
  @ApiResponse({ status: 200, description: 'Estadísticas de proyectos' })
  getEstadisticas() {
    return this.proyectosService.getEstadisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.proyectosService.findOne(id);
  }

  @Get(':id/resumen')
  @ApiOperation({ summary: 'Obtener resumen del presupuesto del proyecto' })
  @ApiResponse({ status: 200, description: 'Resumen del presupuesto' })
  getResumen(@Param('id') id: string) {
    return this.proyectosService.getResumenPresupuesto(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado' })
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectosService.update(id, updateProyectoDto);
  }

  @Post(':id/recalcular')
  @ApiOperation({ summary: 'Recalcular presupuesto del proyecto' })
  @ApiResponse({ status: 200, description: 'Presupuesto recalculado' })
  async recalcular(@Param('id') id: string) {
    await this.proyectosService.calcularPresupuesto(id);
    return { message: 'Presupuesto recalculado exitosamente' };
  }

  @Post(':id/gastos-generales')
  @ApiOperation({ summary: 'Agregar gasto general al proyecto' })
  @ApiResponse({ status: 201, description: 'Gasto agregado exitosamente' })
  agregarGasto(
    @Param('id') id: string,
    @Body() createGastoDto: CreateGastoGeneralDto,
  ) {
    return this.proyectosService.agregarGastoGeneral(id, createGastoDto);
  }

  @Delete(':id/gastos-generales/:gastoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar gasto general del proyecto' })
  @ApiResponse({ status: 204, description: 'Gasto eliminado' })
  eliminarGasto(@Param('id') id: string, @Param('gastoId') gastoId: string) {
    return this.proyectosService.eliminarGastoGeneral(id, gastoId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiResponse({ status: 204, description: 'Proyecto eliminado' })
  remove(@Param('id') id: string) {
    return this.proyectosService.remove(id);
  }

  @Get(':id/reporte/excel')
  @ApiOperation({ summary: 'Descargar presupuesto en Excel' })
  @ApiResponse({ status: 200, description: 'Reporte Excel generado' })
  async descargarPresupuestoExcel(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const proyecto = await this.proyectosService.findOne(id);
    const metrados = await this.metradosService.findByProyecto(id);
    const buffer = await this.reportService.generarPresupuestoExcel(
      proyecto,
      metrados,
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=presupuesto_${proyecto.nombre.replace(/\s+/g, '_')}.xlsx`,
    });
    res.send(buffer);
  }

  @Get(':id/reporte/pdf')
  @ApiOperation({ summary: 'Descargar presupuesto en PDF' })
  @ApiResponse({ status: 200, description: 'Reporte PDF generado' })
  async descargarPresupuestoPDF(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const proyecto = await this.proyectosService.findOne(id);
    const metrados = await this.metradosService.findByProyecto(id);
    const buffer = await this.reportService.generarPresupuestoPDF(
      proyecto,
      metrados,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=presupuesto_${proyecto.nombre.replace(/\s+/g, '_')}.pdf`,
    });
    res.send(buffer);
  }

  @Post(':id/metrados/importar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Importar metrados desde Excel' })
  @ApiResponse({ status: 201, description: 'Metrados importados exitosamente' }}
  async importarMetrados(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Verificar que el proyecto existe
    await this.proyectosService.findOne(id);

    return this.importService.importarMetradosDesdeExcel(id, file.buffer);
  }

  @Get(':id/metrados/plantilla')
  @ApiOperation({ summary: 'Descargar plantilla de metrados' })
  @ApiResponse({ status: 200, description: 'Plantilla descargada' })
  async descargarPlantillaMetrados(@Res() res: Response) {
    const buffer = await this.importService.generarPlantillaMetrados();

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=plantilla_metrados.xlsx',
    });
    res.send(buffer);
  }
}
