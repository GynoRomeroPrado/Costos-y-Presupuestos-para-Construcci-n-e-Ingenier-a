import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service';

@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  // TODO: Implementar endpoints
}
