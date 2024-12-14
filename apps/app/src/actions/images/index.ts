"use server";

import { authClient } from "~/lib/safe-action";

export const uploadImageAction = authClient.uploadImage;
