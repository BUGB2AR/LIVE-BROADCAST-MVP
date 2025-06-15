import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/User';
import { AppError } from '../../../shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { AuthenticateUserDTO, authenticateUserSchema } from '../dtos/AuthenticateUserDTO';
import authConfig from '../../../shared/config/auth';
import { AuthenticatedUserResponse } from './AuthenticatedUserResponse';

export class AuthenticateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: AuthenticateUserDTO): Promise<{ user: AuthenticatedUserResponse; token: string }> {
    const { email, password } = authenticateUserSchema.parse(data);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.passwordHash);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }


    const tokenPayload = {
      id: user.id,
      role: user.role, 
    };

   
    const token = sign(tokenPayload, authConfig.jwt.secret, {
        subject: user.id,
        expiresIn: authConfig.jwt.expiresIn,
      });

    const userResponse: AuthenticatedUserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return { user: userResponse, token };
  }
}