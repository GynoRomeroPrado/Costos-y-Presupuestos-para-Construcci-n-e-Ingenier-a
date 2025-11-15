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
import { User } from '../../users/entities/user.entity';
import { Metrado } from '../../metrados/entities/metrado.entity';
import { GastoGeneral } from './gasto-general.entity';

export enum ProyectoEstado {
  BORRADOR = 'borrador',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

export enum Moneda {
  PEN = 'PEN',
  USD = 'USD',
  EUR = 'EUR',
}

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  cliente: string;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date;

  @Column({
    type: 'enum',
    enum: ProyectoEstado,
    default: ProyectoEstado.BORRADOR,
  })
  estado: ProyectoEstado;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: Moneda,
    default: Moneda.PEN,
  })
  monedaBase: Moneda;

  // Totales calculados
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  costoDirecto: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  gastosGenerales: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  utilidad: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 5, scale: 2, default: 18 })
  igvPorcentaje: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  igv: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  presupuestoTotal: number;

  @ManyToOne(() => User, (user) => user.proyectos, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'creadorId' })
  creador: User;

  @Column({ nullable: true })
  creadorId: string;

  @OneToMany(() => Metrado, (metrado) => metrado.proyecto, {
    cascade: true,
  })
  metrados: Metrado[];

  @OneToMany(() => GastoGeneral, (gasto) => gasto.proyecto, {
    cascade: true,
  })
  gastosGeneralesList: GastoGeneral[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
