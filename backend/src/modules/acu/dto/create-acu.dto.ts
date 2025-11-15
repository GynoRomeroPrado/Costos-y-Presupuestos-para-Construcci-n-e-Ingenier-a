import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AcuInsumoDto {
  @ApiProperty({ description: 'ID del insumo' })
  @IsUUID()
  insumoId: string;

  @ApiProperty({ description: 'Cantidad del insumo' })
  @IsNumber()
  @Min(0)
  cantidad: number;

  @ApiPropertyOptional({
    description: 'Porcentaje de desperdicio',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  desperdicioPorcentaje?: number;
}

export class CreateAcuDto {
  @ApiProperty({ description: 'ID de la partida' })
  @IsUUID()
  @IsNotEmpty()
  partidaId: string;

  @ApiPropertyOptional({ description: 'Rendimiento (default 1)', default: 1 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rendimiento?: number;

  @ApiPropertyOptional({ description: 'Descripción del ACU' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Información de cuadrilla (JSON)',
    example: { operarios: 1, peones: 2 },
  })
  @IsOptional()
  cuadrilla?: object;

  @ApiProperty({
    description: 'Lista de insumos con cantidades',
    type: [AcuInsumoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcuInsumoDto)
  insumos: AcuInsumoDto[];
}
