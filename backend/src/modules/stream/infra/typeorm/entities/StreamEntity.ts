import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../../user/infra/typeorm/entities/UserEntity';
import { StreamStatus } from '../../../domain/Stream';

@Entity('streams')
export class StreamEntity {
  @PrimaryColumn() 
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true }) 
  description!: string;

  @Column() 
  streamerId!: string; 

  
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'streamerId' }) 
  streamer!: UserEntity; 

  @Column({ type: 'enum', enum: StreamStatus, default: StreamStatus.Offline }) 
  status!: StreamStatus;

  @Column({ default: true }) 
  isPublic!: boolean;

  @Column({ type: 'timestamp with time zone' }) 
  startedAt!: Date;

  @Column({ type: 'timestamp with time zone', nullable: true }) 
  endedAt!: Date;
}