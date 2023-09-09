import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  protected code: number = 404;

  constructor(protected data: object) {
    super('Мок не найден', data); 
  }


}
