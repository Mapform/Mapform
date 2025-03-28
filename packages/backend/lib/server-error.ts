// This can be used to surface errors on the client via next-safe-action
export class ServerError extends Error {
  statusCode: number;
  code: string | undefined;

  constructor({
    message,
    statusCode = 500,
    code,
  }: {
    message: string;
    statusCode?: number;
    code?: string;
  }) {
    super(message);
    this.name = "ServerError";
    this.statusCode = statusCode;
    this.code = code;
  }
}
