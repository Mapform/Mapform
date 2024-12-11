import {
  createMiddleware,
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { ServerError } from "./server-error";

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

interface Context {
  foo: string;
}

// This could go in apps/app potentially
const userMiddleware = createMiddleware<{
  ctx: Context; // [1]
  // metadata: { actionName: string }; // [2]
  // serverError: { message: string }; // [3]
}>().define(async ({ next }) => {
  // Do something useful here...
  return next({ ctx: { foo: "doe" } });
});

// wrap part of function below
// const auth = ()

// This goes in get-workspace
export const getWorkspace = (ctx: Context) =>
  baseClient
    .use(async ({ next }) => next({ ctx }))
    .use(userMiddleware)
    .action(async ({ parsedInput }) => {
      // Business logic
    });
