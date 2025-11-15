import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { AcuInsumo } from '../../acu/entities/acu-insumo.entity';

export enum InsumoTipo {
  MATERIAL = 'material',
  MANO_OBRA = 'mano_obra',
  EQUIPO = 'equipo',
  SUBCONTRATO = 'subcontrato',
}

export enum Moneda {
  PEN = 'PEN',
  USD = 'USD',
  EUR = 'EUR',
}

@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column()
  unidadMedida: string;

  @Column({
    type: 'enum',
    enum: InsumoTipo,
    default: InsumoTipo.MATERIAL,
  })
  tipo: InsumoTipo;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({
    type: 'enum',
    enum: Moneda,
    default: Moneda.PEN,
  })
  moneda: Moneda;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.insumos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'proveedorId' })
  proveedor: Proveedor;

  @Column({ nullable: true })
  proveedorId: string;

  @Column({ type: 'date', nullable: true })
  fechaActualizacion: Date;

  @Column({ default: true })
  activo: boolean;

  @Column('text', { nullable: true })
  observaciones: string;

  // Campos adicionales para trazabilidad de precios
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioAnterior: number;

  @Column({ type: 'date', nullable: true })
  fechaUltimaModificacion: Date;

  @OneToMany(() => AcuInsumo, (acuInsumo) => acuInsumo.insumo)
  acuInsumos: AcuInsumo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
