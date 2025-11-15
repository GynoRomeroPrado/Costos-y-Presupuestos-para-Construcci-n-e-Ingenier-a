import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { GastoTipo } from '../entities/gasto-general.entity';

export class CreateGastoGeneralDto {
  @ApiProperty({ description: 'Concepto del gasto' })
  @IsString()
  @IsNotEmpty()
  concepto: string;

  @ApiProperty({
    enum: GastoTipo,
    description: 'Tipo de gasto',
    default: GastoTipo.PORCENTAJE,
  })
  @IsEnum(GastoTipo)
  tipo: GastoTipo;

  @ApiProperty({ description: 'Monto del gasto' })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiPropertyOptional({ description: 'Porcentaje (si tipo es porcentaje)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  porcentaje?: number;

  @ApiPropertyOptional({ description: 'Descripción' })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
