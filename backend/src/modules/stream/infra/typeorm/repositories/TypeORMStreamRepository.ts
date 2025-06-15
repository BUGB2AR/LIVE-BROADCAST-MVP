// backend/src/modules/stream/infra/typeorm/repositories/TypeORMStreamRepository.ts

import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../shared/infra/persistence/typeorm';
import { Stream, StreamStatus } from '../../../domain/Stream';
import { IStreamRepository } from '../../../domain/IStreamRepository';
import { StreamEntity } from '../entities/StreamEntity';
import { User } from '../../../../user/domain/User'; // Importa a entidade de domínio User
import { UserEntity } from '../../../../user/infra/typeorm/entities/UserEntity'; // Importa a entidade TypeORM UserEntity
import { UserProfile, ViewerTier } from '../../../../user/domain/UserProfile'; // Importa UserProfile e ViewerTier

export class TypeORMStreamRepository implements IStreamRepository {
  private ormRepository: Repository<StreamEntity>;
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(StreamEntity);
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  private async mapEntityToDomain(entity: StreamEntity): Promise<Stream> {
    const streamerEntity = entity.streamer || await this.userRepository.findOneBy({ id: entity.streamerId });

    if (!streamerEntity) {
      throw new Error(`Streamer with ID ${entity.streamerId} not found for stream ${entity.id}.`);
    }

    const streamer = User.fromPersistence({
      id: streamerEntity.id,
      username: streamerEntity.username,
      email: streamerEntity.email,
      passwordHash: streamerEntity.passwordHash, // Passa o hash existente
      role: streamerEntity.role,
      avatarUrl: streamerEntity.avatarUrl,
      bio: streamerEntity.bio,
      viewerTier: streamerEntity.viewerTier,
    });

    const stream = Stream.create(
      {
        title: entity.title,
        description: entity.description,
        isPublic: entity.isPublic,
        streamerId: entity.streamerId,
        streamer: streamer,
      },
      entity.id,
    );

    stream.status = entity.status;
    stream.startedAt = entity.startedAt;
    stream.endedAt = entity.endedAt;

    return stream;
  }

  async findById(id: string): Promise<Stream | undefined> {
    const streamEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['streamer'],
    });
    if (!streamEntity) return undefined;
    return this.mapEntityToDomain(streamEntity);
  }

  async findByStreamerId(streamerId: string): Promise<Stream[]> {
    const streamEntities = await this.ormRepository.find({
      where: { streamerId },
      relations: ['streamer'],
      order: { startedAt: 'DESC' },
    });
    return Promise.all(streamEntities.map(entity => this.mapEntityToDomain(entity)));
  }

  async findActiveStreams(): Promise<Stream[]> {
    const streamEntities = await this.ormRepository.find({
      where: { status: StreamStatus.Live },
      relations: ['streamer'],
      order: { startedAt: 'ASC' },
    });
    return Promise.all(streamEntities.map(entity => this.mapEntityToDomain(entity)));
  }

  async save(stream: Stream): Promise<void> {
    const streamEntity = this.ormRepository.create({
      id: stream.id,
      title: stream.title,
      description: stream.description,
      streamerId: stream.streamerId,
      status: stream.status,
      isPublic: stream.isPublic,
      startedAt: stream.startedAt,
      endedAt: stream.endedAt,
    });
    await this.ormRepository.save(streamEntity);
  }

  async update(stream: Stream): Promise<void> {
    await this.save(stream);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}