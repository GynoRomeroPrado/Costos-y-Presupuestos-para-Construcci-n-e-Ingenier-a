import { PartialType } from '@nestjs/swagger';
import { CreateAcuDto } from './create-acu.dto';

export class UpdateAcuDto extends PartialType(CreateAcuDto) {}
