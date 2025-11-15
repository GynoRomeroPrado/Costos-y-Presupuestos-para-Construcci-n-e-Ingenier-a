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
import { Partida } from '../../partidas/entities/partida.entity';
import { AcuInsumo } from './acu-insumo.entity';
import { Metrado } from '../../metrados/entities/metrado.entity';

@Entity('acus')
export class Acu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partida, (partida) => partida.acus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partidaId' })
  partida: Partida;

  @Column()
  partidaId: string;

  @Column({ default: 1 })
  version: number;

  @Column('decimal', { precision: 10, scale: 4, default: 1 })
  rendimiento: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costoUnitarioCalculado: number;

  @Column({ default: true })
  activo: boolean;

  @Column('text', { nullable: true })
  descripcion: string;

  // Desglose de costos
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costoMateriales: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costoManoObra: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costoEquipo: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costoSubcontrato: number;

  // Metadatos para cuadrillas
  @Column('jsonb', { nullable: true })
  cuadrilla: object;

  @OneToMany(() => AcuInsumo, (acuInsumo) => acuInsumo.acu, {
    cascade: true,
  })
  acuInsumos: AcuInsumo[];

  @OneToMany(() => Metrado, (metrado) => metrado.acu)
  metrados: Metrado[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
