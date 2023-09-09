import { CustomError } from '../error/CustomError';

export function getErrorData(error:unknown): {
  data: string,
  code: number
} {
  if (error instanceof CustomError) { return error.response; }
  
  if (error instanceof Error) {
    return {
      code: 500,
      data: JSON.stringify({
        name: error.name,
        message: error.message,
      }),
    };
  }
  
  return {
    code: 500,
    data: JSON.stringify({
      name: 'ХЗ',
      message: (error as { message?: string })?.message,
    }),
  };
}
