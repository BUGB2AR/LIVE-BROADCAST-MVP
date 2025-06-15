import { Request, Response } from 'express';
import { CreateStream } from '../../../application/CreateStream';
import { StartStream } from '../../../application/StartStream';
import { EndStream } from '../../../application/EndStream';
import { TypeORMStreamRepository } from '../../typeorm/repositories/TypeORMStreamRepository';
import { AppError } from '../../../../../shared/errors/AppError';
import { TypeORMUserRepository } from '../../../../user/infra/typeorm/repositories/typeORMUserRepository';

export class StreamController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { title, description, isPublic } = request.body;
      const streamerId = request.user.id;

      const createStream = new CreateStream(
        new TypeORMStreamRepository(),
        new TypeORMUserRepository(),
      );

      const stream = await createStream.execute({ title, description, isPublic, streamerId });
      const { streamer, ...streamResponse } = stream;
      return response.status(201).json(streamResponse);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Internal server error', error: '' });
    }
  }

  async start(request: Request, response: Response): Promise<Response> {
    try {
      const { streamId } = request.params;
      const userId = request.user.id; 

      const startStream = new StartStream(new TypeORMStreamRepository());
      await startStream.execute(streamId, userId);
      return response.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Internal server error', error: ''});
    }
  }

  async end(request: Request, response: Response): Promise<Response> {
    try {
      const { streamId } = request.params;
      const userId = request.user.id; 

      const endStream = new EndStream(new TypeORMStreamRepository());
      await endStream.execute(streamId, userId);
      return response.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Internal server error', error: '' });
    }
  }

  async listActive(request: Request, response: Response): Promise<Response> {
    try {
      const streamRepository = new TypeORMStreamRepository();
      const activeStreams = await streamRepository.findActiveStreams();
      const responseStreams = activeStreams.map(stream => {
        const { streamer, ...streamData } = stream;
        return {
          ...streamData,
          streamerName: streamer.username,
        };
      });
      return response.status(200).json(responseStreams);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Internal server error', error: '' });
    }
  }
}