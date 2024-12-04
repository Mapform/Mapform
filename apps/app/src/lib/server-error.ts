// This can be used to surface errors on the client via next-safe-action
export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}
