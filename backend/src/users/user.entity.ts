import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: true, 
  })
  email: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  phoneNumber: string; 
  @Column({
    type: 'enum',
    enum: Object.values(UserRole),
    nullable: false,
    default: UserRole.ADMIN, 
  })
  role: UserRole;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  authorized: boolean;
}