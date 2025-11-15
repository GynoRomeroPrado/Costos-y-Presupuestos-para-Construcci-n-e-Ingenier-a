import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetradosService } from './metrados.service';

@ApiTags('metrados')
@Controller('metrados')
export class MetradosController {
  constructor(private readonly metradosService: MetradosService) {}

  // TODO: Implementar endpoints
}
