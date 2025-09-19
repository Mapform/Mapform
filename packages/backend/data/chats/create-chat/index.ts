"server-only";

import { chats, projects } from "@mapform/db/schema";
import { createChatSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { and, eq } from "@mapform/db/utils";

export const createChat = (authClient: UserAuthClient) =>
  authClient
    .schema(createChatSchema)
    .action(
      async ({
        parsedInput: { title, projectId },
        ctx: { user, userAccess, db },
      }) => {
        if (projectId) {
          const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
          });

          if (!project) {
            throw new Error("Project not found");
          }

          if (!userAccess.teamspace.checkAccessById(project.teamspaceId)) {
            throw new Error("User cannot create a chat for this project");
          }
        }

        const [chat] = await db
          .insert(chats)
          .values({ title, userId: user.id, projectId })
          .onConflictDoNothing()
          .returning();

        return chat;
      },
    );
