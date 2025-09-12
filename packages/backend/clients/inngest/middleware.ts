import { InngestMiddleware } from "inngest";

import { db } from "@mapform/db";

export const servicesMiddleware = new InngestMiddleware({
  name: "Services Middleware",
  init: () => ({
    onFunctionRun: (_ctx) => ({
      transformInput: (__ctx) => ({
        // Anything passed via `ctx` will be merged with the function's arguments
        ctx: {
          db,
        },
      }),
    }),
  }),
});

export type Context = {
  db: typeof db;
};
