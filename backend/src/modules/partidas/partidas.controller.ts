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
import { PartidasService } from './partidas.service';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';

@ApiTags('partidas')
@Controller('partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva partida' })
  @ApiResponse({ status: 201, description: 'Partida creada exitosamente' })
  create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidasService.create(createPartidaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las partidas' })
  @ApiResponse({ status: 200, description: 'Lista de partidas' })
  findAll(@Query() query: any) {
    return this.partidasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una partida por ID' })
  @ApiResponse({ status: 200, description: 'Partida encontrada' })
  findOne(@Param('id') id: string) {
    return this.partidasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una partida' })
  @ApiResponse({ status: 200, description: 'Partida actualizada' })
  update(@Param('id') id: string, @Body() updatePartidaDto: UpdatePartidaDto) {
    return this.partidasService.update(id, updatePartidaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar una partida' })
  @ApiResponse({ status: 204, description: 'Partida desactivada' })
  remove(@Param('id') id: string) {
    return this.partidasService.remove(id);
  }
}
