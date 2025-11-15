import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { InsumoTipo } from '../entities/insumo.entity';

export class QueryInsumoDto {
  @ApiPropertyOptional({ description: 'Búsqueda por código o nombre' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: InsumoTipo,
    description: 'Filtrar por tipo de insumo',
  })
  @IsOptional()
  @IsEnum(InsumoTipo)
  tipo?: InsumoTipo;

  @ApiPropertyOptional({ description: 'Filtrar por proveedor' })
  @IsOptional()
  @IsString()
  proveedorId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo', default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Elementos por página', default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;
}
