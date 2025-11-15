import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsBoolean,
  Min,
} from 'class-validator';
import { InsumoTipo, Moneda } from '../entities/insumo.entity';

export class CreateInsumoDto {
  @ApiProperty({ description: 'Código único del insumo' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ description: 'Nombre del insumo' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Unidad de medida (m3, kg, und, etc.)' })
  @IsString()
  @IsNotEmpty()
  unidadMedida: string;

  @ApiProperty({
    enum: InsumoTipo,
    description: 'Tipo de insumo',
    default: InsumoTipo.MATERIAL,
  })
  @IsEnum(InsumoTipo)
  tipo: InsumoTipo;

  @ApiProperty({ description: 'Precio unitario' })
  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @ApiProperty({
    enum: Moneda,
    description: 'Moneda del precio',
    default: Moneda.PEN,
  })
  @IsEnum(Moneda)
  @IsOptional()
  moneda?: Moneda;

  @ApiPropertyOptional({ description: 'ID del proveedor' })
  @IsUUID()
  @IsOptional()
  proveedorId?: string;

  @ApiPropertyOptional({ description: 'Observaciones adicionales' })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
