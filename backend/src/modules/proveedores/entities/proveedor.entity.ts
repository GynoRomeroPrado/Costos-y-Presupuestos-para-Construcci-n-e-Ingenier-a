import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  ruc: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  contacto: string;

  @Column({ nullable: true })
  especialidad: string;

  @Column({ default: true })
  activo: boolean;

  @Column('text', { nullable: true })
  observaciones: string;

  @OneToMany(() => Insumo, (insumo) => insumo.proveedor)
  insumos: Insumo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
