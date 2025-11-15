import { PartialType } from '@nestjs/swagger';
import { CreateMetradoDto } from './create-metrado.dto';

export class UpdateMetradoDto extends PartialType(CreateMetradoDto) {}
