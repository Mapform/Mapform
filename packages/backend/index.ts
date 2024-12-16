import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { ServerError } from "./lib/server-error";

// Base client
export const baseClient = createSafeActionClient({
  handleServerError(e) {
    // Log to console.
    console.error("Action error:", e.message);

    // In this case, we can use the 'MyCustomError` class to unmask errors
    // and return them with their actual messages to the client.
    if (e instanceof ServerError) {
      return e.message;
    }

    // Every other error that occurs will be masked with the default message.
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export {
  ServerError,
  // Exporting middleware can allow conusming services to use them.
};
export * from "./lib/middleware";
export type * from "./lib/types";
