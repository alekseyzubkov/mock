import { CustomError } from './CustomError';

export class ValidateError extends CustomError {
  protected code: number = 409;

  constructor(protected data: object) {
    super('Ошибка валидации!', data);
  }
}
