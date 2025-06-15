import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../../domain/User';
import { ViewerTier } from '../../../domain/UserProfile';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Viewer })
  role!: UserRole;

  @Column({ nullable: true })
  avatarUrl!: string;

  @Column({ nullable: true })
  bio!: string;

  @Column({ type: 'enum', enum: ViewerTier, default: ViewerTier.Free })
  viewerTier!: ViewerTier;
}