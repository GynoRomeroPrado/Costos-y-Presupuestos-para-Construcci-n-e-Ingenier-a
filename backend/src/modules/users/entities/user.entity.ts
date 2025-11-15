import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

export enum UserRole {
  ADMIN = 'admin',
  INGENIERO_COSTOS = 'ingeniero_costos',
  PROYECTISTA = 'proyectista',
  VISUALIZADOR = 'visualizador',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PROYECTISTA,
  })
  role: UserRole;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  cargo: string;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.creador)
  proyectos: Proyecto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
