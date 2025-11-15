import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Acu } from './acu.entity';
import { Insumo } from '../../insumos/entities/insumo.entity';

@Entity('acu_insumos')
export class AcuInsumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Acu, (acu) => acu.acuInsumos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'acuId' })
  acu: Acu;

  @Column()
  acuId: string;

  @ManyToOne(() => Insumo, (insumo) => insumo.acuInsumos, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'insumoId' })
  insumo: Insumo;

  @Column()
  insumoId: string;

  @Column('decimal', { precision: 10, scale: 4 })
  cantidad: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  desperdicioPorcentaje: number;

  // Snapshot del precio al momento de crear el ACU
  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitarioSnapshot: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costoParcial: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
