import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Acu } from '../../acu/entities/acu.entity';
import { Metrado } from '../../metrados/entities/metrado.entity';
import { EspecificacionTecnica } from './especificacion-tecnica.entity';

@Entity('partidas')
export class Partida {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column()
  unidadMedida: string;

  @Column({ nullable: true })
  especialidad: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ default: true })
  activa: boolean;

  @OneToMany(() => Acu, (acu) => acu.partida)
  acus: Acu[];

  @OneToMany(() => Metrado, (metrado) => metrado.partida)
  metrados: Metrado[];

  @OneToMany(() => EspecificacionTecnica, (especificacion) => especificacion.partida)
  especificaciones: EspecificacionTecnica[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
