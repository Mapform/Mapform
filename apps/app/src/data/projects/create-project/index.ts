"use server";

import { authClient } from "~/lib/safe-action";

export const createProjectAction = authClient.createProject;
