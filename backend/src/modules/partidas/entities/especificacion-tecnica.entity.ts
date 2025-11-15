import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Partida } from './partida.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('especificaciones_tecnicas')
export class EspecificacionTecnica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partida, (partida) => partida.especificaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partidaId' })
  partida: Partida;

  @Column()
  partidaId: string;

  // Opcional: puede ser genérica (sin proyecto) o específica de un proyecto
  @ManyToOne(() => Proyecto, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @Column({ nullable: true })
  proyectoId: string;

  @Column('text')
  contenidoHtml: string;

  @Column({ default: 1 })
  version: number;

  @Column({ default: false })
  esGenerica: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
