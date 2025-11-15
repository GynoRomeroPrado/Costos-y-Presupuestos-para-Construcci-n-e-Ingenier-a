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
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';
import { InsumosService } from './insumos.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { QueryInsumoDto } from './dto/query-insumo.dto';
import { ImportService } from '../common/services/import.service';

@ApiTags('insumos')
// @ApiBearerAuth() // Descomentar cuando Auth esté implementado
@Controller('insumos')
export class InsumosController {
  constructor(
    private readonly insumosService: InsumosService,
    private readonly importService: ImportService,
  ) {}

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

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Importar insumos desde archivo Excel' })
  @ApiResponse({ status: 200, description: 'Insumos importados' })
  async importarExcel(@UploadedFile() file: Express.Multer.File) {
    return this.importService.importarInsumosDesdeExcel(file.buffer);
  }

  @Get('plantilla/descargar')
  @ApiOperation({ summary: 'Descargar plantilla Excel para importar insumos' })
  @ApiResponse({ status: 200, description: 'Plantilla descargada' })
  async descargarPlantilla(@Res() res: Response) {
    const buffer = await this.importService.generarPlantillaInsumos();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=plantilla_insumos.xlsx',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
