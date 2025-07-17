"server-only";

import { db } from "@mapform/db";
import { chats, projects } from "@mapform/db/schema";
import { createChatSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { eq } from "@mapform/db/utils";

export const createChat = (authClient: UserAuthClient) =>
  authClient
    .schema(createChatSchema)
    .action(
      async ({
        parsedInput: { id, title, projectId },
        ctx: { user, userAccess },
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
          .values({ id, title, userId: user.id, projectId })
          .returning();

        return chat;
      },
    );
