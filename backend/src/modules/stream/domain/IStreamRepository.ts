// backend/src/modules/stream/domain/IStreamRepository.ts

import { Stream } from './Stream'; // Importa a entidade de domínio Stream

/**
 * Interface que define o contrato para o repositório de Streams.
 * Esta interface especifica as operações que qualquer implementação de repositório de Stream deve fornecer,
 * garantindo a abstração da camada de persistência.
 */
export interface IStreamRepository {
  /**
   * Encontra uma Stream pelo seu ID único.
   * @param id O ID da Stream a ser encontrada.
   * @returns Uma Promise que resolve para a Stream encontrada ou 'undefined' se não existir.
   */
  findById(id: string): Promise<Stream | undefined>;

  /**
   * Encontra todas as Streams associadas a um Streamer específico.
   * @param streamerId O ID do Streamer.
   * @returns Uma Promise que resolve para um array de Streams.
   */
  findByStreamerId(streamerId: string): Promise<Stream[]>;

  /**
   * Encontra todas as Streams que estão atualmente ativas (status 'Live').
   * @returns Uma Promise que resolve para um array de Streams ativas.
   */
  findActiveStreams(): Promise<Stream[]>;

  /**
   * Salva uma nova Stream ou atualiza uma existente no repositório.
   * @param stream A entidade de domínio Stream a ser salva ou atualizada.
   * @returns Uma Promise vazia que indica a conclusão da operação.
   */
  save(stream: Stream): Promise<void>;

  /**
   * Atualiza uma Stream existente no repositório.
   * @param stream A entidade de domínio Stream a ser atualizada.
   * @returns Uma Promise vazia que indica a conclusão da operação.
   */
  update(stream: Stream): Promise<void>;

  /**
   * Deleta uma Stream do repositório pelo seu ID.
   * @param id O ID da Stream a ser deletada.
   * @returns Uma Promise vazia que indica a conclusão da operação.
   */
  delete(id: string): Promise<void>;
}