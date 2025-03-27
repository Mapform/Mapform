import {
  selectFormSubmissionSchema,
  selectProjectSchema,
} from "@mapform/db/schema";
import { z } from "zod";

export const getSubmissionSchema = z.object({
  submissionId: selectFormSubmissionSchema.shape.id,
  projectId: selectProjectSchema.shape.id,
});

export type GetSubmissionSchema = z.infer<typeof getSubmissionSchema>;
