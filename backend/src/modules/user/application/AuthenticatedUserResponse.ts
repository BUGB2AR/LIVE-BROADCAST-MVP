
import { UserRole } from '../domain/User';

export interface AuthenticatedUserResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}