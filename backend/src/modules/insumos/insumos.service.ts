import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Insumo } from './entities/insumo.entity';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { QueryInsumoDto } from './dto/query-insumo.dto';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,
  ) {}

  async create(createInsumoDto: CreateInsumoDto): Promise<Insumo> {
    // Verificar si el código ya existe
    const existingInsumo = await this.insumoRepository.findOne({
      where: { codigo: createInsumoDto.codigo },
    });

    if (existingInsumo) {
      throw new ConflictException(
        `El código '${createInsumoDto.codigo}' ya está en uso`,
      );
    }

    const insumo = this.insumoRepository.create({
      ...createInsumoDto,
      fechaActualizacion: new Date(),
    });

    return this.insumoRepository.save(insumo);
  }

  async findAll(query: QueryInsumoDto) {
    const { search, tipo, proveedorId, activo, page = 1, limit = 20 } = query;

    const queryBuilder = this.insumoRepository
      .createQueryBuilder('insumo')
      .leftJoinAndSelect('insumo.proveedor', 'proveedor');

    // Filtros
    if (search) {
      queryBuilder.where(
        '(insumo.codigo ILIKE :search OR insumo.nombre ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tipo) {
      queryBuilder.andWhere('insumo.tipo = :tipo', { tipo });
    }

    if (proveedorId) {
      queryBuilder.andWhere('insumo.proveedorId = :proveedorId', {
        proveedorId,
      });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('insumo.activo = :activo', { activo });
    }

    // Paginación
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('insumo.codigo', 'ASC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Insumo> {
    const insumo = await this.insumoRepository.findOne({
      where: { id },
      relations: ['proveedor'],
    });

    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado`);
    }

    return insumo;
  }

  async findByCodigo(codigo: string): Promise<Insumo> {
    const insumo = await this.insumoRepository.findOne({
      where: { codigo },
      relations: ['proveedor'],
    });

    if (!insumo) {
      throw new NotFoundException(`Insumo con código ${codigo} no encontrado`);
    }

    return insumo;
  }

  async update(id: string, updateInsumoDto: UpdateInsumoDto): Promise<Insumo> {
    const insumo = await this.findOne(id);

    // Si se está actualizando el código, verificar que no exista
    if (updateInsumoDto.codigo && updateInsumoDto.codigo !== insumo.codigo) {
      const existingInsumo = await this.insumoRepository.findOne({
        where: { codigo: updateInsumoDto.codigo },
      });

      if (existingInsumo) {
        throw new ConflictException(
          `El código '${updateInsumoDto.codigo}' ya está en uso`,
        );
      }
    }

    // Guardar precio anterior si se está actualizando el precio
    if (
      updateInsumoDto.precioUnitario &&
      updateInsumoDto.precioUnitario !== insumo.precioUnitario
    ) {
      insumo.precioAnterior = insumo.precioUnitario;
      insumo.fechaUltimaModificacion = new Date();
      insumo.fechaActualizacion = new Date();
    }

    Object.assign(insumo, updateInsumoDto);

    return this.insumoRepository.save(insumo);
  }

  async remove(id: string): Promise<void> {
    const insumo = await this.findOne(id);

    // En lugar de eliminar, marcar como inactivo
    insumo.activo = false;
    await this.insumoRepository.save(insumo);
  }

  async hardDelete(id: string): Promise<void> {
    const insumo = await this.findOne(id);
    await this.insumoRepository.remove(insumo);
  }

  async bulkCreate(insumos: CreateInsumoDto[]): Promise<Insumo[]> {
    const createdInsumos: Insumo[] = [];
    const errors: string[] = [];

    for (const insumoDto of insumos) {
      try {
        const insumo = await this.create(insumoDto);
        createdInsumos.push(insumo);
      } catch (error) {
        errors.push(`Error en ${insumoDto.codigo}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Algunos insumos no pudieron ser creados',
        errors,
        created: createdInsumos.length,
        failed: errors.length,
      });
    }

    return createdInsumos;
  }

  async getEstadisticas() {
    const total = await this.insumoRepository.count();
    const activos = await this.insumoRepository.count({
      where: { activo: true },
    });

    const porTipo = await this.insumoRepository
      .createQueryBuilder('insumo')
      .select('insumo.tipo', 'tipo')
      .addSelect('COUNT(*)', 'count')
      .groupBy('insumo.tipo')
      .getRawMany();

    return {
      total,
      activos,
      inactivos: total - activos,
      porTipo,
    };
  }
}
