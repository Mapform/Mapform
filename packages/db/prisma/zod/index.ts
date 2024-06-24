import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','firstName','lastName','email','imageUrl','createdAt','updatedAt']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','slug','imageUrl','createdAt','updatedAt']);

export const OrganizationMembershipScalarFieldEnumSchema = z.enum(['id','organizationId','userId','role','createdAt','updatedAt']);

export const WorkspaceMembershipScalarFieldEnumSchema = z.enum(['id','userId','workspaceId','role']);

export const WorkspaceScalarFieldEnumSchema = z.enum(['id','name','slug','organizationId','createdAt','updatedAt']);

export const FormScalarFieldEnumSchema = z.enum(['id','name','slug','isDraft','isDirty','isClosed','stepOrder','workspaceId','draftFormId','version','createdAt','updatedAt']);

export const StepScalarFieldEnumSchema = z.enum(['id','title','description','zoom','pitch','bearing','formId','locationId','contentViewType','createdAt','updatedAt']);

export const FormSubmissionScalarFieldEnumSchema = z.enum(['id','formId','createdAt','updatedAt']);

export const InputResponseScalarFieldEnumSchema = z.enum(['id','blockNoteId','value','formSubmissionId','stepId']);

export const LocationResponseScalarFieldEnumSchema = z.enum(['id','blockNoteId','locationId','formSubmissionId','stepId']);

export const LocationScalarFieldEnumSchema = z.enum(['id']);

export const DatasetScalarFieldEnumSchema = z.enum(['id','name','workspaceId']);

export const ColumnScalarFieldEnumSchema = z.enum(['id','datasetId','name','dataType']);

export const RowScalarFieldEnumSchema = z.enum(['id','datasetId']);

