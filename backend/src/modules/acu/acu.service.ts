import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acu } from './entities/acu.entity';
import { AcuInsumo } from './entities/acu-insumo.entity';
import { CreateAcuDto } from './dto/create-acu.dto';
import { UpdateAcuDto } from './dto/update-acu.dto';
import { Insumo, InsumoTipo } from '../insumos/entities/insumo.entity';
import { Partida } from '../partidas/entities/partida.entity';

@Injectable()
export class AcuService {
  constructor(
    @InjectRepository(Acu)
    private readonly acuRepository: Repository<Acu>,
    @InjectRepository(AcuInsumo)
    private readonly acuInsumoRepository: Repository<AcuInsumo>,
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
  ) {}

  async create(createAcuDto: CreateAcuDto): Promise<Acu> {
    // Verificar que la partida existe
    const partida = await this.partidaRepository.findOne({
      where: { id: createAcuDto.partidaId },
    });

    if (!partida) {
      throw new NotFoundException(`Partida con ID ${createAcuDto.partidaId} no encontrada`);
    }

    // Obtener la versión más reciente para esta partida
    const ultimaVersion = await this.acuRepository
      .createQueryBuilder('acu')
      .where('acu.partidaId = :partidaId', { partidaId: createAcuDto.partidaId })
      .orderBy('acu.version', 'DESC')
      .getOne();

    const nuevaVersion = ultimaVersion ? ultimaVersion.version + 1 : 1;

    // Crear el ACU
    const acu = this.acuRepository.create({
      partidaId: createAcuDto.partidaId,
      version: nuevaVersion,
      rendimiento: createAcuDto.rendimiento || 1,
      descripcion: createAcuDto.descripcion,
      cuadrilla: createAcuDto.cuadrilla,
    });

    const acuGuardado = await this.acuRepository.save(acu);

    // Agregar insumos y calcular costos
    if (createAcuDto.insumos && createAcuDto.insumos.length > 0) {
      await this.agregarInsumos(acuGuardado.id, createAcuDto.insumos);
    }

    // Recalcular costos totales
    await this.calcularCostos(acuGuardado.id);

    return this.findOne(acuGuardado.id);
  }

