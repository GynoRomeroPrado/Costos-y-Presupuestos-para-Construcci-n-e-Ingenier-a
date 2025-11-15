import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acu } from './entities/acu.entity';

@Injectable()
export class AcuService {
  constructor(
    @InjectRepository(Acu)
    private readonly acuRepository: Repository<Acu>,
  ) {}

  // TODO: Implementar CRUD y motor de cálculo
}
