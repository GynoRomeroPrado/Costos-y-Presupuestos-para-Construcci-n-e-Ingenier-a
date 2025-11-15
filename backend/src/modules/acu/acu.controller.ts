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
import { AcuService } from './acu.service';
import { CreateAcuDto } from './dto/create-acu.dto';
import { UpdateAcuDto } from './dto/update-acu.dto';

@ApiTags('acu')
@Controller('acu')
export class AcuController {
  constructor(private readonly acuService: AcuService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ACU' })
  @ApiResponse({ status: 201, description: 'ACU creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Partida no encontrada' })
  create(@Body() createAcuDto: CreateAcuDto) {
    return this.acuService.create(createAcuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los ACUs' })
  @ApiResponse({ status: 200, description: 'Lista de ACUs' })
  findAll(@Query() query: any) {
    return this.acuService.findAll(query);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de ACUs' })
  @ApiResponse({ status: 200, description: 'Estadísticas de ACUs' })
  getEstadisticas() {
    return this.acuService.getEstadisticas();
  }

  @Get('partida/:partidaId')
  @ApiOperation({ summary: 'Obtener ACUs de una partida específica' })
  @ApiParam({ name: 'partidaId', description: 'ID de la partida' })
  @ApiResponse({ status: 200, description: 'Lista de ACUs de la partida' })
  findByPartida(@Param('partidaId') partidaId: string) {
    return this.acuService.findByPartida(partidaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ACU por ID' })
  @ApiResponse({ status: 200, description: 'ACU encontrado' })
  @ApiResponse({ status: 404, description: 'ACU no encontrado' })
  findOne(@Param('id') id: string) {
    return this.acuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ACU' })
  @ApiResponse({ status: 200, description: 'ACU actualizado' })
  @ApiResponse({ status: 404, description: 'ACU no encontrado' })
  update(@Param('id') id: string, @Body() updateAcuDto: UpdateAcuDto) {
    return this.acuService.update(id, updateAcuDto);
  }

  @Post(':id/recalcular')
  @ApiOperation({ summary: 'Recalcular costos de un ACU' })
  @ApiResponse({ status: 200, description: 'Costos recalculados' })
  async recalcular(@Param('id') id: string) {
    await this.acuService.calcularCostos(id);
    return { message: 'Costos recalculados exitosamente' };
  }

  @Post(':id/duplicar')
  @ApiOperation({ summary: 'Duplicar un ACU existente' })
  @ApiResponse({ status: 201, description: 'ACU duplicado exitosamente' })
  duplicar(@Param('id') id: string) {
    return this.acuService.duplicar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar un ACU' })
  @ApiResponse({ status: 204, description: 'ACU desactivado' })
  remove(@Param('id') id: string) {
    return this.acuService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un ACU' })
  @ApiResponse({ status: 204, description: 'ACU eliminado' })
  hardDelete(@Param('id') id: string) {
    return this.acuService.hardDelete(id);
  }
}
