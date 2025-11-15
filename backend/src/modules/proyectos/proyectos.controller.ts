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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateGastoGeneralDto } from './dto/create-gasto-general.dto';

@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

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
}
