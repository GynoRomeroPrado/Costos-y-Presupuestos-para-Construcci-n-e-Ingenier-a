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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetradosService } from './metrados.service';
import { CreateMetradoDto } from './dto/create-metrado.dto';
import { UpdateMetradoDto } from './dto/update-metrado.dto';

@ApiTags('metrados')
@Controller('metrados')
export class MetradosController {
  constructor(private readonly metradosService: MetradosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo metrado' })
  @ApiResponse({ status: 201, description: 'Metrado creado exitosamente' })
  create(@Body() createMetradoDto: CreateMetradoDto) {
    return this.metradosService.create(createMetradoDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Crear múltiples metrados en lote' })
  @ApiResponse({ status: 201, description: 'Metrados creados exitosamente' })
  bulkCreate(@Body() createMetradosDto: CreateMetradoDto[]) {
    return this.metradosService.bulkCreate(createMetradosDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los metrados' })
  @ApiResponse({ status: 200, description: 'Lista de metrados' })
  findAll(@Query() query: any) {
    return this.metradosService.findAll(query);
  }

  @Get('proyecto/:proyectoId')
  @ApiOperation({ summary: 'Obtener metrados de un proyecto' })
  @ApiResponse({ status: 200, description: 'Lista de metrados del proyecto' })
  findByProyecto(@Param('proyectoId') proyectoId: string) {
    return this.metradosService.findByProyecto(proyectoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un metrado por ID' })
  @ApiResponse({ status: 200, description: 'Metrado encontrado' })
  findOne(@Param('id') id: string) {
    return this.metradosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un metrado' })
  @ApiResponse({ status: 200, description: 'Metrado actualizado' })
  update(@Param('id') id: string, @Body() updateMetradoDto: UpdateMetradoDto) {
    return this.metradosService.update(id, updateMetradoDto);
  }

  @Post(':id/recalcular')
  @ApiOperation({ summary: 'Recalcular costos de un metrado' }}
  @ApiResponse({ status: 200, description: 'Metrado recalculado' })
  async recalcular(@Param('id') id: string) {
    await this.metradosService.recalcularMetrado(id);
    return { message: 'Metrado recalculado exitosamente' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un metrado' })
  @ApiResponse({ status: 204, description: 'Metrado eliminado' })
  remove(@Param('id') id: string) {
    return this.metradosService.remove(id);
  }
}
