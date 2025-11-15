import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.entity';

export enum GastoTipo {
  PORCENTAJE = 'porcentaje',
  FIJO = 'fijo',
}

@Entity('gastos_generales')
export class GastoGeneral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.gastosGeneralesList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @Column()
  proyectoId: string;

  @Column()
  concepto: string;

  @Column({
    type: 'enum',
    enum: GastoTipo,
    default: GastoTipo.PORCENTAJE,
  })
  tipo: GastoTipo;

  @Column('decimal', { precision: 15, scale: 2 })
  monto: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  porcentaje: number;

  @Column('text', { nullable: true })
  descripcion: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
