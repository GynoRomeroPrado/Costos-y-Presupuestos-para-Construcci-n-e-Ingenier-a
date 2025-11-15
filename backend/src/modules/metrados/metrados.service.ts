import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metrado } from './entities/metrado.entity';
import { CreateMetradoDto } from './dto/create-metrado.dto';
import { UpdateMetradoDto } from './dto/update-metrado.dto';
import { Partida } from '../partidas/entities/partida.entity';
import { Acu } from '../acu/entities/acu.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Injectable()
export class MetradosService {
  constructor(
    @InjectRepository(Metrado)
    private readonly metradoRepository: Repository<Metrado>,
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
    @InjectRepository(Acu)
    private readonly acuRepository: Repository<Acu>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createMetradoDto: CreateMetradoDto): Promise<Metrado> {
    // Verificar que partida existe
    const partida = await this.partidaRepository.findOne({
      where: { id: createMetradoDto.partidaId },
    });

    if (!partida) {
      throw new NotFoundException(
        `Partida con ID ${createMetradoDto.partidaId} no encontrada`,
      );
    }

    // Verificar que proyecto existe
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: createMetradoDto.proyectoId },
    });

    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${createMetradoDto.proyectoId} no encontrado`,
      );
    }

    // Si se especificó ACU, verificar que existe
    let acu: Acu | null = null;
    if (createMetradoDto.acuId) {
      acu = await this.acuRepository.findOne({
        where: { id: createMetradoDto.acuId },
      });

      if (!acu) {
        throw new NotFoundException(
          `ACU con ID ${createMetradoDto.acuId} no encontrado`,
        );
      }
    } else {
      // Buscar ACU activo para esta partida
      acu = await this.acuRepository.findOne({
        where: { partidaId: createMetradoDto.partidaId, activo: true },
        order: { version: 'DESC' },
      });
    }

    const costoUnitario = acu ? acu.costoUnitarioCalculado : 0;
    const costoParcial = createMetradoDto.cantidad * costoUnitario;

    const metrado = this.metradoRepository.create({
      ...createMetradoDto,
      acuId: acu?.id,
      unidadMedida: partida.unidadMedida,
      costoUnitario,
      costoParcial,
    });

    const metradoGuardado = await this.metradoRepository.save(metrado);

    // Notificar al proyecto para recalcular presupuesto
    // (esto podría hacerse con eventos pero por simplicidad lo hacemos directo)
    await this.recalcularProyecto(createMetradoDto.proyectoId);

    return this.findOne(metradoGuardado.id);
  }

  async findAll(query?: any) {
    const { proyectoId, page = 1, limit = 100 } = query || {};

    const queryBuilder = this.metradoRepository
      .createQueryBuilder('metrado')
      .leftJoinAndSelect('metrado.partida', 'partida')
      .leftJoinAndSelect('metrado.acu', 'acu')
      .leftJoinAndSelect('metrado.proyecto', 'proyecto');

    if (proyectoId) {
      queryBuilder.where('metrado.proyectoId = :proyectoId', { proyectoId });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('metrado.ordenVisualizacion', 'ASC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByProyecto(proyectoId: string): Promise<Metrado[]> {
    return this.metradoRepository.find({
      where: { proyectoId },
      relations: ['partida', 'acu'],
      order: { ordenVisualizacion: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Metrado> {
    const metrado = await this.metradoRepository.findOne({
      where: { id },
      relations: ['partida', 'acu', 'proyecto'],
    });

    if (!metrado) {
      throw new NotFoundException(`Metrado con ID ${id} no encontrado`);
    }

    return metrado;
  }

  async update(id: string, updateMetradoDto: UpdateMetradoDto): Promise<Metrado> {
    const metrado = await this.findOne(id);

    // Si cambia la cantidad o el ACU, recalcular
    if (updateMetradoDto.cantidad !== undefined) {
      metrado.cantidad = updateMetradoDto.cantidad;
    }

    if (updateMetradoDto.acuId !== undefined) {
      const acu = await this.acuRepository.findOne({
        where: { id: updateMetradoDto.acuId },
      });

      if (!acu) {
        throw new NotFoundException(
          `ACU con ID ${updateMetradoDto.acuId} no encontrado`,
        );
      }

      metrado.acuId = updateMetradoDto.acuId;
      metrado.costoUnitario = acu.costoUnitarioCalculado;
    }

    if (updateMetradoDto.agrupacion !== undefined) {
      metrado.agrupacion = updateMetradoDto.agrupacion;
    }

    if (updateMetradoDto.observaciones !== undefined) {
      metrado.observaciones = updateMetradoDto.observaciones;
    }

    if (updateMetradoDto.ordenVisualizacion !== undefined) {
      metrado.ordenVisualizacion = updateMetradoDto.ordenVisualizacion;
    }

    // Recalcular costo parcial
    metrado.costoParcial = metrado.cantidad * metrado.costoUnitario;

    const metradoActualizado = await this.metradoRepository.save(metrado);

    // Recalcular presupuesto del proyecto
    await this.recalcularProyecto(metrado.proyectoId);

    return this.findOne(metradoActualizado.id);
  }

  async remove(id: string): Promise<void> {
    const metrado = await this.findOne(id);
    const proyectoId = metrado.proyectoId;

    await this.metradoRepository.remove(metrado);

    // Recalcular presupuesto del proyecto
    await this.recalcularProyecto(proyectoId);
  }

  async recalcularMetrado(id: string): Promise<void> {
    const metrado = await this.findOne(id);

    if (metrado.acu) {
      metrado.costoUnitario = metrado.acu.costoUnitarioCalculado;
      metrado.costoParcial = metrado.cantidad * metrado.costoUnitario;
      await this.metradoRepository.save(metrado);
    }
  }

  async recalcularMetradosPorACU(acuId: string): Promise<void> {
    const metrados = await this.metradoRepository.find({
      where: { acuId },
      relations: ['acu'],
    });

    for (const metrado of metrados) {
      if (metrado.acu) {
        metrado.costoUnitario = metrado.acu.costoUnitarioCalculado;
        metrado.costoParcial = metrado.cantidad * metrado.costoUnitario;
        await this.metradoRepository.save(metrado);

        // Recalcular proyecto
        await this.recalcularProyecto(metrado.proyectoId);
      }
    }
  }

  private async recalcularProyecto(proyectoId: string): Promise<void> {
    // Este método debería estar en ProyectosService, pero para evitar dependencia circular
    // lo simplificamos o usaríamos eventos
    // Por ahora, asumimos que el proyecto se recalcula externamente
  }

  async bulkCreate(metrados: CreateMetradoDto[]): Promise<Metrado[]> {
    const creados: Metrado[] = [];

    for (const metradoDto of metrados) {
      const metrado = await this.create(metradoDto);
      creados.push(metrado);
    }

    return creados;
  }
}
