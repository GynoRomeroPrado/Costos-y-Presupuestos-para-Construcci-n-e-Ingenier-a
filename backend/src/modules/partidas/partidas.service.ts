import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partida } from './entities/partida.entity';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';

@Injectable()
export class PartidasService {
  constructor(
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
  ) {}

  async create(createPartidaDto: CreatePartidaDto): Promise<Partida> {
    const existingPartida = await this.partidaRepository.findOne({
      where: { codigo: createPartidaDto.codigo },
    });

    if (existingPartida) {
      throw new ConflictException(
        `El código '${createPartidaDto.codigo}' ya está en uso`,
      );
    }

    const partida = this.partidaRepository.create(createPartidaDto);
    return this.partidaRepository.save(partida);
  }

  async findAll(query?: any) {
    const { search, especialidad, activa, page = 1, limit = 20 } = query || {};

    const queryBuilder =
      this.partidaRepository.createQueryBuilder('partida');

    if (search) {
      queryBuilder.where(
        '(partida.codigo ILIKE :search OR partida.nombre ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (especialidad) {
      queryBuilder.andWhere('partida.especialidad = :especialidad', {
        especialidad,
      });
    }

    if (activa !== undefined) {
      queryBuilder.andWhere('partida.activa = :activa', { activa });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('partida.codigo', 'ASC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Partida> {
    const partida = await this.partidaRepository.findOne({
      where: { id },
      relations: ['acus', 'especificaciones'],
    });

    if (!partida) {
      throw new NotFoundException(`Partida con ID ${id} no encontrada`);
    }

    return partida;
  }

  async update(
    id: string,
    updatePartidaDto: UpdatePartidaDto,
  ): Promise<Partida> {
    const partida = await this.findOne(id);

    if (updatePartidaDto.codigo && updatePartidaDto.codigo !== partida.codigo) {
      const existingPartida = await this.partidaRepository.findOne({
        where: { codigo: updatePartidaDto.codigo },
      });

      if (existingPartida) {
        throw new ConflictException(
          `El código '${updatePartidaDto.codigo}' ya está en uso`,
        );
      }
    }

    Object.assign(partida, updatePartidaDto);
    return this.partidaRepository.save(partida);
  }

  async remove(id: string): Promise<void> {
    const partida = await this.findOne(id);
    partida.activa = false;
    await this.partidaRepository.save(partida);
  }
}
