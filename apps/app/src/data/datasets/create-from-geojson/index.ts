"use server";

import { authClient } from "~/lib/safe-action";

export const createDatasetFromGeojsonAction =
  authClient.createDatasetFromGeojson;
