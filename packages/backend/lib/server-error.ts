// This can be used to surface errors on the client via next-safe-action
export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}

export const ERROR_CODES_USER = {
  ROW_LIMIT_EXCEEDED: "The project has reached its submission limit.",
};

export const ERROR_CODES_ADMIN = {
  ROW_LIMIT_EXCEEDED:
    "Row limit exceeded. Delete some rows, or upgrade your plan.",
};