export const CellValueScalarFieldEnumSchema = z.enum(['id','rowId','columnId','value']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const WorkspaceMembershipRoleSchema = z.enum(['OWNER','MEMBER']);

export type WorkspaceMembershipRoleType = `${z.infer<typeof WorkspaceMembershipRoleSchema>}`

export const ContentViewTypeSchema = z.enum(['FULL','PARTIAL','HIDDEN']);

export type ContentViewTypeType = `${z.infer<typeof ContentViewTypeSchema>}`

export const ColumnTypeSchema = z.enum(['STRING','INT','FLOAT','BOOLEAN']);

export type ColumnTypeType = `${z.infer<typeof ColumnTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  organizationMemberships: OrganizationMembershipWithRelations[];
  workspaceMemberships: WorkspaceMembershipWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  organizationMemberships: z.lazy(() => OrganizationMembershipWithRelationsSchema).array(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Organization = z.infer<typeof OrganizationSchema>

// ORGANIZATION RELATION SCHEMA
//------------------------------------------------------

export type OrganizationRelations = {
  members: OrganizationMembershipWithRelations[];
  workspaces: WorkspaceWithRelations[];
};

export type OrganizationWithRelations = z.infer<typeof OrganizationSchema> & OrganizationRelations

export const OrganizationWithRelationsSchema: z.ZodType<OrganizationWithRelations> = OrganizationSchema.merge(z.object({
  members: z.lazy(() => OrganizationMembershipWithRelationsSchema).array(),
  workspaces: z.lazy(() => WorkspaceWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ORGANIZATION MEMBERSHIP SCHEMA
/////////////////////////////////////////

export const OrganizationMembershipSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type OrganizationMembership = z.infer<typeof OrganizationMembershipSchema>

// ORGANIZATION MEMBERSHIP RELATION SCHEMA
//------------------------------------------------------

export type OrganizationMembershipRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type OrganizationMembershipWithRelations = z.infer<typeof OrganizationMembershipSchema> & OrganizationMembershipRelations

export const OrganizationMembershipWithRelationsSchema: z.ZodType<OrganizationMembershipWithRelations> = OrganizationMembershipSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// WORKSPACE MEMBERSHIP SCHEMA
/////////////////////////////////////////

export const WorkspaceMembershipSchema = z.object({
  role: WorkspaceMembershipRoleSchema,
  id: z.string().uuid(),
  userId: z.string(),
  workspaceId: z.string(),
})

export type WorkspaceMembership = z.infer<typeof WorkspaceMembershipSchema>

// WORKSPACE MEMBERSHIP RELATION SCHEMA
//------------------------------------------------------

export type WorkspaceMembershipRelations = {
  user: UserWithRelations;
  workspace: WorkspaceWithRelations;
};

export type WorkspaceMembershipWithRelations = z.infer<typeof WorkspaceMembershipSchema> & WorkspaceMembershipRelations

export const WorkspaceMembershipWithRelationsSchema: z.ZodType<WorkspaceMembershipWithRelations> = WorkspaceMembershipSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
}))

/////////////////////////////////////////
// WORKSPACE SCHEMA
/////////////////////////////////////////

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Workspace = z.infer<typeof WorkspaceSchema>

// WORKSPACE RELATION SCHEMA
//------------------------------------------------------

export type WorkspaceRelations = {
  members: WorkspaceMembershipWithRelations[];
  organization: OrganizationWithRelations;
  forms: FormWithRelations[];
  datasets: DatasetWithRelations[];
};

export type WorkspaceWithRelations = z.infer<typeof WorkspaceSchema> & WorkspaceRelations

export const WorkspaceWithRelationsSchema: z.ZodType<WorkspaceWithRelations> = WorkspaceSchema.merge(z.object({
  members: z.lazy(() => WorkspaceMembershipWithRelationsSchema).array(),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  forms: z.lazy(() => FormWithRelationsSchema).array(),
  datasets: z.lazy(() => DatasetWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// FORM SCHEMA
/////////////////////////////////////////

export const FormSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean(),
  isDirty: z.boolean(),
  isClosed: z.boolean(),
  stepOrder: z.string().array(),
  workspaceId: z.string(),
  draftFormId: z.string().nullable(),
  version: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Form = z.infer<typeof FormSchema>

// FORM RELATION SCHEMA
//------------------------------------------------------

export type FormRelations = {
  steps: StepWithRelations[];
  workspace: WorkspaceWithRelations;
  formSubmission: FormSubmissionWithRelations[];
  draftForm?: FormWithRelations | null;
  formVersions: FormWithRelations[];
};

export type FormWithRelations = z.infer<typeof FormSchema> & FormRelations

export const FormWithRelationsSchema: z.ZodType<FormWithRelations> = FormSchema.merge(z.object({
  steps: z.lazy(() => StepWithRelationsSchema).array(),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema).array(),
  draftForm: z.lazy(() => FormWithRelationsSchema).nullable(),
  formVersions: z.lazy(() => FormWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// STEP SCHEMA
/////////////////////////////////////////

export const StepSchema = z.object({
  contentViewType: ContentViewTypeSchema,
  id: z.string().uuid(),
  title: z.string().nullable(),
  /**
   * [DocumentType]
   */
  description: JsonValueSchema,
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().nullable(),
  locationId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Step = z.infer<typeof StepSchema>

// STEP RELATION SCHEMA
//------------------------------------------------------

export type StepRelations = {
  form?: FormWithRelations | null;
  location: LocationWithRelations;
  inputResponses: InputResponseWithRelations[];
  locationResponses: LocationResponseWithRelations[];
};

export type StepWithRelations = Omit<z.infer<typeof StepSchema>, "description"> & {
  description?: JsonValueType | null;
} & StepRelations

export const StepWithRelationsSchema: z.ZodType<StepWithRelations> = StepSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema).nullable(),
  location: z.lazy(() => LocationWithRelationsSchema),
  inputResponses: z.lazy(() => InputResponseWithRelationsSchema).array(),
  locationResponses: z.lazy(() => LocationResponseWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// FORM SUBMISSION SCHEMA
/////////////////////////////////////////

export const FormSubmissionSchema = z.object({
  id: z.string().uuid(),
  formId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FormSubmission = z.infer<typeof FormSubmissionSchema>

// FORM SUBMISSION RELATION SCHEMA
//------------------------------------------------------

export type FormSubmissionRelations = {
  form: FormWithRelations;
  inputResponses: InputResponseWithRelations[];
  locationResponses: LocationResponseWithRelations[];
};

export type FormSubmissionWithRelations = z.infer<typeof FormSubmissionSchema> & FormSubmissionRelations

export const FormSubmissionWithRelationsSchema: z.ZodType<FormSubmissionWithRelations> = FormSubmissionSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema),
  inputResponses: z.lazy(() => InputResponseWithRelationsSchema).array(),
  locationResponses: z.lazy(() => LocationResponseWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// INPUT RESPONSE SCHEMA
/////////////////////////////////////////

export const InputResponseSchema = z.object({
  id: z.string().uuid(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmissionId: z.string(),
  stepId: z.string(),
})

export type InputResponse = z.infer<typeof InputResponseSchema>

// INPUT RESPONSE RELATION SCHEMA
//------------------------------------------------------

export type InputResponseRelations = {
  formSubmission: FormSubmissionWithRelations;
  step: StepWithRelations;
};

export type InputResponseWithRelations = z.infer<typeof InputResponseSchema> & InputResponseRelations

export const InputResponseWithRelationsSchema: z.ZodType<InputResponseWithRelations> = InputResponseSchema.merge(z.object({
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema),
  step: z.lazy(() => StepWithRelationsSchema),
}))

/////////////////////////////////////////
// LOCATION RESPONSE SCHEMA
/////////////////////////////////////////

export const LocationResponseSchema = z.object({
  id: z.string().uuid(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  formSubmissionId: z.string(),
  stepId: z.string(),
})

export type LocationResponse = z.infer<typeof LocationResponseSchema>

// LOCATION RESPONSE RELATION SCHEMA
//------------------------------------------------------

export type LocationResponseRelations = {
  location: LocationWithRelations;
  formSubmission: FormSubmissionWithRelations;
  step: StepWithRelations;
};

export type LocationResponseWithRelations = z.infer<typeof LocationResponseSchema> & LocationResponseRelations

export const LocationResponseWithRelationsSchema: z.ZodType<LocationResponseWithRelations> = LocationResponseSchema.merge(z.object({
  location: z.lazy(() => LocationWithRelationsSchema),
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema),
  step: z.lazy(() => StepWithRelationsSchema),
}))

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  id: z.number().int(),
})

export type Location = z.infer<typeof LocationSchema>

// LOCATION RELATION SCHEMA
//------------------------------------------------------

export type LocationRelations = {
  step?: StepWithRelations | null;
  locationResponse?: LocationResponseWithRelations | null;
};

export type LocationWithRelations = z.infer<typeof LocationSchema> & LocationRelations

export const LocationWithRelationsSchema: z.ZodType<LocationWithRelations> = LocationSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema).nullable(),
  locationResponse: z.lazy(() => LocationResponseWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// DATASET SCHEMA
/////////////////////////////////////////

export const DatasetSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  workspaceId: z.string(),
})

export type Dataset = z.infer<typeof DatasetSchema>

// DATASET RELATION SCHEMA
//------------------------------------------------------

export type DatasetRelations = {
  columns: ColumnWithRelations[];
  rows: RowWithRelations[];
  workspace: WorkspaceWithRelations;
};

export type DatasetWithRelations = z.infer<typeof DatasetSchema> & DatasetRelations

export const DatasetWithRelationsSchema: z.ZodType<DatasetWithRelations> = DatasetSchema.merge(z.object({
  columns: z.lazy(() => ColumnWithRelationsSchema).array(),
  rows: z.lazy(() => RowWithRelationsSchema).array(),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
}))

/////////////////////////////////////////
// COLUMN SCHEMA
/////////////////////////////////////////

export const ColumnSchema = z.object({
  dataType: ColumnTypeSchema,
  id: z.number().int(),
  datasetId: z.string(),
  name: z.string(),
})

export type Column = z.infer<typeof ColumnSchema>

// COLUMN RELATION SCHEMA
//------------------------------------------------------

export type ColumnRelations = {
  dataset: DatasetWithRelations;
  cellValues: CellValueWithRelations[];
};

export type ColumnWithRelations = z.infer<typeof ColumnSchema> & ColumnRelations

export const ColumnWithRelationsSchema: z.ZodType<ColumnWithRelations> = ColumnSchema.merge(z.object({
  dataset: z.lazy(() => DatasetWithRelationsSchema),
  cellValues: z.lazy(() => CellValueWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ROW SCHEMA
/////////////////////////////////////////

export const RowSchema = z.object({
  id: z.number().int(),
  datasetId: z.string(),
})

export type Row = z.infer<typeof RowSchema>

// ROW RELATION SCHEMA
//------------------------------------------------------

export type RowRelations = {
  dataset: DatasetWithRelations;
  cellValues: CellValueWithRelations[];
};

export type RowWithRelations = z.infer<typeof RowSchema> & RowRelations

export const RowWithRelationsSchema: z.ZodType<RowWithRelations> = RowSchema.merge(z.object({
  dataset: z.lazy(() => DatasetWithRelationsSchema),
  cellValues: z.lazy(() => CellValueWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CELL VALUE SCHEMA
/////////////////////////////////////////

export const CellValueSchema = z.object({
  id: z.number().int(),
  rowId: z.number().int(),
  columnId: z.number().int(),
  value: JsonValueSchema.nullable(),
})

export type CellValue = z.infer<typeof CellValueSchema>

// CELL VALUE RELATION SCHEMA
//------------------------------------------------------

export type CellValueRelations = {
  column: ColumnWithRelations;
  row: RowWithRelations;
};

export type CellValueWithRelations = z.infer<typeof CellValueSchema> & CellValueRelations

export const CellValueWithRelationsSchema: z.ZodType<CellValueWithRelations> = CellValueSchema.merge(z.object({
  column: z.lazy(() => ColumnWithRelationsSchema),
  row: z.lazy(() => RowWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  organizationMemberships: z.union([z.boolean(),z.lazy(() => OrganizationMembershipFindManyArgsSchema)]).optional(),
  workspaceMemberships: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  organizationMemberships: z.boolean().optional(),
  workspaceMemberships: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organizationMemberships: z.union([z.boolean(),z.lazy(() => OrganizationMembershipFindManyArgsSchema)]).optional(),
  workspaceMemberships: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORGANIZATION
//------------------------------------------------------

export const OrganizationIncludeSchema: z.ZodType<Prisma.OrganizationInclude> = z.object({
  members: z.union([z.boolean(),z.lazy(() => OrganizationMembershipFindManyArgsSchema)]).optional(),
  workspaces: z.union([z.boolean(),z.lazy(() => WorkspaceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrganizationArgsSchema: z.ZodType<Prisma.OrganizationDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationSelectSchema).optional(),
  include: z.lazy(() => OrganizationIncludeSchema).optional(),
}).strict();

export const OrganizationCountOutputTypeArgsSchema: z.ZodType<Prisma.OrganizationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrganizationCountOutputTypeSelectSchema: z.ZodType<Prisma.OrganizationCountOutputTypeSelect> = z.object({
  members: z.boolean().optional(),
  workspaces: z.boolean().optional(),
}).strict();

export const OrganizationSelectSchema: z.ZodType<Prisma.OrganizationSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  members: z.union([z.boolean(),z.lazy(() => OrganizationMembershipFindManyArgsSchema)]).optional(),
  workspaces: z.union([z.boolean(),z.lazy(() => WorkspaceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORGANIZATION MEMBERSHIP
//------------------------------------------------------

export const OrganizationMembershipIncludeSchema: z.ZodType<Prisma.OrganizationMembershipInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const OrganizationMembershipArgsSchema: z.ZodType<Prisma.OrganizationMembershipDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationMembershipSelectSchema).optional(),
  include: z.lazy(() => OrganizationMembershipIncludeSchema).optional(),
}).strict();

export const OrganizationMembershipSelectSchema: z.ZodType<Prisma.OrganizationMembershipSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  userId: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// WORKSPACE MEMBERSHIP
//------------------------------------------------------

export const WorkspaceMembershipIncludeSchema: z.ZodType<Prisma.WorkspaceMembershipInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
}).strict()

export const WorkspaceMembershipArgsSchema: z.ZodType<Prisma.WorkspaceMembershipDefaultArgs> = z.object({
  select: z.lazy(() => WorkspaceMembershipSelectSchema).optional(),
  include: z.lazy(() => WorkspaceMembershipIncludeSchema).optional(),
}).strict();

export const WorkspaceMembershipSelectSchema: z.ZodType<Prisma.WorkspaceMembershipSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  role: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
}).strict()

// WORKSPACE
//------------------------------------------------------

export const WorkspaceIncludeSchema: z.ZodType<Prisma.WorkspaceInclude> = z.object({
  members: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  forms: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  datasets: z.union([z.boolean(),z.lazy(() => DatasetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkspaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const WorkspaceArgsSchema: z.ZodType<Prisma.WorkspaceDefaultArgs> = z.object({
  select: z.lazy(() => WorkspaceSelectSchema).optional(),
  include: z.lazy(() => WorkspaceIncludeSchema).optional(),
}).strict();

export const WorkspaceCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkspaceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkspaceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkspaceCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkspaceCountOutputTypeSelect> = z.object({
  members: z.boolean().optional(),
  forms: z.boolean().optional(),
  datasets: z.boolean().optional(),
}).strict();

export const WorkspaceSelectSchema: z.ZodType<Prisma.WorkspaceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  members: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  forms: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  datasets: z.union([z.boolean(),z.lazy(() => DatasetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkspaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FORM
//------------------------------------------------------

export const FormIncludeSchema: z.ZodType<Prisma.FormInclude> = z.object({
  steps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionFindManyArgsSchema)]).optional(),
  draftForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  formVersions: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const FormArgsSchema: z.ZodType<Prisma.FormDefaultArgs> = z.object({
  select: z.lazy(() => FormSelectSchema).optional(),
  include: z.lazy(() => FormIncludeSchema).optional(),
}).strict();

export const FormCountOutputTypeArgsSchema: z.ZodType<Prisma.FormCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FormCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FormCountOutputTypeSelectSchema: z.ZodType<Prisma.FormCountOutputTypeSelect> = z.object({
  steps: z.boolean().optional(),
  formSubmission: z.boolean().optional(),
  formVersions: z.boolean().optional(),
}).strict();

export const FormSelectSchema: z.ZodType<Prisma.FormSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  draftFormId: z.boolean().optional(),
  version: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  steps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionFindManyArgsSchema)]).optional(),
  draftForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  formVersions: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict()

// STEP
//------------------------------------------------------

export const StepIncludeSchema: z.ZodType<Prisma.StepInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  inputResponses: z.union([z.boolean(),z.lazy(() => InputResponseFindManyArgsSchema)]).optional(),
  locationResponses: z.union([z.boolean(),z.lazy(() => LocationResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => StepCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const StepArgsSchema: z.ZodType<Prisma.StepDefaultArgs> = z.object({
  select: z.lazy(() => StepSelectSchema).optional(),
  include: z.lazy(() => StepIncludeSchema).optional(),
}).strict();

export const StepCountOutputTypeArgsSchema: z.ZodType<Prisma.StepCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => StepCountOutputTypeSelectSchema).nullish(),
}).strict();

export const StepCountOutputTypeSelectSchema: z.ZodType<Prisma.StepCountOutputTypeSelect> = z.object({
  inputResponses: z.boolean().optional(),
  locationResponses: z.boolean().optional(),
}).strict();

export const StepSelectSchema: z.ZodType<Prisma.StepSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  zoom: z.boolean().optional(),
  pitch: z.boolean().optional(),
  bearing: z.boolean().optional(),
  formId: z.boolean().optional(),
  locationId: z.boolean().optional(),
  contentViewType: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  inputResponses: z.union([z.boolean(),z.lazy(() => InputResponseFindManyArgsSchema)]).optional(),
  locationResponses: z.union([z.boolean(),z.lazy(() => LocationResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => StepCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FORM SUBMISSION
//------------------------------------------------------

export const FormSubmissionIncludeSchema: z.ZodType<Prisma.FormSubmissionInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  inputResponses: z.union([z.boolean(),z.lazy(() => InputResponseFindManyArgsSchema)]).optional(),
  locationResponses: z.union([z.boolean(),z.lazy(() => LocationResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormSubmissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const FormSubmissionArgsSchema: z.ZodType<Prisma.FormSubmissionDefaultArgs> = z.object({
  select: z.lazy(() => FormSubmissionSelectSchema).optional(),
  include: z.lazy(() => FormSubmissionIncludeSchema).optional(),
}).strict();

export const FormSubmissionCountOutputTypeArgsSchema: z.ZodType<Prisma.FormSubmissionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FormSubmissionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FormSubmissionCountOutputTypeSelectSchema: z.ZodType<Prisma.FormSubmissionCountOutputTypeSelect> = z.object({
  inputResponses: z.boolean().optional(),
  locationResponses: z.boolean().optional(),
}).strict();

export const FormSubmissionSelectSchema: z.ZodType<Prisma.FormSubmissionSelect> = z.object({
  id: z.boolean().optional(),
  formId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  inputResponses: z.union([z.boolean(),z.lazy(() => InputResponseFindManyArgsSchema)]).optional(),
  locationResponses: z.union([z.boolean(),z.lazy(() => LocationResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormSubmissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// INPUT RESPONSE
//------------------------------------------------------

export const InputResponseIncludeSchema: z.ZodType<Prisma.InputResponseInclude> = z.object({
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const InputResponseArgsSchema: z.ZodType<Prisma.InputResponseDefaultArgs> = z.object({
  select: z.lazy(() => InputResponseSelectSchema).optional(),
  include: z.lazy(() => InputResponseIncludeSchema).optional(),
}).strict();

export const InputResponseSelectSchema: z.ZodType<Prisma.InputResponseSelect> = z.object({
  id: z.boolean().optional(),
  blockNoteId: z.boolean().optional(),
  value: z.boolean().optional(),
  formSubmissionId: z.boolean().optional(),
  stepId: z.boolean().optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// LOCATION RESPONSE
//------------------------------------------------------

export const LocationResponseIncludeSchema: z.ZodType<Prisma.LocationResponseInclude> = z.object({
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const LocationResponseArgsSchema: z.ZodType<Prisma.LocationResponseDefaultArgs> = z.object({
  select: z.lazy(() => LocationResponseSelectSchema).optional(),
  include: z.lazy(() => LocationResponseIncludeSchema).optional(),
}).strict();

export const LocationResponseSelectSchema: z.ZodType<Prisma.LocationResponseSelect> = z.object({
  id: z.boolean().optional(),
  blockNoteId: z.boolean().optional(),
  locationId: z.boolean().optional(),
  formSubmissionId: z.boolean().optional(),
  stepId: z.boolean().optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// LOCATION
//------------------------------------------------------

export const LocationIncludeSchema: z.ZodType<Prisma.LocationInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
  locationResponse: z.union([z.boolean(),z.lazy(() => LocationResponseArgsSchema)]).optional(),
}).strict()

export const LocationArgsSchema: z.ZodType<Prisma.LocationDefaultArgs> = z.object({
  select: z.lazy(() => LocationSelectSchema).optional(),
  include: z.lazy(() => LocationIncludeSchema).optional(),
}).strict();

export const LocationSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
  id: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
  locationResponse: z.union([z.boolean(),z.lazy(() => LocationResponseArgsSchema)]).optional(),
}).strict()

// DATASET
//------------------------------------------------------

export const DatasetIncludeSchema: z.ZodType<Prisma.DatasetInclude> = z.object({
  columns: z.union([z.boolean(),z.lazy(() => ColumnFindManyArgsSchema)]).optional(),
  rows: z.union([z.boolean(),z.lazy(() => RowFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DatasetCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DatasetArgsSchema: z.ZodType<Prisma.DatasetDefaultArgs> = z.object({
  select: z.lazy(() => DatasetSelectSchema).optional(),
  include: z.lazy(() => DatasetIncludeSchema).optional(),
}).strict();

export const DatasetCountOutputTypeArgsSchema: z.ZodType<Prisma.DatasetCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DatasetCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DatasetCountOutputTypeSelectSchema: z.ZodType<Prisma.DatasetCountOutputTypeSelect> = z.object({
  columns: z.boolean().optional(),
  rows: z.boolean().optional(),
}).strict();

export const DatasetSelectSchema: z.ZodType<Prisma.DatasetSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  columns: z.union([z.boolean(),z.lazy(() => ColumnFindManyArgsSchema)]).optional(),
  rows: z.union([z.boolean(),z.lazy(() => RowFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DatasetCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COLUMN
//------------------------------------------------------

export const ColumnIncludeSchema: z.ZodType<Prisma.ColumnInclude> = z.object({
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ColumnCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ColumnArgsSchema: z.ZodType<Prisma.ColumnDefaultArgs> = z.object({
  select: z.lazy(() => ColumnSelectSchema).optional(),
  include: z.lazy(() => ColumnIncludeSchema).optional(),
}).strict();

export const ColumnCountOutputTypeArgsSchema: z.ZodType<Prisma.ColumnCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ColumnCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ColumnCountOutputTypeSelectSchema: z.ZodType<Prisma.ColumnCountOutputTypeSelect> = z.object({
  cellValues: z.boolean().optional(),
}).strict();

export const ColumnSelectSchema: z.ZodType<Prisma.ColumnSelect> = z.object({
  id: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  name: z.boolean().optional(),
  dataType: z.boolean().optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ColumnCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROW
//------------------------------------------------------

export const RowIncludeSchema: z.ZodType<Prisma.RowInclude> = z.object({
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RowCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RowArgsSchema: z.ZodType<Prisma.RowDefaultArgs> = z.object({
  select: z.lazy(() => RowSelectSchema).optional(),
  include: z.lazy(() => RowIncludeSchema).optional(),
}).strict();

export const RowCountOutputTypeArgsSchema: z.ZodType<Prisma.RowCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RowCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RowCountOutputTypeSelectSchema: z.ZodType<Prisma.RowCountOutputTypeSelect> = z.object({
  cellValues: z.boolean().optional(),
}).strict();

export const RowSelectSchema: z.ZodType<Prisma.RowSelect> = z.object({
  id: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RowCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CELL VALUE
//------------------------------------------------------

export const CellValueIncludeSchema: z.ZodType<Prisma.CellValueInclude> = z.object({
  column: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

export const CellValueArgsSchema: z.ZodType<Prisma.CellValueDefaultArgs> = z.object({
  select: z.lazy(() => CellValueSelectSchema).optional(),
  include: z.lazy(() => CellValueIncludeSchema).optional(),
}).strict();

export const CellValueSelectSchema: z.ZodType<Prisma.CellValueSelect> = z.object({
  id: z.boolean().optional(),
  rowId: z.boolean().optional(),
  columnId: z.boolean().optional(),
  value: z.boolean().optional(),
  column: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipOrderByRelationAggregateInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string().email() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  members: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaces: z.lazy(() => WorkspaceListRelationFilterSchema).optional()
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  members: z.lazy(() => OrganizationMembershipOrderByRelationAggregateInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OrganizationWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    slug: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  members: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaces: z.lazy(() => WorkspaceListRelationFilterSchema).optional()
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationMembershipWhereInputSchema: z.ZodType<Prisma.OrganizationMembershipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationMembershipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const OrganizationMembershipWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationMembershipWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationMembershipOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationMembershipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationMembershipCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMembershipMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMembershipMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationMembershipScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationMembershipScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMembershipScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationMembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMembershipScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMembershipScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationMembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WorkspaceMembershipWhereInputSchema: z.ZodType<Prisma.WorkspaceMembershipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkspaceMembershipWhereInputSchema),z.lazy(() => WorkspaceMembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceMembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceMembershipWhereInputSchema),z.lazy(() => WorkspaceMembershipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWorkspaceMembershipRoleFilterSchema),z.lazy(() => WorkspaceMembershipRoleSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkspaceMembershipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional()
}).strict();

export const WorkspaceMembershipWhereUniqueInputSchema: z.ZodType<Prisma.WorkspaceMembershipWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => WorkspaceMembershipWhereInputSchema),z.lazy(() => WorkspaceMembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceMembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceMembershipWhereInputSchema),z.lazy(() => WorkspaceMembershipWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWorkspaceMembershipRoleFilterSchema),z.lazy(() => WorkspaceMembershipRoleSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict());

export const WorkspaceMembershipOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkspaceMembershipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkspaceMembershipCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkspaceMembershipMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkspaceMembershipMinOrderByAggregateInputSchema).optional()
}).strict();

export const WorkspaceMembershipScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkspaceMembershipScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceMembershipScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWorkspaceMembershipRoleWithAggregatesFilterSchema),z.lazy(() => WorkspaceMembershipRoleSchema) ]).optional(),
}).strict();

export const WorkspaceWhereInputSchema: z.ZodType<Prisma.WorkspaceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkspaceWhereInputSchema),z.lazy(() => WorkspaceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceWhereInputSchema),z.lazy(() => WorkspaceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  members: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  forms: z.lazy(() => FormListRelationFilterSchema).optional(),
  datasets: z.lazy(() => DatasetListRelationFilterSchema).optional()
}).strict();

export const WorkspaceOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkspaceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  members: z.lazy(() => WorkspaceMembershipOrderByRelationAggregateInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  forms: z.lazy(() => FormOrderByRelationAggregateInputSchema).optional(),
  datasets: z.lazy(() => DatasetOrderByRelationAggregateInputSchema).optional()
}).strict();

export const WorkspaceWhereUniqueInputSchema: z.ZodType<Prisma.WorkspaceWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    organizationId_slug: z.lazy(() => WorkspaceOrganizationIdSlugCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    organizationId_slug: z.lazy(() => WorkspaceOrganizationIdSlugCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  organizationId_slug: z.lazy(() => WorkspaceOrganizationIdSlugCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => WorkspaceWhereInputSchema),z.lazy(() => WorkspaceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceWhereInputSchema),z.lazy(() => WorkspaceWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  members: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  forms: z.lazy(() => FormListRelationFilterSchema).optional(),
  datasets: z.lazy(() => DatasetListRelationFilterSchema).optional()
}).strict());

export const WorkspaceOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkspaceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkspaceCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkspaceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkspaceMinOrderByAggregateInputSchema).optional()
}).strict();

export const WorkspaceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkspaceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WorkspaceScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkspaceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkspaceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FormWhereInputSchema: z.ZodType<Prisma.FormWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  draftFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  steps: z.lazy(() => StepListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionListRelationFilterSchema).optional(),
  draftForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  formVersions: z.lazy(() => FormListRelationFilterSchema).optional()
}).strict();

export const FormOrderByWithRelationInputSchema: z.ZodType<Prisma.FormOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  draftFormId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  version: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => StepOrderByRelationAggregateInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByRelationAggregateInputSchema).optional(),
  draftForm: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  formVersions: z.lazy(() => FormOrderByRelationAggregateInputSchema).optional()
}).strict();

export const FormWhereUniqueInputSchema: z.ZodType<Prisma.FormWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  draftFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  steps: z.lazy(() => StepListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionListRelationFilterSchema).optional(),
  draftForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  formVersions: z.lazy(() => FormListRelationFilterSchema).optional()
}).strict());

export const FormOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  draftFormId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  version: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FormCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FormAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FormMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FormMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FormSumOrderByAggregateInputSchema).optional()
}).strict();

export const FormScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FormScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FormScalarWhereWithAggregatesInputSchema),z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormScalarWhereWithAggregatesInputSchema),z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  draftFormId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const StepWhereInputSchema: z.ZodType<Prisma.StepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.lazy(() => JsonNullableFilterSchema).optional(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseListRelationFilterSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseListRelationFilterSchema).optional()
}).strict();

export const StepOrderByWithRelationInputSchema: z.ZodType<Prisma.StepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  contentViewType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseOrderByRelationAggregateInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const StepWhereUniqueInputSchema: z.ZodType<Prisma.StepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    locationId: z.number().int()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    locationId: z.number().int(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  locationId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.lazy(() => JsonNullableFilterSchema).optional(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseListRelationFilterSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseListRelationFilterSchema).optional()
}).strict());

export const StepOrderByWithAggregationInputSchema: z.ZodType<Prisma.StepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  contentViewType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => StepCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => StepAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => StepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => StepMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => StepSumOrderByAggregateInputSchema).optional()
}).strict();

export const StepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.StepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => StepScalarWhereWithAggregatesInputSchema),z.lazy(() => StepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepScalarWhereWithAggregatesInputSchema),z.lazy(() => StepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  description: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  zoom: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeWithAggregatesFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FormSubmissionWhereInputSchema: z.ZodType<Prisma.FormSubmissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  form: z.union([ z.lazy(() => FormRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseListRelationFilterSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseListRelationFilterSchema).optional()
}).strict();

export const FormSubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.FormSubmissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseOrderByRelationAggregateInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const FormSubmissionWhereUniqueInputSchema: z.ZodType<Prisma.FormSubmissionWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  form: z.union([ z.lazy(() => FormRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseListRelationFilterSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseListRelationFilterSchema).optional()
}).strict());

export const FormSubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormSubmissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FormSubmissionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FormSubmissionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FormSubmissionMinOrderByAggregateInputSchema).optional()
}).strict();

export const FormSubmissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FormSubmissionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FormSubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => FormSubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => FormSubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const InputResponseWhereInputSchema: z.ZodType<Prisma.InputResponseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InputResponseWhereInputSchema),z.lazy(() => InputResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InputResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InputResponseWhereInputSchema),z.lazy(() => InputResponseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict();

export const InputResponseOrderByWithRelationInputSchema: z.ZodType<Prisma.InputResponseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByWithRelationInputSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const InputResponseWhereUniqueInputSchema: z.ZodType<Prisma.InputResponseWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    blockNoteId_formSubmissionId: z.lazy(() => InputResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    blockNoteId_formSubmissionId: z.lazy(() => InputResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  blockNoteId_formSubmissionId: z.lazy(() => InputResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => InputResponseWhereInputSchema),z.lazy(() => InputResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InputResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InputResponseWhereInputSchema),z.lazy(() => InputResponseWhereInputSchema).array() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict());

export const InputResponseOrderByWithAggregationInputSchema: z.ZodType<Prisma.InputResponseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => InputResponseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InputResponseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InputResponseMinOrderByAggregateInputSchema).optional()
}).strict();

export const InputResponseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InputResponseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InputResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => InputResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InputResponseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InputResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => InputResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const LocationResponseWhereInputSchema: z.ZodType<Prisma.LocationResponseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationResponseWhereInputSchema),z.lazy(() => LocationResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationResponseWhereInputSchema),z.lazy(() => LocationResponseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict();

export const LocationResponseOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationResponseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByWithRelationInputSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const LocationResponseWhereUniqueInputSchema: z.ZodType<Prisma.LocationResponseWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    locationId: z.number().int(),
    blockNoteId_formSubmissionId: z.lazy(() => LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
    locationId: z.number().int(),
  }),
  z.object({
    id: z.string().uuid(),
    blockNoteId_formSubmissionId: z.lazy(() => LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    locationId: z.number().int(),
    blockNoteId_formSubmissionId: z.lazy(() => LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema),
  }),
  z.object({
    locationId: z.number().int(),
  }),
  z.object({
    blockNoteId_formSubmissionId: z.lazy(() => LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  locationId: z.number().int().optional(),
  blockNoteId_formSubmissionId: z.lazy(() => LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => LocationResponseWhereInputSchema),z.lazy(() => LocationResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationResponseWhereInputSchema),z.lazy(() => LocationResponseWhereInputSchema).array() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict());

export const LocationResponseOrderByWithAggregationInputSchema: z.ZodType<Prisma.LocationResponseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LocationResponseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LocationResponseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LocationResponseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LocationResponseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LocationResponseSumOrderByAggregateInputSchema).optional()
}).strict();

export const LocationResponseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LocationResponseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LocationResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationResponseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  locationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
  locationResponse: z.union([ z.lazy(() => LocationResponseNullableRelationFilterSchema),z.lazy(() => LocationResponseWhereInputSchema) ]).optional().nullable(),
}).strict();

export const LocationOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional(),
  locationResponse: z.lazy(() => LocationResponseOrderByWithRelationInputSchema).optional()
}).strict();

export const LocationWhereUniqueInputSchema: z.ZodType<Prisma.LocationWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
  locationResponse: z.union([ z.lazy(() => LocationResponseNullableRelationFilterSchema),z.lazy(() => LocationResponseWhereInputSchema) ]).optional().nullable(),
}).strict());

export const LocationOrderByWithAggregationInputSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LocationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LocationSumOrderByAggregateInputSchema).optional()
}).strict();

export const LocationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const DatasetWhereInputSchema: z.ZodType<Prisma.DatasetWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DatasetWhereInputSchema),z.lazy(() => DatasetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatasetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatasetWhereInputSchema),z.lazy(() => DatasetWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  columns: z.lazy(() => ColumnListRelationFilterSchema).optional(),
  rows: z.lazy(() => RowListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict();

export const DatasetOrderByWithRelationInputSchema: z.ZodType<Prisma.DatasetOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  columns: z.lazy(() => ColumnOrderByRelationAggregateInputSchema).optional(),
  rows: z.lazy(() => RowOrderByRelationAggregateInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional()
}).strict();

export const DatasetWhereUniqueInputSchema: z.ZodType<Prisma.DatasetWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => DatasetWhereInputSchema),z.lazy(() => DatasetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatasetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatasetWhereInputSchema),z.lazy(() => DatasetWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  columns: z.lazy(() => ColumnListRelationFilterSchema).optional(),
  rows: z.lazy(() => RowListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict());

export const DatasetOrderByWithAggregationInputSchema: z.ZodType<Prisma.DatasetOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DatasetCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DatasetMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DatasetMinOrderByAggregateInputSchema).optional()
}).strict();

export const DatasetScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DatasetScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DatasetScalarWhereWithAggregatesInputSchema),z.lazy(() => DatasetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatasetScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatasetScalarWhereWithAggregatesInputSchema),z.lazy(() => DatasetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ColumnWhereInputSchema: z.ZodType<Prisma.ColumnWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ColumnWhereInputSchema),z.lazy(() => ColumnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnWhereInputSchema),z.lazy(() => ColumnWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional()
}).strict();

export const ColumnOrderByWithRelationInputSchema: z.ZodType<Prisma.ColumnOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  dataset: z.lazy(() => DatasetOrderByWithRelationInputSchema).optional(),
  cellValues: z.lazy(() => CellValueOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ColumnWhereUniqueInputSchema: z.ZodType<Prisma.ColumnWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ColumnWhereInputSchema),z.lazy(() => ColumnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnWhereInputSchema),z.lazy(() => ColumnWhereInputSchema).array() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional()
}).strict());

export const ColumnOrderByWithAggregationInputSchema: z.ZodType<Prisma.ColumnOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ColumnCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ColumnAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ColumnMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ColumnMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ColumnSumOrderByAggregateInputSchema).optional()
}).strict();

export const ColumnScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ColumnScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema),z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema),z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeWithAggregatesFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
}).strict();

export const RowWhereInputSchema: z.ZodType<Prisma.RowWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional()
}).strict();

export const RowOrderByWithRelationInputSchema: z.ZodType<Prisma.RowOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  dataset: z.lazy(() => DatasetOrderByWithRelationInputSchema).optional(),
  cellValues: z.lazy(() => CellValueOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RowWhereUniqueInputSchema: z.ZodType<Prisma.RowWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional()
}).strict());

export const RowOrderByWithAggregationInputSchema: z.ZodType<Prisma.RowOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RowCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RowAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RowMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RowMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RowSumOrderByAggregateInputSchema).optional()
}).strict();

export const RowScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RowScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RowScalarWhereWithAggregatesInputSchema),z.lazy(() => RowScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowScalarWhereWithAggregatesInputSchema),z.lazy(() => RowScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CellValueWhereInputSchema: z.ZodType<Prisma.CellValueWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rowId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  columnId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  value: z.lazy(() => JsonFilterSchema).optional(),
  column: z.union([ z.lazy(() => ColumnRelationFilterSchema),z.lazy(() => ColumnWhereInputSchema) ]).optional(),
  row: z.union([ z.lazy(() => RowRelationFilterSchema),z.lazy(() => RowWhereInputSchema) ]).optional(),
}).strict();

export const CellValueOrderByWithRelationInputSchema: z.ZodType<Prisma.CellValueOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  column: z.lazy(() => ColumnOrderByWithRelationInputSchema).optional(),
  row: z.lazy(() => RowOrderByWithRelationInputSchema).optional()
}).strict();

export const CellValueWhereUniqueInputSchema: z.ZodType<Prisma.CellValueWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  rowId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  columnId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  value: z.lazy(() => JsonFilterSchema).optional(),
  column: z.union([ z.lazy(() => ColumnRelationFilterSchema),z.lazy(() => ColumnWhereInputSchema) ]).optional(),
  row: z.union([ z.lazy(() => RowRelationFilterSchema),z.lazy(() => RowWhereInputSchema) ]).optional(),
}).strict());

export const CellValueOrderByWithAggregationInputSchema: z.ZodType<Prisma.CellValueOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CellValueCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CellValueAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CellValueMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CellValueMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CellValueSumOrderByAggregateInputSchema).optional()
}).strict();

export const CellValueScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CellValueScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema),z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema),z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  rowId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  columnId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  value: z.lazy(() => JsonWithAggregatesFilterSchema).optional()
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateInput> = z.object({
  id: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMembershipsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateManyInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateInput> = z.object({
  id: z.string().uuid().optional(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkspaceMembershipsInputSchema),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const WorkspaceMembershipUncheckedCreateInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const WorkspaceMembershipUpdateInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkspaceMembershipsNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateManyInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const WorkspaceMembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceCreateInputSchema: z.ZodType<Prisma.WorkspaceCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUpdateInputSchema: z.ZodType<Prisma.WorkspaceUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceCreateManyInputSchema: z.ZodType<Prisma.WorkspaceCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WorkspaceUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkspaceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormCreateInputSchema: z.ZodType<Prisma.FormCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateInputSchema: z.ZodType<Prisma.FormUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUpdateInputSchema: z.ZodType<Prisma.FormUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateInputSchema: z.ZodType<Prisma.FormUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormCreateManyInputSchema: z.ZodType<Prisma.FormCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormUpdateManyMutationInputSchema: z.ZodType<Prisma.FormUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepCreateInputSchema: z.ZodType<Prisma.StepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutStepInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateInputSchema: z.ZodType<Prisma.StepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUpdateInputSchema: z.ZodType<Prisma.StepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateInputSchema: z.ZodType<Prisma.StepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateManyInputSchema: z.ZodType<Prisma.StepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const StepUpdateManyMutationInputSchema: z.ZodType<Prisma.StepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionCreateInputSchema: z.ZodType<Prisma.FormSubmissionCreateInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUpdateInputSchema: z.ZodType<Prisma.FormSubmissionUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionCreateManyInputSchema: z.ZodType<Prisma.FormSubmissionCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormSubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseCreateInputSchema: z.ZodType<Prisma.InputResponseCreateInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutInputResponsesInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutInputResponsesInputSchema)
}).strict();

export const InputResponseUncheckedCreateInputSchema: z.ZodType<Prisma.InputResponseUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmissionId: z.string(),
  stepId: z.string()
}).strict();

export const InputResponseUpdateInputSchema: z.ZodType<Prisma.InputResponseUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutInputResponsesNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutInputResponsesNestedInputSchema).optional()
}).strict();

export const InputResponseUncheckedUpdateInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseCreateManyInputSchema: z.ZodType<Prisma.InputResponseCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmissionId: z.string(),
  stepId: z.string()
}).strict();

export const InputResponseUpdateManyMutationInputSchema: z.ZodType<Prisma.InputResponseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseCreateInputSchema: z.ZodType<Prisma.LocationResponseCreateInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  location: z.lazy(() => LocationCreateNestedOneWithoutLocationResponseInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutLocationResponsesInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutLocationResponsesInputSchema)
}).strict();

export const LocationResponseUncheckedCreateInputSchema: z.ZodType<Prisma.LocationResponseUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  formSubmissionId: z.string(),
  stepId: z.string()
}).strict();

export const LocationResponseUpdateInputSchema: z.ZodType<Prisma.LocationResponseUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutLocationResponseNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutLocationResponsesNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutLocationResponsesNestedInputSchema).optional()
}).strict();

export const LocationResponseUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseCreateManyInputSchema: z.ZodType<Prisma.LocationResponseCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  formSubmissionId: z.string(),
  stepId: z.string()
}).strict();

export const LocationResponseUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationResponseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  step: z.lazy(() => StepUpdateOneWithoutLocationNestedInputSchema).optional(),
  locationResponse: z.lazy(() => LocationResponseUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUncheckedUpdateOneWithoutLocationNestedInputSchema).optional(),
  locationResponse: z.lazy(() => LocationResponseUncheckedUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = z.object({
}).strict();

export const LocationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DatasetCreateInputSchema: z.ZodType<Prisma.DatasetCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetUpdateInputSchema: z.ZodType<Prisma.DatasetUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional()
}).strict();

export const DatasetCreateManyInputSchema: z.ZodType<Prisma.DatasetCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  workspaceId: z.string()
}).strict();

export const DatasetUpdateManyMutationInputSchema: z.ZodType<Prisma.DatasetUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DatasetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnCreateInputSchema: z.ZodType<Prisma.ColumnCreateInput> = z.object({
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutColumnsInputSchema),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  datasetId: z.string(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutColumnInputSchema).optional()
}).strict();

export const ColumnUpdateInputSchema: z.ZodType<Prisma.ColumnUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema).optional()
}).strict();

export const ColumnCreateManyInputSchema: z.ZodType<Prisma.ColumnCreateManyInput> = z.object({
  id: z.number().int().optional(),
  datasetId: z.string(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema)
}).strict();

export const ColumnUpdateManyMutationInputSchema: z.ZodType<Prisma.ColumnUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RowCreateInputSchema: z.ZodType<Prisma.RowCreateInput> = z.object({
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutRowsInputSchema),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUncheckedCreateInputSchema: z.ZodType<Prisma.RowUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  datasetId: z.string(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUpdateInputSchema: z.ZodType<Prisma.RowUpdateInput> = z.object({
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutRowsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateInputSchema: z.ZodType<Prisma.RowUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowCreateManyInputSchema: z.ZodType<Prisma.RowCreateManyInput> = z.object({
  id: z.number().int().optional(),
  datasetId: z.string()
}).strict();

export const RowUpdateManyMutationInputSchema: z.ZodType<Prisma.RowUpdateManyMutationInput> = z.object({
}).strict();

export const RowUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RowUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueCreateInputSchema: z.ZodType<Prisma.CellValueCreateInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema)
}).strict();

export const CellValueUncheckedCreateInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  rowId: z.number().int(),
  columnId: z.number().int(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const CellValueUpdateInputSchema: z.ZodType<Prisma.CellValueUpdateInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CellValueCreateManyInputSchema: z.ZodType<Prisma.CellValueCreateManyInput> = z.object({
  id: z.number().int().optional(),
  rowId: z.number().int(),
  columnId: z.number().int(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const CellValueUpdateManyMutationInputSchema: z.ZodType<Prisma.CellValueUpdateManyMutationInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CellValueUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const OrganizationMembershipListRelationFilterSchema: z.ZodType<Prisma.OrganizationMembershipListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationMembershipWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationMembershipWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationMembershipWhereInputSchema).optional()
}).strict();

export const WorkspaceMembershipListRelationFilterSchema: z.ZodType<Prisma.WorkspaceMembershipListRelationFilter> = z.object({
  every: z.lazy(() => WorkspaceMembershipWhereInputSchema).optional(),
  some: z.lazy(() => WorkspaceMembershipWhereInputSchema).optional(),
  none: z.lazy(() => WorkspaceMembershipWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const OrganizationMembershipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMembershipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkspaceMembershipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const WorkspaceListRelationFilterSchema: z.ZodType<Prisma.WorkspaceListRelationFilter> = z.object({
  every: z.lazy(() => WorkspaceWhereInputSchema).optional(),
  some: z.lazy(() => WorkspaceWhereInputSchema).optional(),
  none: z.lazy(() => WorkspaceWhereInputSchema).optional()
}).strict();

export const WorkspaceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkspaceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const OrganizationRelationFilterSchema: z.ZodType<Prisma.OrganizationRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationMembershipCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMembershipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMembershipMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumWorkspaceMembershipRoleFilterSchema: z.ZodType<Prisma.EnumWorkspaceMembershipRoleFilter> = z.object({
  equals: z.lazy(() => WorkspaceMembershipRoleSchema).optional(),
  in: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  notIn: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => NestedEnumWorkspaceMembershipRoleFilterSchema) ]).optional(),
}).strict();

export const WorkspaceRelationFilterSchema: z.ZodType<Prisma.WorkspaceRelationFilter> = z.object({
  is: z.lazy(() => WorkspaceWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkspaceWhereInputSchema).optional()
}).strict();

export const WorkspaceMembershipCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMembershipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMembershipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMembershipMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMembershipMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMembershipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumWorkspaceMembershipRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumWorkspaceMembershipRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => WorkspaceMembershipRoleSchema).optional(),
  in: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  notIn: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => NestedEnumWorkspaceMembershipRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkspaceMembershipRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkspaceMembershipRoleFilterSchema).optional()
}).strict();

export const FormListRelationFilterSchema: z.ZodType<Prisma.FormListRelationFilter> = z.object({
  every: z.lazy(() => FormWhereInputSchema).optional(),
  some: z.lazy(() => FormWhereInputSchema).optional(),
  none: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const DatasetListRelationFilterSchema: z.ZodType<Prisma.DatasetListRelationFilter> = z.object({
  every: z.lazy(() => DatasetWhereInputSchema).optional(),
  some: z.lazy(() => DatasetWhereInputSchema).optional(),
  none: z.lazy(() => DatasetWhereInputSchema).optional()
}).strict();

export const FormOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FormOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DatasetOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DatasetOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceOrganizationIdSlugCompoundUniqueInputSchema: z.ZodType<Prisma.WorkspaceOrganizationIdSlugCompoundUniqueInput> = z.object({
  organizationId: z.string(),
  slug: z.string()
}).strict();

export const WorkspaceCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StepListRelationFilterSchema: z.ZodType<Prisma.StepListRelationFilter> = z.object({
  every: z.lazy(() => StepWhereInputSchema).optional(),
  some: z.lazy(() => StepWhereInputSchema).optional(),
  none: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const FormSubmissionListRelationFilterSchema: z.ZodType<Prisma.FormSubmissionListRelationFilter> = z.object({
  every: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  some: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  none: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const FormNullableRelationFilterSchema: z.ZodType<Prisma.FormNullableRelationFilter> = z.object({
  is: z.lazy(() => FormWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => FormWhereInputSchema).optional().nullable()
}).strict();

export const StepOrderByRelationAggregateInputSchema: z.ZodType<Prisma.StepOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FormSubmissionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormWorkspaceIdSlugVersionCompoundUniqueInputSchema: z.ZodType<Prisma.FormWorkspaceIdSlugVersionCompoundUniqueInput> = z.object({
  workspaceId: z.string(),
  slug: z.string(),
  version: z.number()
}).strict();

export const FormCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  draftFormId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FormAvgOrderByAggregateInput> = z.object({
  version: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  draftFormId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  draftFormId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSumOrderByAggregateInputSchema: z.ZodType<Prisma.FormSumOrderByAggregateInput> = z.object({
  version: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const EnumContentViewTypeFilterSchema: z.ZodType<Prisma.EnumContentViewTypeFilter> = z.object({
  equals: z.lazy(() => ContentViewTypeSchema).optional(),
  in: z.lazy(() => ContentViewTypeSchema).array().optional(),
  notIn: z.lazy(() => ContentViewTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => NestedEnumContentViewTypeFilterSchema) ]).optional(),
}).strict();

export const LocationRelationFilterSchema: z.ZodType<Prisma.LocationRelationFilter> = z.object({
  is: z.lazy(() => LocationWhereInputSchema).optional(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const InputResponseListRelationFilterSchema: z.ZodType<Prisma.InputResponseListRelationFilter> = z.object({
  every: z.lazy(() => InputResponseWhereInputSchema).optional(),
  some: z.lazy(() => InputResponseWhereInputSchema).optional(),
  none: z.lazy(() => InputResponseWhereInputSchema).optional()
}).strict();

export const LocationResponseListRelationFilterSchema: z.ZodType<Prisma.LocationResponseListRelationFilter> = z.object({
  every: z.lazy(() => LocationResponseWhereInputSchema).optional(),
  some: z.lazy(() => LocationResponseWhereInputSchema).optional(),
  none: z.lazy(() => LocationResponseWhereInputSchema).optional()
}).strict();

export const InputResponseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.InputResponseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationResponseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LocationResponseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepCountOrderByAggregateInputSchema: z.ZodType<Prisma.StepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  contentViewType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepAvgOrderByAggregateInputSchema: z.ZodType<Prisma.StepAvgOrderByAggregateInput> = z.object({
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  contentViewType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepMinOrderByAggregateInputSchema: z.ZodType<Prisma.StepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  contentViewType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepSumOrderByAggregateInputSchema: z.ZodType<Prisma.StepSumOrderByAggregateInput> = z.object({
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumContentViewTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumContentViewTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContentViewTypeSchema).optional(),
  in: z.lazy(() => ContentViewTypeSchema).array().optional(),
  notIn: z.lazy(() => ContentViewTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => NestedEnumContentViewTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContentViewTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContentViewTypeFilterSchema).optional()
}).strict();

export const FormRelationFilterSchema: z.ZodType<Prisma.FormRelationFilter> = z.object({
  is: z.lazy(() => FormWhereInputSchema).optional(),
  isNot: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormSubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionRelationFilterSchema: z.ZodType<Prisma.FormSubmissionRelationFilter> = z.object({
  is: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  isNot: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const StepRelationFilterSchema: z.ZodType<Prisma.StepRelationFilter> = z.object({
  is: z.lazy(() => StepWhereInputSchema).optional(),
  isNot: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const InputResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema: z.ZodType<Prisma.InputResponseBlockNoteIdFormSubmissionIdCompoundUniqueInput> = z.object({
  blockNoteId: z.string(),
  formSubmissionId: z.string()
}).strict();

export const InputResponseCountOrderByAggregateInputSchema: z.ZodType<Prisma.InputResponseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InputResponseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InputResponseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InputResponseMinOrderByAggregateInputSchema: z.ZodType<Prisma.InputResponseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInputSchema: z.ZodType<Prisma.LocationResponseBlockNoteIdFormSubmissionIdCompoundUniqueInput> = z.object({
  blockNoteId: z.string(),
  formSubmissionId: z.string()
}).strict();

export const LocationResponseCountOrderByAggregateInputSchema: z.ZodType<Prisma.LocationResponseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationResponseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LocationResponseAvgOrderByAggregateInput> = z.object({
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationResponseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LocationResponseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationResponseMinOrderByAggregateInputSchema: z.ZodType<Prisma.LocationResponseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationResponseSumOrderByAggregateInputSchema: z.ZodType<Prisma.LocationResponseSumOrderByAggregateInput> = z.object({
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepNullableRelationFilterSchema: z.ZodType<Prisma.StepNullableRelationFilter> = z.object({
  is: z.lazy(() => StepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => StepWhereInputSchema).optional().nullable()
}).strict();

export const LocationResponseNullableRelationFilterSchema: z.ZodType<Prisma.LocationResponseNullableRelationFilter> = z.object({
  is: z.lazy(() => LocationResponseWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LocationResponseWhereInputSchema).optional().nullable()
}).strict();

export const LocationCountOrderByAggregateInputSchema: z.ZodType<Prisma.LocationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LocationAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMinOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationSumOrderByAggregateInputSchema: z.ZodType<Prisma.LocationSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnListRelationFilterSchema: z.ZodType<Prisma.ColumnListRelationFilter> = z.object({
  every: z.lazy(() => ColumnWhereInputSchema).optional(),
  some: z.lazy(() => ColumnWhereInputSchema).optional(),
  none: z.lazy(() => ColumnWhereInputSchema).optional()
}).strict();

export const RowListRelationFilterSchema: z.ZodType<Prisma.RowListRelationFilter> = z.object({
  every: z.lazy(() => RowWhereInputSchema).optional(),
  some: z.lazy(() => RowWhereInputSchema).optional(),
  none: z.lazy(() => RowWhereInputSchema).optional()
}).strict();

export const ColumnOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ColumnOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RowOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DatasetCountOrderByAggregateInputSchema: z.ZodType<Prisma.DatasetCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DatasetMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DatasetMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DatasetMinOrderByAggregateInputSchema: z.ZodType<Prisma.DatasetMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumColumnTypeFilterSchema: z.ZodType<Prisma.EnumColumnTypeFilter> = z.object({
  equals: z.lazy(() => ColumnTypeSchema).optional(),
  in: z.lazy(() => ColumnTypeSchema).array().optional(),
  notIn: z.lazy(() => ColumnTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => NestedEnumColumnTypeFilterSchema) ]).optional(),
}).strict();

export const DatasetRelationFilterSchema: z.ZodType<Prisma.DatasetRelationFilter> = z.object({
  is: z.lazy(() => DatasetWhereInputSchema).optional(),
  isNot: z.lazy(() => DatasetWhereInputSchema).optional()
}).strict();

export const CellValueListRelationFilterSchema: z.ZodType<Prisma.CellValueListRelationFilter> = z.object({
  every: z.lazy(() => CellValueWhereInputSchema).optional(),
  some: z.lazy(() => CellValueWhereInputSchema).optional(),
  none: z.lazy(() => CellValueWhereInputSchema).optional()
}).strict();

export const CellValueOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CellValueOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnCountOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnMinOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnSumOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumColumnTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumColumnTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ColumnTypeSchema).optional(),
  in: z.lazy(() => ColumnTypeSchema).array().optional(),
  notIn: z.lazy(() => ColumnTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => NestedEnumColumnTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumColumnTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumColumnTypeFilterSchema).optional()
}).strict();

export const RowCountOrderByAggregateInputSchema: z.ZodType<Prisma.RowCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RowAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RowMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowMinOrderByAggregateInputSchema: z.ZodType<Prisma.RowMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowSumOrderByAggregateInputSchema: z.ZodType<Prisma.RowSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ColumnRelationFilterSchema: z.ZodType<Prisma.ColumnRelationFilter> = z.object({
  is: z.lazy(() => ColumnWhereInputSchema).optional(),
  isNot: z.lazy(() => ColumnWhereInputSchema).optional()
}).strict();

export const RowRelationFilterSchema: z.ZodType<Prisma.RowRelationFilter> = z.object({
  is: z.lazy(() => RowWhereInputSchema).optional(),
  isNot: z.lazy(() => RowWhereInputSchema).optional()
}).strict();

export const CellValueCountOrderByAggregateInputSchema: z.ZodType<Prisma.CellValueCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CellValueAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CellValueAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CellValueMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CellValueMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CellValueMinOrderByAggregateInputSchema: z.ZodType<Prisma.CellValueMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CellValueSumOrderByAggregateInputSchema: z.ZodType<Prisma.CellValueSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const OrganizationMembershipCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMembershipScalarWhereInputSchema),z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMembershipScalarWhereInputSchema),z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema).array(),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema).array(),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMembershipScalarWhereInputSchema),z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.WorkspaceUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema).array(),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkspaceUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkspaceUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkspaceScalarWhereInputSchema),z.lazy(() => WorkspaceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMembershipCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),z.lazy(() => OrganizationMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMembershipScalarWhereInputSchema),z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema).array(),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => WorkspaceCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkspaceUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkspaceWhereUniqueInputSchema),z.lazy(() => WorkspaceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkspaceUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkspaceScalarWhereInputSchema),z.lazy(() => WorkspaceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizationMembershipsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationMembershipsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizationMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUpdateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutWorkspaceMembershipsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkspaceMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const WorkspaceCreateNestedOneWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceCreateNestedOneWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional()
}).strict();

export const EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumWorkspaceMembershipRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => WorkspaceMembershipRoleSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutWorkspaceMembershipsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutWorkspaceMembershipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkspaceMembershipsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutWorkspaceMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUpdateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUpdateOneRequiredWithoutMembersNestedInputSchema: z.ZodType<Prisma.WorkspaceUpdateOneRequiredWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutMembersInputSchema).optional(),
  upsert: z.lazy(() => WorkspaceUpsertWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateToOneWithWhereWithoutMembersInputSchema),z.lazy(() => WorkspaceUpdateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutMembersInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateNestedManyWithoutWorkspaceInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyWorkspaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutWorkspacesInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutWorkspacesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutWorkspacesInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const FormCreateNestedManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormCreateNestedManyWithoutWorkspaceInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyWorkspaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DatasetCreateNestedManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetCreateNestedManyWithoutWorkspaceInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatasetCreateManyWorkspaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyWorkspaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedCreateNestedManyWithoutWorkspaceInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyWorkspaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DatasetUncheckedCreateNestedManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateNestedManyWithoutWorkspaceInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatasetCreateManyWorkspaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyWorkspaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutWorkspaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutWorkspacesNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutWorkspacesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutWorkspacesInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutWorkspacesInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUpdateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutWorkspacesInputSchema) ]).optional(),
}).strict();

export const FormUpdateManyWithoutWorkspaceNestedInputSchema: z.ZodType<Prisma.FormUpdateManyWithoutWorkspaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormUpsertWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => FormUpsertWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyWorkspaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormUpdateWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => FormUpdateWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormUpdateManyWithWhereWithoutWorkspaceInputSchema),z.lazy(() => FormUpdateManyWithWhereWithoutWorkspaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DatasetUpdateManyWithoutWorkspaceNestedInputSchema: z.ZodType<Prisma.DatasetUpdateManyWithoutWorkspaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DatasetUpsertWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => DatasetUpsertWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatasetCreateManyWorkspaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DatasetUpdateWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => DatasetUpdateWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DatasetUpdateManyWithWhereWithoutWorkspaceInputSchema),z.lazy(() => DatasetUpdateManyWithWhereWithoutWorkspaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DatasetScalarWhereInputSchema),z.lazy(() => DatasetScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUpsertWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkspaceMembershipCreateManyWorkspaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUpdateWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUpdateManyWithWhereWithoutWorkspaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutWorkspaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => FormCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormUpsertWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => FormUpsertWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyWorkspaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormUpdateWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => FormUpdateWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormUpdateManyWithWhereWithoutWorkspaceInputSchema),z.lazy(() => FormUpdateManyWithWhereWithoutWorkspaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateManyWithoutWorkspaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema).array(),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema),z.lazy(() => DatasetCreateOrConnectWithoutWorkspaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DatasetUpsertWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => DatasetUpsertWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatasetCreateManyWorkspaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DatasetWhereUniqueInputSchema),z.lazy(() => DatasetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DatasetUpdateWithWhereUniqueWithoutWorkspaceInputSchema),z.lazy(() => DatasetUpdateWithWhereUniqueWithoutWorkspaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DatasetUpdateManyWithWhereWithoutWorkspaceInputSchema),z.lazy(() => DatasetUpdateManyWithWhereWithoutWorkspaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DatasetScalarWhereInputSchema),z.lazy(() => DatasetScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormCreatestepOrderInputSchema: z.ZodType<Prisma.FormCreatestepOrderInput> = z.object({
  set: z.string().array()
}).strict();

export const StepCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.StepCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepCreateWithoutFormInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceCreateNestedOneWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateNestedOneWithoutFormsInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutFormsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional()
}).strict();

export const FormSubmissionCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutFormVersionsInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormVersionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormVersionsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const FormCreateNestedManyWithoutDraftFormInputSchema: z.ZodType<Prisma.FormCreateNestedManyWithoutDraftFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormCreateWithoutDraftFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyDraftFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StepUncheckedCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepCreateWithoutFormInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUncheckedCreateNestedManyWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateNestedManyWithoutDraftFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormCreateWithoutDraftFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyDraftFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const FormUpdatestepOrderInputSchema: z.ZodType<Prisma.FormUpdatestepOrderInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const StepUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.StepUpdateManyWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepCreateWithoutFormInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepUpsertWithWhereUniqueWithoutFormInputSchema),z.lazy(() => StepUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepUpdateWithWhereUniqueWithoutFormInputSchema),z.lazy(() => StepUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepUpdateManyWithWhereWithoutFormInputSchema),z.lazy(() => StepUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema: z.ZodType<Prisma.WorkspaceUpdateOneRequiredWithoutFormsNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutFormsInputSchema).optional(),
  upsert: z.lazy(() => WorkspaceUpsertWithoutFormsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateToOneWithWhereWithoutFormsInputSchema),z.lazy(() => WorkspaceUpdateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutFormsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutFormInputSchema),z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutFormInputSchema),z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutFormInputSchema),z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormUpdateOneWithoutFormVersionsNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutFormVersionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormVersionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormVersionsInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutFormVersionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutFormVersionsInputSchema),z.lazy(() => FormUpdateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormVersionsInputSchema) ]).optional(),
}).strict();

export const FormUpdateManyWithoutDraftFormNestedInputSchema: z.ZodType<Prisma.FormUpdateManyWithoutDraftFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormCreateWithoutDraftFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormUpsertWithWhereUniqueWithoutDraftFormInputSchema),z.lazy(() => FormUpsertWithWhereUniqueWithoutDraftFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyDraftFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormUpdateWithWhereUniqueWithoutDraftFormInputSchema),z.lazy(() => FormUpdateWithWhereUniqueWithoutDraftFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormUpdateManyWithWhereWithoutDraftFormInputSchema),z.lazy(() => FormUpdateManyWithWhereWithoutDraftFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const StepUncheckedUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepCreateWithoutFormInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepUpsertWithWhereUniqueWithoutFormInputSchema),z.lazy(() => StepUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepUpdateWithWhereUniqueWithoutFormInputSchema),z.lazy(() => StepUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepUpdateManyWithWhereWithoutFormInputSchema),z.lazy(() => StepUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutFormInputSchema),z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutFormInputSchema),z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutFormInputSchema),z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormUncheckedUpdateManyWithoutDraftFormNestedInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutDraftFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormCreateWithoutDraftFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormUpsertWithWhereUniqueWithoutDraftFormInputSchema),z.lazy(() => FormUpsertWithWhereUniqueWithoutDraftFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyDraftFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormUpdateWithWhereUniqueWithoutDraftFormInputSchema),z.lazy(() => FormUpdateWithWhereUniqueWithoutDraftFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormUpdateManyWithWhereWithoutDraftFormInputSchema),z.lazy(() => FormUpdateManyWithWhereWithoutDraftFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutStepsInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutStepsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const LocationCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutStepInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const InputResponseCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.InputResponseCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutStepInputSchema),z.lazy(() => InputResponseCreateWithoutStepInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutStepInputSchema),z.lazy(() => LocationResponseCreateWithoutStepInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InputResponseUncheckedCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUncheckedCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutStepInputSchema),z.lazy(() => InputResponseCreateWithoutStepInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseUncheckedCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUncheckedCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutStepInputSchema),z.lazy(() => LocationResponseCreateWithoutStepInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumContentViewTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumContentViewTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ContentViewTypeSchema).optional()
}).strict();

export const FormUpdateOneWithoutStepsNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutStepsInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutStepsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutStepsInputSchema),z.lazy(() => FormUpdateWithoutStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutStepsInputSchema) ]).optional(),
}).strict();

export const LocationUpdateOneRequiredWithoutStepNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneRequiredWithoutStepNestedInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => LocationUpdateWithoutStepInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const InputResponseUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.InputResponseUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutStepInputSchema),z.lazy(() => InputResponseCreateWithoutStepInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InputResponseUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => InputResponseUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InputResponseScalarWhereInputSchema),z.lazy(() => InputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.LocationResponseUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutStepInputSchema),z.lazy(() => LocationResponseCreateWithoutStepInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LocationResponseUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => LocationResponseUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LocationResponseScalarWhereInputSchema),z.lazy(() => LocationResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InputResponseUncheckedUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutStepInputSchema),z.lazy(() => InputResponseCreateWithoutStepInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InputResponseUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => InputResponseUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InputResponseScalarWhereInputSchema),z.lazy(() => InputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseUncheckedUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutStepInputSchema),z.lazy(() => LocationResponseCreateWithoutStepInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LocationResponseUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => LocationResponseUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LocationResponseScalarWhereInputSchema),z.lazy(() => LocationResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const InputResponseCreateNestedManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseCreateNestedManyWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseCreateNestedManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseCreateNestedManyWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUncheckedCreateNestedManyWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUncheckedCreateNestedManyWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.FormUpdateOneRequiredWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => FormUpdateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormSubmissionInputSchema) ]).optional(),
}).strict();

export const InputResponseUpdateManyWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.InputResponseUpdateManyWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InputResponseScalarWhereInputSchema),z.lazy(() => InputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseUpdateManyWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.LocationResponseUpdateManyWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LocationResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LocationResponseScalarWhereInputSchema),z.lazy(() => LocationResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InputResponseWhereUniqueInputSchema),z.lazy(() => InputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InputResponseScalarWhereInputSchema),z.lazy(() => InputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LocationResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateManyWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LocationResponseWhereUniqueInputSchema),z.lazy(() => LocationResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LocationResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LocationResponseScalarWhereInputSchema),z.lazy(() => LocationResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionCreateNestedOneWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionCreateNestedOneWithoutInputResponsesInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutInputResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutInputResponsesInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional()
}).strict();

export const StepCreateNestedOneWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutInputResponsesInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutInputResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutInputResponsesInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const FormSubmissionUpdateOneRequiredWithoutInputResponsesNestedInputSchema: z.ZodType<Prisma.FormSubmissionUpdateOneRequiredWithoutInputResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutInputResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutInputResponsesInputSchema).optional(),
  upsert: z.lazy(() => FormSubmissionUpsertWithoutInputResponsesInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateToOneWithWhereWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUpdateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutInputResponsesInputSchema) ]).optional(),
}).strict();

export const StepUpdateOneRequiredWithoutInputResponsesNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutInputResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutInputResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutInputResponsesInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutInputResponsesInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutInputResponsesInputSchema),z.lazy(() => StepUpdateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedUpdateWithoutInputResponsesInputSchema) ]).optional(),
}).strict();

export const LocationCreateNestedOneWithoutLocationResponseInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutLocationResponseInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const FormSubmissionCreateNestedOneWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionCreateNestedOneWithoutLocationResponsesInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutLocationResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutLocationResponsesInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional()
}).strict();

export const StepCreateNestedOneWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutLocationResponsesInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLocationResponsesInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const LocationUpdateOneRequiredWithoutLocationResponseNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneRequiredWithoutLocationResponseNestedInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutLocationResponseInputSchema),z.lazy(() => LocationUpdateWithoutLocationResponseInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutLocationResponseInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUpdateOneRequiredWithoutLocationResponsesNestedInputSchema: z.ZodType<Prisma.FormSubmissionUpdateOneRequiredWithoutLocationResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutLocationResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutLocationResponsesInputSchema).optional(),
  upsert: z.lazy(() => FormSubmissionUpsertWithoutLocationResponsesInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateToOneWithWhereWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUpdateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutLocationResponsesInputSchema) ]).optional(),
}).strict();

export const StepUpdateOneRequiredWithoutLocationResponsesNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutLocationResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLocationResponsesInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutLocationResponsesInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutLocationResponsesInputSchema),z.lazy(() => StepUpdateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationResponsesInputSchema) ]).optional(),
}).strict();

export const StepUpdateOneWithoutLocationNestedInputSchema: z.ZodType<Prisma.StepUpdateOneWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLocationInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLocationInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutLocationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutLocationInputSchema),z.lazy(() => StepUpdateWithoutLocationInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationInputSchema) ]).optional(),
}).strict();

export const LocationResponseUpdateOneWithoutLocationNestedInputSchema: z.ZodType<Prisma.LocationResponseUpdateOneWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutLocationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationResponseCreateOrConnectWithoutLocationInputSchema).optional(),
  upsert: z.lazy(() => LocationResponseUpsertWithoutLocationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LocationResponseWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LocationResponseWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LocationResponseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationResponseUpdateToOneWithWhereWithoutLocationInputSchema),z.lazy(() => LocationResponseUpdateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutLocationInputSchema) ]).optional(),
}).strict();

export const StepUncheckedUpdateOneWithoutLocationNestedInputSchema: z.ZodType<Prisma.StepUncheckedUpdateOneWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLocationInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLocationInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutLocationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutLocationInputSchema),z.lazy(() => StepUpdateWithoutLocationInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationInputSchema) ]).optional(),
}).strict();

export const LocationResponseUncheckedUpdateOneWithoutLocationNestedInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateOneWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutLocationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationResponseCreateOrConnectWithoutLocationInputSchema).optional(),
  upsert: z.lazy(() => LocationResponseUpsertWithoutLocationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LocationResponseWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LocationResponseWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LocationResponseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationResponseUpdateToOneWithWhereWithoutLocationInputSchema),z.lazy(() => LocationResponseUpdateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutLocationInputSchema) ]).optional(),
}).strict();

export const ColumnCreateNestedManyWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnCreateNestedManyWithoutDatasetInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutDatasetInputSchema),z.lazy(() => ColumnCreateWithoutDatasetInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyDatasetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RowCreateNestedManyWithoutDatasetInputSchema: z.ZodType<Prisma.RowCreateNestedManyWithoutDatasetInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutDatasetInputSchema),z.lazy(() => RowCreateWithoutDatasetInputSchema).array(),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RowCreateManyDatasetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceCreateNestedOneWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceCreateNestedOneWithoutDatasetsInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutDatasetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutDatasetsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateNestedManyWithoutDatasetInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutDatasetInputSchema),z.lazy(() => ColumnCreateWithoutDatasetInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyDatasetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RowUncheckedCreateNestedManyWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedCreateNestedManyWithoutDatasetInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutDatasetInputSchema),z.lazy(() => RowCreateWithoutDatasetInputSchema).array(),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RowCreateManyDatasetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ColumnUpdateManyWithoutDatasetNestedInputSchema: z.ZodType<Prisma.ColumnUpdateManyWithoutDatasetNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutDatasetInputSchema),z.lazy(() => ColumnCreateWithoutDatasetInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ColumnUpsertWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => ColumnUpsertWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyDatasetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ColumnUpdateWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => ColumnUpdateWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ColumnUpdateManyWithWhereWithoutDatasetInputSchema),z.lazy(() => ColumnUpdateManyWithWhereWithoutDatasetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RowUpdateManyWithoutDatasetNestedInputSchema: z.ZodType<Prisma.RowUpdateManyWithoutDatasetNestedInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutDatasetInputSchema),z.lazy(() => RowCreateWithoutDatasetInputSchema).array(),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RowUpsertWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => RowUpsertWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RowCreateManyDatasetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RowUpdateWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => RowUpdateWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RowUpdateManyWithWhereWithoutDatasetInputSchema),z.lazy(() => RowUpdateManyWithWhereWithoutDatasetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RowScalarWhereInputSchema),z.lazy(() => RowScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema: z.ZodType<Prisma.WorkspaceUpdateOneRequiredWithoutDatasetsNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutDatasetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutDatasetsInputSchema).optional(),
  upsert: z.lazy(() => WorkspaceUpsertWithoutDatasetsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateToOneWithWhereWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUpdateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutDatasetsInputSchema) ]).optional(),
}).strict();

export const ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyWithoutDatasetNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutDatasetInputSchema),z.lazy(() => ColumnCreateWithoutDatasetInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ColumnUpsertWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => ColumnUpsertWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyDatasetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ColumnUpdateWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => ColumnUpdateWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ColumnUpdateManyWithWhereWithoutDatasetInputSchema),z.lazy(() => ColumnUpdateManyWithWhereWithoutDatasetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RowUncheckedUpdateManyWithoutDatasetNestedInputSchema: z.ZodType<Prisma.RowUncheckedUpdateManyWithoutDatasetNestedInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutDatasetInputSchema),z.lazy(() => RowCreateWithoutDatasetInputSchema).array(),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema),z.lazy(() => RowCreateOrConnectWithoutDatasetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RowUpsertWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => RowUpsertWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RowCreateManyDatasetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RowWhereUniqueInputSchema),z.lazy(() => RowWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RowUpdateWithWhereUniqueWithoutDatasetInputSchema),z.lazy(() => RowUpdateWithWhereUniqueWithoutDatasetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RowUpdateManyWithWhereWithoutDatasetInputSchema),z.lazy(() => RowUpdateManyWithWhereWithoutDatasetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RowScalarWhereInputSchema),z.lazy(() => RowScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DatasetCreateNestedOneWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetCreateNestedOneWithoutColumnsInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutColumnsInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional()
}).strict();

export const CellValueCreateNestedManyWithoutColumnInputSchema: z.ZodType<Prisma.CellValueCreateNestedManyWithoutColumnInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueCreateWithoutColumnInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CellValueUncheckedCreateNestedManyWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateNestedManyWithoutColumnInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueCreateWithoutColumnInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumColumnTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumColumnTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ColumnTypeSchema).optional()
}).strict();

export const DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema: z.ZodType<Prisma.DatasetUpdateOneRequiredWithoutColumnsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutColumnsInputSchema).optional(),
  upsert: z.lazy(() => DatasetUpsertWithoutColumnsInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DatasetUpdateToOneWithWhereWithoutColumnsInputSchema),z.lazy(() => DatasetUpdateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutColumnsInputSchema) ]).optional(),
}).strict();

export const CellValueUpdateManyWithoutColumnNestedInputSchema: z.ZodType<Prisma.CellValueUpdateManyWithoutColumnNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueCreateWithoutColumnInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CellValueUpsertWithWhereUniqueWithoutColumnInputSchema),z.lazy(() => CellValueUpsertWithWhereUniqueWithoutColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyColumnInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateWithWhereUniqueWithoutColumnInputSchema),z.lazy(() => CellValueUpdateWithWhereUniqueWithoutColumnInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CellValueUpdateManyWithWhereWithoutColumnInputSchema),z.lazy(() => CellValueUpdateManyWithWhereWithoutColumnInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CellValueScalarWhereInputSchema),z.lazy(() => CellValueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyWithoutColumnNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueCreateWithoutColumnInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CellValueUpsertWithWhereUniqueWithoutColumnInputSchema),z.lazy(() => CellValueUpsertWithWhereUniqueWithoutColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyColumnInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateWithWhereUniqueWithoutColumnInputSchema),z.lazy(() => CellValueUpdateWithWhereUniqueWithoutColumnInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CellValueUpdateManyWithWhereWithoutColumnInputSchema),z.lazy(() => CellValueUpdateManyWithWhereWithoutColumnInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CellValueScalarWhereInputSchema),z.lazy(() => CellValueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DatasetCreateNestedOneWithoutRowsInputSchema: z.ZodType<Prisma.DatasetCreateNestedOneWithoutRowsInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutRowsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutRowsInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional()
}).strict();

export const CellValueCreateNestedManyWithoutRowInputSchema: z.ZodType<Prisma.CellValueCreateNestedManyWithoutRowInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueCreateWithoutRowInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyRowInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CellValueUncheckedCreateNestedManyWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateNestedManyWithoutRowInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueCreateWithoutRowInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyRowInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DatasetUpdateOneRequiredWithoutRowsNestedInputSchema: z.ZodType<Prisma.DatasetUpdateOneRequiredWithoutRowsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutRowsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutRowsInputSchema).optional(),
  upsert: z.lazy(() => DatasetUpsertWithoutRowsInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DatasetUpdateToOneWithWhereWithoutRowsInputSchema),z.lazy(() => DatasetUpdateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutRowsInputSchema) ]).optional(),
}).strict();

export const CellValueUpdateManyWithoutRowNestedInputSchema: z.ZodType<Prisma.CellValueUpdateManyWithoutRowNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueCreateWithoutRowInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CellValueUpsertWithWhereUniqueWithoutRowInputSchema),z.lazy(() => CellValueUpsertWithWhereUniqueWithoutRowInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyRowInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateWithWhereUniqueWithoutRowInputSchema),z.lazy(() => CellValueUpdateWithWhereUniqueWithoutRowInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CellValueUpdateManyWithWhereWithoutRowInputSchema),z.lazy(() => CellValueUpdateManyWithWhereWithoutRowInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CellValueScalarWhereInputSchema),z.lazy(() => CellValueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CellValueUncheckedUpdateManyWithoutRowNestedInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyWithoutRowNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueCreateWithoutRowInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CellValueUpsertWithWhereUniqueWithoutRowInputSchema),z.lazy(() => CellValueUpsertWithWhereUniqueWithoutRowInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyRowInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateWithWhereUniqueWithoutRowInputSchema),z.lazy(() => CellValueUpdateWithWhereUniqueWithoutRowInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CellValueUpdateManyWithWhereWithoutRowInputSchema),z.lazy(() => CellValueUpdateManyWithWhereWithoutRowInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CellValueScalarWhereInputSchema),z.lazy(() => CellValueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ColumnCreateNestedOneWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnCreateNestedOneWithoutCellValuesInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutCellValuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ColumnCreateOrConnectWithoutCellValuesInputSchema).optional(),
  connect: z.lazy(() => ColumnWhereUniqueInputSchema).optional()
}).strict();

export const RowCreateNestedOneWithoutCellValuesInputSchema: z.ZodType<Prisma.RowCreateNestedOneWithoutCellValuesInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedCreateWithoutCellValuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RowCreateOrConnectWithoutCellValuesInputSchema).optional(),
  connect: z.lazy(() => RowWhereUniqueInputSchema).optional()
}).strict();

export const ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema: z.ZodType<Prisma.ColumnUpdateOneRequiredWithoutCellValuesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutCellValuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ColumnCreateOrConnectWithoutCellValuesInputSchema).optional(),
  upsert: z.lazy(() => ColumnUpsertWithoutCellValuesInputSchema).optional(),
  connect: z.lazy(() => ColumnWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ColumnUpdateToOneWithWhereWithoutCellValuesInputSchema),z.lazy(() => ColumnUpdateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutCellValuesInputSchema) ]).optional(),
}).strict();

export const RowUpdateOneRequiredWithoutCellValuesNestedInputSchema: z.ZodType<Prisma.RowUpdateOneRequiredWithoutCellValuesNestedInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedCreateWithoutCellValuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RowCreateOrConnectWithoutCellValuesInputSchema).optional(),
  upsert: z.lazy(() => RowUpsertWithoutCellValuesInputSchema).optional(),
  connect: z.lazy(() => RowWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RowUpdateToOneWithWhereWithoutCellValuesInputSchema),z.lazy(() => RowUpdateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedUpdateWithoutCellValuesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumWorkspaceMembershipRoleFilterSchema: z.ZodType<Prisma.NestedEnumWorkspaceMembershipRoleFilter> = z.object({
  equals: z.lazy(() => WorkspaceMembershipRoleSchema).optional(),
  in: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  notIn: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => NestedEnumWorkspaceMembershipRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumWorkspaceMembershipRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumWorkspaceMembershipRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => WorkspaceMembershipRoleSchema).optional(),
  in: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  notIn: z.lazy(() => WorkspaceMembershipRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => NestedEnumWorkspaceMembershipRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkspaceMembershipRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkspaceMembershipRoleFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumContentViewTypeFilterSchema: z.ZodType<Prisma.NestedEnumContentViewTypeFilter> = z.object({
  equals: z.lazy(() => ContentViewTypeSchema).optional(),
  in: z.lazy(() => ContentViewTypeSchema).array().optional(),
  notIn: z.lazy(() => ContentViewTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => NestedEnumContentViewTypeFilterSchema) ]).optional(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumContentViewTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumContentViewTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContentViewTypeSchema).optional(),
  in: z.lazy(() => ContentViewTypeSchema).array().optional(),
  notIn: z.lazy(() => ContentViewTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => NestedEnumContentViewTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContentViewTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContentViewTypeFilterSchema).optional()
}).strict();

export const NestedEnumColumnTypeFilterSchema: z.ZodType<Prisma.NestedEnumColumnTypeFilter> = z.object({
  equals: z.lazy(() => ColumnTypeSchema).optional(),
  in: z.lazy(() => ColumnTypeSchema).array().optional(),
  notIn: z.lazy(() => ColumnTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => NestedEnumColumnTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumColumnTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumColumnTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ColumnTypeSchema).optional(),
  in: z.lazy(() => ColumnTypeSchema).array().optional(),
  notIn: z.lazy(() => ColumnTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => NestedEnumColumnTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumColumnTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumColumnTypeFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const OrganizationMembershipCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateWithoutUserInput> = z.object({
  id: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMembershipCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationMembershipCreateManyUserInputSchema),z.lazy(() => OrganizationMembershipCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WorkspaceMembershipCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const WorkspaceMembershipUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const WorkspaceMembershipCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const WorkspaceMembershipCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WorkspaceMembershipCreateManyUserInputSchema),z.lazy(() => WorkspaceMembershipCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationMembershipUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationMembershipUpdateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMembershipUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationMembershipUpdateWithoutUserInputSchema),z.lazy(() => OrganizationMembershipUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMembershipUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationMembershipUpdateManyMutationInputSchema),z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMembershipScalarWhereInputSchema: z.ZodType<Prisma.OrganizationMembershipScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMembershipScalarWhereInputSchema),z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMembershipScalarWhereInputSchema),z.lazy(() => OrganizationMembershipScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WorkspaceMembershipUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const WorkspaceMembershipUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithoutUserInputSchema),z.lazy(() => WorkspaceMembershipUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const WorkspaceMembershipUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkspaceMembershipUpdateManyMutationInputSchema),z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const WorkspaceMembershipScalarWhereInputSchema: z.ZodType<Prisma.WorkspaceMembershipScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),z.lazy(() => WorkspaceMembershipScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWorkspaceMembershipRoleFilterSchema),z.lazy(() => WorkspaceMembershipRoleSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateWithoutOrganizationInput> = z.object({
  id: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMembershipsInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMembershipCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationMembershipCreateManyOrganizationInputSchema),z.lazy(() => OrganizationMembershipCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WorkspaceCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutOrganizationInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const WorkspaceCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.WorkspaceCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WorkspaceCreateManyOrganizationInputSchema),z.lazy(() => WorkspaceCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationMembershipUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationMembershipUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationMembershipCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMembershipUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationMembershipUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMembershipUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMembershipUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationMembershipUpdateManyMutationInputSchema),z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const WorkspaceUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkspaceUpdateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const WorkspaceUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkspaceUpdateWithoutOrganizationInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const WorkspaceUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => WorkspaceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkspaceUpdateManyMutationInputSchema),z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const WorkspaceScalarWhereInputSchema: z.ZodType<Prisma.WorkspaceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkspaceScalarWhereInputSchema),z.lazy(() => WorkspaceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkspaceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkspaceScalarWhereInputSchema),z.lazy(() => WorkspaceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationMembershipsInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMembershipsInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutMembersInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workspaces: z.lazy(() => WorkspaceCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const UserUpsertWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizationMembershipsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMembershipsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizationMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutMembersInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspaces: z.lazy(() => WorkspaceUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWorkspaceMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema) ]),
}).strict();

export const WorkspaceCreateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutMembersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceCreateOrConnectWithoutMembersInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const UserUpsertWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUpsertWithoutWorkspaceMembershipsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutWorkspaceMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema) ]),
}).strict();

export const UserUpdateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUpdateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const WorkspaceUpsertWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUpsertWithoutMembersInput> = z.object({
  update: z.union([ z.lazy(() => WorkspaceUpdateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutMembersInputSchema) ]),
  where: z.lazy(() => WorkspaceWhereInputSchema).optional()
}).strict();

export const WorkspaceUpdateToOneWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUpdateToOneWithWhereWithoutMembersInput> = z.object({
  where: z.lazy(() => WorkspaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkspaceUpdateWithoutMembersInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutMembersInputSchema) ]),
}).strict();

export const WorkspaceUpdateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkspaceMembershipsInputSchema)
}).strict();

export const WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const WorkspaceMembershipCreateOrConnectWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateOrConnectWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const WorkspaceMembershipCreateManyWorkspaceInputEnvelopeSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyWorkspaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WorkspaceMembershipCreateManyWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipCreateManyWorkspaceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutWorkspacesInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutWorkspacesInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutWorkspacesInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutWorkspacesInputSchema) ]),
}).strict();

export const FormCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const FormCreateManyWorkspaceInputEnvelopeSchema: z.ZodType<Prisma.FormCreateManyWorkspaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormCreateManyWorkspaceInputSchema),z.lazy(() => FormCreateManyWorkspaceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DatasetCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetCreateOrConnectWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetCreateOrConnectWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const DatasetCreateManyWorkspaceInputEnvelopeSchema: z.ZodType<Prisma.DatasetCreateManyWorkspaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DatasetCreateManyWorkspaceInputSchema),z.lazy(() => DatasetCreateManyWorkspaceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WorkspaceMembershipUpsertWithWhereUniqueWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpsertWithWhereUniqueWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedUpdateWithoutWorkspaceInputSchema) ]),
  create: z.union([ z.lazy(() => WorkspaceMembershipCreateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const WorkspaceMembershipUpdateWithWhereUniqueWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateWithWhereUniqueWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkspaceMembershipUpdateWithoutWorkspaceInputSchema),z.lazy(() => WorkspaceMembershipUncheckedUpdateWithoutWorkspaceInputSchema) ]),
}).strict();

export const WorkspaceMembershipUpdateManyWithWhereWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyWithWhereWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => WorkspaceMembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkspaceMembershipUpdateManyMutationInputSchema),z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutWorkspacesInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutWorkspacesInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutWorkspacesInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutWorkspacesInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutWorkspacesInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutWorkspacesInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutWorkspacesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutWorkspacesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const FormUpsertWithWhereUniqueWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUpsertWithWhereUniqueWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FormUpdateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedUpdateWithoutWorkspaceInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const FormUpdateWithWhereUniqueWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUpdateWithWhereUniqueWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FormUpdateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedUpdateWithoutWorkspaceInputSchema) ]),
}).strict();

export const FormUpdateManyWithWhereWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUpdateManyWithWhereWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => FormScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FormUpdateManyMutationInputSchema),z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceInputSchema) ]),
}).strict();

export const FormScalarWhereInputSchema: z.ZodType<Prisma.FormScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  draftFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DatasetUpsertWithWhereUniqueWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUpsertWithWhereUniqueWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DatasetUpdateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutWorkspaceInputSchema) ]),
  create: z.union([ z.lazy(() => DatasetCreateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const DatasetUpdateWithWhereUniqueWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUpdateWithWhereUniqueWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DatasetUpdateWithoutWorkspaceInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutWorkspaceInputSchema) ]),
}).strict();

export const DatasetUpdateManyWithWhereWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUpdateManyWithWhereWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => DatasetScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DatasetUpdateManyMutationInputSchema),z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceInputSchema) ]),
}).strict();

export const DatasetScalarWhereInputSchema: z.ZodType<Prisma.DatasetScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DatasetScalarWhereInputSchema),z.lazy(() => DatasetScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatasetScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatasetScalarWhereInputSchema),z.lazy(() => DatasetScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const StepCreateWithoutFormInputSchema: z.ZodType<Prisma.StepCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutStepInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutFormInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const StepCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.StepCreateManyFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => StepCreateManyFormInputSchema),z.lazy(() => StepCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WorkspaceCreateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutFormsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutFormsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceCreateOrConnectWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateOrConnectWithoutFormsInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]),
}).strict();

export const FormSubmissionCreateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const FormSubmissionCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.FormSubmissionCreateManyFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormSubmissionCreateManyFormInputSchema),z.lazy(() => FormSubmissionCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FormCreateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormCreateWithoutFormVersionsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutFormVersionsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutFormVersionsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormVersionsInputSchema) ]),
}).strict();

export const FormCreateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormCreateWithoutDraftFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutDraftFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutDraftFormInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutDraftFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema) ]),
}).strict();

export const FormCreateManyDraftFormInputEnvelopeSchema: z.ZodType<Prisma.FormCreateManyDraftFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormCreateManyDraftFormInputSchema),z.lazy(() => FormCreateManyDraftFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const StepUpsertWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.StepUpsertWithWhereUniqueWithoutFormInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => StepUpdateWithoutFormInputSchema),z.lazy(() => StepUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const StepUpdateWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.StepUpdateWithWhereUniqueWithoutFormInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => StepUpdateWithoutFormInputSchema),z.lazy(() => StepUncheckedUpdateWithoutFormInputSchema) ]),
}).strict();

export const StepUpdateManyWithWhereWithoutFormInputSchema: z.ZodType<Prisma.StepUpdateManyWithWhereWithoutFormInput> = z.object({
  where: z.lazy(() => StepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => StepUpdateManyMutationInputSchema),z.lazy(() => StepUncheckedUpdateManyWithoutFormInputSchema) ]),
}).strict();

export const StepScalarWhereInputSchema: z.ZodType<Prisma.StepScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.lazy(() => JsonNullableFilterSchema).optional(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WorkspaceUpsertWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUpsertWithoutFormsInput> = z.object({
  update: z.union([ z.lazy(() => WorkspaceUpdateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutFormsInputSchema) ]),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]),
  where: z.lazy(() => WorkspaceWhereInputSchema).optional()
}).strict();

export const WorkspaceUpdateToOneWithWhereWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUpdateToOneWithWhereWithoutFormsInput> = z.object({
  where: z.lazy(() => WorkspaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkspaceUpdateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutFormsInputSchema) ]),
}).strict();

export const WorkspaceUpdateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithoutFormsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutFormsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const FormSubmissionUpsertWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUpsertWithWhereUniqueWithoutFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const FormSubmissionUpdateWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithWhereUniqueWithoutFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FormSubmissionUpdateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutFormInputSchema) ]),
}).strict();

export const FormSubmissionUpdateManyWithWhereWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyWithWhereWithoutFormInput> = z.object({
  where: z.lazy(() => FormSubmissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FormSubmissionUpdateManyMutationInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormInputSchema) ]),
}).strict();

export const FormSubmissionScalarWhereInputSchema: z.ZodType<Prisma.FormSubmissionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FormUpsertWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUpsertWithoutFormVersionsInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormVersionsInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormVersionsInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutFormVersionsInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormVersionsInputSchema) ]),
}).strict();

export const FormUpdateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUpdateWithoutFormVersionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutFormVersionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUpsertWithWhereUniqueWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpsertWithWhereUniqueWithoutDraftFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FormUpdateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema) ]),
}).strict();

export const FormUpdateWithWhereUniqueWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpdateWithWhereUniqueWithoutDraftFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FormUpdateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftFormInputSchema) ]),
}).strict();

export const FormUpdateManyWithWhereWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpdateManyWithWhereWithoutDraftFormInput> = z.object({
  where: z.lazy(() => FormScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FormUpdateManyMutationInputSchema),z.lazy(() => FormUncheckedUpdateManyWithoutDraftFormInputSchema) ]),
}).strict();

export const FormCreateWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateWithoutStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutStepsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutStepsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]),
}).strict();

export const InputResponseCreateWithoutStepInputSchema: z.ZodType<Prisma.InputResponseCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutInputResponsesInputSchema)
}).strict();

export const InputResponseUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmissionId: z.string()
}).strict();

export const InputResponseCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.InputResponseCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => InputResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InputResponseCreateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const InputResponseCreateManyStepInputEnvelopeSchema: z.ZodType<Prisma.InputResponseCreateManyStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InputResponseCreateManyStepInputSchema),z.lazy(() => InputResponseCreateManyStepInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const LocationResponseCreateWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  location: z.lazy(() => LocationCreateNestedOneWithoutLocationResponseInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutLocationResponsesInputSchema)
}).strict();

export const LocationResponseUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  formSubmissionId: z.string()
}).strict();

export const LocationResponseCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const LocationResponseCreateManyStepInputEnvelopeSchema: z.ZodType<Prisma.LocationResponseCreateManyStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LocationResponseCreateManyStepInputSchema),z.lazy(() => LocationResponseCreateManyStepInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FormUpsertWithoutStepsInputSchema: z.ZodType<Prisma.FormUpsertWithoutStepsInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutStepsInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutStepsInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutStepsInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutStepsInputSchema) ]),
}).strict();

export const FormUpdateWithoutStepsInputSchema: z.ZodType<Prisma.FormUpdateWithoutStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutStepsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const LocationUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutStepInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const LocationUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationUpdateWithoutStepInput> = z.object({
  locationResponse: z.lazy(() => LocationResponseUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationResponse: z.lazy(() => LocationResponseUncheckedUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const InputResponseUpsertWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUpsertWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => InputResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InputResponseUpdateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => InputResponseCreateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const InputResponseUpdateWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUpdateWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => InputResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InputResponseUpdateWithoutStepInputSchema),z.lazy(() => InputResponseUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const InputResponseUpdateManyWithWhereWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUpdateManyWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => InputResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InputResponseUpdateManyMutationInputSchema),z.lazy(() => InputResponseUncheckedUpdateManyWithoutStepInputSchema) ]),
}).strict();

export const InputResponseScalarWhereInputSchema: z.ZodType<Prisma.InputResponseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InputResponseScalarWhereInputSchema),z.lazy(() => InputResponseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InputResponseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InputResponseScalarWhereInputSchema),z.lazy(() => InputResponseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const LocationResponseUpsertWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUpsertWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LocationResponseUpdateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const LocationResponseUpdateWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUpdateWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LocationResponseUpdateWithoutStepInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const LocationResponseUpdateManyWithWhereWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUpdateManyWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => LocationResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LocationResponseUpdateManyMutationInputSchema),z.lazy(() => LocationResponseUncheckedUpdateManyWithoutStepInputSchema) ]),
}).strict();

export const LocationResponseScalarWhereInputSchema: z.ZodType<Prisma.LocationResponseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationResponseScalarWhereInputSchema),z.lazy(() => LocationResponseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationResponseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationResponseScalarWhereInputSchema),z.lazy(() => LocationResponseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const FormCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutDraftFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const InputResponseCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  step: z.lazy(() => StepCreateNestedOneWithoutInputResponsesInputSchema)
}).strict();

export const InputResponseUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  stepId: z.string()
}).strict();

export const InputResponseCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => InputResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const InputResponseCreateManyFormSubmissionInputEnvelopeSchema: z.ZodType<Prisma.InputResponseCreateManyFormSubmissionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InputResponseCreateManyFormSubmissionInputSchema),z.lazy(() => InputResponseCreateManyFormSubmissionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const LocationResponseCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  location: z.lazy(() => LocationCreateNestedOneWithoutLocationResponseInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutLocationResponsesInputSchema)
}).strict();

export const LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  stepId: z.string()
}).strict();

export const LocationResponseCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const LocationResponseCreateManyFormSubmissionInputEnvelopeSchema: z.ZodType<Prisma.LocationResponseCreateManyFormSubmissionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LocationResponseCreateManyFormSubmissionInputSchema),z.lazy(() => LocationResponseCreateManyFormSubmissionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FormUpsertWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUpsertWithoutFormSubmissionInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const FormUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const InputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUpsertWithWhereUniqueWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => InputResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InputResponseUpdateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => InputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const InputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUpdateWithWhereUniqueWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => InputResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InputResponseUpdateWithoutFormSubmissionInputSchema),z.lazy(() => InputResponseUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const InputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUpdateManyWithWhereWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => InputResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InputResponseUpdateManyMutationInputSchema),z.lazy(() => InputResponseUncheckedUpdateManyWithoutFormSubmissionInputSchema) ]),
}).strict();

export const LocationResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUpsertWithWhereUniqueWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LocationResponseUpdateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const LocationResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUpdateWithWhereUniqueWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LocationResponseUpdateWithoutFormSubmissionInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const LocationResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUpdateManyWithWhereWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => LocationResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LocationResponseUpdateManyMutationInputSchema),z.lazy(() => LocationResponseUncheckedUpdateManyWithoutFormSubmissionInputSchema) ]),
}).strict();

export const FormSubmissionCreateWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutInputResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedCreateWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutInputResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionCreateOrConnectWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutInputResponsesInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutInputResponsesInputSchema) ]),
}).strict();

export const StepCreateWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepCreateWithoutInputResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutInputResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutInputResponsesInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutInputResponsesInputSchema) ]),
}).strict();

export const FormSubmissionUpsertWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUpsertWithoutInputResponsesInput> = z.object({
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutInputResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutInputResponsesInputSchema) ]),
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const FormSubmissionUpdateToOneWithWhereWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUpdateToOneWithWhereWithoutInputResponsesInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormSubmissionUpdateWithoutInputResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutInputResponsesInputSchema) ]),
}).strict();

export const FormSubmissionUpdateWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutInputResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutInputResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutInputResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const StepUpsertWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepUpsertWithoutInputResponsesInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedUpdateWithoutInputResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutInputResponsesInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutInputResponsesInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutInputResponsesInputSchema),z.lazy(() => StepUncheckedUpdateWithoutInputResponsesInputSchema) ]),
}).strict();

export const StepUpdateWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepUpdateWithoutInputResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutInputResponsesInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutInputResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const FormSubmissionCreateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutLocationResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedCreateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutLocationResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionCreateOrConnectWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutLocationResponsesInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutLocationResponsesInputSchema) ]),
}).strict();

export const StepCreateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepCreateWithoutLocationResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutLocationResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutLocationResponsesInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationResponsesInputSchema) ]),
}).strict();

export const LocationUpdateToOneWithWhereWithoutLocationResponseInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutLocationResponseInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutLocationResponseInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutLocationResponseInputSchema) ]),
}).strict();

export const LocationUpdateWithoutLocationResponseInputSchema: z.ZodType<Prisma.LocationUpdateWithoutLocationResponseInput> = z.object({
  step: z.lazy(() => StepUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateWithoutLocationResponseInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutLocationResponseInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUncheckedUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const FormSubmissionUpsertWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUpsertWithoutLocationResponsesInput> = z.object({
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutLocationResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutLocationResponsesInputSchema) ]),
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const FormSubmissionUpdateToOneWithWhereWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUpdateToOneWithWhereWithoutLocationResponsesInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormSubmissionUpdateWithoutLocationResponsesInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutLocationResponsesInputSchema) ]),
}).strict();

export const FormSubmissionUpdateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutLocationResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutLocationResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const StepUpsertWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepUpsertWithoutLocationResponsesInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationResponsesInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutLocationResponsesInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutLocationResponsesInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationResponsesInputSchema) ]),
}).strict();

export const StepUpdateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepUpdateWithoutLocationResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutLocationResponsesInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutLocationResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseCreateNestedManyWithoutStepInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutLocationInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutLocationInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutLocationInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const StepUpsertWithoutLocationInputSchema: z.ZodType<Prisma.StepUpsertWithoutLocationInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutLocationInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutLocationInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutLocationInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutLocationInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutLocationInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationInputSchema) ]),
}).strict();

export const StepUpdateWithoutLocationInputSchema: z.ZodType<Prisma.StepUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const LocationResponseCreateWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutLocationResponsesInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutLocationResponsesInputSchema)
}).strict();

export const LocationResponseUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseUncheckedCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  formSubmissionId: z.string(),
  stepId: z.string()
}).strict();

export const LocationResponseCreateOrConnectWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseCreateOrConnectWithoutLocationInput> = z.object({
  where: z.lazy(() => LocationResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const LocationResponseUpsertWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseUpsertWithoutLocationInput> = z.object({
  update: z.union([ z.lazy(() => LocationResponseUpdateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutLocationInputSchema) ]),
  create: z.union([ z.lazy(() => LocationResponseCreateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedCreateWithoutLocationInputSchema) ]),
  where: z.lazy(() => LocationResponseWhereInputSchema).optional()
}).strict();

export const LocationResponseUpdateToOneWithWhereWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseUpdateToOneWithWhereWithoutLocationInput> = z.object({
  where: z.lazy(() => LocationResponseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationResponseUpdateWithoutLocationInputSchema),z.lazy(() => LocationResponseUncheckedUpdateWithoutLocationInputSchema) ]),
}).strict();

export const LocationResponseUpdateWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutLocationResponsesNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutLocationResponsesNestedInputSchema).optional()
}).strict();

export const LocationResponseUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnCreateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnCreateWithoutDatasetInput> = z.object({
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateWithoutDatasetInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutColumnInputSchema).optional()
}).strict();

export const ColumnCreateOrConnectWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnCreateOrConnectWithoutDatasetInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ColumnCreateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema) ]),
}).strict();

export const ColumnCreateManyDatasetInputEnvelopeSchema: z.ZodType<Prisma.ColumnCreateManyDatasetInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ColumnCreateManyDatasetInputSchema),z.lazy(() => ColumnCreateManyDatasetInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RowCreateWithoutDatasetInputSchema: z.ZodType<Prisma.RowCreateWithoutDatasetInput> = z.object({
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUncheckedCreateWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedCreateWithoutDatasetInput> = z.object({
  id: z.number().int().optional(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowCreateOrConnectWithoutDatasetInputSchema: z.ZodType<Prisma.RowCreateOrConnectWithoutDatasetInput> = z.object({
  where: z.lazy(() => RowWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RowCreateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema) ]),
}).strict();

export const RowCreateManyDatasetInputEnvelopeSchema: z.ZodType<Prisma.RowCreateManyDatasetInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RowCreateManyDatasetInputSchema),z.lazy(() => RowCreateManyDatasetInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WorkspaceCreateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutDatasetsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutDatasetsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceCreateOrConnectWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceCreateOrConnectWithoutDatasetsInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutDatasetsInputSchema) ]),
}).strict();

export const ColumnUpsertWithWhereUniqueWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUpsertWithWhereUniqueWithoutDatasetInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ColumnUpdateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutDatasetInputSchema) ]),
  create: z.union([ z.lazy(() => ColumnCreateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutDatasetInputSchema) ]),
}).strict();

export const ColumnUpdateWithWhereUniqueWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUpdateWithWhereUniqueWithoutDatasetInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ColumnUpdateWithoutDatasetInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutDatasetInputSchema) ]),
}).strict();

export const ColumnUpdateManyWithWhereWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUpdateManyWithWhereWithoutDatasetInput> = z.object({
  where: z.lazy(() => ColumnScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ColumnUpdateManyMutationInputSchema),z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetInputSchema) ]),
}).strict();

export const ColumnScalarWhereInputSchema: z.ZodType<Prisma.ColumnScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
}).strict();

export const RowUpsertWithWhereUniqueWithoutDatasetInputSchema: z.ZodType<Prisma.RowUpsertWithWhereUniqueWithoutDatasetInput> = z.object({
  where: z.lazy(() => RowWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RowUpdateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedUpdateWithoutDatasetInputSchema) ]),
  create: z.union([ z.lazy(() => RowCreateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedCreateWithoutDatasetInputSchema) ]),
}).strict();

export const RowUpdateWithWhereUniqueWithoutDatasetInputSchema: z.ZodType<Prisma.RowUpdateWithWhereUniqueWithoutDatasetInput> = z.object({
  where: z.lazy(() => RowWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RowUpdateWithoutDatasetInputSchema),z.lazy(() => RowUncheckedUpdateWithoutDatasetInputSchema) ]),
}).strict();

export const RowUpdateManyWithWhereWithoutDatasetInputSchema: z.ZodType<Prisma.RowUpdateManyWithWhereWithoutDatasetInput> = z.object({
  where: z.lazy(() => RowScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RowUpdateManyMutationInputSchema),z.lazy(() => RowUncheckedUpdateManyWithoutDatasetInputSchema) ]),
}).strict();

export const RowScalarWhereInputSchema: z.ZodType<Prisma.RowScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RowScalarWhereInputSchema),z.lazy(() => RowScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowScalarWhereInputSchema),z.lazy(() => RowScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const WorkspaceUpsertWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUpsertWithoutDatasetsInput> = z.object({
  update: z.union([ z.lazy(() => WorkspaceUpdateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutDatasetsInputSchema) ]),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutDatasetsInputSchema) ]),
  where: z.lazy(() => WorkspaceWhereInputSchema).optional()
}).strict();

export const WorkspaceUpdateToOneWithWhereWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUpdateToOneWithWhereWithoutDatasetsInput> = z.object({
  where: z.lazy(() => WorkspaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkspaceUpdateWithoutDatasetsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutDatasetsInputSchema) ]),
}).strict();

export const WorkspaceUpdateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithoutDatasetsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutDatasetsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const DatasetCreateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetCreateWithoutColumnsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutColumnsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetCreateOrConnectWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetCreateOrConnectWithoutColumnsInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatasetCreateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutColumnsInputSchema) ]),
}).strict();

export const CellValueCreateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueCreateWithoutColumnInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema)
}).strict();

export const CellValueUncheckedCreateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutColumnInput> = z.object({
  id: z.number().int().optional(),
  rowId: z.number().int(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const CellValueCreateOrConnectWithoutColumnInputSchema: z.ZodType<Prisma.CellValueCreateOrConnectWithoutColumnInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema) ]),
}).strict();

export const CellValueCreateManyColumnInputEnvelopeSchema: z.ZodType<Prisma.CellValueCreateManyColumnInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CellValueCreateManyColumnInputSchema),z.lazy(() => CellValueCreateManyColumnInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DatasetUpsertWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUpsertWithoutColumnsInput> = z.object({
  update: z.union([ z.lazy(() => DatasetUpdateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutColumnsInputSchema) ]),
  create: z.union([ z.lazy(() => DatasetCreateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutColumnsInputSchema) ]),
  where: z.lazy(() => DatasetWhereInputSchema).optional()
}).strict();

export const DatasetUpdateToOneWithWhereWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUpdateToOneWithWhereWithoutColumnsInput> = z.object({
  where: z.lazy(() => DatasetWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DatasetUpdateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutColumnsInputSchema) ]),
}).strict();

export const DatasetUpdateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUpdateWithoutColumnsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutColumnsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional()
}).strict();

export const CellValueUpsertWithWhereUniqueWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUpsertWithWhereUniqueWithoutColumnInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CellValueUpdateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutColumnInputSchema) ]),
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema) ]),
}).strict();

export const CellValueUpdateWithWhereUniqueWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUpdateWithWhereUniqueWithoutColumnInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CellValueUpdateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutColumnInputSchema) ]),
}).strict();

export const CellValueUpdateManyWithWhereWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUpdateManyWithWhereWithoutColumnInput> = z.object({
  where: z.lazy(() => CellValueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CellValueUpdateManyMutationInputSchema),z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnInputSchema) ]),
}).strict();

export const CellValueScalarWhereInputSchema: z.ZodType<Prisma.CellValueScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CellValueScalarWhereInputSchema),z.lazy(() => CellValueScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueScalarWhereInputSchema),z.lazy(() => CellValueScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rowId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  columnId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  value: z.lazy(() => JsonFilterSchema).optional()
}).strict();

export const DatasetCreateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetCreateWithoutRowsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutRowsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetCreateOrConnectWithoutRowsInputSchema: z.ZodType<Prisma.DatasetCreateOrConnectWithoutRowsInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatasetCreateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutRowsInputSchema) ]),
}).strict();

export const CellValueCreateWithoutRowInputSchema: z.ZodType<Prisma.CellValueCreateWithoutRowInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema)
}).strict();

export const CellValueUncheckedCreateWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutRowInput> = z.object({
  id: z.number().int().optional(),
  columnId: z.number().int(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const CellValueCreateOrConnectWithoutRowInputSchema: z.ZodType<Prisma.CellValueCreateOrConnectWithoutRowInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema) ]),
}).strict();

export const CellValueCreateManyRowInputEnvelopeSchema: z.ZodType<Prisma.CellValueCreateManyRowInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CellValueCreateManyRowInputSchema),z.lazy(() => CellValueCreateManyRowInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DatasetUpsertWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUpsertWithoutRowsInput> = z.object({
  update: z.union([ z.lazy(() => DatasetUpdateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutRowsInputSchema) ]),
  create: z.union([ z.lazy(() => DatasetCreateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutRowsInputSchema) ]),
  where: z.lazy(() => DatasetWhereInputSchema).optional()
}).strict();

export const DatasetUpdateToOneWithWhereWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUpdateToOneWithWhereWithoutRowsInput> = z.object({
  where: z.lazy(() => DatasetWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DatasetUpdateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutRowsInputSchema) ]),
}).strict();

export const DatasetUpdateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUpdateWithoutRowsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutRowsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional()
}).strict();

export const CellValueUpsertWithWhereUniqueWithoutRowInputSchema: z.ZodType<Prisma.CellValueUpsertWithWhereUniqueWithoutRowInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CellValueUpdateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutRowInputSchema) ]),
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema) ]),
}).strict();

export const CellValueUpdateWithWhereUniqueWithoutRowInputSchema: z.ZodType<Prisma.CellValueUpdateWithWhereUniqueWithoutRowInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CellValueUpdateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutRowInputSchema) ]),
}).strict();

export const CellValueUpdateManyWithWhereWithoutRowInputSchema: z.ZodType<Prisma.CellValueUpdateManyWithWhereWithoutRowInput> = z.object({
  where: z.lazy(() => CellValueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CellValueUpdateManyMutationInputSchema),z.lazy(() => CellValueUncheckedUpdateManyWithoutRowInputSchema) ]),
}).strict();

export const ColumnCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnCreateWithoutCellValuesInput> = z.object({
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutColumnsInputSchema)
}).strict();

export const ColumnUncheckedCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateWithoutCellValuesInput> = z.object({
  id: z.number().int().optional(),
  datasetId: z.string(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema)
}).strict();

export const ColumnCreateOrConnectWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnCreateOrConnectWithoutCellValuesInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ColumnCreateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutCellValuesInputSchema) ]),
}).strict();

export const RowCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowCreateWithoutCellValuesInput> = z.object({
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutRowsInputSchema)
}).strict();

export const RowUncheckedCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUncheckedCreateWithoutCellValuesInput> = z.object({
  id: z.number().int().optional(),
  datasetId: z.string()
}).strict();

export const RowCreateOrConnectWithoutCellValuesInputSchema: z.ZodType<Prisma.RowCreateOrConnectWithoutCellValuesInput> = z.object({
  where: z.lazy(() => RowWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RowCreateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedCreateWithoutCellValuesInputSchema) ]),
}).strict();

export const ColumnUpsertWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUpsertWithoutCellValuesInput> = z.object({
  update: z.union([ z.lazy(() => ColumnUpdateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutCellValuesInputSchema) ]),
  create: z.union([ z.lazy(() => ColumnCreateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutCellValuesInputSchema) ]),
  where: z.lazy(() => ColumnWhereInputSchema).optional()
}).strict();

export const ColumnUpdateToOneWithWhereWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUpdateToOneWithWhereWithoutCellValuesInput> = z.object({
  where: z.lazy(() => ColumnWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ColumnUpdateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutCellValuesInputSchema) ]),
}).strict();

export const ColumnUpdateWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUpdateWithoutCellValuesInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateWithoutCellValuesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RowUpsertWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUpsertWithoutCellValuesInput> = z.object({
  update: z.union([ z.lazy(() => RowUpdateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedUpdateWithoutCellValuesInputSchema) ]),
  create: z.union([ z.lazy(() => RowCreateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedCreateWithoutCellValuesInputSchema) ]),
  where: z.lazy(() => RowWhereInputSchema).optional()
}).strict();

export const RowUpdateToOneWithWhereWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUpdateToOneWithWhereWithoutCellValuesInput> = z.object({
  where: z.lazy(() => RowWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RowUpdateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedUpdateWithoutCellValuesInputSchema) ]),
}).strict();

export const RowUpdateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUpdateWithoutCellValuesInput> = z.object({
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutRowsNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUncheckedUpdateWithoutCellValuesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateManyUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyUserInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WorkspaceMembershipCreateManyUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const OrganizationMembershipUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyOrganizationInput> = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WorkspaceCreateManyOrganizationInputSchema: z.ZodType<Prisma.WorkspaceCreateManyOrganizationInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateManyWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const FormCreateManyWorkspaceInputSchema: z.ZodType<Prisma.FormCreateManyWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  draftFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DatasetCreateManyWorkspaceInputSchema: z.ZodType<Prisma.DatasetCreateManyWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
}).strict();

export const WorkspaceMembershipUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkspaceMembershipsNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  draftFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DatasetUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepCreateManyFormInputSchema: z.ZodType<Prisma.StepCreateManyFormInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormSubmissionCreateManyFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateManyFormInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormCreateManyDraftFormInputSchema: z.ZodType<Prisma.FormCreateManyDraftFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isDraft: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const StepUpdateWithoutFormInputSchema: z.ZodType<Prisma.StepUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUpdateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputResponses: z.lazy(() => InputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional(),
  locationResponses: z.lazy(() => LocationResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUpdateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpdateWithoutDraftFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutDraftFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateManyWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutDraftFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseCreateManyStepInputSchema: z.ZodType<Prisma.InputResponseCreateManyStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  formSubmissionId: z.string()
}).strict();

export const LocationResponseCreateManyStepInputSchema: z.ZodType<Prisma.LocationResponseCreateManyStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  formSubmissionId: z.string()
}).strict();

export const InputResponseUpdateWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutInputResponsesNestedInputSchema).optional()
}).strict();

export const InputResponseUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseUncheckedUpdateManyWithoutStepInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateManyWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutLocationResponseNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutLocationResponsesNestedInputSchema).optional()
}).strict();

export const LocationResponseUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseUncheckedUpdateManyWithoutStepInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateManyWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseCreateManyFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseCreateManyFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  value: z.string(),
  stepId: z.string()
}).strict();

export const LocationResponseCreateManyFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseCreateManyFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  locationId: z.number().int(),
  stepId: z.string()
}).strict();

export const InputResponseUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutInputResponsesNestedInputSchema).optional()
}).strict();

export const InputResponseUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InputResponseUncheckedUpdateManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.InputResponseUncheckedUpdateManyWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutLocationResponseNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutLocationResponsesNestedInputSchema).optional()
}).strict();

export const LocationResponseUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationResponseUncheckedUpdateManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.LocationResponseUncheckedUpdateManyWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnCreateManyDatasetInputSchema: z.ZodType<Prisma.ColumnCreateManyDatasetInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema)
}).strict();

export const RowCreateManyDatasetInputSchema: z.ZodType<Prisma.RowCreateManyDatasetInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const ColumnUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUpdateWithoutDatasetInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateManyWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyWithoutDatasetInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RowUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.RowUpdateWithoutDatasetInput> = z.object({
  cellValues: z.lazy(() => CellValueUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateManyWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedUpdateManyWithoutDatasetInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueCreateManyColumnInputSchema: z.ZodType<Prisma.CellValueCreateManyColumnInput> = z.object({
  id: z.number().int().optional(),
  rowId: z.number().int(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const CellValueUpdateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutColumnInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutColumnInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CellValueUncheckedUpdateManyWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyWithoutColumnInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CellValueCreateManyRowInputSchema: z.ZodType<Prisma.CellValueCreateManyRowInput> = z.object({
  id: z.number().int().optional(),
  columnId: z.number().int(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const CellValueUpdateWithoutRowInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutRowInput> = z.object({
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutRowInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CellValueUncheckedUpdateManyWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyWithoutRowInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindFirstArgsSchema: z.ZodType<Prisma.OrganizationFindFirstArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindFirstOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindManyArgsSchema: z.ZodType<Prisma.OrganizationFindManyArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationAggregateArgsSchema: z.ZodType<Prisma.OrganizationAggregateArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationGroupByArgsSchema: z.ZodType<Prisma.OrganizationGroupByArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithAggregationInputSchema.array(),OrganizationOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationScalarFieldEnumSchema.array(),
  having: OrganizationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMembershipFindFirstArgsSchema: z.ZodType<Prisma.OrganizationMembershipFindFirstArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMembershipOrderByWithRelationInputSchema.array(),OrganizationMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMembershipScalarFieldEnumSchema,OrganizationMembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMembershipFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationMembershipFindFirstOrThrowArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMembershipOrderByWithRelationInputSchema.array(),OrganizationMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMembershipScalarFieldEnumSchema,OrganizationMembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMembershipFindManyArgsSchema: z.ZodType<Prisma.OrganizationMembershipFindManyArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMembershipOrderByWithRelationInputSchema.array(),OrganizationMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMembershipScalarFieldEnumSchema,OrganizationMembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMembershipAggregateArgsSchema: z.ZodType<Prisma.OrganizationMembershipAggregateArgs> = z.object({
  where: OrganizationMembershipWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMembershipOrderByWithRelationInputSchema.array(),OrganizationMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationMembershipGroupByArgsSchema: z.ZodType<Prisma.OrganizationMembershipGroupByArgs> = z.object({
  where: OrganizationMembershipWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMembershipOrderByWithAggregationInputSchema.array(),OrganizationMembershipOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationMembershipScalarFieldEnumSchema.array(),
  having: OrganizationMembershipScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationMembershipFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationMembershipFindUniqueArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMembershipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationMembershipFindUniqueOrThrowArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceMembershipFindFirstArgsSchema: z.ZodType<Prisma.WorkspaceMembershipFindFirstArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceMembershipOrderByWithRelationInputSchema.array(),WorkspaceMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkspaceMembershipScalarFieldEnumSchema,WorkspaceMembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkspaceMembershipFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkspaceMembershipFindFirstOrThrowArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceMembershipOrderByWithRelationInputSchema.array(),WorkspaceMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkspaceMembershipScalarFieldEnumSchema,WorkspaceMembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkspaceMembershipFindManyArgsSchema: z.ZodType<Prisma.WorkspaceMembershipFindManyArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceMembershipOrderByWithRelationInputSchema.array(),WorkspaceMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkspaceMembershipScalarFieldEnumSchema,WorkspaceMembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkspaceMembershipAggregateArgsSchema: z.ZodType<Prisma.WorkspaceMembershipAggregateArgs> = z.object({
  where: WorkspaceMembershipWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceMembershipOrderByWithRelationInputSchema.array(),WorkspaceMembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceMembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkspaceMembershipGroupByArgsSchema: z.ZodType<Prisma.WorkspaceMembershipGroupByArgs> = z.object({
  where: WorkspaceMembershipWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceMembershipOrderByWithAggregationInputSchema.array(),WorkspaceMembershipOrderByWithAggregationInputSchema ]).optional(),
  by: WorkspaceMembershipScalarFieldEnumSchema.array(),
  having: WorkspaceMembershipScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkspaceMembershipFindUniqueArgsSchema: z.ZodType<Prisma.WorkspaceMembershipFindUniqueArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceMembershipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkspaceMembershipFindUniqueOrThrowArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceFindFirstArgsSchema: z.ZodType<Prisma.WorkspaceFindFirstArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceOrderByWithRelationInputSchema.array(),WorkspaceOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkspaceScalarFieldEnumSchema,WorkspaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkspaceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkspaceFindFirstOrThrowArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceOrderByWithRelationInputSchema.array(),WorkspaceOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkspaceScalarFieldEnumSchema,WorkspaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkspaceFindManyArgsSchema: z.ZodType<Prisma.WorkspaceFindManyArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceOrderByWithRelationInputSchema.array(),WorkspaceOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkspaceScalarFieldEnumSchema,WorkspaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkspaceAggregateArgsSchema: z.ZodType<Prisma.WorkspaceAggregateArgs> = z.object({
  where: WorkspaceWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceOrderByWithRelationInputSchema.array(),WorkspaceOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkspaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkspaceGroupByArgsSchema: z.ZodType<Prisma.WorkspaceGroupByArgs> = z.object({
  where: WorkspaceWhereInputSchema.optional(),
  orderBy: z.union([ WorkspaceOrderByWithAggregationInputSchema.array(),WorkspaceOrderByWithAggregationInputSchema ]).optional(),
  by: WorkspaceScalarFieldEnumSchema.array(),
  having: WorkspaceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkspaceFindUniqueArgsSchema: z.ZodType<Prisma.WorkspaceFindUniqueArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkspaceFindUniqueOrThrowArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereUniqueInputSchema,
}).strict() ;

export const FormFindFirstArgsSchema: z.ZodType<Prisma.FormFindFirstArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereInputSchema.optional(),
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(),FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormScalarFieldEnumSchema,FormScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FormFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FormFindFirstOrThrowArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereInputSchema.optional(),
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(),FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormScalarFieldEnumSchema,FormScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FormFindManyArgsSchema: z.ZodType<Prisma.FormFindManyArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereInputSchema.optional(),
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(),FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormScalarFieldEnumSchema,FormScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FormAggregateArgsSchema: z.ZodType<Prisma.FormAggregateArgs> = z.object({
  where: FormWhereInputSchema.optional(),
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(),FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FormGroupByArgsSchema: z.ZodType<Prisma.FormGroupByArgs> = z.object({
  where: FormWhereInputSchema.optional(),
  orderBy: z.union([ FormOrderByWithAggregationInputSchema.array(),FormOrderByWithAggregationInputSchema ]).optional(),
  by: FormScalarFieldEnumSchema.array(),
  having: FormScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FormFindUniqueArgsSchema: z.ZodType<Prisma.FormFindUniqueArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema,
}).strict() ;

export const FormFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FormFindUniqueOrThrowArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema,
}).strict() ;

export const StepFindFirstArgsSchema: z.ZodType<Prisma.StepFindFirstArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereInputSchema.optional(),
  orderBy: z.union([ StepOrderByWithRelationInputSchema.array(),StepOrderByWithRelationInputSchema ]).optional(),
  cursor: StepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StepScalarFieldEnumSchema,StepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.StepFindFirstOrThrowArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereInputSchema.optional(),
  orderBy: z.union([ StepOrderByWithRelationInputSchema.array(),StepOrderByWithRelationInputSchema ]).optional(),
  cursor: StepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StepScalarFieldEnumSchema,StepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StepFindManyArgsSchema: z.ZodType<Prisma.StepFindManyArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereInputSchema.optional(),
  orderBy: z.union([ StepOrderByWithRelationInputSchema.array(),StepOrderByWithRelationInputSchema ]).optional(),
  cursor: StepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StepScalarFieldEnumSchema,StepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StepAggregateArgsSchema: z.ZodType<Prisma.StepAggregateArgs> = z.object({
  where: StepWhereInputSchema.optional(),
  orderBy: z.union([ StepOrderByWithRelationInputSchema.array(),StepOrderByWithRelationInputSchema ]).optional(),
  cursor: StepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const StepGroupByArgsSchema: z.ZodType<Prisma.StepGroupByArgs> = z.object({
  where: StepWhereInputSchema.optional(),
  orderBy: z.union([ StepOrderByWithAggregationInputSchema.array(),StepOrderByWithAggregationInputSchema ]).optional(),
  by: StepScalarFieldEnumSchema.array(),
  having: StepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const StepFindUniqueArgsSchema: z.ZodType<Prisma.StepFindUniqueArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereUniqueInputSchema,
}).strict() ;

export const StepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.StepFindUniqueOrThrowArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereUniqueInputSchema,
}).strict() ;

export const FormSubmissionFindFirstArgsSchema: z.ZodType<Prisma.FormSubmissionFindFirstArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ FormSubmissionOrderByWithRelationInputSchema.array(),FormSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: FormSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormSubmissionScalarFieldEnumSchema,FormSubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FormSubmissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FormSubmissionFindFirstOrThrowArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ FormSubmissionOrderByWithRelationInputSchema.array(),FormSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: FormSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormSubmissionScalarFieldEnumSchema,FormSubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FormSubmissionFindManyArgsSchema: z.ZodType<Prisma.FormSubmissionFindManyArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ FormSubmissionOrderByWithRelationInputSchema.array(),FormSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: FormSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormSubmissionScalarFieldEnumSchema,FormSubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FormSubmissionAggregateArgsSchema: z.ZodType<Prisma.FormSubmissionAggregateArgs> = z.object({
  where: FormSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ FormSubmissionOrderByWithRelationInputSchema.array(),FormSubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: FormSubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FormSubmissionGroupByArgsSchema: z.ZodType<Prisma.FormSubmissionGroupByArgs> = z.object({
  where: FormSubmissionWhereInputSchema.optional(),
  orderBy: z.union([ FormSubmissionOrderByWithAggregationInputSchema.array(),FormSubmissionOrderByWithAggregationInputSchema ]).optional(),
  by: FormSubmissionScalarFieldEnumSchema.array(),
  having: FormSubmissionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FormSubmissionFindUniqueArgsSchema: z.ZodType<Prisma.FormSubmissionFindUniqueArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereUniqueInputSchema,
}).strict() ;

export const FormSubmissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FormSubmissionFindUniqueOrThrowArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereUniqueInputSchema,
}).strict() ;

export const InputResponseFindFirstArgsSchema: z.ZodType<Prisma.InputResponseFindFirstArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereInputSchema.optional(),
  orderBy: z.union([ InputResponseOrderByWithRelationInputSchema.array(),InputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: InputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InputResponseScalarFieldEnumSchema,InputResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InputResponseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InputResponseFindFirstOrThrowArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereInputSchema.optional(),
  orderBy: z.union([ InputResponseOrderByWithRelationInputSchema.array(),InputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: InputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InputResponseScalarFieldEnumSchema,InputResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InputResponseFindManyArgsSchema: z.ZodType<Prisma.InputResponseFindManyArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereInputSchema.optional(),
  orderBy: z.union([ InputResponseOrderByWithRelationInputSchema.array(),InputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: InputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InputResponseScalarFieldEnumSchema,InputResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InputResponseAggregateArgsSchema: z.ZodType<Prisma.InputResponseAggregateArgs> = z.object({
  where: InputResponseWhereInputSchema.optional(),
  orderBy: z.union([ InputResponseOrderByWithRelationInputSchema.array(),InputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: InputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InputResponseGroupByArgsSchema: z.ZodType<Prisma.InputResponseGroupByArgs> = z.object({
  where: InputResponseWhereInputSchema.optional(),
  orderBy: z.union([ InputResponseOrderByWithAggregationInputSchema.array(),InputResponseOrderByWithAggregationInputSchema ]).optional(),
  by: InputResponseScalarFieldEnumSchema.array(),
  having: InputResponseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InputResponseFindUniqueArgsSchema: z.ZodType<Prisma.InputResponseFindUniqueArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereUniqueInputSchema,
}).strict() ;

export const InputResponseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InputResponseFindUniqueOrThrowArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereUniqueInputSchema,
}).strict() ;

export const LocationResponseFindFirstArgsSchema: z.ZodType<Prisma.LocationResponseFindFirstArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereInputSchema.optional(),
  orderBy: z.union([ LocationResponseOrderByWithRelationInputSchema.array(),LocationResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationResponseScalarFieldEnumSchema,LocationResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationResponseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LocationResponseFindFirstOrThrowArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereInputSchema.optional(),
  orderBy: z.union([ LocationResponseOrderByWithRelationInputSchema.array(),LocationResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationResponseScalarFieldEnumSchema,LocationResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationResponseFindManyArgsSchema: z.ZodType<Prisma.LocationResponseFindManyArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereInputSchema.optional(),
  orderBy: z.union([ LocationResponseOrderByWithRelationInputSchema.array(),LocationResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationResponseScalarFieldEnumSchema,LocationResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationResponseAggregateArgsSchema: z.ZodType<Prisma.LocationResponseAggregateArgs> = z.object({
  where: LocationResponseWhereInputSchema.optional(),
  orderBy: z.union([ LocationResponseOrderByWithRelationInputSchema.array(),LocationResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationResponseGroupByArgsSchema: z.ZodType<Prisma.LocationResponseGroupByArgs> = z.object({
  where: LocationResponseWhereInputSchema.optional(),
  orderBy: z.union([ LocationResponseOrderByWithAggregationInputSchema.array(),LocationResponseOrderByWithAggregationInputSchema ]).optional(),
  by: LocationResponseScalarFieldEnumSchema.array(),
  having: LocationResponseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationResponseFindUniqueArgsSchema: z.ZodType<Prisma.LocationResponseFindUniqueArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereUniqueInputSchema,
}).strict() ;

export const LocationResponseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LocationResponseFindUniqueOrThrowArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereUniqueInputSchema,
}).strict() ;

export const LocationFindFirstArgsSchema: z.ZodType<Prisma.LocationFindFirstArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LocationFindFirstOrThrowArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationFindManyArgsSchema: z.ZodType<Prisma.LocationFindManyArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationAggregateArgsSchema: z.ZodType<Prisma.LocationAggregateArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationGroupByArgsSchema: z.ZodType<Prisma.LocationGroupByArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithAggregationInputSchema.array(),LocationOrderByWithAggregationInputSchema ]).optional(),
  by: LocationScalarFieldEnumSchema.array(),
  having: LocationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationFindUniqueArgsSchema: z.ZodType<Prisma.LocationFindUniqueArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LocationFindUniqueOrThrowArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const DatasetFindFirstArgsSchema: z.ZodType<Prisma.DatasetFindFirstArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereInputSchema.optional(),
  orderBy: z.union([ DatasetOrderByWithRelationInputSchema.array(),DatasetOrderByWithRelationInputSchema ]).optional(),
  cursor: DatasetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DatasetScalarFieldEnumSchema,DatasetScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DatasetFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DatasetFindFirstOrThrowArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereInputSchema.optional(),
  orderBy: z.union([ DatasetOrderByWithRelationInputSchema.array(),DatasetOrderByWithRelationInputSchema ]).optional(),
  cursor: DatasetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DatasetScalarFieldEnumSchema,DatasetScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DatasetFindManyArgsSchema: z.ZodType<Prisma.DatasetFindManyArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereInputSchema.optional(),
  orderBy: z.union([ DatasetOrderByWithRelationInputSchema.array(),DatasetOrderByWithRelationInputSchema ]).optional(),
  cursor: DatasetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DatasetScalarFieldEnumSchema,DatasetScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DatasetAggregateArgsSchema: z.ZodType<Prisma.DatasetAggregateArgs> = z.object({
  where: DatasetWhereInputSchema.optional(),
  orderBy: z.union([ DatasetOrderByWithRelationInputSchema.array(),DatasetOrderByWithRelationInputSchema ]).optional(),
  cursor: DatasetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DatasetGroupByArgsSchema: z.ZodType<Prisma.DatasetGroupByArgs> = z.object({
  where: DatasetWhereInputSchema.optional(),
  orderBy: z.union([ DatasetOrderByWithAggregationInputSchema.array(),DatasetOrderByWithAggregationInputSchema ]).optional(),
  by: DatasetScalarFieldEnumSchema.array(),
  having: DatasetScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DatasetFindUniqueArgsSchema: z.ZodType<Prisma.DatasetFindUniqueArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereUniqueInputSchema,
}).strict() ;

export const DatasetFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DatasetFindUniqueOrThrowArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereUniqueInputSchema,
}).strict() ;

export const ColumnFindFirstArgsSchema: z.ZodType<Prisma.ColumnFindFirstArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereInputSchema.optional(),
  orderBy: z.union([ ColumnOrderByWithRelationInputSchema.array(),ColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ColumnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ColumnScalarFieldEnumSchema,ColumnScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ColumnFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ColumnFindFirstOrThrowArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereInputSchema.optional(),
  orderBy: z.union([ ColumnOrderByWithRelationInputSchema.array(),ColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ColumnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ColumnScalarFieldEnumSchema,ColumnScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ColumnFindManyArgsSchema: z.ZodType<Prisma.ColumnFindManyArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereInputSchema.optional(),
  orderBy: z.union([ ColumnOrderByWithRelationInputSchema.array(),ColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ColumnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ColumnScalarFieldEnumSchema,ColumnScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ColumnAggregateArgsSchema: z.ZodType<Prisma.ColumnAggregateArgs> = z.object({
  where: ColumnWhereInputSchema.optional(),
  orderBy: z.union([ ColumnOrderByWithRelationInputSchema.array(),ColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ColumnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ColumnGroupByArgsSchema: z.ZodType<Prisma.ColumnGroupByArgs> = z.object({
  where: ColumnWhereInputSchema.optional(),
  orderBy: z.union([ ColumnOrderByWithAggregationInputSchema.array(),ColumnOrderByWithAggregationInputSchema ]).optional(),
  by: ColumnScalarFieldEnumSchema.array(),
  having: ColumnScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ColumnFindUniqueArgsSchema: z.ZodType<Prisma.ColumnFindUniqueArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereUniqueInputSchema,
}).strict() ;

export const ColumnFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ColumnFindUniqueOrThrowArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereUniqueInputSchema,
}).strict() ;

export const RowFindFirstArgsSchema: z.ZodType<Prisma.RowFindFirstArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereInputSchema.optional(),
  orderBy: z.union([ RowOrderByWithRelationInputSchema.array(),RowOrderByWithRelationInputSchema ]).optional(),
  cursor: RowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RowScalarFieldEnumSchema,RowScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RowFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RowFindFirstOrThrowArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereInputSchema.optional(),
  orderBy: z.union([ RowOrderByWithRelationInputSchema.array(),RowOrderByWithRelationInputSchema ]).optional(),
  cursor: RowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RowScalarFieldEnumSchema,RowScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RowFindManyArgsSchema: z.ZodType<Prisma.RowFindManyArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereInputSchema.optional(),
  orderBy: z.union([ RowOrderByWithRelationInputSchema.array(),RowOrderByWithRelationInputSchema ]).optional(),
  cursor: RowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RowScalarFieldEnumSchema,RowScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RowAggregateArgsSchema: z.ZodType<Prisma.RowAggregateArgs> = z.object({
  where: RowWhereInputSchema.optional(),
  orderBy: z.union([ RowOrderByWithRelationInputSchema.array(),RowOrderByWithRelationInputSchema ]).optional(),
  cursor: RowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RowGroupByArgsSchema: z.ZodType<Prisma.RowGroupByArgs> = z.object({
  where: RowWhereInputSchema.optional(),
  orderBy: z.union([ RowOrderByWithAggregationInputSchema.array(),RowOrderByWithAggregationInputSchema ]).optional(),
  by: RowScalarFieldEnumSchema.array(),
  having: RowScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RowFindUniqueArgsSchema: z.ZodType<Prisma.RowFindUniqueArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereUniqueInputSchema,
}).strict() ;

export const RowFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RowFindUniqueOrThrowArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereUniqueInputSchema,
}).strict() ;

export const CellValueFindFirstArgsSchema: z.ZodType<Prisma.CellValueFindFirstArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereInputSchema.optional(),
  orderBy: z.union([ CellValueOrderByWithRelationInputSchema.array(),CellValueOrderByWithRelationInputSchema ]).optional(),
  cursor: CellValueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CellValueScalarFieldEnumSchema,CellValueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CellValueFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CellValueFindFirstOrThrowArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereInputSchema.optional(),
  orderBy: z.union([ CellValueOrderByWithRelationInputSchema.array(),CellValueOrderByWithRelationInputSchema ]).optional(),
  cursor: CellValueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CellValueScalarFieldEnumSchema,CellValueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CellValueFindManyArgsSchema: z.ZodType<Prisma.CellValueFindManyArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereInputSchema.optional(),
  orderBy: z.union([ CellValueOrderByWithRelationInputSchema.array(),CellValueOrderByWithRelationInputSchema ]).optional(),
  cursor: CellValueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CellValueScalarFieldEnumSchema,CellValueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CellValueAggregateArgsSchema: z.ZodType<Prisma.CellValueAggregateArgs> = z.object({
  where: CellValueWhereInputSchema.optional(),
  orderBy: z.union([ CellValueOrderByWithRelationInputSchema.array(),CellValueOrderByWithRelationInputSchema ]).optional(),
  cursor: CellValueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CellValueGroupByArgsSchema: z.ZodType<Prisma.CellValueGroupByArgs> = z.object({
  where: CellValueWhereInputSchema.optional(),
  orderBy: z.union([ CellValueOrderByWithAggregationInputSchema.array(),CellValueOrderByWithAggregationInputSchema ]).optional(),
  by: CellValueScalarFieldEnumSchema.array(),
  having: CellValueScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CellValueFindUniqueArgsSchema: z.ZodType<Prisma.CellValueFindUniqueArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereUniqueInputSchema,
}).strict() ;

export const CellValueFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CellValueFindUniqueOrThrowArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const OrganizationCreateArgsSchema: z.ZodType<Prisma.OrganizationCreateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationUpsertArgsSchema: z.ZodType<Prisma.OrganizationUpsertArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
  create: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationCreateManyArgsSchema: z.ZodType<Prisma.OrganizationCreateManyArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDeleteArgsSchema: z.ZodType<Prisma.OrganizationDeleteArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateArgsSchema: z.ZodType<Prisma.OrganizationUpdateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
}).strict() ;

export const OrganizationDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationDeleteManyArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
}).strict() ;

export const OrganizationMembershipCreateArgsSchema: z.ZodType<Prisma.OrganizationMembershipCreateArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  data: z.union([ OrganizationMembershipCreateInputSchema,OrganizationMembershipUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationMembershipUpsertArgsSchema: z.ZodType<Prisma.OrganizationMembershipUpsertArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereUniqueInputSchema,
  create: z.union([ OrganizationMembershipCreateInputSchema,OrganizationMembershipUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationMembershipUpdateInputSchema,OrganizationMembershipUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationMembershipCreateManyArgsSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyArgs> = z.object({
  data: z.union([ OrganizationMembershipCreateManyInputSchema,OrganizationMembershipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationMembershipDeleteArgsSchema: z.ZodType<Prisma.OrganizationMembershipDeleteArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  where: OrganizationMembershipWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMembershipUpdateArgsSchema: z.ZodType<Prisma.OrganizationMembershipUpdateArgs> = z.object({
  select: OrganizationMembershipSelectSchema.optional(),
  include: OrganizationMembershipIncludeSchema.optional(),
  data: z.union([ OrganizationMembershipUpdateInputSchema,OrganizationMembershipUncheckedUpdateInputSchema ]),
  where: OrganizationMembershipWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMembershipUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyArgs> = z.object({
  data: z.union([ OrganizationMembershipUpdateManyMutationInputSchema,OrganizationMembershipUncheckedUpdateManyInputSchema ]),
  where: OrganizationMembershipWhereInputSchema.optional(),
}).strict() ;

export const OrganizationMembershipDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationMembershipDeleteManyArgs> = z.object({
  where: OrganizationMembershipWhereInputSchema.optional(),
}).strict() ;

export const WorkspaceMembershipCreateArgsSchema: z.ZodType<Prisma.WorkspaceMembershipCreateArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  data: z.union([ WorkspaceMembershipCreateInputSchema,WorkspaceMembershipUncheckedCreateInputSchema ]),
}).strict() ;

export const WorkspaceMembershipUpsertArgsSchema: z.ZodType<Prisma.WorkspaceMembershipUpsertArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereUniqueInputSchema,
  create: z.union([ WorkspaceMembershipCreateInputSchema,WorkspaceMembershipUncheckedCreateInputSchema ]),
  update: z.union([ WorkspaceMembershipUpdateInputSchema,WorkspaceMembershipUncheckedUpdateInputSchema ]),
}).strict() ;

export const WorkspaceMembershipCreateManyArgsSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyArgs> = z.object({
  data: z.union([ WorkspaceMembershipCreateManyInputSchema,WorkspaceMembershipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WorkspaceMembershipDeleteArgsSchema: z.ZodType<Prisma.WorkspaceMembershipDeleteArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  where: WorkspaceMembershipWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceMembershipUpdateArgsSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateArgs> = z.object({
  select: WorkspaceMembershipSelectSchema.optional(),
  include: WorkspaceMembershipIncludeSchema.optional(),
  data: z.union([ WorkspaceMembershipUpdateInputSchema,WorkspaceMembershipUncheckedUpdateInputSchema ]),
  where: WorkspaceMembershipWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceMembershipUpdateManyArgsSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyArgs> = z.object({
  data: z.union([ WorkspaceMembershipUpdateManyMutationInputSchema,WorkspaceMembershipUncheckedUpdateManyInputSchema ]),
  where: WorkspaceMembershipWhereInputSchema.optional(),
}).strict() ;

export const WorkspaceMembershipDeleteManyArgsSchema: z.ZodType<Prisma.WorkspaceMembershipDeleteManyArgs> = z.object({
  where: WorkspaceMembershipWhereInputSchema.optional(),
}).strict() ;

export const WorkspaceCreateArgsSchema: z.ZodType<Prisma.WorkspaceCreateArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  data: z.union([ WorkspaceCreateInputSchema,WorkspaceUncheckedCreateInputSchema ]),
}).strict() ;

export const WorkspaceUpsertArgsSchema: z.ZodType<Prisma.WorkspaceUpsertArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereUniqueInputSchema,
  create: z.union([ WorkspaceCreateInputSchema,WorkspaceUncheckedCreateInputSchema ]),
  update: z.union([ WorkspaceUpdateInputSchema,WorkspaceUncheckedUpdateInputSchema ]),
}).strict() ;

export const WorkspaceCreateManyArgsSchema: z.ZodType<Prisma.WorkspaceCreateManyArgs> = z.object({
  data: z.union([ WorkspaceCreateManyInputSchema,WorkspaceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WorkspaceDeleteArgsSchema: z.ZodType<Prisma.WorkspaceDeleteArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  where: WorkspaceWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceUpdateArgsSchema: z.ZodType<Prisma.WorkspaceUpdateArgs> = z.object({
  select: WorkspaceSelectSchema.optional(),
  include: WorkspaceIncludeSchema.optional(),
  data: z.union([ WorkspaceUpdateInputSchema,WorkspaceUncheckedUpdateInputSchema ]),
  where: WorkspaceWhereUniqueInputSchema,
}).strict() ;

export const WorkspaceUpdateManyArgsSchema: z.ZodType<Prisma.WorkspaceUpdateManyArgs> = z.object({
  data: z.union([ WorkspaceUpdateManyMutationInputSchema,WorkspaceUncheckedUpdateManyInputSchema ]),
  where: WorkspaceWhereInputSchema.optional(),
}).strict() ;

export const WorkspaceDeleteManyArgsSchema: z.ZodType<Prisma.WorkspaceDeleteManyArgs> = z.object({
  where: WorkspaceWhereInputSchema.optional(),
}).strict() ;

export const FormCreateArgsSchema: z.ZodType<Prisma.FormCreateArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  data: z.union([ FormCreateInputSchema,FormUncheckedCreateInputSchema ]),
}).strict() ;

export const FormUpsertArgsSchema: z.ZodType<Prisma.FormUpsertArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema,
  create: z.union([ FormCreateInputSchema,FormUncheckedCreateInputSchema ]),
  update: z.union([ FormUpdateInputSchema,FormUncheckedUpdateInputSchema ]),
}).strict() ;

export const FormCreateManyArgsSchema: z.ZodType<Prisma.FormCreateManyArgs> = z.object({
  data: z.union([ FormCreateManyInputSchema,FormCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FormDeleteArgsSchema: z.ZodType<Prisma.FormDeleteArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema,
}).strict() ;

export const FormUpdateArgsSchema: z.ZodType<Prisma.FormUpdateArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  data: z.union([ FormUpdateInputSchema,FormUncheckedUpdateInputSchema ]),
  where: FormWhereUniqueInputSchema,
}).strict() ;

export const FormUpdateManyArgsSchema: z.ZodType<Prisma.FormUpdateManyArgs> = z.object({
  data: z.union([ FormUpdateManyMutationInputSchema,FormUncheckedUpdateManyInputSchema ]),
  where: FormWhereInputSchema.optional(),
}).strict() ;

export const FormDeleteManyArgsSchema: z.ZodType<Prisma.FormDeleteManyArgs> = z.object({
  where: FormWhereInputSchema.optional(),
}).strict() ;

export const StepCreateArgsSchema: z.ZodType<Prisma.StepCreateArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  data: z.union([ StepCreateInputSchema,StepUncheckedCreateInputSchema ]),
}).strict() ;

export const StepUpsertArgsSchema: z.ZodType<Prisma.StepUpsertArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereUniqueInputSchema,
  create: z.union([ StepCreateInputSchema,StepUncheckedCreateInputSchema ]),
  update: z.union([ StepUpdateInputSchema,StepUncheckedUpdateInputSchema ]),
}).strict() ;

export const StepCreateManyArgsSchema: z.ZodType<Prisma.StepCreateManyArgs> = z.object({
  data: z.union([ StepCreateManyInputSchema,StepCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const StepDeleteArgsSchema: z.ZodType<Prisma.StepDeleteArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  where: StepWhereUniqueInputSchema,
}).strict() ;

export const StepUpdateArgsSchema: z.ZodType<Prisma.StepUpdateArgs> = z.object({
  select: StepSelectSchema.optional(),
  include: StepIncludeSchema.optional(),
  data: z.union([ StepUpdateInputSchema,StepUncheckedUpdateInputSchema ]),
  where: StepWhereUniqueInputSchema,
}).strict() ;

export const StepUpdateManyArgsSchema: z.ZodType<Prisma.StepUpdateManyArgs> = z.object({
  data: z.union([ StepUpdateManyMutationInputSchema,StepUncheckedUpdateManyInputSchema ]),
  where: StepWhereInputSchema.optional(),
}).strict() ;

export const StepDeleteManyArgsSchema: z.ZodType<Prisma.StepDeleteManyArgs> = z.object({
  where: StepWhereInputSchema.optional(),
}).strict() ;

export const FormSubmissionCreateArgsSchema: z.ZodType<Prisma.FormSubmissionCreateArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  data: z.union([ FormSubmissionCreateInputSchema,FormSubmissionUncheckedCreateInputSchema ]),
}).strict() ;

export const FormSubmissionUpsertArgsSchema: z.ZodType<Prisma.FormSubmissionUpsertArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereUniqueInputSchema,
  create: z.union([ FormSubmissionCreateInputSchema,FormSubmissionUncheckedCreateInputSchema ]),
  update: z.union([ FormSubmissionUpdateInputSchema,FormSubmissionUncheckedUpdateInputSchema ]),
}).strict() ;

export const FormSubmissionCreateManyArgsSchema: z.ZodType<Prisma.FormSubmissionCreateManyArgs> = z.object({
  data: z.union([ FormSubmissionCreateManyInputSchema,FormSubmissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FormSubmissionDeleteArgsSchema: z.ZodType<Prisma.FormSubmissionDeleteArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  where: FormSubmissionWhereUniqueInputSchema,
}).strict() ;

export const FormSubmissionUpdateArgsSchema: z.ZodType<Prisma.FormSubmissionUpdateArgs> = z.object({
  select: FormSubmissionSelectSchema.optional(),
  include: FormSubmissionIncludeSchema.optional(),
  data: z.union([ FormSubmissionUpdateInputSchema,FormSubmissionUncheckedUpdateInputSchema ]),
  where: FormSubmissionWhereUniqueInputSchema,
}).strict() ;

export const FormSubmissionUpdateManyArgsSchema: z.ZodType<Prisma.FormSubmissionUpdateManyArgs> = z.object({
  data: z.union([ FormSubmissionUpdateManyMutationInputSchema,FormSubmissionUncheckedUpdateManyInputSchema ]),
  where: FormSubmissionWhereInputSchema.optional(),
}).strict() ;

export const FormSubmissionDeleteManyArgsSchema: z.ZodType<Prisma.FormSubmissionDeleteManyArgs> = z.object({
  where: FormSubmissionWhereInputSchema.optional(),
}).strict() ;

export const InputResponseCreateArgsSchema: z.ZodType<Prisma.InputResponseCreateArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  data: z.union([ InputResponseCreateInputSchema,InputResponseUncheckedCreateInputSchema ]),
}).strict() ;

export const InputResponseUpsertArgsSchema: z.ZodType<Prisma.InputResponseUpsertArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereUniqueInputSchema,
  create: z.union([ InputResponseCreateInputSchema,InputResponseUncheckedCreateInputSchema ]),
  update: z.union([ InputResponseUpdateInputSchema,InputResponseUncheckedUpdateInputSchema ]),
}).strict() ;

export const InputResponseCreateManyArgsSchema: z.ZodType<Prisma.InputResponseCreateManyArgs> = z.object({
  data: z.union([ InputResponseCreateManyInputSchema,InputResponseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InputResponseDeleteArgsSchema: z.ZodType<Prisma.InputResponseDeleteArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  where: InputResponseWhereUniqueInputSchema,
}).strict() ;

export const InputResponseUpdateArgsSchema: z.ZodType<Prisma.InputResponseUpdateArgs> = z.object({
  select: InputResponseSelectSchema.optional(),
  include: InputResponseIncludeSchema.optional(),
  data: z.union([ InputResponseUpdateInputSchema,InputResponseUncheckedUpdateInputSchema ]),
  where: InputResponseWhereUniqueInputSchema,
}).strict() ;

export const InputResponseUpdateManyArgsSchema: z.ZodType<Prisma.InputResponseUpdateManyArgs> = z.object({
  data: z.union([ InputResponseUpdateManyMutationInputSchema,InputResponseUncheckedUpdateManyInputSchema ]),
  where: InputResponseWhereInputSchema.optional(),
}).strict() ;

export const InputResponseDeleteManyArgsSchema: z.ZodType<Prisma.InputResponseDeleteManyArgs> = z.object({
  where: InputResponseWhereInputSchema.optional(),
}).strict() ;

export const LocationResponseCreateArgsSchema: z.ZodType<Prisma.LocationResponseCreateArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  data: z.union([ LocationResponseCreateInputSchema,LocationResponseUncheckedCreateInputSchema ]),
}).strict() ;

export const LocationResponseUpsertArgsSchema: z.ZodType<Prisma.LocationResponseUpsertArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereUniqueInputSchema,
  create: z.union([ LocationResponseCreateInputSchema,LocationResponseUncheckedCreateInputSchema ]),
  update: z.union([ LocationResponseUpdateInputSchema,LocationResponseUncheckedUpdateInputSchema ]),
}).strict() ;

export const LocationResponseCreateManyArgsSchema: z.ZodType<Prisma.LocationResponseCreateManyArgs> = z.object({
  data: z.union([ LocationResponseCreateManyInputSchema,LocationResponseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LocationResponseDeleteArgsSchema: z.ZodType<Prisma.LocationResponseDeleteArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  where: LocationResponseWhereUniqueInputSchema,
}).strict() ;

export const LocationResponseUpdateArgsSchema: z.ZodType<Prisma.LocationResponseUpdateArgs> = z.object({
  select: LocationResponseSelectSchema.optional(),
  include: LocationResponseIncludeSchema.optional(),
  data: z.union([ LocationResponseUpdateInputSchema,LocationResponseUncheckedUpdateInputSchema ]),
  where: LocationResponseWhereUniqueInputSchema,
}).strict() ;

export const LocationResponseUpdateManyArgsSchema: z.ZodType<Prisma.LocationResponseUpdateManyArgs> = z.object({
  data: z.union([ LocationResponseUpdateManyMutationInputSchema,LocationResponseUncheckedUpdateManyInputSchema ]),
  where: LocationResponseWhereInputSchema.optional(),
}).strict() ;

export const LocationResponseDeleteManyArgsSchema: z.ZodType<Prisma.LocationResponseDeleteManyArgs> = z.object({
  where: LocationResponseWhereInputSchema.optional(),
}).strict() ;

export const LocationDeleteArgsSchema: z.ZodType<Prisma.LocationDeleteArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationUpdateArgsSchema: z.ZodType<Prisma.LocationUpdateArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  data: z.union([ LocationUpdateInputSchema,LocationUncheckedUpdateInputSchema ]),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationUpdateManyArgsSchema: z.ZodType<Prisma.LocationUpdateManyArgs> = z.object({
  data: z.union([ LocationUpdateManyMutationInputSchema,LocationUncheckedUpdateManyInputSchema ]),
  where: LocationWhereInputSchema.optional(),
}).strict() ;

export const LocationDeleteManyArgsSchema: z.ZodType<Prisma.LocationDeleteManyArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
}).strict() ;

export const DatasetCreateArgsSchema: z.ZodType<Prisma.DatasetCreateArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  data: z.union([ DatasetCreateInputSchema,DatasetUncheckedCreateInputSchema ]),
}).strict() ;

export const DatasetUpsertArgsSchema: z.ZodType<Prisma.DatasetUpsertArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereUniqueInputSchema,
  create: z.union([ DatasetCreateInputSchema,DatasetUncheckedCreateInputSchema ]),
  update: z.union([ DatasetUpdateInputSchema,DatasetUncheckedUpdateInputSchema ]),
}).strict() ;

export const DatasetCreateManyArgsSchema: z.ZodType<Prisma.DatasetCreateManyArgs> = z.object({
  data: z.union([ DatasetCreateManyInputSchema,DatasetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DatasetDeleteArgsSchema: z.ZodType<Prisma.DatasetDeleteArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  where: DatasetWhereUniqueInputSchema,
}).strict() ;

export const DatasetUpdateArgsSchema: z.ZodType<Prisma.DatasetUpdateArgs> = z.object({
  select: DatasetSelectSchema.optional(),
  include: DatasetIncludeSchema.optional(),
  data: z.union([ DatasetUpdateInputSchema,DatasetUncheckedUpdateInputSchema ]),
  where: DatasetWhereUniqueInputSchema,
}).strict() ;

export const DatasetUpdateManyArgsSchema: z.ZodType<Prisma.DatasetUpdateManyArgs> = z.object({
  data: z.union([ DatasetUpdateManyMutationInputSchema,DatasetUncheckedUpdateManyInputSchema ]),
  where: DatasetWhereInputSchema.optional(),
}).strict() ;

export const DatasetDeleteManyArgsSchema: z.ZodType<Prisma.DatasetDeleteManyArgs> = z.object({
  where: DatasetWhereInputSchema.optional(),
}).strict() ;

export const ColumnCreateArgsSchema: z.ZodType<Prisma.ColumnCreateArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  data: z.union([ ColumnCreateInputSchema,ColumnUncheckedCreateInputSchema ]),
}).strict() ;

export const ColumnUpsertArgsSchema: z.ZodType<Prisma.ColumnUpsertArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereUniqueInputSchema,
  create: z.union([ ColumnCreateInputSchema,ColumnUncheckedCreateInputSchema ]),
  update: z.union([ ColumnUpdateInputSchema,ColumnUncheckedUpdateInputSchema ]),
}).strict() ;

export const ColumnCreateManyArgsSchema: z.ZodType<Prisma.ColumnCreateManyArgs> = z.object({
  data: z.union([ ColumnCreateManyInputSchema,ColumnCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ColumnDeleteArgsSchema: z.ZodType<Prisma.ColumnDeleteArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  where: ColumnWhereUniqueInputSchema,
}).strict() ;

export const ColumnUpdateArgsSchema: z.ZodType<Prisma.ColumnUpdateArgs> = z.object({
  select: ColumnSelectSchema.optional(),
  include: ColumnIncludeSchema.optional(),
  data: z.union([ ColumnUpdateInputSchema,ColumnUncheckedUpdateInputSchema ]),
  where: ColumnWhereUniqueInputSchema,
}).strict() ;

export const ColumnUpdateManyArgsSchema: z.ZodType<Prisma.ColumnUpdateManyArgs> = z.object({
  data: z.union([ ColumnUpdateManyMutationInputSchema,ColumnUncheckedUpdateManyInputSchema ]),
  where: ColumnWhereInputSchema.optional(),
}).strict() ;

export const ColumnDeleteManyArgsSchema: z.ZodType<Prisma.ColumnDeleteManyArgs> = z.object({
  where: ColumnWhereInputSchema.optional(),
}).strict() ;

export const RowCreateArgsSchema: z.ZodType<Prisma.RowCreateArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  data: z.union([ RowCreateInputSchema,RowUncheckedCreateInputSchema ]),
}).strict() ;

export const RowUpsertArgsSchema: z.ZodType<Prisma.RowUpsertArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereUniqueInputSchema,
  create: z.union([ RowCreateInputSchema,RowUncheckedCreateInputSchema ]),
  update: z.union([ RowUpdateInputSchema,RowUncheckedUpdateInputSchema ]),
}).strict() ;

export const RowCreateManyArgsSchema: z.ZodType<Prisma.RowCreateManyArgs> = z.object({
  data: z.union([ RowCreateManyInputSchema,RowCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RowDeleteArgsSchema: z.ZodType<Prisma.RowDeleteArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  where: RowWhereUniqueInputSchema,
}).strict() ;

export const RowUpdateArgsSchema: z.ZodType<Prisma.RowUpdateArgs> = z.object({
  select: RowSelectSchema.optional(),
  include: RowIncludeSchema.optional(),
  data: z.union([ RowUpdateInputSchema,RowUncheckedUpdateInputSchema ]),
  where: RowWhereUniqueInputSchema,
}).strict() ;

export const RowUpdateManyArgsSchema: z.ZodType<Prisma.RowUpdateManyArgs> = z.object({
  data: z.union([ RowUpdateManyMutationInputSchema,RowUncheckedUpdateManyInputSchema ]),
  where: RowWhereInputSchema.optional(),
}).strict() ;

export const RowDeleteManyArgsSchema: z.ZodType<Prisma.RowDeleteManyArgs> = z.object({
  where: RowWhereInputSchema.optional(),
}).strict() ;

export const CellValueCreateArgsSchema: z.ZodType<Prisma.CellValueCreateArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  data: z.union([ CellValueCreateInputSchema,CellValueUncheckedCreateInputSchema ]),
}).strict() ;

export const CellValueUpsertArgsSchema: z.ZodType<Prisma.CellValueUpsertArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereUniqueInputSchema,
  create: z.union([ CellValueCreateInputSchema,CellValueUncheckedCreateInputSchema ]),
  update: z.union([ CellValueUpdateInputSchema,CellValueUncheckedUpdateInputSchema ]),
}).strict() ;

export const CellValueCreateManyArgsSchema: z.ZodType<Prisma.CellValueCreateManyArgs> = z.object({
  data: z.union([ CellValueCreateManyInputSchema,CellValueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CellValueDeleteArgsSchema: z.ZodType<Prisma.CellValueDeleteArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  where: CellValueWhereUniqueInputSchema,
}).strict() ;

export const CellValueUpdateArgsSchema: z.ZodType<Prisma.CellValueUpdateArgs> = z.object({
  select: CellValueSelectSchema.optional(),
  include: CellValueIncludeSchema.optional(),
  data: z.union([ CellValueUpdateInputSchema,CellValueUncheckedUpdateInputSchema ]),
  where: CellValueWhereUniqueInputSchema,
}).strict() ;

export const CellValueUpdateManyArgsSchema: z.ZodType<Prisma.CellValueUpdateManyArgs> = z.object({
  data: z.union([ CellValueUpdateManyMutationInputSchema,CellValueUncheckedUpdateManyInputSchema ]),
  where: CellValueWhereInputSchema.optional(),
}).strict() ;

export const CellValueDeleteManyArgsSchema: z.ZodType<Prisma.CellValueDeleteManyArgs> = z.object({
  where: CellValueWhereInputSchema.optional(),
}).strict() ;