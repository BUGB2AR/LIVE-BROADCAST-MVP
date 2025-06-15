// backend/src/modules/user/application/CreateUser.ts
import { User, UserRole } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).default(UserRole.Viewer),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const validatedData = createUserSchema.parse(data);

    const userAlreadyExists = await this.userRepository.findByEmail(validatedData.email);
    if (userAlreadyExists) {
      throw new AppError('User with this email already exists', 409);
    }

    const user = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role,
    });

    await this.userRepository.save(user);
    return user;
  }
}