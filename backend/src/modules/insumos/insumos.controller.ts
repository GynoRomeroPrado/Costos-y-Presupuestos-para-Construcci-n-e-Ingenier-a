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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InsumosService } from './insumos.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { QueryInsumoDto } from './dto/query-insumo.dto';

@ApiTags('insumos')
// @ApiBearerAuth() // Descomentar cuando Auth esté implementado
@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo insumo' })
  @ApiResponse({ status: 201, description: 'Insumo creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El código ya existe' })
  create(@Body() createInsumoDto: CreateInsumoDto) {
    return this.insumosService.create(createInsumoDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Crear múltiples insumos en lote' })
  @ApiResponse({ status: 201, description: 'Insumos creados exitosamente' })
  bulkCreate(@Body() createInsumosDto: CreateInsumoDto[]) {
    return this.insumosService.bulkCreate(createInsumosDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los insumos con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de insumos' })
  findAll(@Query() query: QueryInsumoDto) {
    return this.insumosService.findAll(query);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de insumos' })
  @ApiResponse({ status: 200, description: 'Estadísticas de insumos' })
  getEstadisticas() {
    return this.insumosService.getEstadisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un insumo por ID' })
  @ApiResponse({ status: 200, description: 'Insumo encontrado' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.insumosService.findOne(id);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un insumo por código' })
  @ApiResponse({ status: 200, description: 'Insumo encontrado' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.insumosService.findByCodigo(codigo);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un insumo' })
  @ApiResponse({ status: 200, description: 'Insumo actualizado' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  update(@Param('id') id: string, @Body() updateInsumoDto: UpdateInsumoDto) {
    return this.insumosService.update(id, updateInsumoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar un insumo (soft delete)' })
  @ApiResponse({ status: 204, description: 'Insumo desactivado' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  remove(@Param('id') id: string) {
    return this.insumosService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un insumo' })
  @ApiResponse({ status: 204, description: 'Insumo eliminado' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  hardDelete(@Param('id') id: string) {
    return this.insumosService.hardDelete(id);
  }
}
