import { IStreamRepository } from '../domain/IStreamRepository';
import { AppError } from '../../../shared/errors/AppError';

export class EndStream {
  constructor(private streamRepository: IStreamRepository) {}

  async execute(streamId: string, userId: string): Promise<void> {
    const stream = await this.streamRepository.findById(streamId);
    if (!stream) {
      throw new AppError('Stream not found.', 404);
    }
    if (stream.streamerId !== userId) {
      throw new AppError('You are not authorized to end this stream.', 403);
    }
    stream.end();
    await this.streamRepository.update(stream);
  }
}