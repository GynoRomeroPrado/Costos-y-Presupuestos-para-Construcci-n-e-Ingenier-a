import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { ProyectoEstado, Moneda } from '../entities/proyecto.entity';

export class CreateProyectoDto {
  @ApiProperty({ description: 'Nombre del proyecto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ description: 'Cliente' })
  @IsString()
  @IsOptional()
  cliente?: string;

  @ApiPropertyOptional({ description: 'Ubicación' })
  @IsString()
  @IsOptional()
  ubicacion?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio' })
  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin estimada' })
  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @ApiPropertyOptional({
    enum: ProyectoEstado,
    description: 'Estado del proyecto',
    default: ProyectoEstado.BORRADOR,
  })
  @IsEnum(ProyectoEstado)
  @IsOptional()
  estado?: ProyectoEstado;

  @ApiPropertyOptional({ description: 'Descripción del proyecto' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    enum: Moneda,
    description: 'Moneda base',
    default: Moneda.PEN,
  })
  @IsEnum(Moneda)
  @IsOptional()
  monedaBase?: Moneda;

  @ApiPropertyOptional({
    description: 'Porcentaje de IGV',
    default: 18,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  igvPorcentaje?: number;
}
