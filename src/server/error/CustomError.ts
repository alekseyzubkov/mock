export class CustomError extends Error {
  protected code: number = 400;

  constructor(message: string, protected data: object) {
    super(message);
  }

  get response() {
    const data = JSON.stringify({
      name: this.constructor.name,
      message: this.message,
      ...this.data,
    });

    return {
      code: this.code,
      data,
    };
  }
}
