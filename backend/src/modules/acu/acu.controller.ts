import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AcuService } from './acu.service';

@ApiTags('acu')
@Controller('acu')
export class AcuController {
  constructor(private readonly acuService: AcuService) {}

  // TODO: Implementar endpoints
}
