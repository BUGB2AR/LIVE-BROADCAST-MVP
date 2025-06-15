import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../shared/infra/persistence/typeorm';
import { User } from '../../../domain/User';
import { IUserRepository } from '../../../domain/IUserRepository';
import { UserEntity } from '../entities/UserEntity';
import { UserProfile } from '../../../domain/UserProfile';

export class TypeORMUserRepository implements IUserRepository {
  private ormRepository: Repository<UserEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<User | undefined> {
    const userEntity = await this.ormRepository.findOneBy({ id });
    if (!userEntity) return undefined;
    return User.create({
      username: userEntity.username,
      email: userEntity.email,
      role: userEntity.role,
      password: userEntity.passwordHash,
    }, userEntity.id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userEntity = await this.ormRepository.findOneBy({ email });
    if (!userEntity) return undefined;
    const user = await User.create({
      username: userEntity.username,
      email: userEntity.email,
      role: userEntity.role,
      password: userEntity.passwordHash,
    }, userEntity.id);
    user.profile = new UserProfile(userEntity.avatarUrl, userEntity.bio, userEntity.viewerTier);
    return user;
  }

  async save(user: User): Promise<void> {
    const userEntity = this.ormRepository.create({
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      avatarUrl: user.profile?.avatarUrl,
      bio: user.profile?.bio,
      viewerTier: user.profile?.viewerTier,
    });
    await this.ormRepository.save(userEntity);
  }

  async update(user: User): Promise<void> {
    const userEntity = this.ormRepository.create({
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      avatarUrl: user.profile?.avatarUrl,
      bio: user.profile?.bio,
      viewerTier: user.profile?.viewerTier,
    });
    await this.ormRepository.save(userEntity);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}