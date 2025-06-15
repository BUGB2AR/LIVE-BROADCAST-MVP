// backend/src/modules/user/domain/User.ts

import { v4 as uuid } from 'uuid';
import { hash, compare } from 'bcryptjs';
import { UserProfile, ViewerTier } from './UserProfile'; // Importe UserProfile e ViewerTier

export enum UserRole {
  Streamer = 'streamer',
  Viewer = 'viewer',
}

export class User {
  public readonly id: string;
  public username!: string;
  public email!: string;
  public passwordHash!: string; // Armazenará a senha JÁ HASHADA
  public role!: UserRole;
  public profile!: UserProfile;

  // Construtor privado para garantir a criação via métodos estáticos controlados
  private constructor(
    props: { username: string; email: string; passwordHash: string; role: UserRole; profile: UserProfile },
    id?: string,
  ) {
    this.id = id || uuid();
    Object.assign(this, props);
  }

  /**
   * Cria uma NOVA instância de User. A senha fornecida é em texto plano e será hasheada.
   * Usado para registro de novos usuários.
   */
  static async create(
    props: { username: string; email: string; password: string; role: UserRole }, // 'password' é em texto plano
    id?: string,
  ): Promise<User> {
    const passwordHash = await hash(props.password, 8); // HASH DA SENHA
    const userProfile = new UserProfile(); // Novo perfil para novo usuário
    const user = new User({ ...props, passwordHash, profile: userProfile }, id);
    return user;
  }

  /**
   * Reconstrói uma instância de User a partir de dados persistidos (do banco de dados).
   * A 'passwordHash' já deve estar hasheada.
   * Usado por repositórios para carregar usuários.
   */
  static fromPersistence(
    props: {
      id: string;
      username: string;
      email: string;
      passwordHash: string; // Já é a senha hasheada do banco de dados
      role: UserRole;
      avatarUrl?: string; // Propriedades do perfil que vêm do banco de dados
      bio?: string;
      viewerTier?: ViewerTier;
    },
  ): User {
    const userProfile = new UserProfile(props.avatarUrl, props.bio, props.viewerTier);
    const user = new User({
      username: props.username,
      email: props.email,
      passwordHash: props.passwordHash, // Atribui o hash diretamente
      role: props.role,
      profile: userProfile,
    }, props.id);
    return user;
  }

  /**
   * Compara uma senha em texto plano com a senha hasheada do usuário.
   */
  async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  /**
   * Atualiza o perfil do usuário.
   */
  updateProfile(newProfile: UserProfile): void {
    this.profile = newProfile;
  }
}