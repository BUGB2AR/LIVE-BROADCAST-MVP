
import { Request, Response } from 'express';
import { CreateUser } from '../../../application/CreateUser';
import { TypeORMUserRepository } from '../../typeorm/repositories/typeORMUserRepository';
import { AppError } from '../../../../../shared/errors/AppError';
import { AuthenticateUser } from '../../../application/AuthenticateUser';


export class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { username, email, password, role } = request.body;
      const createUser = new CreateUser(new TypeORMUserRepository());
      const user = await createUser.execute({ username, email, password, role });
      return response.status(201).json(user);
    } catch (error) {
       if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Internal server error', error: '' });
    }
  }

  async authenticate(request: Request, response: Response): Promise<Response> { 
    try {
      const { email, password } = request.body;
      const authenticateUser = new AuthenticateUser(new TypeORMUserRepository());
      const { user, token } = await authenticateUser.execute({ email, password });
      return response.json({ user, token });
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Internal server error', error: '' });
    }
  }
}