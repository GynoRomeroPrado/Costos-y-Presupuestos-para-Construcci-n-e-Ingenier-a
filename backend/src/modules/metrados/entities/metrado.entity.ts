import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Partida } from '../../partidas/entities/partida.entity';
import { Acu } from '../../acu/entities/acu.entity';

@Entity('metrados')
export class Metrado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.metrados, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @Column()
  proyectoId: string;

  @ManyToOne(() => Partida, (partida) => partida.metrados, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'partidaId' })
  partida: Partida;

  @Column()
  partidaId: string;

  @ManyToOne(() => Acu, (acu) => acu.metrados, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'acuId' })
  acu: Acu;

  @Column({ nullable: true })
  acuId: string;

  @Column('decimal', { precision: 15, scale: 4 })
  cantidad: number;

  @Column()
  unidadMedida: string;

  @Column('decimal', { precision: 15, scale: 2 })
  costoUnitario: number;

  @Column('decimal', { precision: 15, scale: 2 })
  costoParcial: number;

  @Column({ default: 1 })
  ordenVisualizacion: number;

  @Column({ nullable: true })
  agrupacion: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
