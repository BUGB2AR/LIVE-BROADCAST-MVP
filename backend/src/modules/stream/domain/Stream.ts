// backend/src/modules/stream/domain/Stream.ts

import { v4 as uuid } from 'uuid';
import { User } from '../../user/domain/User'; // Importar a entidade de domínio User

/**
 * Enum que representa o status atual de uma transmissão ao vivo.
 */
export enum StreamStatus {
  Offline = 'offline', // A live ainda não começou, foi programada ou está inativa.
  Live = 'live',       // A live está acontecendo no momento.
  Ended = 'ended',     // A live foi encerrada.
}

/**
 * Interface que define as propriedades de dados de um Stream.
 * Isso ajuda a separar os dados dos métodos da classe.
 */
interface StreamProps {
  title: string;
  description?: string;
  streamerId: string;
  streamer: User;
  status: StreamStatus;
  isPublic: boolean;
  startedAt: Date;
  endedAt?: Date;
}

/**
 * Entidade de domínio 'Stream', representando uma transmissão ao vivo.
 * Esta classe encapsula a lógica de negócio e as regras de um Stream.
 */
export class Stream {
  public readonly id: string;
  public title!: string;
  public description?: string;
  public streamerId!: string;
  public streamer!: User;
  public status!: StreamStatus;
  public isPublic!: boolean;
  public startedAt!: Date;
  public endedAt?: Date;
  public viewerCount: number; // Número de espectadores atuais (não persistente no DB, atualizado em tempo real via WebSocket)

  /**
   * Construtor privado para garantir que a criação da Stream passe pelo método estático 'create'.
   * @param props As propriedades da stream.
   * @param id Opcional: ID preexistente para recriação a partir de persistência.
   */
  private constructor(props: StreamProps, id?: string) {
    this.id = id || uuid(); // Gera um novo UUID se nenhum ID for fornecido
    Object.assign(this, props);
    this.viewerCount = 0; // Inicializa a contagem de espectadores como zero
  }

  /**
   * Cria uma nova instância de Stream com um status inicial 'Offline'.
   * Este é o método preferencial para criar objetos Stream no domínio.
   *
   * @param props Objeto com as propriedades essenciais para criar uma Stream.
   * @param id Opcional: ID preexistente, usado principalmente ao reconstruir a entidade a partir do banco de dados.
   * @returns Uma nova instância de Stream.
   */
  static create(props: {
    title: string;
    streamerId: string;
    streamer: User; // Deve ser o objeto de domínio User
    description?: string;
    isPublic?: boolean;
  }, id?: string): Stream {
    // Monta o objeto de props que corresponde a StreamProps
    const streamProps: StreamProps = {
      title: props.title,
      streamerId: props.streamerId,
      streamer: props.streamer,
      description: props.description,
      isPublic: props.isPublic ?? true, // Garante um valor padrão se for opcional
      status: StreamStatus.Offline, // Toda live começa como offline
      startedAt: new Date(),        // A data de início é definida na criação, mas atualizada ao 'startar'
    };

    const stream = new Stream(streamProps, id);
    return stream;
  }

  /**
   * Inicia a transmissão ao vivo, mudando o status para 'Live'.
   * Lança um erro se a live já estiver ativa ou em um estado inválido para iniciar.
   */
  start(): void {
    if (this.status === StreamStatus.Offline || this.status === StreamStatus.Ended) {
      this.status = StreamStatus.Live;
      this.startedAt = new Date(); // Atualiza a hora de início real da live
      this.endedAt = undefined;   // Garante que endedAt é nulo ao iniciar
      console.log(`Stream '${this.title}' (ID: ${this.id}) started by ${this.streamer.username}.`);
    } else {
      throw new Error('Cannot start stream: Stream is already live or in an invalid status.');
    }
  }

  /**
   * Encerra a transmissão ao vivo, mudando o status para 'Ended'.
   * Lança um erro se a live não estiver 'Live'.
   */
  end(): void {
    if (this.status === StreamStatus.Live) {
      this.status = StreamStatus.Ended;
      this.endedAt = new Date(); // Registra a hora de término da live
      console.log(`Stream '${this.title}' (ID: ${this.id}) ended.`);
    } else {
      throw new Error('Cannot end stream: Stream is not currently live.');
    }
  }

  /**
   * Atualiza a contagem de espectadores.
   * Nota: 'viewerCount' é uma propriedade em tempo real e não persistente diretamente no banco de dados.
   * @param count O novo número de espectadores.
   */
  updateViewerCount(count: number): void {
    if (count < 0) {
      throw new Error('Viewer count cannot be negative.');
    }
    this.viewerCount = count;
  }

  /**
   * Altera a visibilidade pública da live.
   * @param isPublic Novo status de publicidade (true para pública, false para privada/assinantes).
   */
  togglePublicStatus(isPublic: boolean): void {
    this.isPublic = isPublic;
    console.log(`Stream '${this.title}' public status changed to: ${this.isPublic}`);
  }

  /**
   * Atualiza o título e a descrição da live.
   * @param title O novo título da live.
   * @param description A nova descrição da live (opcional).
   */
  updateDetails(title: string, description?: string): void {
    if (!title || title.trim() === '') {
      throw new Error('Stream title cannot be empty.');
    }
    this.title = title;
    this.description = description;
    console.log(`Stream '${this.id}' details updated.`);
  }
}