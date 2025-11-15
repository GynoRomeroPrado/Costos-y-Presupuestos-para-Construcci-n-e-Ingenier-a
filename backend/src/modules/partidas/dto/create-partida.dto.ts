import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePartidaDto {
  @ApiProperty({ description: 'Código único de la partida' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ description: 'Nombre de la partida' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Unidad de medida' })
  @IsString()
  @IsNotEmpty()
  unidadMedida: string;

  @ApiPropertyOptional({
    description: 'Especialidad (arquitectura, estructuras, etc.)',
  })
  @IsString()
  @IsOptional()
  especialidad?: string;

  @ApiPropertyOptional({ description: 'Descripción de la partida' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', default: true })
  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}
