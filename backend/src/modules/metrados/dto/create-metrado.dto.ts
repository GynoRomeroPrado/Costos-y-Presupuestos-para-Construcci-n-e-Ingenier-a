import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateMetradoDto {
  @ApiProperty({ description: 'ID del proyecto' })
  @IsUUID()
  @IsNotEmpty()
  proyectoId: string;

  @ApiProperty({ description: 'ID de la partida' })
  @IsUUID()
  @IsNotEmpty()
  partidaId: string;

  @ApiPropertyOptional({ description: 'ID del ACU (opcional)' })
  @IsUUID()
  @IsOptional()
  acuId?: string;

  @ApiProperty({ description: 'Cantidad' })
  @IsNumber()
  @Min(0)
  cantidad: number;

  @ApiPropertyOptional({ description: 'Agrupación (especialidad, piso, etc.)' })
  @IsString()
  @IsOptional()
  agrupacion?: string;

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional({ description: 'Orden de visualización', default: 1 })
  @IsNumber()
  @IsOptional()
  ordenVisualizacion?: number;
}
