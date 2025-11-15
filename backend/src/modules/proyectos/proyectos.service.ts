import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { GastoGeneral, GastoTipo } from './entities/gasto-general.entity';
import { Metrado } from '../metrados/entities/metrado.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateGastoGeneralDto } from './dto/create-gasto-general.dto';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(GastoGeneral)
    private readonly gastoGeneralRepository: Repository<GastoGeneral>,
    @InjectRepository(Metrado)
    private readonly metradoRepository: Repository<Metrado>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const proyecto = this.proyectoRepository.create(createProyectoDto);
    return this.proyectoRepository.save(proyecto);
  }

  async findAll(query?: any) {
    const { estado, page = 1, limit = 20, search } = query || {};

    const queryBuilder = this.proyectoRepository
      .createQueryBuilder('proyecto')
      .leftJoinAndSelect('proyecto.creador', 'creador');

    if (search) {
      queryBuilder.where(
        '(proyecto.nombre ILIKE :search OR proyecto.cliente ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (estado) {
      queryBuilder.andWhere('proyecto.estado = :estado', { estado });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('proyecto.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: [
        'creador',
        'metrados',
        'metrados.partida',
        'metrados.acu',
        'gastosGeneralesList',
      ],
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return proyecto;
  }

  async update(id: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    Object.assign(proyecto, updateProyectoDto);
    return this.proyectoRepository.save(proyecto);
  }

  async remove(id: string): Promise<void> {
    const proyecto = await this.findOne(id);
    await this.proyectoRepository.remove(proyecto);
  }

  // ============ GESTIÓN DE GASTOS GENERALES ============

  async agregarGastoGeneral(
    proyectoId: string,
    createGastoDto: CreateGastoGeneralDto,
  ): Promise<GastoGeneral> {
    const proyecto = await this.findOne(proyectoId);

    const gasto = this.gastoGeneralRepository.create({
      ...createGastoDto,
      proyectoId,
    });

    const gastoGuardado = await this.gastoGeneralRepository.save(gasto);

    // Recalcular presupuesto
    await this.calcularPresupuesto(proyectoId);

    return gastoGuardado;
  }

  async eliminarGastoGeneral(proyectoId: string, gastoId: string): Promise<void> {
    await this.gastoGeneralRepository.delete({ id: gastoId, proyectoId });
    await this.calcularPresupuesto(proyectoId);
  }

  // ============ MOTOR DE PRESUPUESTO ============

  async calcularPresupuesto(proyectoId: string): Promise<void> {
    const proyecto = await this.findOne(proyectoId);

    // 1. Calcular costo directo (suma de todos los metrados)
    const metrados = await this.metradoRepository.find({
      where: { proyectoId },
    });

    let costoDirecto = 0;
    for (const metrado of metrados) {
      costoDirecto += Number(metrado.costoParcial);
    }

    proyecto.costoDirecto = costoDirecto;

    // 2. Calcular gastos generales
    let gastosGenerales = 0;
    for (const gasto of proyecto.gastosGeneralesList) {
      if (gasto.tipo === GastoTipo.PORCENTAJE) {
        const montoCalculado = (costoDirecto * gasto.porcentaje) / 100;
        gastosGenerales += montoCalculado;
      } else {
        gastosGenerales += Number(gasto.monto);
      }
    }

    proyecto.gastosGenerales = gastosGenerales;

    // 3. Calcular utilidad (asumiendo que está en gastos generales o puede ser un campo separado)
    // Por ahora, utilidad = 0, pero puede agregarse como campo configurableproyecto.utilidad = 0;

    // 4. Calcular subtotal
    proyecto.subtotal = costoDirecto + gastosGenerales + proyecto.utilidad;

    // 5. Calcular IGV
    proyecto.igv = (proyecto.subtotal * proyecto.igvPorcentaje) / 100;

    // 6. Calcular presupuesto total
    proyecto.presupuestoTotal = proyecto.subtotal + proyecto.igv;

    await this.proyectoRepository.save(proyecto);
  }

  async getResumenPresupuesto(proyectoId: string) {
    const proyecto = await this.findOne(proyectoId);

    // Agrupar metrados por especialidad/agrupación
    const metradosPorEspecialidad = await this.metradoRepository
      .createQueryBuilder('metrado')
      .leftJoinAndSelect('metrado.partida', 'partida')
      .where('metrado.proyectoId = :proyectoId', { proyectoId })
      .select([
        'partida.especialidad as especialidad',
        'SUM(metrado.costoParcial) as total',
      ])
      .groupBy('partida.especialidad')
      .getRawMany();

    return {
      proyecto: {
        id: proyecto.id,
        nombre: proyecto.nombre,
        cliente: proyecto.cliente,
      },
      resumen: {
        costoDirecto: proyecto.costoDirecto,
        gastosGenerales: proyecto.gastosGenerales,
        utilidad: proyecto.utilidad,
        subtotal: proyecto.subtotal,
        igv: proyecto.igv,
        presupuestoTotal: proyecto.presupuestoTotal,
        moneda: proyecto.monedaBase,
      },
      porEspecialidad: metradosPorEspecialidad,
      gastosGenerales: proyecto.gastosGeneralesList,
    };
  }

  async getEstadisticas() {
    const total = await this.proyectoRepository.count();
    const porEstado = await this.proyectoRepository
      .createQueryBuilder('proyecto')
      .select('proyecto.estado', 'estado')
      .addSelect('COUNT(*)', 'count')
      .groupBy('proyecto.estado')
      .getRawMany();

    const presupuestoTotal = await this.proyectoRepository
      .createQueryBuilder('proyecto')
      .select('SUM(proyecto.presupuestoTotal)', 'total')
      .getRawOne();

    return {
      total,
      porEstado,
      presupuestoTotal: presupuestoTotal?.total || 0,
    };
  }
}
