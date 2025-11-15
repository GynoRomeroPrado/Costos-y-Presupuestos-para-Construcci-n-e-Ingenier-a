import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({ description: 'Nombre del proveedor' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ description: 'RUC del proveedor' })
  @IsString()
  @IsOptional()
  ruc?: string;

  @ApiPropertyOptional({ description: 'Dirección' })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiPropertyOptional({ description: 'Teléfono' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Nombre del contacto' })
  @IsString()
  @IsOptional()
  contacto?: string;

  @ApiPropertyOptional({ description: 'Especialidad' })
  @IsString()
  @IsOptional()
  especialidad?: string;

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional({ description: 'Estado activo', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
