import { DataSource } from 'typeorm';
import { UserEntity } from '../../../../modules/user/infra/typeorm/entities/UserEntity';
import { StreamEntity } from '../../../../modules/stream/infra/typeorm/entities/StreamEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [UserEntity, StreamEntity],
  migrations: [],
  subscribers: [],
});

export const initializeTypeORM = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }
};