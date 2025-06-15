
/**
 * @class AppError
 * @extends Error
 * @description Classe de erro personalizada para a aplicação.
 * Permite adicionar um código de status HTTP e marcar se o erro é operacional (esperado) ou de programação (inesperado).
 * Isso ajuda a diferenciar erros que podem ser tratados de forma controlada (ex: validação)
 * de erros que indicam um bug no código (ex: referência nula).
 */
export class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
  
    /**
     * Construtor de AppError.
     * @param message A mensagem de erro que será retornada.
     * @param statusCode O código de status HTTP associado a este erro (ex: 400, 401, 404, 403).
     * @param isOperational Opcional: Se 'true', indica um erro operacional (default: true).
     */
    constructor(message: string, statusCode: number = 400, isOperational: boolean = true) {
      super(message); 
  
      this.message = message;
      this.statusCode = statusCode;
      this.isOperational = isOperational;

      Error.captureStackTrace(this, this.constructor);
    }
  }