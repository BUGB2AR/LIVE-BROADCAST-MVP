import { Stream, StreamStatus } from '../domain/Stream';
import { IStreamRepository } from '../domain/IStreamRepository';
import { IUserRepository } from '../../user/domain/IUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { UserRole } from '../../user/domain/User';
import { z } from 'zod';

export const createStreamSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  streamerId: z.string().uuid(),
});

export type CreateStreamDTO = z.infer<typeof createStreamSchema>;

export class CreateStream {
  constructor(
    private streamRepository: IStreamRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(data: CreateStreamDTO): Promise<Stream> {
    const validatedData = createStreamSchema.parse(data);

    const streamer = await this.userRepository.findById(validatedData.streamerId);
    if (!streamer) {
      throw new AppError('Streamer not found.', 404);
    }
    if (streamer.role !== UserRole.Streamer) {
      throw new AppError('Only users with streamer role can create streams.', 403);
    }

    const activeStreams = await this.streamRepository.findByStreamerId(streamer.id);
    if (activeStreams.some(s => s.status === StreamStatus.Live)) {
      throw new AppError('Streamer already has an active live stream.', 409);
    }

    const stream = Stream.create({
      title: validatedData.title,
      description: validatedData.description,
      isPublic: validatedData.isPublic,
      streamerId: validatedData.streamerId,
      streamer: streamer, 
    });

    await this.streamRepository.save(stream);
    return stream;
  }
}