  async findAll(query?: any) {
    const { partidaId, activo, page = 1, limit = 20 } = query || {};

    const queryBuilder = this.acuRepository
      .createQueryBuilder('acu')
      .leftJoinAndSelect('acu.partida', 'partida')
      .leftJoinAndSelect('acu.acuInsumos', 'acuInsumos')
      .leftJoinAndSelect('acuInsumos.insumo', 'insumo');

    if (partidaId) {
      queryBuilder.andWhere('acu.partidaId = :partidaId', { partidaId });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('acu.activo = :activo', { activo });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('acu.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Acu> {
    const acu = await this.acuRepository.findOne({
      where: { id },
      relations: ['partida', 'acuInsumos', 'acuInsumos.insumo'],
    });

    if (!acu) {
      throw new NotFoundException(`ACU con ID ${id} no encontrado`);
    }

    return acu;
  }

  async findByPartida(partidaId: string): Promise<Acu[]> {
    return this.acuRepository.find({
      where: { partidaId, activo: true },
      relations: ['partida', 'acuInsumos', 'acuInsumos.insumo'],
      order: { version: 'DESC' },
    });
  }

  async update(id: string, updateAcuDto: UpdateAcuDto): Promise<Acu> {
    const acu = await this.findOne(id);

    // Actualizar campos básicos
    if (updateAcuDto.rendimiento !== undefined) {
      acu.rendimiento = updateAcuDto.rendimiento;
    }
    if (updateAcuDto.descripcion !== undefined) {
      acu.descripcion = updateAcuDto.descripcion;
    }
    if (updateAcuDto.cuadrilla !== undefined) {
      acu.cuadrilla = updateAcuDto.cuadrilla;
    }

    await this.acuRepository.save(acu);

    // Si hay cambios en insumos, actualizar
    if (updateAcuDto.insumos) {
      // Eliminar insumos existentes
      await this.acuInsumoRepository.delete({ acuId: id });

      // Agregar nuevos insumos
      await this.agregarInsumos(id, updateAcuDto.insumos);
    }

    // Recalcular costos
    await this.calcularCostos(id);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const acu = await this.findOne(id);
    acu.activo = false;
    await this.acuRepository.save(acu);
  }

  async hardDelete(id: string): Promise<void> {
    const acu = await this.findOne(id);
    await this.acuRepository.remove(acu);
  }

  // ============ MÉTODOS DE CÁLCULO ============

  private async agregarInsumos(acuId: string, insumosDto: any[]): Promise<void> {
    for (const insumoDto of insumosDto) {
      const insumo = await this.insumoRepository.findOne({
        where: { id: insumoDto.insumoId },
      });

      if (!insumo) {
        throw new NotFoundException(`Insumo con ID ${insumoDto.insumoId} no encontrado`);
      }

      const cantidadConDesperdicio = insumoDto.cantidad * (1 + (insumoDto.desperdicioPorcentaje || 0) / 100);
      const costoParcial = cantidadConDesperdicio * insumo.precioUnitario;

      const acuInsumo = this.acuInsumoRepository.create({
        acuId,
        insumoId: insumo.id,
        cantidad: insumoDto.cantidad,
        desperdicioPorcentaje: insumoDto.desperdicioPorcentaje || 0,
        precioUnitarioSnapshot: insumo.precioUnitario,
        costoParcial,
      });

      await this.acuInsumoRepository.save(acuInsumo);
    }
  }

  async calcularCostos(acuId: string): Promise<void> {
    const acu = await this.findOne(acuId);

    let costoMateriales = 0;
    let costoManoObra = 0;
    let costoEquipo = 0;
    let costoSubcontrato = 0;

    for (const acuInsumo of acu.acuInsumos) {
      const tipo = acuInsumo.insumo.tipo;

      switch (tipo) {
        case InsumoTipo.MATERIAL:
          costoMateriales += acuInsumo.costoParcial;
          break;
        case InsumoTipo.MANO_OBRA:
          costoManoObra += acuInsumo.costoParcial;
          break;
        case InsumoTipo.EQUIPO:
          costoEquipo += acuInsumo.costoParcial;
          break;
        case InsumoTipo.SUBCONTRATO:
          costoSubcontrato += acuInsumo.costoParcial;
          break;
      }
    }

    const costoTotal = costoMateriales + costoManoObra + costoEquipo + costoSubcontrato;

    acu.costoMateriales = costoMateriales;
    acu.costoManoObra = costoManoObra;
    acu.costoEquipo = costoEquipo;
    acu.costoSubcontrato = costoSubcontrato;
    acu.costoUnitarioCalculado = costoTotal;

    await this.acuRepository.save(acu);
  }

  async recalcularPorInsumo(insumoId: string): Promise<void> {
    // Obtener todos los ACUs que usan este insumo
    const acuInsumos = await this.acuInsumoRepository.find({
      where: { insumoId },
      relations: ['acu', 'insumo'],
    });

    const insumo = await this.insumoRepository.findOne({
      where: { id: insumoId },
    });

    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
    }

    // Actualizar cada ACU-Insumo con el nuevo precio
    for (const acuInsumo of acuInsumos) {
      const cantidadConDesperdicio = acuInsumo.cantidad * (1 + acuInsumo.desperdicioPorcentaje / 100);
      acuInsumo.costoParcial = cantidadConDesperdicio * insumo.precioUnitario;
      acuInsumo.precioUnitarioSnapshot = insumo.precioUnitario;

      await this.acuInsumoRepository.save(acuInsumo);

      // Recalcular el ACU completo
      await this.calcularCostos(acuInsumo.acuId);
    }
  }

  async duplicar(id: string): Promise<Acu> {
    const acuOriginal = await this.findOne(id);

    const insumosDto = acuOriginal.acuInsumos.map((ai) => ({
      insumoId: ai.insumoId,
      cantidad: ai.cantidad,
      desperdicioPorcentaje: ai.desperdicioPorcentaje,
    }));

    const createDto: CreateAcuDto = {
      partidaId: acuOriginal.partidaId,
      rendimiento: acuOriginal.rendimiento,
      descripcion: acuOriginal.descripcion + ' (copia)',
      cuadrilla: acuOriginal.cuadrilla,
      insumos: insumosDto,
    };

    return this.create(createDto);
  }

  async getEstadisticas() {
    const total = await this.acuRepository.count();
    const activos = await this.acuRepository.count({ where: { activo: true } });

    const conMasCostos = await this.acuRepository
      .createQueryBuilder('acu')
      .leftJoinAndSelect('acu.partida', 'partida')
      .orderBy('acu.costoUnitarioCalculado', 'DESC')
      .limit(10)
      .getMany();

    return {
      total,
      activos,
      inactivos: total - activos,
      conMasCostos,
    };
  }
}
