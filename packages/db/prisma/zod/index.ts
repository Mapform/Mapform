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

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','hasOnboarded']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','slug','imageUrl','createdAt','updatedAt']);

export const OrganizationMembershipScalarFieldEnumSchema = z.enum(['id','organizationId','userId','role','createdAt','updatedAt']);

export const WorkspaceMembershipScalarFieldEnumSchema = z.enum(['id','userId','workspaceId','role']);

export const WorkspaceScalarFieldEnumSchema = z.enum(['id','name','slug','organizationId','createdAt','updatedAt']);

export const FormScalarFieldEnumSchema = z.enum(['id','name','slug','isRoot','isDirty','isClosed','stepOrder','workspaceId','rootFormId','version','datasetId','createdAt','updatedAt']);

export const StepScalarFieldEnumSchema = z.enum(['id','title','description','zoom','pitch','bearing','formId','locationId','contentViewType','createdAt','updatedAt']);

export const DataTrackScalarFieldEnumSchema = z.enum(['id','name','startStepIndex','endStepIndex','layerIndex','formId']);

export const FormSubmissionScalarFieldEnumSchema = z.enum(['id','publishedFormId','rowId','createdAt','updatedAt']);

export const LocationScalarFieldEnumSchema = z.enum(['id']);

export const DatasetScalarFieldEnumSchema = z.enum(['id','name','workspaceId']);

export const ColumnScalarFieldEnumSchema = z.enum(['id','name','dataType','blockNoteId','datasetId','stepId']);

export const RowScalarFieldEnumSchema = z.enum(['id','datasetId']);

export const CellValueScalarFieldEnumSchema = z.enum(['id','rowId','columnId']);

export const BoolCellScalarFieldEnumSchema = z.enum(['id','cellValueId','value']);

export const StringCellScalarFieldEnumSchema = z.enum(['id','cellValueId','value']);

export const PointCellScalarFieldEnumSchema = z.enum(['id','cellvalueid']);

export const LayerScalarFieldEnumSchema = z.enum(['id','type','dataTrackId']);

export const PointLayerScalarFieldEnumSchema = z.enum(['id','layerId','pointColumnId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const RoleSchema = z.enum(['OWNER','ADMIN','MEMBER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const WorkspaceMembershipRoleSchema = z.enum(['OWNER','MEMBER']);

export type WorkspaceMembershipRoleType = `${z.infer<typeof WorkspaceMembershipRoleSchema>}`

export const ContentViewTypeSchema = z.enum(['FULL','PARTIAL','HIDDEN']);

export type ContentViewTypeType = `${z.infer<typeof ContentViewTypeSchema>}`

export const ColumnTypeSchema = z.enum(['STRING','BOOL','POINT']);

export type ColumnTypeType = `${z.infer<typeof ColumnTypeSchema>}`

export const LayerTypeSchema = z.enum(['POINT']);

export type LayerTypeType = `${z.infer<typeof LayerTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

// ACCOUNT RELATION SCHEMA
//------------------------------------------------------

export type AccountRelations = {
  user: UserWithRelations;
};

export type AccountWithRelations = z.infer<typeof AccountSchema> & AccountRelations

export const AccountWithRelationsSchema: z.ZodType<AccountWithRelations> = AccountSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

// SESSION RELATION SCHEMA
//------------------------------------------------------

export type SessionRelations = {
  user: UserWithRelations;
};

export type SessionWithRelations = z.infer<typeof SessionSchema> & SessionRelations

export const SessionWithRelationsSchema: z.ZodType<SessionWithRelations> = SessionSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  hasOnboarded: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  accounts: AccountWithRelations[];
  sessions: SessionWithRelations[];
  organizationMemberships: OrganizationMembershipWithRelations[];
  workspaceMemberships: WorkspaceMembershipWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  accounts: z.lazy(() => AccountWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  organizationMemberships: z.lazy(() => OrganizationMembershipWithRelationsSchema).array(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  id: z.string().cuid(),
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
  role: RoleSchema,
  id: z.string().cuid(),
  organizationId: z.string(),
  userId: z.string(),
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
  id: z.string().cuid(),
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
  id: z.string().cuid(),
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
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean(),
  isDirty: z.boolean(),
  isClosed: z.boolean(),
  stepOrder: z.string().array(),
  workspaceId: z.string(),
  rootFormId: z.string().nullable(),
  version: z.number().int().nullable(),
  datasetId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Form = z.infer<typeof FormSchema>

// FORM RELATION SCHEMA
//------------------------------------------------------

export type FormRelations = {
  steps: StepWithRelations[];
  dataTracks: DataTrackWithRelations[];
  workspace: WorkspaceWithRelations;
  formSubmission: FormSubmissionWithRelations[];
  rootForm?: FormWithRelations | null;
  formVersions: FormWithRelations[];
  dataset?: DatasetWithRelations | null;
};

export type FormWithRelations = z.infer<typeof FormSchema> & FormRelations

export const FormWithRelationsSchema: z.ZodType<FormWithRelations> = FormSchema.merge(z.object({
  steps: z.lazy(() => StepWithRelationsSchema).array(),
  dataTracks: z.lazy(() => DataTrackWithRelationsSchema).array(),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema).array(),
  rootForm: z.lazy(() => FormWithRelationsSchema).nullable(),
  formVersions: z.lazy(() => FormWithRelationsSchema).array(),
  dataset: z.lazy(() => DatasetWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// STEP SCHEMA
/////////////////////////////////////////

export const StepSchema = z.object({
  contentViewType: ContentViewTypeSchema,
  id: z.string().cuid(),
  title: z.string().nullable(),
  /**
   * [DocumentType]
   */
  description: JsonValueSchema,
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
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
  datasetColumns: ColumnWithRelations[];
};

export type StepWithRelations = Omit<z.infer<typeof StepSchema>, "description"> & {
  description?: JsonValueType | null;
} & StepRelations

export const StepWithRelationsSchema: z.ZodType<StepWithRelations> = StepSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema).nullable(),
  location: z.lazy(() => LocationWithRelationsSchema),
  datasetColumns: z.lazy(() => ColumnWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// DATA TRACK SCHEMA
/////////////////////////////////////////

export const DataTrackSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int(),
  formId: z.string().nullable(),
})

export type DataTrack = z.infer<typeof DataTrackSchema>

// DATA TRACK RELATION SCHEMA
//------------------------------------------------------

export type DataTrackRelations = {
  form?: FormWithRelations | null;
  layer?: LayerWithRelations | null;
};

export type DataTrackWithRelations = z.infer<typeof DataTrackSchema> & DataTrackRelations

export const DataTrackWithRelationsSchema: z.ZodType<DataTrackWithRelations> = DataTrackSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema).nullable(),
  layer: z.lazy(() => LayerWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// FORM SUBMISSION SCHEMA
/////////////////////////////////////////

export const FormSubmissionSchema = z.object({
  id: z.string().cuid(),
  publishedFormId: z.string(),
  rowId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FormSubmission = z.infer<typeof FormSubmissionSchema>

// FORM SUBMISSION RELATION SCHEMA
//------------------------------------------------------

export type FormSubmissionRelations = {
  publishedForm: FormWithRelations;
  row: RowWithRelations;
};

export type FormSubmissionWithRelations = z.infer<typeof FormSubmissionSchema> & FormSubmissionRelations

export const FormSubmissionWithRelationsSchema: z.ZodType<FormSubmissionWithRelations> = FormSubmissionSchema.merge(z.object({
  publishedForm: z.lazy(() => FormWithRelationsSchema),
  row: z.lazy(() => RowWithRelationsSchema),
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
};

export type LocationWithRelations = z.infer<typeof LocationSchema> & LocationRelations

export const LocationWithRelationsSchema: z.ZodType<LocationWithRelations> = LocationSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// DATASET SCHEMA
/////////////////////////////////////////

export const DatasetSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  workspaceId: z.string(),
})

export type Dataset = z.infer<typeof DatasetSchema>

// DATASET RELATION SCHEMA
//------------------------------------------------------

export type DatasetRelations = {
  columns: ColumnWithRelations[];
  rows: RowWithRelations[];
  form?: FormWithRelations | null;
  workspace: WorkspaceWithRelations;
};

export type DatasetWithRelations = z.infer<typeof DatasetSchema> & DatasetRelations

export const DatasetWithRelationsSchema: z.ZodType<DatasetWithRelations> = DatasetSchema.merge(z.object({
  columns: z.lazy(() => ColumnWithRelationsSchema).array(),
  rows: z.lazy(() => RowWithRelationsSchema).array(),
  form: z.lazy(() => FormWithRelationsSchema).nullable(),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
}))

/////////////////////////////////////////
// COLUMN SCHEMA
/////////////////////////////////////////

export const ColumnSchema = z.object({
  dataType: ColumnTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
  blockNoteId: z.string().nullable(),
  datasetId: z.string(),
  stepId: z.string().nullable(),
})

export type Column = z.infer<typeof ColumnSchema>

// COLUMN RELATION SCHEMA
//------------------------------------------------------

export type ColumnRelations = {
  dataset: DatasetWithRelations;
  step?: StepWithRelations | null;
  cellValues: CellValueWithRelations[];
  pointLayers: PointLayerWithRelations[];
};

export type ColumnWithRelations = z.infer<typeof ColumnSchema> & ColumnRelations

export const ColumnWithRelationsSchema: z.ZodType<ColumnWithRelations> = ColumnSchema.merge(z.object({
  dataset: z.lazy(() => DatasetWithRelationsSchema),
  step: z.lazy(() => StepWithRelationsSchema).nullable(),
  cellValues: z.lazy(() => CellValueWithRelationsSchema).array(),
  pointLayers: z.lazy(() => PointLayerWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ROW SCHEMA
/////////////////////////////////////////

export const RowSchema = z.object({
  id: z.string().cuid(),
  datasetId: z.string(),
})

export type Row = z.infer<typeof RowSchema>

// ROW RELATION SCHEMA
//------------------------------------------------------

export type RowRelations = {
  dataset: DatasetWithRelations;
  formSubmission?: FormSubmissionWithRelations | null;
  cellValues: CellValueWithRelations[];
};

export type RowWithRelations = z.infer<typeof RowSchema> & RowRelations

export const RowWithRelationsSchema: z.ZodType<RowWithRelations> = RowSchema.merge(z.object({
  dataset: z.lazy(() => DatasetWithRelationsSchema),
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema).nullable(),
  cellValues: z.lazy(() => CellValueWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CELL VALUE SCHEMA
/////////////////////////////////////////

export const CellValueSchema = z.object({
  id: z.string().cuid(),
  rowId: z.string(),
  columnId: z.string(),
})

export type CellValue = z.infer<typeof CellValueSchema>

// CELL VALUE RELATION SCHEMA
//------------------------------------------------------

export type CellValueRelations = {
  column: ColumnWithRelations;
  row: RowWithRelations;
  boolCell?: BoolCellWithRelations | null;
  stringCell?: StringCellWithRelations | null;
  pointCell?: PointCellWithRelations | null;
};

export type CellValueWithRelations = z.infer<typeof CellValueSchema> & CellValueRelations

export const CellValueWithRelationsSchema: z.ZodType<CellValueWithRelations> = CellValueSchema.merge(z.object({
  column: z.lazy(() => ColumnWithRelationsSchema),
  row: z.lazy(() => RowWithRelationsSchema),
  boolCell: z.lazy(() => BoolCellWithRelationsSchema).nullable(),
  stringCell: z.lazy(() => StringCellWithRelationsSchema).nullable(),
  pointCell: z.lazy(() => PointCellWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// BOOL CELL SCHEMA
/////////////////////////////////////////

export const BoolCellSchema = z.object({
  id: z.string().cuid(),
  cellValueId: z.string(),
  value: z.boolean(),
})

export type BoolCell = z.infer<typeof BoolCellSchema>

// BOOL CELL RELATION SCHEMA
//------------------------------------------------------

export type BoolCellRelations = {
  cellValue: CellValueWithRelations;
};

export type BoolCellWithRelations = z.infer<typeof BoolCellSchema> & BoolCellRelations

export const BoolCellWithRelationsSchema: z.ZodType<BoolCellWithRelations> = BoolCellSchema.merge(z.object({
  cellValue: z.lazy(() => CellValueWithRelationsSchema),
}))

/////////////////////////////////////////
// STRING CELL SCHEMA
/////////////////////////////////////////

export const StringCellSchema = z.object({
  id: z.string().cuid(),
  cellValueId: z.string(),
  value: z.string(),
})

export type StringCell = z.infer<typeof StringCellSchema>

// STRING CELL RELATION SCHEMA
//------------------------------------------------------

export type StringCellRelations = {
  cellValue: CellValueWithRelations;
};

export type StringCellWithRelations = z.infer<typeof StringCellSchema> & StringCellRelations

export const StringCellWithRelationsSchema: z.ZodType<StringCellWithRelations> = StringCellSchema.merge(z.object({
  cellValue: z.lazy(() => CellValueWithRelationsSchema),
}))

/////////////////////////////////////////
// POINT CELL SCHEMA
/////////////////////////////////////////

export const PointCellSchema = z.object({
  id: z.string().cuid(),
  cellvalueid: z.string(),
})

export type PointCell = z.infer<typeof PointCellSchema>

// POINT CELL RELATION SCHEMA
//------------------------------------------------------

export type PointCellRelations = {
  cellValue: CellValueWithRelations;
};

export type PointCellWithRelations = z.infer<typeof PointCellSchema> & PointCellRelations

export const PointCellWithRelationsSchema: z.ZodType<PointCellWithRelations> = PointCellSchema.merge(z.object({
  cellValue: z.lazy(() => CellValueWithRelationsSchema),
}))

/////////////////////////////////////////
// LAYER SCHEMA
/////////////////////////////////////////

export const LayerSchema = z.object({
  type: LayerTypeSchema,
  id: z.string().cuid(),
  dataTrackId: z.string(),
})

export type Layer = z.infer<typeof LayerSchema>

// LAYER RELATION SCHEMA
//------------------------------------------------------

export type LayerRelations = {
  pointLayer?: PointLayerWithRelations | null;
  dataTrack: DataTrackWithRelations;
};

export type LayerWithRelations = z.infer<typeof LayerSchema> & LayerRelations

export const LayerWithRelationsSchema: z.ZodType<LayerWithRelations> = LayerSchema.merge(z.object({
  pointLayer: z.lazy(() => PointLayerWithRelationsSchema).nullable(),
  dataTrack: z.lazy(() => DataTrackWithRelationsSchema),
}))

/////////////////////////////////////////
// POINT LAYER SCHEMA
/////////////////////////////////////////

export const PointLayerSchema = z.object({
  id: z.string().cuid(),
  layerId: z.string(),
  pointColumnId: z.string(),
})

export type PointLayer = z.infer<typeof PointLayerSchema>

// POINT LAYER RELATION SCHEMA
//------------------------------------------------------

export type PointLayerRelations = {
  layer: LayerWithRelations;
  pointColumn: ColumnWithRelations;
};

export type PointLayerWithRelations = z.infer<typeof PointLayerSchema> & PointLayerRelations

export const PointLayerWithRelationsSchema: z.ZodType<PointLayerWithRelations> = PointLayerSchema.merge(z.object({
  layer: z.lazy(() => LayerWithRelationsSchema),
  pointColumn: z.lazy(() => ColumnWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
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
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  organizationMemberships: z.boolean().optional(),
  workspaceMemberships: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  organizationMemberships: z.union([z.boolean(),z.lazy(() => OrganizationMembershipFindManyArgsSchema)]).optional(),
  workspaceMemberships: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
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
  dataTracks: z.union([z.boolean(),z.lazy(() => DataTrackFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionFindManyArgsSchema)]).optional(),
  rootForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  formVersions: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
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
  dataTracks: z.boolean().optional(),
  formSubmission: z.boolean().optional(),
  formVersions: z.boolean().optional(),
}).strict();

export const FormSelectSchema: z.ZodType<Prisma.FormSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  rootFormId: z.boolean().optional(),
  version: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  steps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  dataTracks: z.union([z.boolean(),z.lazy(() => DataTrackFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionFindManyArgsSchema)]).optional(),
  rootForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  formVersions: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict()

// STEP
//------------------------------------------------------

export const StepIncludeSchema: z.ZodType<Prisma.StepInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  datasetColumns: z.union([z.boolean(),z.lazy(() => ColumnFindManyArgsSchema)]).optional(),
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
  datasetColumns: z.boolean().optional(),
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
  datasetColumns: z.union([z.boolean(),z.lazy(() => ColumnFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => StepCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DATA TRACK
//------------------------------------------------------

export const DataTrackIncludeSchema: z.ZodType<Prisma.DataTrackInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  layer: z.union([z.boolean(),z.lazy(() => LayerArgsSchema)]).optional(),
}).strict()

export const DataTrackArgsSchema: z.ZodType<Prisma.DataTrackDefaultArgs> = z.object({
  select: z.lazy(() => DataTrackSelectSchema).optional(),
  include: z.lazy(() => DataTrackIncludeSchema).optional(),
}).strict();

export const DataTrackSelectSchema: z.ZodType<Prisma.DataTrackSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  startStepIndex: z.boolean().optional(),
  endStepIndex: z.boolean().optional(),
  layerIndex: z.boolean().optional(),
  formId: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  layer: z.union([z.boolean(),z.lazy(() => LayerArgsSchema)]).optional(),
}).strict()

// FORM SUBMISSION
//------------------------------------------------------

export const FormSubmissionIncludeSchema: z.ZodType<Prisma.FormSubmissionInclude> = z.object({
  publishedForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

export const FormSubmissionArgsSchema: z.ZodType<Prisma.FormSubmissionDefaultArgs> = z.object({
  select: z.lazy(() => FormSubmissionSelectSchema).optional(),
  include: z.lazy(() => FormSubmissionIncludeSchema).optional(),
}).strict();

export const FormSubmissionSelectSchema: z.ZodType<Prisma.FormSubmissionSelect> = z.object({
  id: z.boolean().optional(),
  publishedFormId: z.boolean().optional(),
  rowId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  publishedForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

// LOCATION
//------------------------------------------------------

export const LocationIncludeSchema: z.ZodType<Prisma.LocationInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const LocationArgsSchema: z.ZodType<Prisma.LocationDefaultArgs> = z.object({
  select: z.lazy(() => LocationSelectSchema).optional(),
  include: z.lazy(() => LocationIncludeSchema).optional(),
}).strict();

export const LocationSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
  id: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// DATASET
//------------------------------------------------------

export const DatasetIncludeSchema: z.ZodType<Prisma.DatasetInclude> = z.object({
  columns: z.union([z.boolean(),z.lazy(() => ColumnFindManyArgsSchema)]).optional(),
  rows: z.union([z.boolean(),z.lazy(() => RowFindManyArgsSchema)]).optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
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
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DatasetCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COLUMN
//------------------------------------------------------

export const ColumnIncludeSchema: z.ZodType<Prisma.ColumnInclude> = z.object({
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  pointLayers: z.union([z.boolean(),z.lazy(() => PointLayerFindManyArgsSchema)]).optional(),
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
  pointLayers: z.boolean().optional(),
}).strict();

export const ColumnSelectSchema: z.ZodType<Prisma.ColumnSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  dataType: z.boolean().optional(),
  blockNoteId: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  stepId: z.boolean().optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  pointLayers: z.union([z.boolean(),z.lazy(() => PointLayerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ColumnCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROW
//------------------------------------------------------

export const RowIncludeSchema: z.ZodType<Prisma.RowInclude> = z.object({
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
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
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  cellValues: z.union([z.boolean(),z.lazy(() => CellValueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RowCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CELL VALUE
//------------------------------------------------------

export const CellValueIncludeSchema: z.ZodType<Prisma.CellValueInclude> = z.object({
  column: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
  boolCell: z.union([z.boolean(),z.lazy(() => BoolCellArgsSchema)]).optional(),
  stringCell: z.union([z.boolean(),z.lazy(() => StringCellArgsSchema)]).optional(),
  pointCell: z.union([z.boolean(),z.lazy(() => PointCellArgsSchema)]).optional(),
}).strict()

export const CellValueArgsSchema: z.ZodType<Prisma.CellValueDefaultArgs> = z.object({
  select: z.lazy(() => CellValueSelectSchema).optional(),
  include: z.lazy(() => CellValueIncludeSchema).optional(),
}).strict();

export const CellValueSelectSchema: z.ZodType<Prisma.CellValueSelect> = z.object({
  id: z.boolean().optional(),
  rowId: z.boolean().optional(),
  columnId: z.boolean().optional(),
  column: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
  boolCell: z.union([z.boolean(),z.lazy(() => BoolCellArgsSchema)]).optional(),
  stringCell: z.union([z.boolean(),z.lazy(() => StringCellArgsSchema)]).optional(),
  pointCell: z.union([z.boolean(),z.lazy(() => PointCellArgsSchema)]).optional(),
}).strict()

// BOOL CELL
//------------------------------------------------------

export const BoolCellIncludeSchema: z.ZodType<Prisma.BoolCellInclude> = z.object({
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

export const BoolCellArgsSchema: z.ZodType<Prisma.BoolCellDefaultArgs> = z.object({
  select: z.lazy(() => BoolCellSelectSchema).optional(),
  include: z.lazy(() => BoolCellIncludeSchema).optional(),
}).strict();

export const BoolCellSelectSchema: z.ZodType<Prisma.BoolCellSelect> = z.object({
  id: z.boolean().optional(),
  cellValueId: z.boolean().optional(),
  value: z.boolean().optional(),
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

// STRING CELL
//------------------------------------------------------

export const StringCellIncludeSchema: z.ZodType<Prisma.StringCellInclude> = z.object({
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

export const StringCellArgsSchema: z.ZodType<Prisma.StringCellDefaultArgs> = z.object({
  select: z.lazy(() => StringCellSelectSchema).optional(),
  include: z.lazy(() => StringCellIncludeSchema).optional(),
}).strict();

export const StringCellSelectSchema: z.ZodType<Prisma.StringCellSelect> = z.object({
  id: z.boolean().optional(),
  cellValueId: z.boolean().optional(),
  value: z.boolean().optional(),
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

// POINT CELL
//------------------------------------------------------

export const PointCellIncludeSchema: z.ZodType<Prisma.PointCellInclude> = z.object({
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

export const PointCellArgsSchema: z.ZodType<Prisma.PointCellDefaultArgs> = z.object({
  select: z.lazy(() => PointCellSelectSchema).optional(),
  include: z.lazy(() => PointCellIncludeSchema).optional(),
}).strict();

export const PointCellSelectSchema: z.ZodType<Prisma.PointCellSelect> = z.object({
  id: z.boolean().optional(),
  cellvalueid: z.boolean().optional(),
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

// LAYER
//------------------------------------------------------

export const LayerIncludeSchema: z.ZodType<Prisma.LayerInclude> = z.object({
  pointLayer: z.union([z.boolean(),z.lazy(() => PointLayerArgsSchema)]).optional(),
  dataTrack: z.union([z.boolean(),z.lazy(() => DataTrackArgsSchema)]).optional(),
}).strict()

export const LayerArgsSchema: z.ZodType<Prisma.LayerDefaultArgs> = z.object({
  select: z.lazy(() => LayerSelectSchema).optional(),
  include: z.lazy(() => LayerIncludeSchema).optional(),
}).strict();

export const LayerSelectSchema: z.ZodType<Prisma.LayerSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  dataTrackId: z.boolean().optional(),
  pointLayer: z.union([z.boolean(),z.lazy(() => PointLayerArgsSchema)]).optional(),
  dataTrack: z.union([z.boolean(),z.lazy(() => DataTrackArgsSchema)]).optional(),
}).strict()

// POINT LAYER
//------------------------------------------------------

export const PointLayerIncludeSchema: z.ZodType<Prisma.PointLayerInclude> = z.object({
  layer: z.union([z.boolean(),z.lazy(() => LayerArgsSchema)]).optional(),
  pointColumn: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
}).strict()

export const PointLayerArgsSchema: z.ZodType<Prisma.PointLayerDefaultArgs> = z.object({
  select: z.lazy(() => PointLayerSelectSchema).optional(),
  include: z.lazy(() => PointLayerIncludeSchema).optional(),
}).strict();

export const PointLayerSelectSchema: z.ZodType<Prisma.PointLayerSelect> = z.object({
  id: z.boolean().optional(),
  layerId: z.boolean().optional(),
  pointColumnId: z.boolean().optional(),
  layer: z.union([z.boolean(),z.lazy(() => LayerArgsSchema)]).optional(),
  pointColumn: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
}).strict()

// CREATE MANY ACCOUNT AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyAccountAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyAccountAndReturnOutputTypeInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const CreateManyAccountAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyAccountAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyAccountAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyAccountAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyAccountAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyAccountAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// CREATE MANY SESSION AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManySessionAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManySessionAndReturnOutputTypeInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const CreateManySessionAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManySessionAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManySessionAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManySessionAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManySessionAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManySessionAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// CREATE MANY USER AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyUserAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyUserAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  hasOnboarded: z.boolean().optional(),
}).strict()

// CREATE MANY VERIFICATION TOKEN AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyVerificationTokenAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyVerificationTokenAndReturnOutputTypeSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// CREATE MANY ORGANIZATION AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyOrganizationAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyOrganizationAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// CREATE MANY ORGANIZATION MEMBERSHIP AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyOrganizationMembershipAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyOrganizationMembershipAndReturnOutputTypeInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const CreateManyOrganizationMembershipAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyOrganizationMembershipAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyOrganizationMembershipAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyOrganizationMembershipAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyOrganizationMembershipAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyOrganizationMembershipAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  userId: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// CREATE MANY WORKSPACE MEMBERSHIP AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyWorkspaceMembershipAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyWorkspaceMembershipAndReturnOutputTypeInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
}).strict()

export const CreateManyWorkspaceMembershipAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyWorkspaceMembershipAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyWorkspaceMembershipAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyWorkspaceMembershipAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyWorkspaceMembershipAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyWorkspaceMembershipAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  role: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
}).strict()

// CREATE MANY WORKSPACE AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyWorkspaceAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyWorkspaceAndReturnOutputTypeInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const CreateManyWorkspaceAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyWorkspaceAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyWorkspaceAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyWorkspaceAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyWorkspaceAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyWorkspaceAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// CREATE MANY FORM AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyFormAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyFormAndReturnOutputTypeInclude> = z.object({
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  rootForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
}).strict()

export const CreateManyFormAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyFormAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyFormAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyFormAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyFormAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyFormAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  rootFormId: z.boolean().optional(),
  version: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  rootForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
}).strict()

// CREATE MANY STEP AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyStepAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyStepAndReturnOutputTypeInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
}).strict()

export const CreateManyStepAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyStepAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyStepAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyStepAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyStepAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyStepAndReturnOutputTypeSelect> = z.object({
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
}).strict()

// CREATE MANY DATA TRACK AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyDataTrackAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyDataTrackAndReturnOutputTypeInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
}).strict()

export const CreateManyDataTrackAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyDataTrackAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyDataTrackAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyDataTrackAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyDataTrackAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyDataTrackAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  startStepIndex: z.boolean().optional(),
  endStepIndex: z.boolean().optional(),
  layerIndex: z.boolean().optional(),
  formId: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
}).strict()

// CREATE MANY FORM SUBMISSION AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyFormSubmissionAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyFormSubmissionAndReturnOutputTypeInclude> = z.object({
  publishedForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

export const CreateManyFormSubmissionAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyFormSubmissionAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyFormSubmissionAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyFormSubmissionAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyFormSubmissionAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyFormSubmissionAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  publishedFormId: z.boolean().optional(),
  rowId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  publishedForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

// CREATE MANY DATASET AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyDatasetAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyDatasetAndReturnOutputTypeInclude> = z.object({
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
}).strict()

export const CreateManyDatasetAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyDatasetAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyDatasetAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyDatasetAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyDatasetAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyDatasetAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
}).strict()

// CREATE MANY COLUMN AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyColumnAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyColumnAndReturnOutputTypeInclude> = z.object({
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const CreateManyColumnAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyColumnAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyColumnAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyColumnAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyColumnAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyColumnAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  dataType: z.boolean().optional(),
  blockNoteId: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  stepId: z.boolean().optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// CREATE MANY ROW AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyRowAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyRowAndReturnOutputTypeInclude> = z.object({
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
}).strict()

export const CreateManyRowAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyRowAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyRowAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyRowAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyRowAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyRowAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  datasetId: z.boolean().optional(),
  dataset: z.union([z.boolean(),z.lazy(() => DatasetArgsSchema)]).optional(),
}).strict()

// CREATE MANY CELL VALUE AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyCellValueAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyCellValueAndReturnOutputTypeInclude> = z.object({
  column: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

export const CreateManyCellValueAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyCellValueAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyCellValueAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyCellValueAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyCellValueAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyCellValueAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  rowId: z.boolean().optional(),
  columnId: z.boolean().optional(),
  column: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
  row: z.union([z.boolean(),z.lazy(() => RowArgsSchema)]).optional(),
}).strict()

// CREATE MANY BOOL CELL AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyBoolCellAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyBoolCellAndReturnOutputTypeInclude> = z.object({
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

export const CreateManyBoolCellAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyBoolCellAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyBoolCellAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyBoolCellAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyBoolCellAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyBoolCellAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  cellValueId: z.boolean().optional(),
  value: z.boolean().optional(),
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

// CREATE MANY STRING CELL AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyStringCellAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyStringCellAndReturnOutputTypeInclude> = z.object({
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

export const CreateManyStringCellAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyStringCellAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyStringCellAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyStringCellAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyStringCellAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyStringCellAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  cellValueId: z.boolean().optional(),
  value: z.boolean().optional(),
  cellValue: z.union([z.boolean(),z.lazy(() => CellValueArgsSchema)]).optional(),
}).strict()

// CREATE MANY LAYER AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyLayerAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyLayerAndReturnOutputTypeInclude> = z.object({
  dataTrack: z.union([z.boolean(),z.lazy(() => DataTrackArgsSchema)]).optional(),
}).strict()

export const CreateManyLayerAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyLayerAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyLayerAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyLayerAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyLayerAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyLayerAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  dataTrackId: z.boolean().optional(),
  dataTrack: z.union([z.boolean(),z.lazy(() => DataTrackArgsSchema)]).optional(),
}).strict()

// CREATE MANY POINT LAYER AND RETURN OUTPUT TYPE
//------------------------------------------------------

export const CreateManyPointLayerAndReturnOutputTypeIncludeSchema: z.ZodType<Prisma.CreateManyPointLayerAndReturnOutputTypeInclude> = z.object({
  layer: z.union([z.boolean(),z.lazy(() => LayerArgsSchema)]).optional(),
  pointColumn: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
}).strict()

export const CreateManyPointLayerAndReturnOutputTypeArgsSchema: z.ZodType<Prisma.CreateManyPointLayerAndReturnOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CreateManyPointLayerAndReturnOutputTypeSelectSchema).optional(),
  include: z.lazy(() => CreateManyPointLayerAndReturnOutputTypeIncludeSchema).optional(),
}).strict();

export const CreateManyPointLayerAndReturnOutputTypeSelectSchema: z.ZodType<Prisma.CreateManyPointLayerAndReturnOutputTypeSelect> = z.object({
  id: z.boolean().optional(),
  layerId: z.boolean().optional(),
  pointColumnId: z.boolean().optional(),
  layer: z.union([z.boolean(),z.lazy(() => LayerArgsSchema)]).optional(),
  pointColumn: z.union([z.boolean(),z.lazy(() => ColumnArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    sessionToken: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    sessionToken: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hasOnboarded: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hasOnboarded: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipOrderByRelationAggregateInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hasOnboarded: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hasOnboarded: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  hasOnboarded: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.object({
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema)
})
.and(z.object({
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
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
    id: z.string().cuid(),
    slug: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
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
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
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
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
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
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
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
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
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
    id: z.string().cuid(),
    organizationId_slug: z.lazy(() => WorkspaceOrganizationIdSlugCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    organizationId_slug: z.lazy(() => WorkspaceOrganizationIdSlugCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
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
  isRoot: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rootFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  datasetId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  steps: z.lazy(() => StepListRelationFilterSchema).optional(),
  dataTracks: z.lazy(() => DataTrackListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionListRelationFilterSchema).optional(),
  rootForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  formVersions: z.lazy(() => FormListRelationFilterSchema).optional(),
  dataset: z.union([ z.lazy(() => DatasetNullableRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional().nullable(),
}).strict();

export const FormOrderByWithRelationInputSchema: z.ZodType<Prisma.FormOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isRoot: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  rootFormId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  version: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  datasetId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => StepOrderByRelationAggregateInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackOrderByRelationAggregateInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByRelationAggregateInputSchema).optional(),
  rootForm: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  formVersions: z.lazy(() => FormOrderByRelationAggregateInputSchema).optional(),
  dataset: z.lazy(() => DatasetOrderByWithRelationInputSchema).optional()
}).strict();

export const FormWhereUniqueInputSchema: z.ZodType<Prisma.FormWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    datasetId: z.string(),
    workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
    datasetId: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    datasetId: z.string(),
    workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema),
  }),
  z.object({
    datasetId: z.string(),
  }),
  z.object({
    workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  datasetId: z.string().optional(),
  workspaceId_slug_version: z.lazy(() => FormWorkspaceIdSlugVersionCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRoot: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rootFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  steps: z.lazy(() => StepListRelationFilterSchema).optional(),
  dataTracks: z.lazy(() => DataTrackListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionListRelationFilterSchema).optional(),
  rootForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  formVersions: z.lazy(() => FormListRelationFilterSchema).optional(),
  dataset: z.union([ z.lazy(() => DatasetNullableRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional().nullable(),
}).strict());

export const FormOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isRoot: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  rootFormId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  version: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  datasetId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  isRoot: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rootFormId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  datasetId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
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
  zoom: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  datasetColumns: z.lazy(() => ColumnListRelationFilterSchema).optional()
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
  datasetColumns: z.lazy(() => ColumnOrderByRelationAggregateInputSchema).optional()
}).strict();

export const StepWhereUniqueInputSchema: z.ZodType<Prisma.StepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    locationId: z.number().int()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    locationId: z.number().int(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  locationId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.lazy(() => JsonNullableFilterSchema).optional(),
  zoom: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  datasetColumns: z.lazy(() => ColumnListRelationFilterSchema).optional()
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
  zoom: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeWithAggregatesFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DataTrackWhereInputSchema: z.ZodType<Prisma.DataTrackWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DataTrackWhereInputSchema),z.lazy(() => DataTrackWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DataTrackWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DataTrackWhereInputSchema),z.lazy(() => DataTrackWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  startStepIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endStepIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  layerIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  layer: z.union([ z.lazy(() => LayerNullableRelationFilterSchema),z.lazy(() => LayerWhereInputSchema) ]).optional().nullable(),
}).strict();

export const DataTrackOrderByWithRelationInputSchema: z.ZodType<Prisma.DataTrackOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional(),
  formId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  layer: z.lazy(() => LayerOrderByWithRelationInputSchema).optional()
}).strict();

export const DataTrackWhereUniqueInputSchema: z.ZodType<Prisma.DataTrackWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => DataTrackWhereInputSchema),z.lazy(() => DataTrackWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DataTrackWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DataTrackWhereInputSchema),z.lazy(() => DataTrackWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  startStepIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  endStepIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  layerIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  layer: z.union([ z.lazy(() => LayerNullableRelationFilterSchema),z.lazy(() => LayerWhereInputSchema) ]).optional().nullable(),
}).strict());

export const DataTrackOrderByWithAggregationInputSchema: z.ZodType<Prisma.DataTrackOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional(),
  formId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => DataTrackCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DataTrackAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DataTrackMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DataTrackMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DataTrackSumOrderByAggregateInputSchema).optional()
}).strict();

export const DataTrackScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DataTrackScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DataTrackScalarWhereWithAggregatesInputSchema),z.lazy(() => DataTrackScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DataTrackScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DataTrackScalarWhereWithAggregatesInputSchema),z.lazy(() => DataTrackScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  startStepIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  endStepIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  layerIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const FormSubmissionWhereInputSchema: z.ZodType<Prisma.FormSubmissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedFormId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rowId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  publishedForm: z.union([ z.lazy(() => FormRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional(),
  row: z.union([ z.lazy(() => RowRelationFilterSchema),z.lazy(() => RowWhereInputSchema) ]).optional(),
}).strict();

export const FormSubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.FormSubmissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  publishedForm: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  row: z.lazy(() => RowOrderByWithRelationInputSchema).optional()
}).strict();

export const FormSubmissionWhereUniqueInputSchema: z.ZodType<Prisma.FormSubmissionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    rowId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    rowId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  rowId: z.string().optional(),
  AND: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  publishedFormId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  publishedForm: z.union([ z.lazy(() => FormRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional(),
  row: z.union([ z.lazy(() => RowRelationFilterSchema),z.lazy(() => RowWhereInputSchema) ]).optional(),
}).strict());

export const FormSubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormSubmissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
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
  publishedFormId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rowId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
}).strict();

export const LocationOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
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
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict();

export const DatasetOrderByWithRelationInputSchema: z.ZodType<Prisma.DatasetOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  columns: z.lazy(() => ColumnOrderByRelationAggregateInputSchema).optional(),
  rows: z.lazy(() => RowOrderByRelationAggregateInputSchema).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional()
}).strict();

export const DatasetWhereUniqueInputSchema: z.ZodType<Prisma.DatasetWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => DatasetWhereInputSchema),z.lazy(() => DatasetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatasetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatasetWhereInputSchema),z.lazy(() => DatasetWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  columns: z.lazy(() => ColumnListRelationFilterSchema).optional(),
  rows: z.lazy(() => RowListRelationFilterSchema).optional(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
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
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional(),
  pointLayers: z.lazy(() => PointLayerListRelationFilterSchema).optional()
}).strict();

export const ColumnOrderByWithRelationInputSchema: z.ZodType<Prisma.ColumnOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dataset: z.lazy(() => DatasetOrderByWithRelationInputSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional(),
  cellValues: z.lazy(() => CellValueOrderByRelationAggregateInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ColumnWhereUniqueInputSchema: z.ZodType<Prisma.ColumnWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    blockNoteId: z.string(),
    datasetId_name: z.lazy(() => ColumnDatasetIdNameCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
    blockNoteId: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    datasetId_name: z.lazy(() => ColumnDatasetIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    blockNoteId: z.string(),
    datasetId_name: z.lazy(() => ColumnDatasetIdNameCompoundUniqueInputSchema),
  }),
  z.object({
    blockNoteId: z.string(),
  }),
  z.object({
    datasetId_name: z.lazy(() => ColumnDatasetIdNameCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  blockNoteId: z.string().optional(),
  datasetId_name: z.lazy(() => ColumnDatasetIdNameCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ColumnWhereInputSchema),z.lazy(() => ColumnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnWhereInputSchema),z.lazy(() => ColumnWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional(),
  pointLayers: z.lazy(() => PointLayerListRelationFilterSchema).optional()
}).strict());

export const ColumnOrderByWithAggregationInputSchema: z.ZodType<Prisma.ColumnOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ColumnCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ColumnMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ColumnMinOrderByAggregateInputSchema).optional()
}).strict();

export const ColumnScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ColumnScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema),z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema),z.lazy(() => ColumnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeWithAggregatesFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  datasetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const RowWhereInputSchema: z.ZodType<Prisma.RowWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionNullableRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional()
}).strict();

export const RowOrderByWithRelationInputSchema: z.ZodType<Prisma.RowOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  dataset: z.lazy(() => DatasetOrderByWithRelationInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByWithRelationInputSchema).optional(),
  cellValues: z.lazy(() => CellValueOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RowWhereUniqueInputSchema: z.ZodType<Prisma.RowWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowWhereInputSchema),z.lazy(() => RowWhereInputSchema).array() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataset: z.union([ z.lazy(() => DatasetRelationFilterSchema),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionNullableRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueListRelationFilterSchema).optional()
}).strict());

export const RowOrderByWithAggregationInputSchema: z.ZodType<Prisma.RowOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RowCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RowMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RowMinOrderByAggregateInputSchema).optional()
}).strict();

export const RowScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RowScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RowScalarWhereWithAggregatesInputSchema),z.lazy(() => RowScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RowScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RowScalarWhereWithAggregatesInputSchema),z.lazy(() => RowScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CellValueWhereInputSchema: z.ZodType<Prisma.CellValueWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rowId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  columnId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  column: z.union([ z.lazy(() => ColumnRelationFilterSchema),z.lazy(() => ColumnWhereInputSchema) ]).optional(),
  row: z.union([ z.lazy(() => RowRelationFilterSchema),z.lazy(() => RowWhereInputSchema) ]).optional(),
  boolCell: z.union([ z.lazy(() => BoolCellNullableRelationFilterSchema),z.lazy(() => BoolCellWhereInputSchema) ]).optional().nullable(),
  stringCell: z.union([ z.lazy(() => StringCellNullableRelationFilterSchema),z.lazy(() => StringCellWhereInputSchema) ]).optional().nullable(),
  pointCell: z.union([ z.lazy(() => PointCellNullableRelationFilterSchema),z.lazy(() => PointCellWhereInputSchema) ]).optional().nullable(),
}).strict();

export const CellValueOrderByWithRelationInputSchema: z.ZodType<Prisma.CellValueOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional(),
  column: z.lazy(() => ColumnOrderByWithRelationInputSchema).optional(),
  row: z.lazy(() => RowOrderByWithRelationInputSchema).optional(),
  boolCell: z.lazy(() => BoolCellOrderByWithRelationInputSchema).optional(),
  stringCell: z.lazy(() => StringCellOrderByWithRelationInputSchema).optional(),
  pointCell: z.lazy(() => PointCellOrderByWithRelationInputSchema).optional()
}).strict();

export const CellValueWhereUniqueInputSchema: z.ZodType<Prisma.CellValueWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    rowId_columnId: z.lazy(() => CellValueRowIdColumnIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    rowId_columnId: z.lazy(() => CellValueRowIdColumnIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  rowId_columnId: z.lazy(() => CellValueRowIdColumnIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueWhereInputSchema),z.lazy(() => CellValueWhereInputSchema).array() ]).optional(),
  rowId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  columnId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  column: z.union([ z.lazy(() => ColumnRelationFilterSchema),z.lazy(() => ColumnWhereInputSchema) ]).optional(),
  row: z.union([ z.lazy(() => RowRelationFilterSchema),z.lazy(() => RowWhereInputSchema) ]).optional(),
  boolCell: z.union([ z.lazy(() => BoolCellNullableRelationFilterSchema),z.lazy(() => BoolCellWhereInputSchema) ]).optional().nullable(),
  stringCell: z.union([ z.lazy(() => StringCellNullableRelationFilterSchema),z.lazy(() => StringCellWhereInputSchema) ]).optional().nullable(),
  pointCell: z.union([ z.lazy(() => PointCellNullableRelationFilterSchema),z.lazy(() => PointCellWhereInputSchema) ]).optional().nullable(),
}).strict());

export const CellValueOrderByWithAggregationInputSchema: z.ZodType<Prisma.CellValueOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  columnId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CellValueCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CellValueMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CellValueMinOrderByAggregateInputSchema).optional()
}).strict();

export const CellValueScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CellValueScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema),z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema),z.lazy(() => CellValueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rowId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  columnId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BoolCellWhereInputSchema: z.ZodType<Prisma.BoolCellWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BoolCellWhereInputSchema),z.lazy(() => BoolCellWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BoolCellWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BoolCellWhereInputSchema),z.lazy(() => BoolCellWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cellValueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  cellValue: z.union([ z.lazy(() => CellValueRelationFilterSchema),z.lazy(() => CellValueWhereInputSchema) ]).optional(),
}).strict();

export const BoolCellOrderByWithRelationInputSchema: z.ZodType<Prisma.BoolCellOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  cellValue: z.lazy(() => CellValueOrderByWithRelationInputSchema).optional()
}).strict();

export const BoolCellWhereUniqueInputSchema: z.ZodType<Prisma.BoolCellWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    cellValueId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    cellValueId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  cellValueId: z.string().optional(),
  AND: z.union([ z.lazy(() => BoolCellWhereInputSchema),z.lazy(() => BoolCellWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BoolCellWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BoolCellWhereInputSchema),z.lazy(() => BoolCellWhereInputSchema).array() ]).optional(),
  value: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  cellValue: z.union([ z.lazy(() => CellValueRelationFilterSchema),z.lazy(() => CellValueWhereInputSchema) ]).optional(),
}).strict());

export const BoolCellOrderByWithAggregationInputSchema: z.ZodType<Prisma.BoolCellOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BoolCellCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BoolCellMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BoolCellMinOrderByAggregateInputSchema).optional()
}).strict();

export const BoolCellScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BoolCellScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BoolCellScalarWhereWithAggregatesInputSchema),z.lazy(() => BoolCellScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BoolCellScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BoolCellScalarWhereWithAggregatesInputSchema),z.lazy(() => BoolCellScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  cellValueId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const StringCellWhereInputSchema: z.ZodType<Prisma.StringCellWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StringCellWhereInputSchema),z.lazy(() => StringCellWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StringCellWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StringCellWhereInputSchema),z.lazy(() => StringCellWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cellValueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cellValue: z.union([ z.lazy(() => CellValueRelationFilterSchema),z.lazy(() => CellValueWhereInputSchema) ]).optional(),
}).strict();

export const StringCellOrderByWithRelationInputSchema: z.ZodType<Prisma.StringCellOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  cellValue: z.lazy(() => CellValueOrderByWithRelationInputSchema).optional()
}).strict();

export const StringCellWhereUniqueInputSchema: z.ZodType<Prisma.StringCellWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    cellValueId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    cellValueId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  cellValueId: z.string().optional(),
  AND: z.union([ z.lazy(() => StringCellWhereInputSchema),z.lazy(() => StringCellWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StringCellWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StringCellWhereInputSchema),z.lazy(() => StringCellWhereInputSchema).array() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cellValue: z.union([ z.lazy(() => CellValueRelationFilterSchema),z.lazy(() => CellValueWhereInputSchema) ]).optional(),
}).strict());

export const StringCellOrderByWithAggregationInputSchema: z.ZodType<Prisma.StringCellOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => StringCellCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => StringCellMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => StringCellMinOrderByAggregateInputSchema).optional()
}).strict();

export const StringCellScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.StringCellScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => StringCellScalarWhereWithAggregatesInputSchema),z.lazy(() => StringCellScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => StringCellScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StringCellScalarWhereWithAggregatesInputSchema),z.lazy(() => StringCellScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  cellValueId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PointCellWhereInputSchema: z.ZodType<Prisma.PointCellWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PointCellWhereInputSchema),z.lazy(() => PointCellWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointCellWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointCellWhereInputSchema),z.lazy(() => PointCellWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cellvalueid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cellValue: z.union([ z.lazy(() => CellValueRelationFilterSchema),z.lazy(() => CellValueWhereInputSchema) ]).optional(),
}).strict();

export const PointCellOrderByWithRelationInputSchema: z.ZodType<Prisma.PointCellOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellvalueid: z.lazy(() => SortOrderSchema).optional(),
  cellValue: z.lazy(() => CellValueOrderByWithRelationInputSchema).optional()
}).strict();

export const PointCellWhereUniqueInputSchema: z.ZodType<Prisma.PointCellWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    cellvalueid: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    cellvalueid: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  cellvalueid: z.string().optional(),
  AND: z.union([ z.lazy(() => PointCellWhereInputSchema),z.lazy(() => PointCellWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointCellWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointCellWhereInputSchema),z.lazy(() => PointCellWhereInputSchema).array() ]).optional(),
  cellValue: z.union([ z.lazy(() => CellValueRelationFilterSchema),z.lazy(() => CellValueWhereInputSchema) ]).optional(),
}).strict());

export const PointCellOrderByWithAggregationInputSchema: z.ZodType<Prisma.PointCellOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellvalueid: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PointCellCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PointCellMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PointCellMinOrderByAggregateInputSchema).optional()
}).strict();

export const PointCellScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PointCellScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PointCellScalarWhereWithAggregatesInputSchema),z.lazy(() => PointCellScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointCellScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointCellScalarWhereWithAggregatesInputSchema),z.lazy(() => PointCellScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  cellvalueid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const LayerWhereInputSchema: z.ZodType<Prisma.LayerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LayerWhereInputSchema),z.lazy(() => LayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LayerWhereInputSchema),z.lazy(() => LayerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumLayerTypeFilterSchema),z.lazy(() => LayerTypeSchema) ]).optional(),
  dataTrackId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pointLayer: z.union([ z.lazy(() => PointLayerNullableRelationFilterSchema),z.lazy(() => PointLayerWhereInputSchema) ]).optional().nullable(),
  dataTrack: z.union([ z.lazy(() => DataTrackRelationFilterSchema),z.lazy(() => DataTrackWhereInputSchema) ]).optional(),
}).strict();

export const LayerOrderByWithRelationInputSchema: z.ZodType<Prisma.LayerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dataTrackId: z.lazy(() => SortOrderSchema).optional(),
  pointLayer: z.lazy(() => PointLayerOrderByWithRelationInputSchema).optional(),
  dataTrack: z.lazy(() => DataTrackOrderByWithRelationInputSchema).optional()
}).strict();

export const LayerWhereUniqueInputSchema: z.ZodType<Prisma.LayerWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    dataTrackId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    dataTrackId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  dataTrackId: z.string().optional(),
  AND: z.union([ z.lazy(() => LayerWhereInputSchema),z.lazy(() => LayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LayerWhereInputSchema),z.lazy(() => LayerWhereInputSchema).array() ]).optional(),
  type: z.union([ z.lazy(() => EnumLayerTypeFilterSchema),z.lazy(() => LayerTypeSchema) ]).optional(),
  pointLayer: z.union([ z.lazy(() => PointLayerNullableRelationFilterSchema),z.lazy(() => PointLayerWhereInputSchema) ]).optional().nullable(),
  dataTrack: z.union([ z.lazy(() => DataTrackRelationFilterSchema),z.lazy(() => DataTrackWhereInputSchema) ]).optional(),
}).strict());

export const LayerOrderByWithAggregationInputSchema: z.ZodType<Prisma.LayerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dataTrackId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LayerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LayerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LayerMinOrderByAggregateInputSchema).optional()
}).strict();

export const LayerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LayerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LayerScalarWhereWithAggregatesInputSchema),z.lazy(() => LayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LayerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LayerScalarWhereWithAggregatesInputSchema),z.lazy(() => LayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumLayerTypeWithAggregatesFilterSchema),z.lazy(() => LayerTypeSchema) ]).optional(),
  dataTrackId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PointLayerWhereInputSchema: z.ZodType<Prisma.PointLayerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PointLayerWhereInputSchema),z.lazy(() => PointLayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointLayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointLayerWhereInputSchema),z.lazy(() => PointLayerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  layerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pointColumnId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  layer: z.union([ z.lazy(() => LayerRelationFilterSchema),z.lazy(() => LayerWhereInputSchema) ]).optional(),
  pointColumn: z.union([ z.lazy(() => ColumnRelationFilterSchema),z.lazy(() => ColumnWhereInputSchema) ]).optional(),
}).strict();

export const PointLayerOrderByWithRelationInputSchema: z.ZodType<Prisma.PointLayerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  layerId: z.lazy(() => SortOrderSchema).optional(),
  pointColumnId: z.lazy(() => SortOrderSchema).optional(),
  layer: z.lazy(() => LayerOrderByWithRelationInputSchema).optional(),
  pointColumn: z.lazy(() => ColumnOrderByWithRelationInputSchema).optional()
}).strict();

export const PointLayerWhereUniqueInputSchema: z.ZodType<Prisma.PointLayerWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    layerId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    layerId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  layerId: z.string().optional(),
  AND: z.union([ z.lazy(() => PointLayerWhereInputSchema),z.lazy(() => PointLayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointLayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointLayerWhereInputSchema),z.lazy(() => PointLayerWhereInputSchema).array() ]).optional(),
  pointColumnId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  layer: z.union([ z.lazy(() => LayerRelationFilterSchema),z.lazy(() => LayerWhereInputSchema) ]).optional(),
  pointColumn: z.union([ z.lazy(() => ColumnRelationFilterSchema),z.lazy(() => ColumnWhereInputSchema) ]).optional(),
}).strict());

export const PointLayerOrderByWithAggregationInputSchema: z.ZodType<Prisma.PointLayerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  layerId: z.lazy(() => SortOrderSchema).optional(),
  pointColumnId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PointLayerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PointLayerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PointLayerMinOrderByAggregateInputSchema).optional()
}).strict();

export const PointLayerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PointLayerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PointLayerScalarWhereWithAggregatesInputSchema),z.lazy(() => PointLayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointLayerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointLayerScalarWhereWithAggregatesInputSchema),z.lazy(() => PointLayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  layerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  pointColumnId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMembershipsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateManyInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkspaceMembershipsInputSchema),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const WorkspaceMembershipUncheckedCreateInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const WorkspaceMembershipUpdateInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkspaceMembershipsNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateManyInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const WorkspaceMembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceCreateInputSchema: z.ZodType<Prisma.WorkspaceCreateInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.string().cuid().optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WorkspaceUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkspaceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormCreateInputSchema: z.ZodType<Prisma.FormCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateInputSchema: z.ZodType<Prisma.FormUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormUpdateInputSchema: z.ZodType<Prisma.FormUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateInputSchema: z.ZodType<Prisma.FormUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const FormCreateManyInputSchema: z.ZodType<Prisma.FormCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormUpdateManyMutationInputSchema: z.ZodType<Prisma.FormUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepCreateInputSchema: z.ZodType<Prisma.StepCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  datasetColumns: z.lazy(() => ColumnCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateInputSchema: z.ZodType<Prisma.StepUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  datasetColumns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUpdateInputSchema: z.ZodType<Prisma.StepUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  datasetColumns: z.lazy(() => ColumnUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateInputSchema: z.ZodType<Prisma.StepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  datasetColumns: z.lazy(() => ColumnUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateManyInputSchema: z.ZodType<Prisma.StepCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const StepUpdateManyMutationInputSchema: z.ZodType<Prisma.StepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DataTrackCreateInputSchema: z.ZodType<Prisma.DataTrackCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutDataTracksInputSchema).optional(),
  layer: z.lazy(() => LayerCreateNestedOneWithoutDataTrackInputSchema).optional()
}).strict();

export const DataTrackUncheckedCreateInputSchema: z.ZodType<Prisma.DataTrackUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  formId: z.string().optional().nullable(),
  layer: z.lazy(() => LayerUncheckedCreateNestedOneWithoutDataTrackInputSchema).optional()
}).strict();

export const DataTrackUpdateInputSchema: z.ZodType<Prisma.DataTrackUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutDataTracksNestedInputSchema).optional(),
  layer: z.lazy(() => LayerUpdateOneWithoutDataTrackNestedInputSchema).optional()
}).strict();

export const DataTrackUncheckedUpdateInputSchema: z.ZodType<Prisma.DataTrackUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  layer: z.lazy(() => LayerUncheckedUpdateOneWithoutDataTrackNestedInputSchema).optional()
}).strict();

export const DataTrackCreateManyInputSchema: z.ZodType<Prisma.DataTrackCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  formId: z.string().optional().nullable()
}).strict();

export const DataTrackUpdateManyMutationInputSchema: z.ZodType<Prisma.DataTrackUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DataTrackUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DataTrackUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const FormSubmissionCreateInputSchema: z.ZodType<Prisma.FormSubmissionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema),
  row: z.lazy(() => RowCreateNestedOneWithoutFormSubmissionInputSchema)
}).strict();

export const FormSubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  publishedFormId: z.string(),
  rowId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormSubmissionUpdateInputSchema: z.ZodType<Prisma.FormSubmissionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  publishedForm: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionCreateManyInputSchema: z.ZodType<Prisma.FormSubmissionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  publishedFormId: z.string(),
  rowId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormSubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  step: z.lazy(() => StepUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUncheckedUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = z.object({
}).strict();

export const LocationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DatasetCreateInputSchema: z.ZodType<Prisma.DatasetCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetUpdateInputSchema: z.ZodType<Prisma.DatasetUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutDatasetNestedInputSchema).optional()
}).strict();

export const DatasetCreateManyInputSchema: z.ZodType<Prisma.DatasetCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  workspaceId: z.string()
}).strict();

export const DatasetUpdateManyMutationInputSchema: z.ZodType<Prisma.DatasetUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DatasetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnCreateInputSchema: z.ZodType<Prisma.ColumnCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutColumnsInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutDatasetColumnsInputSchema).optional(),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutColumnInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  datasetId: z.string(),
  stepId: z.string().optional().nullable(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutColumnInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUncheckedCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnUpdateInputSchema: z.ZodType<Prisma.ColumnUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneWithoutDatasetColumnsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutColumnNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUncheckedUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnCreateManyInputSchema: z.ZodType<Prisma.ColumnCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  datasetId: z.string(),
  stepId: z.string().optional().nullable()
}).strict();

export const ColumnUpdateManyMutationInputSchema: z.ZodType<Prisma.ColumnUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ColumnUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RowCreateInputSchema: z.ZodType<Prisma.RowCreateInput> = z.object({
  id: z.string().cuid().optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutRowsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutRowInputSchema).optional(),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUncheckedCreateInputSchema: z.ZodType<Prisma.RowUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  datasetId: z.string(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedOneWithoutRowInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUpdateInputSchema: z.ZodType<Prisma.RowUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutRowsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneWithoutRowNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateInputSchema: z.ZodType<Prisma.RowUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateOneWithoutRowNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowCreateManyInputSchema: z.ZodType<Prisma.RowCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  datasetId: z.string()
}).strict();

export const RowUpdateManyMutationInputSchema: z.ZodType<Prisma.RowUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RowUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RowUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueCreateInputSchema: z.ZodType<Prisma.CellValueCreateInput> = z.object({
  id: z.string().cuid().optional(),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema),
  boolCell: z.lazy(() => BoolCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUncheckedCreateInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  columnId: z.string(),
  boolCell: z.lazy(() => BoolCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUpdateInputSchema: z.ZodType<Prisma.CellValueUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  boolCell: z.lazy(() => BoolCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  boolCell: z.lazy(() => BoolCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueCreateManyInputSchema: z.ZodType<Prisma.CellValueCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  columnId: z.string()
}).strict();

export const CellValueUpdateManyMutationInputSchema: z.ZodType<Prisma.CellValueUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BoolCellCreateInputSchema: z.ZodType<Prisma.BoolCellCreateInput> = z.object({
  id: z.string().cuid().optional(),
  value: z.boolean(),
  cellValue: z.lazy(() => CellValueCreateNestedOneWithoutBoolCellInputSchema)
}).strict();

export const BoolCellUncheckedCreateInputSchema: z.ZodType<Prisma.BoolCellUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  cellValueId: z.string(),
  value: z.boolean()
}).strict();

export const BoolCellUpdateInputSchema: z.ZodType<Prisma.BoolCellUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  cellValue: z.lazy(() => CellValueUpdateOneRequiredWithoutBoolCellNestedInputSchema).optional()
}).strict();

export const BoolCellUncheckedUpdateInputSchema: z.ZodType<Prisma.BoolCellUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BoolCellCreateManyInputSchema: z.ZodType<Prisma.BoolCellCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  cellValueId: z.string(),
  value: z.boolean()
}).strict();

export const BoolCellUpdateManyMutationInputSchema: z.ZodType<Prisma.BoolCellUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BoolCellUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BoolCellUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringCellCreateInputSchema: z.ZodType<Prisma.StringCellCreateInput> = z.object({
  id: z.string().cuid().optional(),
  value: z.string(),
  cellValue: z.lazy(() => CellValueCreateNestedOneWithoutStringCellInputSchema)
}).strict();

export const StringCellUncheckedCreateInputSchema: z.ZodType<Prisma.StringCellUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  cellValueId: z.string(),
  value: z.string()
}).strict();

export const StringCellUpdateInputSchema: z.ZodType<Prisma.StringCellUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValue: z.lazy(() => CellValueUpdateOneRequiredWithoutStringCellNestedInputSchema).optional()
}).strict();

export const StringCellUncheckedUpdateInputSchema: z.ZodType<Prisma.StringCellUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringCellCreateManyInputSchema: z.ZodType<Prisma.StringCellCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  cellValueId: z.string(),
  value: z.string()
}).strict();

export const StringCellUpdateManyMutationInputSchema: z.ZodType<Prisma.StringCellUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringCellUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StringCellUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointCellUpdateInputSchema: z.ZodType<Prisma.PointCellUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValue: z.lazy(() => CellValueUpdateOneRequiredWithoutPointCellNestedInputSchema).optional()
}).strict();

export const PointCellUncheckedUpdateInputSchema: z.ZodType<Prisma.PointCellUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellvalueid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointCellUpdateManyMutationInputSchema: z.ZodType<Prisma.PointCellUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointCellUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PointCellUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellvalueid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LayerCreateInputSchema: z.ZodType<Prisma.LayerCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  pointLayer: z.lazy(() => PointLayerCreateNestedOneWithoutLayerInputSchema).optional(),
  dataTrack: z.lazy(() => DataTrackCreateNestedOneWithoutLayerInputSchema)
}).strict();

export const LayerUncheckedCreateInputSchema: z.ZodType<Prisma.LayerUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  dataTrackId: z.string(),
  pointLayer: z.lazy(() => PointLayerUncheckedCreateNestedOneWithoutLayerInputSchema).optional()
}).strict();

export const LayerUpdateInputSchema: z.ZodType<Prisma.LayerUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  pointLayer: z.lazy(() => PointLayerUpdateOneWithoutLayerNestedInputSchema).optional(),
  dataTrack: z.lazy(() => DataTrackUpdateOneRequiredWithoutLayerNestedInputSchema).optional()
}).strict();

export const LayerUncheckedUpdateInputSchema: z.ZodType<Prisma.LayerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dataTrackId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pointLayer: z.lazy(() => PointLayerUncheckedUpdateOneWithoutLayerNestedInputSchema).optional()
}).strict();

export const LayerCreateManyInputSchema: z.ZodType<Prisma.LayerCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  dataTrackId: z.string()
}).strict();

export const LayerUpdateManyMutationInputSchema: z.ZodType<Prisma.LayerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LayerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LayerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dataTrackId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointLayerCreateInputSchema: z.ZodType<Prisma.PointLayerCreateInput> = z.object({
  id: z.string().cuid().optional(),
  layer: z.lazy(() => LayerCreateNestedOneWithoutPointLayerInputSchema),
  pointColumn: z.lazy(() => ColumnCreateNestedOneWithoutPointLayersInputSchema)
}).strict();

export const PointLayerUncheckedCreateInputSchema: z.ZodType<Prisma.PointLayerUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  layerId: z.string(),
  pointColumnId: z.string()
}).strict();

export const PointLayerUpdateInputSchema: z.ZodType<Prisma.PointLayerUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  layer: z.lazy(() => LayerUpdateOneRequiredWithoutPointLayerNestedInputSchema).optional(),
  pointColumn: z.lazy(() => ColumnUpdateOneRequiredWithoutPointLayersNestedInputSchema).optional()
}).strict();

export const PointLayerUncheckedUpdateInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  layerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pointColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointLayerCreateManyInputSchema: z.ZodType<Prisma.PointLayerCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  layerId: z.string(),
  pointColumnId: z.string()
}).strict();

export const PointLayerUpdateManyMutationInputSchema: z.ZodType<Prisma.PointLayerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointLayerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  layerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pointColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
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

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
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

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
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

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMembershipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMembershipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkspaceMembershipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  hasOnboarded: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  hasOnboarded: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  hasOnboarded: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.object({
  identifier: z.string(),
  token: z.string()
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
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

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
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

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
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

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const StepListRelationFilterSchema: z.ZodType<Prisma.StepListRelationFilter> = z.object({
  every: z.lazy(() => StepWhereInputSchema).optional(),
  some: z.lazy(() => StepWhereInputSchema).optional(),
  none: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const DataTrackListRelationFilterSchema: z.ZodType<Prisma.DataTrackListRelationFilter> = z.object({
  every: z.lazy(() => DataTrackWhereInputSchema).optional(),
  some: z.lazy(() => DataTrackWhereInputSchema).optional(),
  none: z.lazy(() => DataTrackWhereInputSchema).optional()
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

export const DatasetNullableRelationFilterSchema: z.ZodType<Prisma.DatasetNullableRelationFilter> = z.object({
  is: z.lazy(() => DatasetWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DatasetWhereInputSchema).optional().nullable()
}).strict();

export const StepOrderByRelationAggregateInputSchema: z.ZodType<Prisma.StepOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DataTrackOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DataTrackOrderByRelationAggregateInput> = z.object({
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
  isRoot: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  rootFormId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
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
  isRoot: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  rootFormId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isRoot: z.lazy(() => SortOrderSchema).optional(),
  isDirty: z.lazy(() => SortOrderSchema).optional(),
  isClosed: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  rootFormId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSumOrderByAggregateInputSchema: z.ZodType<Prisma.FormSumOrderByAggregateInput> = z.object({
  version: z.lazy(() => SortOrderSchema).optional()
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

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
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

export const ColumnListRelationFilterSchema: z.ZodType<Prisma.ColumnListRelationFilter> = z.object({
  every: z.lazy(() => ColumnWhereInputSchema).optional(),
  some: z.lazy(() => ColumnWhereInputSchema).optional(),
  none: z.lazy(() => ColumnWhereInputSchema).optional()
}).strict();

export const ColumnOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ColumnOrderByRelationAggregateInput> = z.object({
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

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
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

export const LayerNullableRelationFilterSchema: z.ZodType<Prisma.LayerNullableRelationFilter> = z.object({
  is: z.lazy(() => LayerWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LayerWhereInputSchema).optional().nullable()
}).strict();

export const DataTrackCountOrderByAggregateInputSchema: z.ZodType<Prisma.DataTrackCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DataTrackAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DataTrackAvgOrderByAggregateInput> = z.object({
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DataTrackMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DataTrackMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DataTrackMinOrderByAggregateInputSchema: z.ZodType<Prisma.DataTrackMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DataTrackSumOrderByAggregateInputSchema: z.ZodType<Prisma.DataTrackSumOrderByAggregateInput> = z.object({
  startStepIndex: z.lazy(() => SortOrderSchema).optional(),
  endStepIndex: z.lazy(() => SortOrderSchema).optional(),
  layerIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormRelationFilterSchema: z.ZodType<Prisma.FormRelationFilter> = z.object({
  is: z.lazy(() => FormWhereInputSchema).optional(),
  isNot: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const RowRelationFilterSchema: z.ZodType<Prisma.RowRelationFilter> = z.object({
  is: z.lazy(() => RowWhereInputSchema).optional(),
  isNot: z.lazy(() => RowWhereInputSchema).optional()
}).strict();

export const FormSubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional(),
  rowId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepNullableRelationFilterSchema: z.ZodType<Prisma.StepNullableRelationFilter> = z.object({
  is: z.lazy(() => StepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => StepWhereInputSchema).optional().nullable()
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

export const RowListRelationFilterSchema: z.ZodType<Prisma.RowListRelationFilter> = z.object({
  every: z.lazy(() => RowWhereInputSchema).optional(),
  some: z.lazy(() => RowWhereInputSchema).optional(),
  none: z.lazy(() => RowWhereInputSchema).optional()
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

export const PointLayerListRelationFilterSchema: z.ZodType<Prisma.PointLayerListRelationFilter> = z.object({
  every: z.lazy(() => PointLayerWhereInputSchema).optional(),
  some: z.lazy(() => PointLayerWhereInputSchema).optional(),
  none: z.lazy(() => PointLayerWhereInputSchema).optional()
}).strict();

export const CellValueOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CellValueOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PointLayerOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PointLayerOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnDatasetIdNameCompoundUniqueInputSchema: z.ZodType<Prisma.ColumnDatasetIdNameCompoundUniqueInput> = z.object({
  datasetId: z.string(),
  name: z.string()
}).strict();

export const ColumnCountOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnMinOrderByAggregateInputSchema: z.ZodType<Prisma.ColumnMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dataType: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
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

export const FormSubmissionNullableRelationFilterSchema: z.ZodType<Prisma.FormSubmissionNullableRelationFilter> = z.object({
  is: z.lazy(() => FormSubmissionWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => FormSubmissionWhereInputSchema).optional().nullable()
}).strict();

export const RowCountOrderByAggregateInputSchema: z.ZodType<Prisma.RowCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RowMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RowMinOrderByAggregateInputSchema: z.ZodType<Prisma.RowMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  datasetId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColumnRelationFilterSchema: z.ZodType<Prisma.ColumnRelationFilter> = z.object({
  is: z.lazy(() => ColumnWhereInputSchema).optional(),
  isNot: z.lazy(() => ColumnWhereInputSchema).optional()
}).strict();

export const BoolCellNullableRelationFilterSchema: z.ZodType<Prisma.BoolCellNullableRelationFilter> = z.object({
  is: z.lazy(() => BoolCellWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => BoolCellWhereInputSchema).optional().nullable()
}).strict();

export const StringCellNullableRelationFilterSchema: z.ZodType<Prisma.StringCellNullableRelationFilter> = z.object({
  is: z.lazy(() => StringCellWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => StringCellWhereInputSchema).optional().nullable()
}).strict();

export const PointCellNullableRelationFilterSchema: z.ZodType<Prisma.PointCellNullableRelationFilter> = z.object({
  is: z.lazy(() => PointCellWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PointCellWhereInputSchema).optional().nullable()
}).strict();

export const CellValueRowIdColumnIdCompoundUniqueInputSchema: z.ZodType<Prisma.CellValueRowIdColumnIdCompoundUniqueInput> = z.object({
  rowId: z.string(),
  columnId: z.string()
}).strict();

export const CellValueCountOrderByAggregateInputSchema: z.ZodType<Prisma.CellValueCountOrderByAggregateInput> = z.object({
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

export const CellValueRelationFilterSchema: z.ZodType<Prisma.CellValueRelationFilter> = z.object({
  is: z.lazy(() => CellValueWhereInputSchema).optional(),
  isNot: z.lazy(() => CellValueWhereInputSchema).optional()
}).strict();

export const BoolCellCountOrderByAggregateInputSchema: z.ZodType<Prisma.BoolCellCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolCellMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BoolCellMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolCellMinOrderByAggregateInputSchema: z.ZodType<Prisma.BoolCellMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringCellCountOrderByAggregateInputSchema: z.ZodType<Prisma.StringCellCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringCellMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StringCellMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringCellMinOrderByAggregateInputSchema: z.ZodType<Prisma.StringCellMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellValueId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PointCellCountOrderByAggregateInputSchema: z.ZodType<Prisma.PointCellCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellvalueid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PointCellMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PointCellMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellvalueid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PointCellMinOrderByAggregateInputSchema: z.ZodType<Prisma.PointCellMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cellvalueid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumLayerTypeFilterSchema: z.ZodType<Prisma.EnumLayerTypeFilter> = z.object({
  equals: z.lazy(() => LayerTypeSchema).optional(),
  in: z.lazy(() => LayerTypeSchema).array().optional(),
  notIn: z.lazy(() => LayerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => NestedEnumLayerTypeFilterSchema) ]).optional(),
}).strict();

export const PointLayerNullableRelationFilterSchema: z.ZodType<Prisma.PointLayerNullableRelationFilter> = z.object({
  is: z.lazy(() => PointLayerWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PointLayerWhereInputSchema).optional().nullable()
}).strict();

export const DataTrackRelationFilterSchema: z.ZodType<Prisma.DataTrackRelationFilter> = z.object({
  is: z.lazy(() => DataTrackWhereInputSchema).optional(),
  isNot: z.lazy(() => DataTrackWhereInputSchema).optional()
}).strict();

export const LayerCountOrderByAggregateInputSchema: z.ZodType<Prisma.LayerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dataTrackId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LayerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LayerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dataTrackId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LayerMinOrderByAggregateInputSchema: z.ZodType<Prisma.LayerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dataTrackId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumLayerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumLayerTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LayerTypeSchema).optional(),
  in: z.lazy(() => LayerTypeSchema).array().optional(),
  notIn: z.lazy(() => LayerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => NestedEnumLayerTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLayerTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLayerTypeFilterSchema).optional()
}).strict();

export const LayerRelationFilterSchema: z.ZodType<Prisma.LayerRelationFilter> = z.object({
  is: z.lazy(() => LayerWhereInputSchema).optional(),
  isNot: z.lazy(() => LayerWhereInputSchema).optional()
}).strict();

export const PointLayerCountOrderByAggregateInputSchema: z.ZodType<Prisma.PointLayerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  layerId: z.lazy(() => SortOrderSchema).optional(),
  pointColumnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PointLayerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PointLayerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  layerId: z.lazy(() => SortOrderSchema).optional(),
  pointColumnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PointLayerMinOrderByAggregateInputSchema: z.ZodType<Prisma.PointLayerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  layerId: z.lazy(() => SortOrderSchema).optional(),
  pointColumnId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
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

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
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

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
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

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
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

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
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

export const DataTrackCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.DataTrackCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => DataTrackCreateWithoutFormInputSchema),z.lazy(() => DataTrackCreateWithoutFormInputSchema).array(),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema),z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DataTrackCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceCreateNestedOneWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateNestedOneWithoutFormsInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutFormsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional()
}).strict();

export const FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateNestedManyWithoutPublishedFormInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyPublishedFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutFormVersionsInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormVersionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormVersionsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const FormCreateNestedManyWithoutRootFormInputSchema: z.ZodType<Prisma.FormCreateNestedManyWithoutRootFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutRootFormInputSchema),z.lazy(() => FormCreateWithoutRootFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyRootFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DatasetCreateNestedOneWithoutFormInputSchema: z.ZodType<Prisma.DatasetCreateNestedOneWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutFormInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional()
}).strict();

export const StepUncheckedCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepCreateWithoutFormInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DataTrackUncheckedCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUncheckedCreateNestedManyWithoutFormInput> = z.object({
  create: z.union([ z.lazy(() => DataTrackCreateWithoutFormInputSchema),z.lazy(() => DataTrackCreateWithoutFormInputSchema).array(),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema),z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DataTrackCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyPublishedFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUncheckedCreateNestedManyWithoutRootFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateNestedManyWithoutRootFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutRootFormInputSchema),z.lazy(() => FormCreateWithoutRootFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyRootFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUpdatestepOrderInputSchema: z.ZodType<Prisma.FormUpdatestepOrderInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
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

export const DataTrackUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.DataTrackUpdateManyWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => DataTrackCreateWithoutFormInputSchema),z.lazy(() => DataTrackCreateWithoutFormInputSchema).array(),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema),z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DataTrackUpsertWithWhereUniqueWithoutFormInputSchema),z.lazy(() => DataTrackUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DataTrackCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DataTrackUpdateWithWhereUniqueWithoutFormInputSchema),z.lazy(() => DataTrackUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DataTrackUpdateManyWithWhereWithoutFormInputSchema),z.lazy(() => DataTrackUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DataTrackScalarWhereInputSchema),z.lazy(() => DataTrackScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema: z.ZodType<Prisma.WorkspaceUpdateOneRequiredWithoutFormsNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutFormsInputSchema).optional(),
  upsert: z.lazy(() => WorkspaceUpsertWithoutFormsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateToOneWithWhereWithoutFormsInputSchema),z.lazy(() => WorkspaceUpdateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutFormsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyWithoutPublishedFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutPublishedFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyPublishedFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutPublishedFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutPublishedFormInputSchema).array() ]).optional(),
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

export const FormUpdateManyWithoutRootFormNestedInputSchema: z.ZodType<Prisma.FormUpdateManyWithoutRootFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutRootFormInputSchema),z.lazy(() => FormCreateWithoutRootFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormUpsertWithWhereUniqueWithoutRootFormInputSchema),z.lazy(() => FormUpsertWithWhereUniqueWithoutRootFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyRootFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormUpdateWithWhereUniqueWithoutRootFormInputSchema),z.lazy(() => FormUpdateWithWhereUniqueWithoutRootFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormUpdateManyWithWhereWithoutRootFormInputSchema),z.lazy(() => FormUpdateManyWithWhereWithoutRootFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormScalarWhereInputSchema),z.lazy(() => FormScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DatasetUpdateOneWithoutFormNestedInputSchema: z.ZodType<Prisma.DatasetUpdateOneWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutFormInputSchema).optional(),
  upsert: z.lazy(() => DatasetUpsertWithoutFormInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DatasetWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DatasetUpdateToOneWithWhereWithoutFormInputSchema),z.lazy(() => DatasetUpdateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutFormInputSchema) ]).optional(),
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

export const DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.DataTrackUncheckedUpdateManyWithoutFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => DataTrackCreateWithoutFormInputSchema),z.lazy(() => DataTrackCreateWithoutFormInputSchema).array(),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema),z.lazy(() => DataTrackCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DataTrackUpsertWithWhereUniqueWithoutFormInputSchema),z.lazy(() => DataTrackUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DataTrackCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DataTrackWhereUniqueInputSchema),z.lazy(() => DataTrackWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DataTrackUpdateWithWhereUniqueWithoutFormInputSchema),z.lazy(() => DataTrackUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DataTrackUpdateManyWithWhereWithoutFormInputSchema),z.lazy(() => DataTrackUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DataTrackScalarWhereInputSchema),z.lazy(() => DataTrackScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema).array(),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUpsertWithWhereUniqueWithoutPublishedFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormSubmissionCreateManyPublishedFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormSubmissionWhereUniqueInputSchema),z.lazy(() => FormSubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUpdateWithWhereUniqueWithoutPublishedFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUpdateManyWithWhereWithoutPublishedFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormUncheckedUpdateManyWithoutRootFormNestedInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutRootFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutRootFormInputSchema),z.lazy(() => FormCreateWithoutRootFormInputSchema).array(),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema),z.lazy(() => FormCreateOrConnectWithoutRootFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormUpsertWithWhereUniqueWithoutRootFormInputSchema),z.lazy(() => FormUpsertWithWhereUniqueWithoutRootFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormCreateManyRootFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormWhereUniqueInputSchema),z.lazy(() => FormWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormUpdateWithWhereUniqueWithoutRootFormInputSchema),z.lazy(() => FormUpdateWithWhereUniqueWithoutRootFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormUpdateManyWithWhereWithoutRootFormInputSchema),z.lazy(() => FormUpdateManyWithWhereWithoutRootFormInputSchema).array() ]).optional(),
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

export const ColumnCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.ColumnCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutStepInputSchema),z.lazy(() => ColumnCreateWithoutStepInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ColumnUncheckedCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutStepInputSchema),z.lazy(() => ColumnCreateWithoutStepInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
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

export const ColumnUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.ColumnUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutStepInputSchema),z.lazy(() => ColumnCreateWithoutStepInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ColumnUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ColumnUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ColumnUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ColumnUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ColumnUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => ColumnUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ColumnUncheckedUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutStepInputSchema),z.lazy(() => ColumnCreateWithoutStepInputSchema).array(),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema),z.lazy(() => ColumnCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ColumnUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ColumnUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColumnCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ColumnWhereUniqueInputSchema),z.lazy(() => ColumnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ColumnUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ColumnUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ColumnUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => ColumnUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutDataTracksInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutDataTracksInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedCreateWithoutDataTracksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDataTracksInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const LayerCreateNestedOneWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerCreateNestedOneWithoutDataTrackInput> = z.object({
  create: z.union([ z.lazy(() => LayerCreateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedCreateWithoutDataTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LayerCreateOrConnectWithoutDataTrackInputSchema).optional(),
  connect: z.lazy(() => LayerWhereUniqueInputSchema).optional()
}).strict();

export const LayerUncheckedCreateNestedOneWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerUncheckedCreateNestedOneWithoutDataTrackInput> = z.object({
  create: z.union([ z.lazy(() => LayerCreateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedCreateWithoutDataTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LayerCreateOrConnectWithoutDataTrackInputSchema).optional(),
  connect: z.lazy(() => LayerWhereUniqueInputSchema).optional()
}).strict();

export const FormUpdateOneWithoutDataTracksNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutDataTracksNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedCreateWithoutDataTracksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDataTracksInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutDataTracksInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutDataTracksInputSchema),z.lazy(() => FormUpdateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDataTracksInputSchema) ]).optional(),
}).strict();

export const LayerUpdateOneWithoutDataTrackNestedInputSchema: z.ZodType<Prisma.LayerUpdateOneWithoutDataTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => LayerCreateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedCreateWithoutDataTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LayerCreateOrConnectWithoutDataTrackInputSchema).optional(),
  upsert: z.lazy(() => LayerUpsertWithoutDataTrackInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LayerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LayerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LayerUpdateToOneWithWhereWithoutDataTrackInputSchema),z.lazy(() => LayerUpdateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutDataTrackInputSchema) ]).optional(),
}).strict();

export const LayerUncheckedUpdateOneWithoutDataTrackNestedInputSchema: z.ZodType<Prisma.LayerUncheckedUpdateOneWithoutDataTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => LayerCreateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedCreateWithoutDataTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LayerCreateOrConnectWithoutDataTrackInputSchema).optional(),
  upsert: z.lazy(() => LayerUpsertWithoutDataTrackInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LayerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LayerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LayerUpdateToOneWithWhereWithoutDataTrackInputSchema),z.lazy(() => LayerUpdateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutDataTrackInputSchema) ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const RowCreateNestedOneWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowCreateNestedOneWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RowCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => RowWhereUniqueInputSchema).optional()
}).strict();

export const FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.FormUpdateOneRequiredWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => FormUpdateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormSubmissionInputSchema) ]).optional(),
}).strict();

export const RowUpdateOneRequiredWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.RowUpdateOneRequiredWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => RowCreateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RowCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  upsert: z.lazy(() => RowUpsertWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => RowWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RowUpdateToOneWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => RowUpdateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedUpdateWithoutFormSubmissionInputSchema) ]).optional(),
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

export const StepUncheckedUpdateOneWithoutLocationNestedInputSchema: z.ZodType<Prisma.StepUncheckedUpdateOneWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLocationInputSchema),z.lazy(() => StepUncheckedCreateWithoutLocationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLocationInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutLocationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutLocationInputSchema),z.lazy(() => StepUpdateWithoutLocationInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLocationInputSchema) ]).optional(),
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

export const FormCreateNestedOneWithoutDatasetInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutDatasetInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedCreateWithoutDatasetInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDatasetInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
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

export const FormUncheckedCreateNestedOneWithoutDatasetInputSchema: z.ZodType<Prisma.FormUncheckedCreateNestedOneWithoutDatasetInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedCreateWithoutDatasetInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDatasetInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
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

export const FormUpdateOneWithoutDatasetNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutDatasetNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedCreateWithoutDatasetInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDatasetInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutDatasetInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutDatasetInputSchema),z.lazy(() => FormUpdateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDatasetInputSchema) ]).optional(),
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

export const FormUncheckedUpdateOneWithoutDatasetNestedInputSchema: z.ZodType<Prisma.FormUncheckedUpdateOneWithoutDatasetNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedCreateWithoutDatasetInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDatasetInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutDatasetInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutDatasetInputSchema),z.lazy(() => FormUpdateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDatasetInputSchema) ]).optional(),
}).strict();

export const DatasetCreateNestedOneWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetCreateNestedOneWithoutColumnsInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutColumnsInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional()
}).strict();

export const StepCreateNestedOneWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutDatasetColumnsInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedCreateWithoutDatasetColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutDatasetColumnsInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const CellValueCreateNestedManyWithoutColumnInputSchema: z.ZodType<Prisma.CellValueCreateNestedManyWithoutColumnInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueCreateWithoutColumnInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PointLayerCreateNestedManyWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerCreateNestedManyWithoutPointColumnInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema).array(),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PointLayerCreateManyPointColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CellValueUncheckedCreateNestedManyWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateNestedManyWithoutColumnInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueCreateWithoutColumnInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PointLayerUncheckedCreateNestedManyWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUncheckedCreateNestedManyWithoutPointColumnInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema).array(),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PointLayerCreateManyPointColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
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

export const StepUpdateOneWithoutDatasetColumnsNestedInputSchema: z.ZodType<Prisma.StepUpdateOneWithoutDatasetColumnsNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedCreateWithoutDatasetColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutDatasetColumnsInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutDatasetColumnsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutDatasetColumnsInputSchema),z.lazy(() => StepUpdateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedUpdateWithoutDatasetColumnsInputSchema) ]).optional(),
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

export const PointLayerUpdateManyWithoutPointColumnNestedInputSchema: z.ZodType<Prisma.PointLayerUpdateManyWithoutPointColumnNestedInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema).array(),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PointLayerUpsertWithWhereUniqueWithoutPointColumnInputSchema),z.lazy(() => PointLayerUpsertWithWhereUniqueWithoutPointColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PointLayerCreateManyPointColumnInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PointLayerUpdateWithWhereUniqueWithoutPointColumnInputSchema),z.lazy(() => PointLayerUpdateWithWhereUniqueWithoutPointColumnInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PointLayerUpdateManyWithWhereWithoutPointColumnInputSchema),z.lazy(() => PointLayerUpdateManyWithWhereWithoutPointColumnInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PointLayerScalarWhereInputSchema),z.lazy(() => PointLayerScalarWhereInputSchema).array() ]).optional(),
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

export const PointLayerUncheckedUpdateManyWithoutPointColumnNestedInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateManyWithoutPointColumnNestedInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema).array(),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema),z.lazy(() => PointLayerCreateOrConnectWithoutPointColumnInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PointLayerUpsertWithWhereUniqueWithoutPointColumnInputSchema),z.lazy(() => PointLayerUpsertWithWhereUniqueWithoutPointColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PointLayerCreateManyPointColumnInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PointLayerWhereUniqueInputSchema),z.lazy(() => PointLayerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PointLayerUpdateWithWhereUniqueWithoutPointColumnInputSchema),z.lazy(() => PointLayerUpdateWithWhereUniqueWithoutPointColumnInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PointLayerUpdateManyWithWhereWithoutPointColumnInputSchema),z.lazy(() => PointLayerUpdateManyWithWhereWithoutPointColumnInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PointLayerScalarWhereInputSchema),z.lazy(() => PointLayerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DatasetCreateNestedOneWithoutRowsInputSchema: z.ZodType<Prisma.DatasetCreateNestedOneWithoutRowsInput> = z.object({
  create: z.union([ z.lazy(() => DatasetCreateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutRowsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatasetCreateOrConnectWithoutRowsInputSchema).optional(),
  connect: z.lazy(() => DatasetWhereUniqueInputSchema).optional()
}).strict();

export const FormSubmissionCreateNestedOneWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionCreateNestedOneWithoutRowInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutRowInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutRowInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional()
}).strict();

export const CellValueCreateNestedManyWithoutRowInputSchema: z.ZodType<Prisma.CellValueCreateNestedManyWithoutRowInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutRowInputSchema),z.lazy(() => CellValueCreateWithoutRowInputSchema).array(),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutRowInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema),z.lazy(() => CellValueCreateOrConnectWithoutRowInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CellValueCreateManyRowInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CellValueWhereUniqueInputSchema),z.lazy(() => CellValueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionUncheckedCreateNestedOneWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateNestedOneWithoutRowInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutRowInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutRowInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional()
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

export const FormSubmissionUpdateOneWithoutRowNestedInputSchema: z.ZodType<Prisma.FormSubmissionUpdateOneWithoutRowNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutRowInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutRowInputSchema).optional(),
  upsert: z.lazy(() => FormSubmissionUpsertWithoutRowInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateToOneWithWhereWithoutRowInputSchema),z.lazy(() => FormSubmissionUpdateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutRowInputSchema) ]).optional(),
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

export const FormSubmissionUncheckedUpdateOneWithoutRowNestedInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateOneWithoutRowNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutRowInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutRowInputSchema).optional(),
  upsert: z.lazy(() => FormSubmissionUpsertWithoutRowInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateToOneWithWhereWithoutRowInputSchema),z.lazy(() => FormSubmissionUpdateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutRowInputSchema) ]).optional(),
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

export const BoolCellCreateNestedOneWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellCreateNestedOneWithoutCellValueInput> = z.object({
  create: z.union([ z.lazy(() => BoolCellCreateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BoolCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  connect: z.lazy(() => BoolCellWhereUniqueInputSchema).optional()
}).strict();

export const StringCellCreateNestedOneWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellCreateNestedOneWithoutCellValueInput> = z.object({
  create: z.union([ z.lazy(() => StringCellCreateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StringCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  connect: z.lazy(() => StringCellWhereUniqueInputSchema).optional()
}).strict();

export const PointCellCreateNestedOneWithoutCellValueInputSchema: z.ZodType<Prisma.PointCellCreateNestedOneWithoutCellValueInput> = z.object({
  connect: z.lazy(() => PointCellWhereUniqueInputSchema).optional()
}).strict();

export const BoolCellUncheckedCreateNestedOneWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellUncheckedCreateNestedOneWithoutCellValueInput> = z.object({
  create: z.union([ z.lazy(() => BoolCellCreateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BoolCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  connect: z.lazy(() => BoolCellWhereUniqueInputSchema).optional()
}).strict();

export const StringCellUncheckedCreateNestedOneWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellUncheckedCreateNestedOneWithoutCellValueInput> = z.object({
  create: z.union([ z.lazy(() => StringCellCreateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StringCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  connect: z.lazy(() => StringCellWhereUniqueInputSchema).optional()
}).strict();

export const PointCellUncheckedCreateNestedOneWithoutCellValueInputSchema: z.ZodType<Prisma.PointCellUncheckedCreateNestedOneWithoutCellValueInput> = z.object({
  connect: z.lazy(() => PointCellWhereUniqueInputSchema).optional()
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

export const BoolCellUpdateOneWithoutCellValueNestedInputSchema: z.ZodType<Prisma.BoolCellUpdateOneWithoutCellValueNestedInput> = z.object({
  create: z.union([ z.lazy(() => BoolCellCreateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BoolCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  upsert: z.lazy(() => BoolCellUpsertWithoutCellValueInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BoolCellWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BoolCellWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BoolCellWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BoolCellUpdateToOneWithWhereWithoutCellValueInputSchema),z.lazy(() => BoolCellUpdateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedUpdateWithoutCellValueInputSchema) ]).optional(),
}).strict();

export const StringCellUpdateOneWithoutCellValueNestedInputSchema: z.ZodType<Prisma.StringCellUpdateOneWithoutCellValueNestedInput> = z.object({
  create: z.union([ z.lazy(() => StringCellCreateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StringCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  upsert: z.lazy(() => StringCellUpsertWithoutCellValueInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StringCellWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StringCellWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StringCellWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StringCellUpdateToOneWithWhereWithoutCellValueInputSchema),z.lazy(() => StringCellUpdateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedUpdateWithoutCellValueInputSchema) ]).optional(),
}).strict();

export const PointCellUpdateOneWithoutCellValueNestedInputSchema: z.ZodType<Prisma.PointCellUpdateOneWithoutCellValueNestedInput> = z.object({
  disconnect: z.union([ z.boolean(),z.lazy(() => PointCellWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PointCellWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PointCellWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PointCellUpdateToOneWithWhereWithoutCellValueInputSchema),z.lazy(() => PointCellUpdateWithoutCellValueInputSchema),z.lazy(() => PointCellUncheckedUpdateWithoutCellValueInputSchema) ]).optional(),
}).strict();

export const BoolCellUncheckedUpdateOneWithoutCellValueNestedInputSchema: z.ZodType<Prisma.BoolCellUncheckedUpdateOneWithoutCellValueNestedInput> = z.object({
  create: z.union([ z.lazy(() => BoolCellCreateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BoolCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  upsert: z.lazy(() => BoolCellUpsertWithoutCellValueInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BoolCellWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BoolCellWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BoolCellWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BoolCellUpdateToOneWithWhereWithoutCellValueInputSchema),z.lazy(() => BoolCellUpdateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedUpdateWithoutCellValueInputSchema) ]).optional(),
}).strict();

export const StringCellUncheckedUpdateOneWithoutCellValueNestedInputSchema: z.ZodType<Prisma.StringCellUncheckedUpdateOneWithoutCellValueNestedInput> = z.object({
  create: z.union([ z.lazy(() => StringCellCreateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedCreateWithoutCellValueInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StringCellCreateOrConnectWithoutCellValueInputSchema).optional(),
  upsert: z.lazy(() => StringCellUpsertWithoutCellValueInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => StringCellWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => StringCellWhereInputSchema) ]).optional(),
  connect: z.lazy(() => StringCellWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StringCellUpdateToOneWithWhereWithoutCellValueInputSchema),z.lazy(() => StringCellUpdateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedUpdateWithoutCellValueInputSchema) ]).optional(),
}).strict();

export const PointCellUncheckedUpdateOneWithoutCellValueNestedInputSchema: z.ZodType<Prisma.PointCellUncheckedUpdateOneWithoutCellValueNestedInput> = z.object({
  disconnect: z.union([ z.boolean(),z.lazy(() => PointCellWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PointCellWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PointCellWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PointCellUpdateToOneWithWhereWithoutCellValueInputSchema),z.lazy(() => PointCellUpdateWithoutCellValueInputSchema),z.lazy(() => PointCellUncheckedUpdateWithoutCellValueInputSchema) ]).optional(),
}).strict();

export const CellValueCreateNestedOneWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueCreateNestedOneWithoutBoolCellInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutBoolCellInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CellValueCreateOrConnectWithoutBoolCellInputSchema).optional(),
  connect: z.lazy(() => CellValueWhereUniqueInputSchema).optional()
}).strict();

export const CellValueUpdateOneRequiredWithoutBoolCellNestedInputSchema: z.ZodType<Prisma.CellValueUpdateOneRequiredWithoutBoolCellNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutBoolCellInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CellValueCreateOrConnectWithoutBoolCellInputSchema).optional(),
  upsert: z.lazy(() => CellValueUpsertWithoutBoolCellInputSchema).optional(),
  connect: z.lazy(() => CellValueWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateToOneWithWhereWithoutBoolCellInputSchema),z.lazy(() => CellValueUpdateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutBoolCellInputSchema) ]).optional(),
}).strict();

export const CellValueCreateNestedOneWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueCreateNestedOneWithoutStringCellInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutStringCellInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CellValueCreateOrConnectWithoutStringCellInputSchema).optional(),
  connect: z.lazy(() => CellValueWhereUniqueInputSchema).optional()
}).strict();

export const CellValueUpdateOneRequiredWithoutStringCellNestedInputSchema: z.ZodType<Prisma.CellValueUpdateOneRequiredWithoutStringCellNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutStringCellInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CellValueCreateOrConnectWithoutStringCellInputSchema).optional(),
  upsert: z.lazy(() => CellValueUpsertWithoutStringCellInputSchema).optional(),
  connect: z.lazy(() => CellValueWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateToOneWithWhereWithoutStringCellInputSchema),z.lazy(() => CellValueUpdateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutStringCellInputSchema) ]).optional(),
}).strict();

export const CellValueUpdateOneRequiredWithoutPointCellNestedInputSchema: z.ZodType<Prisma.CellValueUpdateOneRequiredWithoutPointCellNestedInput> = z.object({
  create: z.union([ z.lazy(() => CellValueCreateWithoutPointCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutPointCellInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CellValueCreateOrConnectWithoutPointCellInputSchema).optional(),
  upsert: z.lazy(() => CellValueUpsertWithoutPointCellInputSchema).optional(),
  connect: z.lazy(() => CellValueWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CellValueUpdateToOneWithWhereWithoutPointCellInputSchema),z.lazy(() => CellValueUpdateWithoutPointCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutPointCellInputSchema) ]).optional(),
}).strict();

export const PointLayerCreateNestedOneWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerCreateNestedOneWithoutLayerInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PointLayerCreateOrConnectWithoutLayerInputSchema).optional(),
  connect: z.lazy(() => PointLayerWhereUniqueInputSchema).optional()
}).strict();

export const DataTrackCreateNestedOneWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackCreateNestedOneWithoutLayerInput> = z.object({
  create: z.union([ z.lazy(() => DataTrackCreateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DataTrackCreateOrConnectWithoutLayerInputSchema).optional(),
  connect: z.lazy(() => DataTrackWhereUniqueInputSchema).optional()
}).strict();

export const PointLayerUncheckedCreateNestedOneWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerUncheckedCreateNestedOneWithoutLayerInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PointLayerCreateOrConnectWithoutLayerInputSchema).optional(),
  connect: z.lazy(() => PointLayerWhereUniqueInputSchema).optional()
}).strict();

export const EnumLayerTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumLayerTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => LayerTypeSchema).optional()
}).strict();

export const PointLayerUpdateOneWithoutLayerNestedInputSchema: z.ZodType<Prisma.PointLayerUpdateOneWithoutLayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PointLayerCreateOrConnectWithoutLayerInputSchema).optional(),
  upsert: z.lazy(() => PointLayerUpsertWithoutLayerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PointLayerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PointLayerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PointLayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PointLayerUpdateToOneWithWhereWithoutLayerInputSchema),z.lazy(() => PointLayerUpdateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedUpdateWithoutLayerInputSchema) ]).optional(),
}).strict();

export const DataTrackUpdateOneRequiredWithoutLayerNestedInputSchema: z.ZodType<Prisma.DataTrackUpdateOneRequiredWithoutLayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => DataTrackCreateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DataTrackCreateOrConnectWithoutLayerInputSchema).optional(),
  upsert: z.lazy(() => DataTrackUpsertWithoutLayerInputSchema).optional(),
  connect: z.lazy(() => DataTrackWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DataTrackUpdateToOneWithWhereWithoutLayerInputSchema),z.lazy(() => DataTrackUpdateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedUpdateWithoutLayerInputSchema) ]).optional(),
}).strict();

export const PointLayerUncheckedUpdateOneWithoutLayerNestedInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateOneWithoutLayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PointLayerCreateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PointLayerCreateOrConnectWithoutLayerInputSchema).optional(),
  upsert: z.lazy(() => PointLayerUpsertWithoutLayerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PointLayerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PointLayerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PointLayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PointLayerUpdateToOneWithWhereWithoutLayerInputSchema),z.lazy(() => PointLayerUpdateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedUpdateWithoutLayerInputSchema) ]).optional(),
}).strict();

export const LayerCreateNestedOneWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerCreateNestedOneWithoutPointLayerInput> = z.object({
  create: z.union([ z.lazy(() => LayerCreateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedCreateWithoutPointLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LayerCreateOrConnectWithoutPointLayerInputSchema).optional(),
  connect: z.lazy(() => LayerWhereUniqueInputSchema).optional()
}).strict();

export const ColumnCreateNestedOneWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnCreateNestedOneWithoutPointLayersInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutPointLayersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ColumnCreateOrConnectWithoutPointLayersInputSchema).optional(),
  connect: z.lazy(() => ColumnWhereUniqueInputSchema).optional()
}).strict();

export const LayerUpdateOneRequiredWithoutPointLayerNestedInputSchema: z.ZodType<Prisma.LayerUpdateOneRequiredWithoutPointLayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => LayerCreateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedCreateWithoutPointLayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LayerCreateOrConnectWithoutPointLayerInputSchema).optional(),
  upsert: z.lazy(() => LayerUpsertWithoutPointLayerInputSchema).optional(),
  connect: z.lazy(() => LayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LayerUpdateToOneWithWhereWithoutPointLayerInputSchema),z.lazy(() => LayerUpdateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutPointLayerInputSchema) ]).optional(),
}).strict();

export const ColumnUpdateOneRequiredWithoutPointLayersNestedInputSchema: z.ZodType<Prisma.ColumnUpdateOneRequiredWithoutPointLayersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColumnCreateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutPointLayersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ColumnCreateOrConnectWithoutPointLayersInputSchema).optional(),
  upsert: z.lazy(() => ColumnUpsertWithoutPointLayersInputSchema).optional(),
  connect: z.lazy(() => ColumnWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ColumnUpdateToOneWithWhereWithoutPointLayersInputSchema),z.lazy(() => ColumnUpdateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutPointLayersInputSchema) ]).optional(),
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

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
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

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
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

export const NestedEnumLayerTypeFilterSchema: z.ZodType<Prisma.NestedEnumLayerTypeFilter> = z.object({
  equals: z.lazy(() => LayerTypeSchema).optional(),
  in: z.lazy(() => LayerTypeSchema).array().optional(),
  notIn: z.lazy(() => LayerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => NestedEnumLayerTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumLayerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumLayerTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LayerTypeSchema).optional(),
  in: z.lazy(() => LayerTypeSchema).array().optional(),
  notIn: z.lazy(() => LayerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => NestedEnumLayerTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLayerTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLayerTypeFilterSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationMembershipCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  role: z.lazy(() => RoleSchema),
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
  id: z.string().cuid().optional(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const WorkspaceMembershipUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
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

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
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
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
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
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMembershipsInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  role: z.lazy(() => RoleSchema),
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
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMembershipsInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutMembersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  workspaces: z.lazy(() => WorkspaceCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspaces: z.lazy(() => WorkspaceUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  hasOnboarded: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWorkspaceMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkspaceMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema) ]),
}).strict();

export const WorkspaceCreateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutMembersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hasOnboarded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateWithoutWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkspaceMembershipsInputSchema)
}).strict();

export const WorkspaceMembershipUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutWorkspacesInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
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
  id: z.string().cuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutDatasetInputSchema).optional()
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutWorkspacesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  isRoot: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isDirty: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isClosed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rootFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  version: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  datasetId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
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
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  datasetColumns: z.lazy(() => ColumnCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  datasetColumns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutFormInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutFormInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const StepCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.StepCreateManyFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => StepCreateManyFormInputSchema),z.lazy(() => StepCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DataTrackCreateWithoutFormInputSchema: z.ZodType<Prisma.DataTrackCreateWithoutFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  layer: z.lazy(() => LayerCreateNestedOneWithoutDataTrackInputSchema).optional()
}).strict();

export const DataTrackUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  layer: z.lazy(() => LayerUncheckedCreateNestedOneWithoutDataTrackInputSchema).optional()
}).strict();

export const DataTrackCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.DataTrackCreateOrConnectWithoutFormInput> = z.object({
  where: z.lazy(() => DataTrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DataTrackCreateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const DataTrackCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.DataTrackCreateManyFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DataTrackCreateManyFormInputSchema),z.lazy(() => DataTrackCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WorkspaceCreateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutFormsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  datasets: z.lazy(() => DatasetCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutFormsInput> = z.object({
  id: z.string().cuid().optional(),
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

export const FormSubmissionCreateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutPublishedFormInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  row: z.lazy(() => RowCreateNestedOneWithoutFormSubmissionInputSchema)
}).strict();

export const FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutPublishedFormInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormSubmissionCreateOrConnectWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutPublishedFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema) ]),
}).strict();

export const FormSubmissionCreateManyPublishedFormInputEnvelopeSchema: z.ZodType<Prisma.FormSubmissionCreateManyPublishedFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormSubmissionCreateManyPublishedFormInputSchema),z.lazy(() => FormSubmissionCreateManyPublishedFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FormCreateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormCreateWithoutFormVersionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutFormVersionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutFormVersionsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutFormVersionsInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormVersionsInputSchema) ]),
}).strict();

export const FormCreateWithoutRootFormInputSchema: z.ZodType<Prisma.FormCreateWithoutRootFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutRootFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutRootFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutRootFormInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutRootFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema) ]),
}).strict();

export const FormCreateManyRootFormInputEnvelopeSchema: z.ZodType<Prisma.FormCreateManyRootFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormCreateManyRootFormInputSchema),z.lazy(() => FormCreateManyRootFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DatasetCreateWithoutFormInputSchema: z.ZodType<Prisma.DatasetCreateWithoutFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.DatasetCreateOrConnectWithoutFormInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatasetCreateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutFormInputSchema) ]),
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
  zoom: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contentViewType: z.union([ z.lazy(() => EnumContentViewTypeFilterSchema),z.lazy(() => ContentViewTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DataTrackUpsertWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUpsertWithWhereUniqueWithoutFormInput> = z.object({
  where: z.lazy(() => DataTrackWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DataTrackUpdateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => DataTrackCreateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const DataTrackUpdateWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUpdateWithWhereUniqueWithoutFormInput> = z.object({
  where: z.lazy(() => DataTrackWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DataTrackUpdateWithoutFormInputSchema),z.lazy(() => DataTrackUncheckedUpdateWithoutFormInputSchema) ]),
}).strict();

export const DataTrackUpdateManyWithWhereWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUpdateManyWithWhereWithoutFormInput> = z.object({
  where: z.lazy(() => DataTrackScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DataTrackUpdateManyMutationInputSchema),z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormInputSchema) ]),
}).strict();

export const DataTrackScalarWhereInputSchema: z.ZodType<Prisma.DataTrackScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DataTrackScalarWhereInputSchema),z.lazy(() => DataTrackScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DataTrackScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DataTrackScalarWhereInputSchema),z.lazy(() => DataTrackScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  startStepIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endStepIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  layerIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutFormsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const FormSubmissionUpsertWithWhereUniqueWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUpsertWithWhereUniqueWithoutPublishedFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutPublishedFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutPublishedFormInputSchema) ]),
}).strict();

export const FormSubmissionUpdateWithWhereUniqueWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithWhereUniqueWithoutPublishedFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FormSubmissionUpdateWithoutPublishedFormInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutPublishedFormInputSchema) ]),
}).strict();

export const FormSubmissionUpdateManyWithWhereWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyWithWhereWithoutPublishedFormInput> = z.object({
  where: z.lazy(() => FormSubmissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FormSubmissionUpdateManyMutationInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormInputSchema) ]),
}).strict();

export const FormSubmissionScalarWhereInputSchema: z.ZodType<Prisma.FormSubmissionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionScalarWhereInputSchema),z.lazy(() => FormSubmissionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedFormId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rowId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutFormVersionsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutFormVersionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUpsertWithWhereUniqueWithoutRootFormInputSchema: z.ZodType<Prisma.FormUpsertWithWhereUniqueWithoutRootFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FormUpdateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutRootFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutRootFormInputSchema) ]),
}).strict();

export const FormUpdateWithWhereUniqueWithoutRootFormInputSchema: z.ZodType<Prisma.FormUpdateWithWhereUniqueWithoutRootFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FormUpdateWithoutRootFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutRootFormInputSchema) ]),
}).strict();

export const FormUpdateManyWithWhereWithoutRootFormInputSchema: z.ZodType<Prisma.FormUpdateManyWithWhereWithoutRootFormInput> = z.object({
  where: z.lazy(() => FormScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FormUpdateManyMutationInputSchema),z.lazy(() => FormUncheckedUpdateManyWithoutRootFormInputSchema) ]),
}).strict();

export const DatasetUpsertWithoutFormInputSchema: z.ZodType<Prisma.DatasetUpsertWithoutFormInput> = z.object({
  update: z.union([ z.lazy(() => DatasetUpdateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => DatasetCreateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutFormInputSchema) ]),
  where: z.lazy(() => DatasetWhereInputSchema).optional()
}).strict();

export const DatasetUpdateToOneWithWhereWithoutFormInputSchema: z.ZodType<Prisma.DatasetUpdateToOneWithWhereWithoutFormInput> = z.object({
  where: z.lazy(() => DatasetWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DatasetUpdateWithoutFormInputSchema),z.lazy(() => DatasetUncheckedUpdateWithoutFormInputSchema) ]),
}).strict();

export const DatasetUpdateWithoutFormInputSchema: z.ZodType<Prisma.DatasetUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional()
}).strict();

export const FormCreateWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateWithoutStepsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutStepsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutStepsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutStepsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]),
}).strict();

export const ColumnCreateWithoutStepInputSchema: z.ZodType<Prisma.ColumnCreateWithoutStepInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutColumnsInputSchema),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutColumnInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  datasetId: z.string(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutColumnInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUncheckedCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.ColumnCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ColumnCreateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const ColumnCreateManyStepInputEnvelopeSchema: z.ZodType<Prisma.ColumnCreateManyStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ColumnCreateManyStepInputSchema),z.lazy(() => ColumnCreateManyStepInputSchema).array() ]),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutStepsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutStepsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const LocationUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutStepInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const LocationUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationUpdateWithoutStepInput> = z.object({
}).strict();

export const LocationUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnUpsertWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.ColumnUpsertWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ColumnUpdateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => ColumnCreateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const ColumnUpdateWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.ColumnUpdateWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ColumnUpdateWithoutStepInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const ColumnUpdateManyWithWhereWithoutStepInputSchema: z.ZodType<Prisma.ColumnUpdateManyWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => ColumnScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ColumnUpdateManyMutationInputSchema),z.lazy(() => ColumnUncheckedUpdateManyWithoutStepInputSchema) ]),
}).strict();

export const ColumnScalarWhereInputSchema: z.ZodType<Prisma.ColumnScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColumnScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColumnScalarWhereInputSchema),z.lazy(() => ColumnScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dataType: z.union([ z.lazy(() => EnumColumnTypeFilterSchema),z.lazy(() => ColumnTypeSchema) ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const FormCreateWithoutDataTracksInputSchema: z.ZodType<Prisma.FormCreateWithoutDataTracksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutDataTracksInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutDataTracksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutDataTracksInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutDataTracksInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedCreateWithoutDataTracksInputSchema) ]),
}).strict();

export const LayerCreateWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerCreateWithoutDataTrackInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  pointLayer: z.lazy(() => PointLayerCreateNestedOneWithoutLayerInputSchema).optional()
}).strict();

export const LayerUncheckedCreateWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerUncheckedCreateWithoutDataTrackInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  pointLayer: z.lazy(() => PointLayerUncheckedCreateNestedOneWithoutLayerInputSchema).optional()
}).strict();

export const LayerCreateOrConnectWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerCreateOrConnectWithoutDataTrackInput> = z.object({
  where: z.lazy(() => LayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LayerCreateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedCreateWithoutDataTrackInputSchema) ]),
}).strict();

export const FormUpsertWithoutDataTracksInputSchema: z.ZodType<Prisma.FormUpsertWithoutDataTracksInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDataTracksInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedCreateWithoutDataTracksInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutDataTracksInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutDataTracksInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutDataTracksInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDataTracksInputSchema) ]),
}).strict();

export const FormUpdateWithoutDataTracksInputSchema: z.ZodType<Prisma.FormUpdateWithoutDataTracksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutDataTracksInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutDataTracksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const LayerUpsertWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerUpsertWithoutDataTrackInput> = z.object({
  update: z.union([ z.lazy(() => LayerUpdateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutDataTrackInputSchema) ]),
  create: z.union([ z.lazy(() => LayerCreateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedCreateWithoutDataTrackInputSchema) ]),
  where: z.lazy(() => LayerWhereInputSchema).optional()
}).strict();

export const LayerUpdateToOneWithWhereWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerUpdateToOneWithWhereWithoutDataTrackInput> = z.object({
  where: z.lazy(() => LayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LayerUpdateWithoutDataTrackInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutDataTrackInputSchema) ]),
}).strict();

export const LayerUpdateWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerUpdateWithoutDataTrackInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  pointLayer: z.lazy(() => PointLayerUpdateOneWithoutLayerNestedInputSchema).optional()
}).strict();

export const LayerUncheckedUpdateWithoutDataTrackInputSchema: z.ZodType<Prisma.LayerUncheckedUpdateWithoutDataTrackInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  pointLayer: z.lazy(() => PointLayerUncheckedUpdateOneWithoutLayerNestedInputSchema).optional()
}).strict();

export const FormCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const RowCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().cuid().optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutRowsInputSchema),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().cuid().optional(),
  datasetId: z.string(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => RowWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RowCreateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedCreateWithoutFormSubmissionInputSchema) ]),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const RowUpsertWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowUpsertWithoutFormSubmissionInput> = z.object({
  update: z.union([ z.lazy(() => RowUpdateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => RowCreateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedCreateWithoutFormSubmissionInputSchema) ]),
  where: z.lazy(() => RowWhereInputSchema).optional()
}).strict();

export const RowUpdateToOneWithWhereWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowUpdateToOneWithWhereWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => RowWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RowUpdateWithoutFormSubmissionInputSchema),z.lazy(() => RowUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const RowUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutRowsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.RowUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const StepCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepCreateWithoutLocationInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  datasetColumns: z.lazy(() => ColumnCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutLocationInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  formId: z.string().optional().nullable(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  datasetColumns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutStepInputSchema).optional()
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  datasetColumns: z.lazy(() => ColumnUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  datasetColumns: z.lazy(() => ColumnUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const ColumnCreateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnCreateWithoutDatasetInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  step: z.lazy(() => StepCreateNestedOneWithoutDatasetColumnsInputSchema).optional(),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutColumnInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateWithoutDatasetInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  stepId: z.string().optional().nullable(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutColumnInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUncheckedCreateNestedManyWithoutPointColumnInputSchema).optional()
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
  id: z.string().cuid().optional(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutRowInputSchema).optional(),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutRowInputSchema).optional()
}).strict();

export const RowUncheckedCreateWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedCreateWithoutDatasetInput> = z.object({
  id: z.string().cuid().optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedOneWithoutRowInputSchema).optional(),
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

export const FormCreateWithoutDatasetInputSchema: z.ZodType<Prisma.FormCreateWithoutDatasetInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  rootForm: z.lazy(() => FormCreateNestedOneWithoutFormVersionsInputSchema).optional(),
  formVersions: z.lazy(() => FormCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutDatasetInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutDatasetInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutPublishedFormInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedCreateNestedManyWithoutRootFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutDatasetInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutDatasetInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedCreateWithoutDatasetInputSchema) ]),
}).strict();

export const WorkspaceCreateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceCreateWithoutDatasetsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutDatasetsInput> = z.object({
  id: z.string().cuid().optional(),
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
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  datasetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const FormUpsertWithoutDatasetInputSchema: z.ZodType<Prisma.FormUpsertWithoutDatasetInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDatasetInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedCreateWithoutDatasetInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutDatasetInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutDatasetInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutDatasetInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDatasetInputSchema) ]),
}).strict();

export const FormUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.FormUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutDatasetsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutDatasetsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const DatasetCreateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetCreateWithoutColumnsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  rows: z.lazy(() => RowCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutColumnsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  rows: z.lazy(() => RowUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetCreateOrConnectWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetCreateOrConnectWithoutColumnsInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatasetCreateWithoutColumnsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutColumnsInputSchema) ]),
}).strict();

export const StepCreateWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepCreateWithoutDatasetColumnsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutDatasetColumnsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  formId: z.string().optional().nullable(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const StepCreateOrConnectWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutDatasetColumnsInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedCreateWithoutDatasetColumnsInputSchema) ]),
}).strict();

export const CellValueCreateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueCreateWithoutColumnInput> = z.object({
  id: z.string().cuid().optional(),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema),
  boolCell: z.lazy(() => BoolCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUncheckedCreateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutColumnInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  boolCell: z.lazy(() => BoolCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueCreateOrConnectWithoutColumnInputSchema: z.ZodType<Prisma.CellValueCreateOrConnectWithoutColumnInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CellValueCreateWithoutColumnInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutColumnInputSchema) ]),
}).strict();

export const CellValueCreateManyColumnInputEnvelopeSchema: z.ZodType<Prisma.CellValueCreateManyColumnInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CellValueCreateManyColumnInputSchema),z.lazy(() => CellValueCreateManyColumnInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PointLayerCreateWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerCreateWithoutPointColumnInput> = z.object({
  id: z.string().cuid().optional(),
  layer: z.lazy(() => LayerCreateNestedOneWithoutPointLayerInputSchema)
}).strict();

export const PointLayerUncheckedCreateWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUncheckedCreateWithoutPointColumnInput> = z.object({
  id: z.string().cuid().optional(),
  layerId: z.string()
}).strict();

export const PointLayerCreateOrConnectWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerCreateOrConnectWithoutPointColumnInput> = z.object({
  where: z.lazy(() => PointLayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema) ]),
}).strict();

export const PointLayerCreateManyPointColumnInputEnvelopeSchema: z.ZodType<Prisma.PointLayerCreateManyPointColumnInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PointLayerCreateManyPointColumnInputSchema),z.lazy(() => PointLayerCreateManyPointColumnInputSchema).array() ]),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutColumnsInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutColumnsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutDatasetNestedInputSchema).optional()
}).strict();

export const StepUpsertWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepUpsertWithoutDatasetColumnsInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedUpdateWithoutDatasetColumnsInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedCreateWithoutDatasetColumnsInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutDatasetColumnsInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutDatasetColumnsInputSchema),z.lazy(() => StepUncheckedUpdateWithoutDatasetColumnsInputSchema) ]),
}).strict();

export const StepUpdateWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepUpdateWithoutDatasetColumnsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutDatasetColumnsInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutDatasetColumnsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rowId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  columnId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const PointLayerUpsertWithWhereUniqueWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUpsertWithWhereUniqueWithoutPointColumnInput> = z.object({
  where: z.lazy(() => PointLayerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PointLayerUpdateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedUpdateWithoutPointColumnInputSchema) ]),
  create: z.union([ z.lazy(() => PointLayerCreateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutPointColumnInputSchema) ]),
}).strict();

export const PointLayerUpdateWithWhereUniqueWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUpdateWithWhereUniqueWithoutPointColumnInput> = z.object({
  where: z.lazy(() => PointLayerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PointLayerUpdateWithoutPointColumnInputSchema),z.lazy(() => PointLayerUncheckedUpdateWithoutPointColumnInputSchema) ]),
}).strict();

export const PointLayerUpdateManyWithWhereWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUpdateManyWithWhereWithoutPointColumnInput> = z.object({
  where: z.lazy(() => PointLayerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PointLayerUpdateManyMutationInputSchema),z.lazy(() => PointLayerUncheckedUpdateManyWithoutPointColumnInputSchema) ]),
}).strict();

export const PointLayerScalarWhereInputSchema: z.ZodType<Prisma.PointLayerScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PointLayerScalarWhereInputSchema),z.lazy(() => PointLayerScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PointLayerScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PointLayerScalarWhereInputSchema),z.lazy(() => PointLayerScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  layerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pointColumnId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const DatasetCreateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetCreateWithoutRowsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  columns: z.lazy(() => ColumnCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutDatasetInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutDatasetsInputSchema)
}).strict();

export const DatasetUncheckedCreateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUncheckedCreateWithoutRowsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  workspaceId: z.string(),
  columns: z.lazy(() => ColumnUncheckedCreateNestedManyWithoutDatasetInputSchema).optional(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutDatasetInputSchema).optional()
}).strict();

export const DatasetCreateOrConnectWithoutRowsInputSchema: z.ZodType<Prisma.DatasetCreateOrConnectWithoutRowsInput> = z.object({
  where: z.lazy(() => DatasetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatasetCreateWithoutRowsInputSchema),z.lazy(() => DatasetUncheckedCreateWithoutRowsInputSchema) ]),
}).strict();

export const FormSubmissionCreateWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutRowInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema)
}).strict();

export const FormSubmissionUncheckedCreateWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutRowInput> = z.object({
  id: z.string().cuid().optional(),
  publishedFormId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormSubmissionCreateOrConnectWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutRowInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutRowInputSchema) ]),
}).strict();

export const CellValueCreateWithoutRowInputSchema: z.ZodType<Prisma.CellValueCreateWithoutRowInput> = z.object({
  id: z.string().cuid().optional(),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema),
  boolCell: z.lazy(() => BoolCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUncheckedCreateWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutRowInput> = z.object({
  id: z.string().cuid().optional(),
  columnId: z.string(),
  boolCell: z.lazy(() => BoolCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional()
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneWithoutDatasetNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutDatasetsNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutRowsInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutRowsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutDatasetNestedInputSchema).optional()
}).strict();

export const FormSubmissionUpsertWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionUpsertWithoutRowInput> = z.object({
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutRowInputSchema) ]),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutRowInputSchema) ]),
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const FormSubmissionUpdateToOneWithWhereWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionUpdateToOneWithWhereWithoutRowInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormSubmissionUpdateWithoutRowInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutRowInputSchema) ]),
}).strict();

export const FormSubmissionUpdateWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutRowInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  publishedForm: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutRowInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutRowInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutColumnsInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutDatasetColumnsInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateWithoutCellValuesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  datasetId: z.string(),
  stepId: z.string().optional().nullable(),
  pointLayers: z.lazy(() => PointLayerUncheckedCreateNestedManyWithoutPointColumnInputSchema).optional()
}).strict();

export const ColumnCreateOrConnectWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnCreateOrConnectWithoutCellValuesInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ColumnCreateWithoutCellValuesInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutCellValuesInputSchema) ]),
}).strict();

export const RowCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowCreateWithoutCellValuesInput> = z.object({
  id: z.string().cuid().optional(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutRowsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutRowInputSchema).optional()
}).strict();

export const RowUncheckedCreateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUncheckedCreateWithoutCellValuesInput> = z.object({
  id: z.string().cuid().optional(),
  datasetId: z.string(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedOneWithoutRowInputSchema).optional()
}).strict();

export const RowCreateOrConnectWithoutCellValuesInputSchema: z.ZodType<Prisma.RowCreateOrConnectWithoutCellValuesInput> = z.object({
  where: z.lazy(() => RowWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RowCreateWithoutCellValuesInputSchema),z.lazy(() => RowUncheckedCreateWithoutCellValuesInputSchema) ]),
}).strict();

export const BoolCellCreateWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellCreateWithoutCellValueInput> = z.object({
  id: z.string().cuid().optional(),
  value: z.boolean()
}).strict();

export const BoolCellUncheckedCreateWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellUncheckedCreateWithoutCellValueInput> = z.object({
  id: z.string().cuid().optional(),
  value: z.boolean()
}).strict();

export const BoolCellCreateOrConnectWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellCreateOrConnectWithoutCellValueInput> = z.object({
  where: z.lazy(() => BoolCellWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BoolCellCreateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedCreateWithoutCellValueInputSchema) ]),
}).strict();

export const StringCellCreateWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellCreateWithoutCellValueInput> = z.object({
  id: z.string().cuid().optional(),
  value: z.string()
}).strict();

export const StringCellUncheckedCreateWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellUncheckedCreateWithoutCellValueInput> = z.object({
  id: z.string().cuid().optional(),
  value: z.string()
}).strict();

export const StringCellCreateOrConnectWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellCreateOrConnectWithoutCellValueInput> = z.object({
  where: z.lazy(() => StringCellWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StringCellCreateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedCreateWithoutCellValueInputSchema) ]),
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneWithoutDatasetColumnsNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateWithoutCellValuesInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateWithoutCellValuesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pointLayers: z.lazy(() => PointLayerUncheckedUpdateManyWithoutPointColumnNestedInputSchema).optional()
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
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutRowsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateWithoutCellValuesInputSchema: z.ZodType<Prisma.RowUncheckedUpdateWithoutCellValuesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateOneWithoutRowNestedInputSchema).optional()
}).strict();

export const BoolCellUpsertWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellUpsertWithoutCellValueInput> = z.object({
  update: z.union([ z.lazy(() => BoolCellUpdateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedUpdateWithoutCellValueInputSchema) ]),
  create: z.union([ z.lazy(() => BoolCellCreateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedCreateWithoutCellValueInputSchema) ]),
  where: z.lazy(() => BoolCellWhereInputSchema).optional()
}).strict();

export const BoolCellUpdateToOneWithWhereWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellUpdateToOneWithWhereWithoutCellValueInput> = z.object({
  where: z.lazy(() => BoolCellWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BoolCellUpdateWithoutCellValueInputSchema),z.lazy(() => BoolCellUncheckedUpdateWithoutCellValueInputSchema) ]),
}).strict();

export const BoolCellUpdateWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellUpdateWithoutCellValueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BoolCellUncheckedUpdateWithoutCellValueInputSchema: z.ZodType<Prisma.BoolCellUncheckedUpdateWithoutCellValueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringCellUpsertWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellUpsertWithoutCellValueInput> = z.object({
  update: z.union([ z.lazy(() => StringCellUpdateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedUpdateWithoutCellValueInputSchema) ]),
  create: z.union([ z.lazy(() => StringCellCreateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedCreateWithoutCellValueInputSchema) ]),
  where: z.lazy(() => StringCellWhereInputSchema).optional()
}).strict();

export const StringCellUpdateToOneWithWhereWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellUpdateToOneWithWhereWithoutCellValueInput> = z.object({
  where: z.lazy(() => StringCellWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StringCellUpdateWithoutCellValueInputSchema),z.lazy(() => StringCellUncheckedUpdateWithoutCellValueInputSchema) ]),
}).strict();

export const StringCellUpdateWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellUpdateWithoutCellValueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringCellUncheckedUpdateWithoutCellValueInputSchema: z.ZodType<Prisma.StringCellUncheckedUpdateWithoutCellValueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointCellUpdateToOneWithWhereWithoutCellValueInputSchema: z.ZodType<Prisma.PointCellUpdateToOneWithWhereWithoutCellValueInput> = z.object({
  where: z.lazy(() => PointCellWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PointCellUpdateWithoutCellValueInputSchema),z.lazy(() => PointCellUncheckedUpdateWithoutCellValueInputSchema) ]),
}).strict();

export const PointCellUpdateWithoutCellValueInputSchema: z.ZodType<Prisma.PointCellUpdateWithoutCellValueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointCellUncheckedUpdateWithoutCellValueInputSchema: z.ZodType<Prisma.PointCellUncheckedUpdateWithoutCellValueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueCreateWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueCreateWithoutBoolCellInput> = z.object({
  id: z.string().cuid().optional(),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema),
  stringCell: z.lazy(() => StringCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUncheckedCreateWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutBoolCellInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  columnId: z.string(),
  stringCell: z.lazy(() => StringCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueCreateOrConnectWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueCreateOrConnectWithoutBoolCellInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CellValueCreateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutBoolCellInputSchema) ]),
}).strict();

export const CellValueUpsertWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueUpsertWithoutBoolCellInput> = z.object({
  update: z.union([ z.lazy(() => CellValueUpdateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutBoolCellInputSchema) ]),
  create: z.union([ z.lazy(() => CellValueCreateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutBoolCellInputSchema) ]),
  where: z.lazy(() => CellValueWhereInputSchema).optional()
}).strict();

export const CellValueUpdateToOneWithWhereWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueUpdateToOneWithWhereWithoutBoolCellInput> = z.object({
  where: z.lazy(() => CellValueWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CellValueUpdateWithoutBoolCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutBoolCellInputSchema) ]),
}).strict();

export const CellValueUpdateWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutBoolCellInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutBoolCellInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutBoolCellInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stringCell: z.lazy(() => StringCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueCreateWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueCreateWithoutStringCellInput> = z.object({
  id: z.string().cuid().optional(),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema),
  boolCell: z.lazy(() => BoolCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUncheckedCreateWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutStringCellInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  columnId: z.string(),
  boolCell: z.lazy(() => BoolCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueCreateOrConnectWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueCreateOrConnectWithoutStringCellInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CellValueCreateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutStringCellInputSchema) ]),
}).strict();

export const CellValueUpsertWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueUpsertWithoutStringCellInput> = z.object({
  update: z.union([ z.lazy(() => CellValueUpdateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutStringCellInputSchema) ]),
  create: z.union([ z.lazy(() => CellValueCreateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutStringCellInputSchema) ]),
  where: z.lazy(() => CellValueWhereInputSchema).optional()
}).strict();

export const CellValueUpdateToOneWithWhereWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueUpdateToOneWithWhereWithoutStringCellInput> = z.object({
  where: z.lazy(() => CellValueWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CellValueUpdateWithoutStringCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutStringCellInputSchema) ]),
}).strict();

export const CellValueUpdateWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutStringCellInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  boolCell: z.lazy(() => BoolCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutStringCellInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutStringCellInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  boolCell: z.lazy(() => BoolCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueCreateWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueCreateWithoutPointCellInput> = z.object({
  id: z.string().cuid().optional(),
  column: z.lazy(() => ColumnCreateNestedOneWithoutCellValuesInputSchema),
  row: z.lazy(() => RowCreateNestedOneWithoutCellValuesInputSchema),
  boolCell: z.lazy(() => BoolCellCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueUncheckedCreateWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueUncheckedCreateWithoutPointCellInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  columnId: z.string(),
  boolCell: z.lazy(() => BoolCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedCreateNestedOneWithoutCellValueInputSchema).optional()
}).strict();

export const CellValueCreateOrConnectWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueCreateOrConnectWithoutPointCellInput> = z.object({
  where: z.lazy(() => CellValueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CellValueCreateWithoutPointCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutPointCellInputSchema) ]),
}).strict();

export const CellValueUpsertWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueUpsertWithoutPointCellInput> = z.object({
  update: z.union([ z.lazy(() => CellValueUpdateWithoutPointCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutPointCellInputSchema) ]),
  create: z.union([ z.lazy(() => CellValueCreateWithoutPointCellInputSchema),z.lazy(() => CellValueUncheckedCreateWithoutPointCellInputSchema) ]),
  where: z.lazy(() => CellValueWhereInputSchema).optional()
}).strict();

export const CellValueUpdateToOneWithWhereWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueUpdateToOneWithWhereWithoutPointCellInput> = z.object({
  where: z.lazy(() => CellValueWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CellValueUpdateWithoutPointCellInputSchema),z.lazy(() => CellValueUncheckedUpdateWithoutPointCellInputSchema) ]),
}).strict();

export const CellValueUpdateWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutPointCellInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  boolCell: z.lazy(() => BoolCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutPointCellInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutPointCellInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  boolCell: z.lazy(() => BoolCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const PointLayerCreateWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerCreateWithoutLayerInput> = z.object({
  id: z.string().cuid().optional(),
  pointColumn: z.lazy(() => ColumnCreateNestedOneWithoutPointLayersInputSchema)
}).strict();

export const PointLayerUncheckedCreateWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerUncheckedCreateWithoutLayerInput> = z.object({
  id: z.string().cuid().optional(),
  pointColumnId: z.string()
}).strict();

export const PointLayerCreateOrConnectWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerCreateOrConnectWithoutLayerInput> = z.object({
  where: z.lazy(() => PointLayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PointLayerCreateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutLayerInputSchema) ]),
}).strict();

export const DataTrackCreateWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackCreateWithoutLayerInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutDataTracksInputSchema).optional()
}).strict();

export const DataTrackUncheckedCreateWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackUncheckedCreateWithoutLayerInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional(),
  formId: z.string().optional().nullable()
}).strict();

export const DataTrackCreateOrConnectWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackCreateOrConnectWithoutLayerInput> = z.object({
  where: z.lazy(() => DataTrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DataTrackCreateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutLayerInputSchema) ]),
}).strict();

export const PointLayerUpsertWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerUpsertWithoutLayerInput> = z.object({
  update: z.union([ z.lazy(() => PointLayerUpdateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedUpdateWithoutLayerInputSchema) ]),
  create: z.union([ z.lazy(() => PointLayerCreateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedCreateWithoutLayerInputSchema) ]),
  where: z.lazy(() => PointLayerWhereInputSchema).optional()
}).strict();

export const PointLayerUpdateToOneWithWhereWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerUpdateToOneWithWhereWithoutLayerInput> = z.object({
  where: z.lazy(() => PointLayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PointLayerUpdateWithoutLayerInputSchema),z.lazy(() => PointLayerUncheckedUpdateWithoutLayerInputSchema) ]),
}).strict();

export const PointLayerUpdateWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerUpdateWithoutLayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pointColumn: z.lazy(() => ColumnUpdateOneRequiredWithoutPointLayersNestedInputSchema).optional()
}).strict();

export const PointLayerUncheckedUpdateWithoutLayerInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateWithoutLayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pointColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DataTrackUpsertWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackUpsertWithoutLayerInput> = z.object({
  update: z.union([ z.lazy(() => DataTrackUpdateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedUpdateWithoutLayerInputSchema) ]),
  create: z.union([ z.lazy(() => DataTrackCreateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedCreateWithoutLayerInputSchema) ]),
  where: z.lazy(() => DataTrackWhereInputSchema).optional()
}).strict();

export const DataTrackUpdateToOneWithWhereWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackUpdateToOneWithWhereWithoutLayerInput> = z.object({
  where: z.lazy(() => DataTrackWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DataTrackUpdateWithoutLayerInputSchema),z.lazy(() => DataTrackUncheckedUpdateWithoutLayerInputSchema) ]),
}).strict();

export const DataTrackUpdateWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackUpdateWithoutLayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutDataTracksNestedInputSchema).optional()
}).strict();

export const DataTrackUncheckedUpdateWithoutLayerInputSchema: z.ZodType<Prisma.DataTrackUncheckedUpdateWithoutLayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LayerCreateWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerCreateWithoutPointLayerInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  dataTrack: z.lazy(() => DataTrackCreateNestedOneWithoutLayerInputSchema)
}).strict();

export const LayerUncheckedCreateWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerUncheckedCreateWithoutPointLayerInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => LayerTypeSchema),
  dataTrackId: z.string()
}).strict();

export const LayerCreateOrConnectWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerCreateOrConnectWithoutPointLayerInput> = z.object({
  where: z.lazy(() => LayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LayerCreateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedCreateWithoutPointLayerInputSchema) ]),
}).strict();

export const ColumnCreateWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnCreateWithoutPointLayersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  dataset: z.lazy(() => DatasetCreateNestedOneWithoutColumnsInputSchema),
  step: z.lazy(() => StepCreateNestedOneWithoutDatasetColumnsInputSchema).optional(),
  cellValues: z.lazy(() => CellValueCreateNestedManyWithoutColumnInputSchema).optional()
}).strict();

export const ColumnUncheckedCreateWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnUncheckedCreateWithoutPointLayersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  datasetId: z.string(),
  stepId: z.string().optional().nullable(),
  cellValues: z.lazy(() => CellValueUncheckedCreateNestedManyWithoutColumnInputSchema).optional()
}).strict();

export const ColumnCreateOrConnectWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnCreateOrConnectWithoutPointLayersInput> = z.object({
  where: z.lazy(() => ColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ColumnCreateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutPointLayersInputSchema) ]),
}).strict();

export const LayerUpsertWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerUpsertWithoutPointLayerInput> = z.object({
  update: z.union([ z.lazy(() => LayerUpdateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutPointLayerInputSchema) ]),
  create: z.union([ z.lazy(() => LayerCreateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedCreateWithoutPointLayerInputSchema) ]),
  where: z.lazy(() => LayerWhereInputSchema).optional()
}).strict();

export const LayerUpdateToOneWithWhereWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerUpdateToOneWithWhereWithoutPointLayerInput> = z.object({
  where: z.lazy(() => LayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LayerUpdateWithoutPointLayerInputSchema),z.lazy(() => LayerUncheckedUpdateWithoutPointLayerInputSchema) ]),
}).strict();

export const LayerUpdateWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerUpdateWithoutPointLayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dataTrack: z.lazy(() => DataTrackUpdateOneRequiredWithoutLayerNestedInputSchema).optional()
}).strict();

export const LayerUncheckedUpdateWithoutPointLayerInputSchema: z.ZodType<Prisma.LayerUncheckedUpdateWithoutPointLayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LayerTypeSchema),z.lazy(() => EnumLayerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dataTrackId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnUpsertWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnUpsertWithoutPointLayersInput> = z.object({
  update: z.union([ z.lazy(() => ColumnUpdateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutPointLayersInputSchema) ]),
  create: z.union([ z.lazy(() => ColumnCreateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedCreateWithoutPointLayersInputSchema) ]),
  where: z.lazy(() => ColumnWhereInputSchema).optional()
}).strict();

export const ColumnUpdateToOneWithWhereWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnUpdateToOneWithWhereWithoutPointLayersInput> = z.object({
  where: z.lazy(() => ColumnWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ColumnUpdateWithoutPointLayersInputSchema),z.lazy(() => ColumnUncheckedUpdateWithoutPointLayersInputSchema) ]),
}).strict();

export const ColumnUpdateWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnUpdateWithoutPointLayersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema).optional(),
  step: z.lazy(() => StepUpdateOneWithoutDatasetColumnsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateWithoutPointLayersInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateWithoutPointLayersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema).optional()
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const OrganizationMembershipCreateManyUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WorkspaceMembershipCreateManyUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WorkspaceCreateManyOrganizationInputSchema: z.ZodType<Prisma.WorkspaceCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationMembershipUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  datasets: z.lazy(() => DatasetUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipCreateManyWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const FormCreateManyWorkspaceInputSchema: z.ZodType<Prisma.FormCreateManyWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  rootFormId: z.string().optional().nullable(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DatasetCreateManyWorkspaceInputSchema: z.ZodType<Prisma.DatasetCreateManyWorkspaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string()
}).strict();

export const WorkspaceMembershipUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkspaceMembershipsNestedInputSchema).optional()
}).strict();

export const WorkspaceMembershipUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WorkspaceMembershipRoleSchema),z.lazy(() => EnumWorkspaceMembershipRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  rootForm: z.lazy(() => FormUpdateOneWithoutFormVersionsNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  rootFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DatasetUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneWithoutDatasetNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columns: z.lazy(() => ColumnUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  rows: z.lazy(() => RowUncheckedUpdateManyWithoutDatasetNestedInputSchema).optional(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutDatasetNestedInputSchema).optional()
}).strict();

export const DatasetUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.DatasetUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepCreateManyFormInputSchema: z.ZodType<Prisma.StepCreateManyFormInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number(),
  pitch: z.number(),
  bearing: z.number(),
  locationId: z.number().int(),
  contentViewType: z.lazy(() => ContentViewTypeSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DataTrackCreateManyFormInputSchema: z.ZodType<Prisma.DataTrackCreateManyFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  startStepIndex: z.number().int(),
  endStepIndex: z.number().int(),
  layerIndex: z.number().int().optional()
}).strict();

export const FormSubmissionCreateManyPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateManyPublishedFormInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FormCreateManyRootFormInputSchema: z.ZodType<Prisma.FormCreateManyRootFormInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  slug: z.string(),
  isRoot: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  version: z.number().int().optional().nullable(),
  datasetId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const StepUpdateWithoutFormInputSchema: z.ZodType<Prisma.StepUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  datasetColumns: z.lazy(() => ColumnUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  datasetColumns: z.lazy(() => ColumnUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contentViewType: z.union([ z.lazy(() => ContentViewTypeSchema),z.lazy(() => EnumContentViewTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DataTrackUpdateWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layer: z.lazy(() => LayerUpdateOneWithoutDataTrackNestedInputSchema).optional()
}).strict();

export const DataTrackUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layer: z.lazy(() => LayerUncheckedUpdateOneWithoutDataTrackNestedInputSchema).optional()
}).strict();

export const DataTrackUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.DataTrackUncheckedUpdateManyWithoutFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endStepIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  layerIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUpdateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutPublishedFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutPublishedFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUncheckedUpdateManyWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyWithoutPublishedFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUpdateWithoutRootFormInputSchema: z.ZodType<Prisma.FormUpdateWithoutRootFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUpdateManyWithoutRootFormNestedInputSchema).optional(),
  dataset: z.lazy(() => DatasetUpdateOneWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutRootFormInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutRootFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  dataTracks: z.lazy(() => DataTrackUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutPublishedFormNestedInputSchema).optional(),
  formVersions: z.lazy(() => FormUncheckedUpdateManyWithoutRootFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateManyWithoutRootFormInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutRootFormInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRoot: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isDirty: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isClosed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnCreateManyStepInputSchema: z.ZodType<Prisma.ColumnCreateManyStepInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  datasetId: z.string()
}).strict();

export const ColumnUpdateWithoutStepInputSchema: z.ZodType<Prisma.ColumnUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dataset: z.lazy(() => DatasetUpdateOneRequiredWithoutColumnsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutColumnNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUncheckedUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateManyWithoutStepInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyWithoutStepInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datasetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColumnCreateManyDatasetInputSchema: z.ZodType<Prisma.ColumnCreateManyDatasetInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  dataType: z.lazy(() => ColumnTypeSchema),
  blockNoteId: z.string().optional().nullable(),
  stepId: z.string().optional().nullable()
}).strict();

export const RowCreateManyDatasetInputSchema: z.ZodType<Prisma.RowCreateManyDatasetInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const ColumnUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  step: z.lazy(() => StepUpdateOneWithoutDatasetColumnsNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutColumnNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutColumnNestedInputSchema).optional(),
  pointLayers: z.lazy(() => PointLayerUncheckedUpdateManyWithoutPointColumnNestedInputSchema).optional()
}).strict();

export const ColumnUncheckedUpdateManyWithoutDatasetInputSchema: z.ZodType<Prisma.ColumnUncheckedUpdateManyWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dataType: z.union([ z.lazy(() => ColumnTypeSchema),z.lazy(() => EnumColumnTypeFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RowUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.RowUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneWithoutRowNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedUpdateWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateOneWithoutRowNestedInputSchema).optional(),
  cellValues: z.lazy(() => CellValueUncheckedUpdateManyWithoutRowNestedInputSchema).optional()
}).strict();

export const RowUncheckedUpdateManyWithoutDatasetInputSchema: z.ZodType<Prisma.RowUncheckedUpdateManyWithoutDatasetInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueCreateManyColumnInputSchema: z.ZodType<Prisma.CellValueCreateManyColumnInput> = z.object({
  id: z.string().cuid().optional(),
  rowId: z.string()
}).strict();

export const PointLayerCreateManyPointColumnInputSchema: z.ZodType<Prisma.PointLayerCreateManyPointColumnInput> = z.object({
  id: z.string().cuid().optional(),
  layerId: z.string()
}).strict();

export const CellValueUpdateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutColumnInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  row: z.lazy(() => RowUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  boolCell: z.lazy(() => BoolCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutColumnInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  boolCell: z.lazy(() => BoolCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateManyWithoutColumnInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyWithoutColumnInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rowId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointLayerUpdateWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUpdateWithoutPointColumnInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  layer: z.lazy(() => LayerUpdateOneRequiredWithoutPointLayerNestedInputSchema).optional()
}).strict();

export const PointLayerUncheckedUpdateWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateWithoutPointColumnInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  layerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PointLayerUncheckedUpdateManyWithoutPointColumnInputSchema: z.ZodType<Prisma.PointLayerUncheckedUpdateManyWithoutPointColumnInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  layerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CellValueCreateManyRowInputSchema: z.ZodType<Prisma.CellValueCreateManyRowInput> = z.object({
  id: z.string().cuid().optional(),
  columnId: z.string()
}).strict();

export const CellValueUpdateWithoutRowInputSchema: z.ZodType<Prisma.CellValueUpdateWithoutRowInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  column: z.lazy(() => ColumnUpdateOneRequiredWithoutCellValuesNestedInputSchema).optional(),
  boolCell: z.lazy(() => BoolCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateWithoutRowInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  boolCell: z.lazy(() => BoolCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  stringCell: z.lazy(() => StringCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional(),
  pointCell: z.lazy(() => PointCellUncheckedUpdateOneWithoutCellValueNestedInputSchema).optional()
}).strict();

export const CellValueUncheckedUpdateManyWithoutRowInputSchema: z.ZodType<Prisma.CellValueUncheckedUpdateManyWithoutRowInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  columnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

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

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(),VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
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

export const DataTrackFindFirstArgsSchema: z.ZodType<Prisma.DataTrackFindFirstArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereInputSchema.optional(),
  orderBy: z.union([ DataTrackOrderByWithRelationInputSchema.array(),DataTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: DataTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DataTrackScalarFieldEnumSchema,DataTrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DataTrackFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DataTrackFindFirstOrThrowArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereInputSchema.optional(),
  orderBy: z.union([ DataTrackOrderByWithRelationInputSchema.array(),DataTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: DataTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DataTrackScalarFieldEnumSchema,DataTrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DataTrackFindManyArgsSchema: z.ZodType<Prisma.DataTrackFindManyArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereInputSchema.optional(),
  orderBy: z.union([ DataTrackOrderByWithRelationInputSchema.array(),DataTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: DataTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DataTrackScalarFieldEnumSchema,DataTrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DataTrackAggregateArgsSchema: z.ZodType<Prisma.DataTrackAggregateArgs> = z.object({
  where: DataTrackWhereInputSchema.optional(),
  orderBy: z.union([ DataTrackOrderByWithRelationInputSchema.array(),DataTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: DataTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DataTrackGroupByArgsSchema: z.ZodType<Prisma.DataTrackGroupByArgs> = z.object({
  where: DataTrackWhereInputSchema.optional(),
  orderBy: z.union([ DataTrackOrderByWithAggregationInputSchema.array(),DataTrackOrderByWithAggregationInputSchema ]).optional(),
  by: DataTrackScalarFieldEnumSchema.array(),
  having: DataTrackScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DataTrackFindUniqueArgsSchema: z.ZodType<Prisma.DataTrackFindUniqueArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereUniqueInputSchema,
}).strict() ;

export const DataTrackFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DataTrackFindUniqueOrThrowArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereUniqueInputSchema,
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

export const BoolCellFindFirstArgsSchema: z.ZodType<Prisma.BoolCellFindFirstArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereInputSchema.optional(),
  orderBy: z.union([ BoolCellOrderByWithRelationInputSchema.array(),BoolCellOrderByWithRelationInputSchema ]).optional(),
  cursor: BoolCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BoolCellScalarFieldEnumSchema,BoolCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BoolCellFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BoolCellFindFirstOrThrowArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereInputSchema.optional(),
  orderBy: z.union([ BoolCellOrderByWithRelationInputSchema.array(),BoolCellOrderByWithRelationInputSchema ]).optional(),
  cursor: BoolCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BoolCellScalarFieldEnumSchema,BoolCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BoolCellFindManyArgsSchema: z.ZodType<Prisma.BoolCellFindManyArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereInputSchema.optional(),
  orderBy: z.union([ BoolCellOrderByWithRelationInputSchema.array(),BoolCellOrderByWithRelationInputSchema ]).optional(),
  cursor: BoolCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BoolCellScalarFieldEnumSchema,BoolCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BoolCellAggregateArgsSchema: z.ZodType<Prisma.BoolCellAggregateArgs> = z.object({
  where: BoolCellWhereInputSchema.optional(),
  orderBy: z.union([ BoolCellOrderByWithRelationInputSchema.array(),BoolCellOrderByWithRelationInputSchema ]).optional(),
  cursor: BoolCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BoolCellGroupByArgsSchema: z.ZodType<Prisma.BoolCellGroupByArgs> = z.object({
  where: BoolCellWhereInputSchema.optional(),
  orderBy: z.union([ BoolCellOrderByWithAggregationInputSchema.array(),BoolCellOrderByWithAggregationInputSchema ]).optional(),
  by: BoolCellScalarFieldEnumSchema.array(),
  having: BoolCellScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BoolCellFindUniqueArgsSchema: z.ZodType<Prisma.BoolCellFindUniqueArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereUniqueInputSchema,
}).strict() ;

export const BoolCellFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BoolCellFindUniqueOrThrowArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereUniqueInputSchema,
}).strict() ;

export const StringCellFindFirstArgsSchema: z.ZodType<Prisma.StringCellFindFirstArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereInputSchema.optional(),
  orderBy: z.union([ StringCellOrderByWithRelationInputSchema.array(),StringCellOrderByWithRelationInputSchema ]).optional(),
  cursor: StringCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StringCellScalarFieldEnumSchema,StringCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StringCellFindFirstOrThrowArgsSchema: z.ZodType<Prisma.StringCellFindFirstOrThrowArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereInputSchema.optional(),
  orderBy: z.union([ StringCellOrderByWithRelationInputSchema.array(),StringCellOrderByWithRelationInputSchema ]).optional(),
  cursor: StringCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StringCellScalarFieldEnumSchema,StringCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StringCellFindManyArgsSchema: z.ZodType<Prisma.StringCellFindManyArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereInputSchema.optional(),
  orderBy: z.union([ StringCellOrderByWithRelationInputSchema.array(),StringCellOrderByWithRelationInputSchema ]).optional(),
  cursor: StringCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StringCellScalarFieldEnumSchema,StringCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const StringCellAggregateArgsSchema: z.ZodType<Prisma.StringCellAggregateArgs> = z.object({
  where: StringCellWhereInputSchema.optional(),
  orderBy: z.union([ StringCellOrderByWithRelationInputSchema.array(),StringCellOrderByWithRelationInputSchema ]).optional(),
  cursor: StringCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const StringCellGroupByArgsSchema: z.ZodType<Prisma.StringCellGroupByArgs> = z.object({
  where: StringCellWhereInputSchema.optional(),
  orderBy: z.union([ StringCellOrderByWithAggregationInputSchema.array(),StringCellOrderByWithAggregationInputSchema ]).optional(),
  by: StringCellScalarFieldEnumSchema.array(),
  having: StringCellScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const StringCellFindUniqueArgsSchema: z.ZodType<Prisma.StringCellFindUniqueArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereUniqueInputSchema,
}).strict() ;

export const StringCellFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.StringCellFindUniqueOrThrowArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereUniqueInputSchema,
}).strict() ;

export const PointCellFindFirstArgsSchema: z.ZodType<Prisma.PointCellFindFirstArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  where: PointCellWhereInputSchema.optional(),
  orderBy: z.union([ PointCellOrderByWithRelationInputSchema.array(),PointCellOrderByWithRelationInputSchema ]).optional(),
  cursor: PointCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PointCellScalarFieldEnumSchema,PointCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PointCellFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PointCellFindFirstOrThrowArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  where: PointCellWhereInputSchema.optional(),
  orderBy: z.union([ PointCellOrderByWithRelationInputSchema.array(),PointCellOrderByWithRelationInputSchema ]).optional(),
  cursor: PointCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PointCellScalarFieldEnumSchema,PointCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PointCellFindManyArgsSchema: z.ZodType<Prisma.PointCellFindManyArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  where: PointCellWhereInputSchema.optional(),
  orderBy: z.union([ PointCellOrderByWithRelationInputSchema.array(),PointCellOrderByWithRelationInputSchema ]).optional(),
  cursor: PointCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PointCellScalarFieldEnumSchema,PointCellScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PointCellAggregateArgsSchema: z.ZodType<Prisma.PointCellAggregateArgs> = z.object({
  where: PointCellWhereInputSchema.optional(),
  orderBy: z.union([ PointCellOrderByWithRelationInputSchema.array(),PointCellOrderByWithRelationInputSchema ]).optional(),
  cursor: PointCellWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PointCellGroupByArgsSchema: z.ZodType<Prisma.PointCellGroupByArgs> = z.object({
  where: PointCellWhereInputSchema.optional(),
  orderBy: z.union([ PointCellOrderByWithAggregationInputSchema.array(),PointCellOrderByWithAggregationInputSchema ]).optional(),
  by: PointCellScalarFieldEnumSchema.array(),
  having: PointCellScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PointCellFindUniqueArgsSchema: z.ZodType<Prisma.PointCellFindUniqueArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  where: PointCellWhereUniqueInputSchema,
}).strict() ;

export const PointCellFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PointCellFindUniqueOrThrowArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  where: PointCellWhereUniqueInputSchema,
}).strict() ;

export const LayerFindFirstArgsSchema: z.ZodType<Prisma.LayerFindFirstArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereInputSchema.optional(),
  orderBy: z.union([ LayerOrderByWithRelationInputSchema.array(),LayerOrderByWithRelationInputSchema ]).optional(),
  cursor: LayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LayerScalarFieldEnumSchema,LayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LayerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LayerFindFirstOrThrowArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereInputSchema.optional(),
  orderBy: z.union([ LayerOrderByWithRelationInputSchema.array(),LayerOrderByWithRelationInputSchema ]).optional(),
  cursor: LayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LayerScalarFieldEnumSchema,LayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LayerFindManyArgsSchema: z.ZodType<Prisma.LayerFindManyArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereInputSchema.optional(),
  orderBy: z.union([ LayerOrderByWithRelationInputSchema.array(),LayerOrderByWithRelationInputSchema ]).optional(),
  cursor: LayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LayerScalarFieldEnumSchema,LayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LayerAggregateArgsSchema: z.ZodType<Prisma.LayerAggregateArgs> = z.object({
  where: LayerWhereInputSchema.optional(),
  orderBy: z.union([ LayerOrderByWithRelationInputSchema.array(),LayerOrderByWithRelationInputSchema ]).optional(),
  cursor: LayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LayerGroupByArgsSchema: z.ZodType<Prisma.LayerGroupByArgs> = z.object({
  where: LayerWhereInputSchema.optional(),
  orderBy: z.union([ LayerOrderByWithAggregationInputSchema.array(),LayerOrderByWithAggregationInputSchema ]).optional(),
  by: LayerScalarFieldEnumSchema.array(),
  having: LayerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LayerFindUniqueArgsSchema: z.ZodType<Prisma.LayerFindUniqueArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereUniqueInputSchema,
}).strict() ;

export const LayerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LayerFindUniqueOrThrowArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereUniqueInputSchema,
}).strict() ;

export const PointLayerFindFirstArgsSchema: z.ZodType<Prisma.PointLayerFindFirstArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereInputSchema.optional(),
  orderBy: z.union([ PointLayerOrderByWithRelationInputSchema.array(),PointLayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PointLayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PointLayerScalarFieldEnumSchema,PointLayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PointLayerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PointLayerFindFirstOrThrowArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereInputSchema.optional(),
  orderBy: z.union([ PointLayerOrderByWithRelationInputSchema.array(),PointLayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PointLayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PointLayerScalarFieldEnumSchema,PointLayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PointLayerFindManyArgsSchema: z.ZodType<Prisma.PointLayerFindManyArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereInputSchema.optional(),
  orderBy: z.union([ PointLayerOrderByWithRelationInputSchema.array(),PointLayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PointLayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PointLayerScalarFieldEnumSchema,PointLayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PointLayerAggregateArgsSchema: z.ZodType<Prisma.PointLayerAggregateArgs> = z.object({
  where: PointLayerWhereInputSchema.optional(),
  orderBy: z.union([ PointLayerOrderByWithRelationInputSchema.array(),PointLayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PointLayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PointLayerGroupByArgsSchema: z.ZodType<Prisma.PointLayerGroupByArgs> = z.object({
  where: PointLayerWhereInputSchema.optional(),
  orderBy: z.union([ PointLayerOrderByWithAggregationInputSchema.array(),PointLayerOrderByWithAggregationInputSchema ]).optional(),
  by: PointLayerScalarFieldEnumSchema.array(),
  having: PointLayerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PointLayerFindUniqueArgsSchema: z.ZodType<Prisma.PointLayerFindUniqueArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereUniqueInputSchema,
}).strict() ;

export const PointLayerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PointLayerFindUniqueOrThrowArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereUniqueInputSchema,
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountAndReturnCreateManyArgsSchema: z.ZodType<Prisma.AccountAndReturnCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionAndReturnCreateManyArgsSchema: z.ZodType<Prisma.SessionAndReturnCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]).optional(),
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

export const UserAndReturnCreateManyArgsSchema: z.ZodType<Prisma.UserAndReturnCreateManyArgs> = z.object({
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

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenAndReturnCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenAndReturnCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
}).strict() ;

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
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

export const OrganizationAndReturnCreateManyArgsSchema: z.ZodType<Prisma.OrganizationAndReturnCreateManyArgs> = z.object({
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

export const OrganizationMembershipAndReturnCreateManyArgsSchema: z.ZodType<Prisma.OrganizationMembershipAndReturnCreateManyArgs> = z.object({
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

export const WorkspaceMembershipAndReturnCreateManyArgsSchema: z.ZodType<Prisma.WorkspaceMembershipAndReturnCreateManyArgs> = z.object({
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

export const WorkspaceAndReturnCreateManyArgsSchema: z.ZodType<Prisma.WorkspaceAndReturnCreateManyArgs> = z.object({
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

export const FormAndReturnCreateManyArgsSchema: z.ZodType<Prisma.FormAndReturnCreateManyArgs> = z.object({
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

export const StepAndReturnCreateManyArgsSchema: z.ZodType<Prisma.StepAndReturnCreateManyArgs> = z.object({
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

export const DataTrackCreateArgsSchema: z.ZodType<Prisma.DataTrackCreateArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  data: z.union([ DataTrackCreateInputSchema,DataTrackUncheckedCreateInputSchema ]),
}).strict() ;

export const DataTrackUpsertArgsSchema: z.ZodType<Prisma.DataTrackUpsertArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereUniqueInputSchema,
  create: z.union([ DataTrackCreateInputSchema,DataTrackUncheckedCreateInputSchema ]),
  update: z.union([ DataTrackUpdateInputSchema,DataTrackUncheckedUpdateInputSchema ]),
}).strict() ;

export const DataTrackCreateManyArgsSchema: z.ZodType<Prisma.DataTrackCreateManyArgs> = z.object({
  data: z.union([ DataTrackCreateManyInputSchema,DataTrackCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DataTrackAndReturnCreateManyArgsSchema: z.ZodType<Prisma.DataTrackAndReturnCreateManyArgs> = z.object({
  data: z.union([ DataTrackCreateManyInputSchema,DataTrackCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DataTrackDeleteArgsSchema: z.ZodType<Prisma.DataTrackDeleteArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  where: DataTrackWhereUniqueInputSchema,
}).strict() ;

export const DataTrackUpdateArgsSchema: z.ZodType<Prisma.DataTrackUpdateArgs> = z.object({
  select: DataTrackSelectSchema.optional(),
  include: DataTrackIncludeSchema.optional(),
  data: z.union([ DataTrackUpdateInputSchema,DataTrackUncheckedUpdateInputSchema ]),
  where: DataTrackWhereUniqueInputSchema,
}).strict() ;

export const DataTrackUpdateManyArgsSchema: z.ZodType<Prisma.DataTrackUpdateManyArgs> = z.object({
  data: z.union([ DataTrackUpdateManyMutationInputSchema,DataTrackUncheckedUpdateManyInputSchema ]),
  where: DataTrackWhereInputSchema.optional(),
}).strict() ;

export const DataTrackDeleteManyArgsSchema: z.ZodType<Prisma.DataTrackDeleteManyArgs> = z.object({
  where: DataTrackWhereInputSchema.optional(),
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

export const FormSubmissionAndReturnCreateManyArgsSchema: z.ZodType<Prisma.FormSubmissionAndReturnCreateManyArgs> = z.object({
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

export const DatasetAndReturnCreateManyArgsSchema: z.ZodType<Prisma.DatasetAndReturnCreateManyArgs> = z.object({
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

export const ColumnAndReturnCreateManyArgsSchema: z.ZodType<Prisma.ColumnAndReturnCreateManyArgs> = z.object({
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

export const RowAndReturnCreateManyArgsSchema: z.ZodType<Prisma.RowAndReturnCreateManyArgs> = z.object({
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

export const CellValueAndReturnCreateManyArgsSchema: z.ZodType<Prisma.CellValueAndReturnCreateManyArgs> = z.object({
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

export const BoolCellCreateArgsSchema: z.ZodType<Prisma.BoolCellCreateArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  data: z.union([ BoolCellCreateInputSchema,BoolCellUncheckedCreateInputSchema ]),
}).strict() ;

export const BoolCellUpsertArgsSchema: z.ZodType<Prisma.BoolCellUpsertArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereUniqueInputSchema,
  create: z.union([ BoolCellCreateInputSchema,BoolCellUncheckedCreateInputSchema ]),
  update: z.union([ BoolCellUpdateInputSchema,BoolCellUncheckedUpdateInputSchema ]),
}).strict() ;

export const BoolCellCreateManyArgsSchema: z.ZodType<Prisma.BoolCellCreateManyArgs> = z.object({
  data: z.union([ BoolCellCreateManyInputSchema,BoolCellCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BoolCellAndReturnCreateManyArgsSchema: z.ZodType<Prisma.BoolCellAndReturnCreateManyArgs> = z.object({
  data: z.union([ BoolCellCreateManyInputSchema,BoolCellCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BoolCellDeleteArgsSchema: z.ZodType<Prisma.BoolCellDeleteArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  where: BoolCellWhereUniqueInputSchema,
}).strict() ;

export const BoolCellUpdateArgsSchema: z.ZodType<Prisma.BoolCellUpdateArgs> = z.object({
  select: BoolCellSelectSchema.optional(),
  include: BoolCellIncludeSchema.optional(),
  data: z.union([ BoolCellUpdateInputSchema,BoolCellUncheckedUpdateInputSchema ]),
  where: BoolCellWhereUniqueInputSchema,
}).strict() ;

export const BoolCellUpdateManyArgsSchema: z.ZodType<Prisma.BoolCellUpdateManyArgs> = z.object({
  data: z.union([ BoolCellUpdateManyMutationInputSchema,BoolCellUncheckedUpdateManyInputSchema ]),
  where: BoolCellWhereInputSchema.optional(),
}).strict() ;

export const BoolCellDeleteManyArgsSchema: z.ZodType<Prisma.BoolCellDeleteManyArgs> = z.object({
  where: BoolCellWhereInputSchema.optional(),
}).strict() ;

export const StringCellCreateArgsSchema: z.ZodType<Prisma.StringCellCreateArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  data: z.union([ StringCellCreateInputSchema,StringCellUncheckedCreateInputSchema ]),
}).strict() ;

export const StringCellUpsertArgsSchema: z.ZodType<Prisma.StringCellUpsertArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereUniqueInputSchema,
  create: z.union([ StringCellCreateInputSchema,StringCellUncheckedCreateInputSchema ]),
  update: z.union([ StringCellUpdateInputSchema,StringCellUncheckedUpdateInputSchema ]),
}).strict() ;

export const StringCellCreateManyArgsSchema: z.ZodType<Prisma.StringCellCreateManyArgs> = z.object({
  data: z.union([ StringCellCreateManyInputSchema,StringCellCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const StringCellAndReturnCreateManyArgsSchema: z.ZodType<Prisma.StringCellAndReturnCreateManyArgs> = z.object({
  data: z.union([ StringCellCreateManyInputSchema,StringCellCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const StringCellDeleteArgsSchema: z.ZodType<Prisma.StringCellDeleteArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  where: StringCellWhereUniqueInputSchema,
}).strict() ;

export const StringCellUpdateArgsSchema: z.ZodType<Prisma.StringCellUpdateArgs> = z.object({
  select: StringCellSelectSchema.optional(),
  include: StringCellIncludeSchema.optional(),
  data: z.union([ StringCellUpdateInputSchema,StringCellUncheckedUpdateInputSchema ]),
  where: StringCellWhereUniqueInputSchema,
}).strict() ;

export const StringCellUpdateManyArgsSchema: z.ZodType<Prisma.StringCellUpdateManyArgs> = z.object({
  data: z.union([ StringCellUpdateManyMutationInputSchema,StringCellUncheckedUpdateManyInputSchema ]),
  where: StringCellWhereInputSchema.optional(),
}).strict() ;

export const StringCellDeleteManyArgsSchema: z.ZodType<Prisma.StringCellDeleteManyArgs> = z.object({
  where: StringCellWhereInputSchema.optional(),
}).strict() ;

export const PointCellDeleteArgsSchema: z.ZodType<Prisma.PointCellDeleteArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  where: PointCellWhereUniqueInputSchema,
}).strict() ;

export const PointCellUpdateArgsSchema: z.ZodType<Prisma.PointCellUpdateArgs> = z.object({
  select: PointCellSelectSchema.optional(),
  include: PointCellIncludeSchema.optional(),
  data: z.union([ PointCellUpdateInputSchema,PointCellUncheckedUpdateInputSchema ]),
  where: PointCellWhereUniqueInputSchema,
}).strict() ;

export const PointCellUpdateManyArgsSchema: z.ZodType<Prisma.PointCellUpdateManyArgs> = z.object({
  data: z.union([ PointCellUpdateManyMutationInputSchema,PointCellUncheckedUpdateManyInputSchema ]),
  where: PointCellWhereInputSchema.optional(),
}).strict() ;

export const PointCellDeleteManyArgsSchema: z.ZodType<Prisma.PointCellDeleteManyArgs> = z.object({
  where: PointCellWhereInputSchema.optional(),
}).strict() ;

export const LayerCreateArgsSchema: z.ZodType<Prisma.LayerCreateArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  data: z.union([ LayerCreateInputSchema,LayerUncheckedCreateInputSchema ]),
}).strict() ;

export const LayerUpsertArgsSchema: z.ZodType<Prisma.LayerUpsertArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereUniqueInputSchema,
  create: z.union([ LayerCreateInputSchema,LayerUncheckedCreateInputSchema ]),
  update: z.union([ LayerUpdateInputSchema,LayerUncheckedUpdateInputSchema ]),
}).strict() ;

export const LayerCreateManyArgsSchema: z.ZodType<Prisma.LayerCreateManyArgs> = z.object({
  data: z.union([ LayerCreateManyInputSchema,LayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LayerAndReturnCreateManyArgsSchema: z.ZodType<Prisma.LayerAndReturnCreateManyArgs> = z.object({
  data: z.union([ LayerCreateManyInputSchema,LayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LayerDeleteArgsSchema: z.ZodType<Prisma.LayerDeleteArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  where: LayerWhereUniqueInputSchema,
}).strict() ;

export const LayerUpdateArgsSchema: z.ZodType<Prisma.LayerUpdateArgs> = z.object({
  select: LayerSelectSchema.optional(),
  include: LayerIncludeSchema.optional(),
  data: z.union([ LayerUpdateInputSchema,LayerUncheckedUpdateInputSchema ]),
  where: LayerWhereUniqueInputSchema,
}).strict() ;

export const LayerUpdateManyArgsSchema: z.ZodType<Prisma.LayerUpdateManyArgs> = z.object({
  data: z.union([ LayerUpdateManyMutationInputSchema,LayerUncheckedUpdateManyInputSchema ]),
  where: LayerWhereInputSchema.optional(),
}).strict() ;

export const LayerDeleteManyArgsSchema: z.ZodType<Prisma.LayerDeleteManyArgs> = z.object({
  where: LayerWhereInputSchema.optional(),
}).strict() ;

export const PointLayerCreateArgsSchema: z.ZodType<Prisma.PointLayerCreateArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  data: z.union([ PointLayerCreateInputSchema,PointLayerUncheckedCreateInputSchema ]),
}).strict() ;

export const PointLayerUpsertArgsSchema: z.ZodType<Prisma.PointLayerUpsertArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereUniqueInputSchema,
  create: z.union([ PointLayerCreateInputSchema,PointLayerUncheckedCreateInputSchema ]),
  update: z.union([ PointLayerUpdateInputSchema,PointLayerUncheckedUpdateInputSchema ]),
}).strict() ;

export const PointLayerCreateManyArgsSchema: z.ZodType<Prisma.PointLayerCreateManyArgs> = z.object({
  data: z.union([ PointLayerCreateManyInputSchema,PointLayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PointLayerAndReturnCreateManyArgsSchema: z.ZodType<Prisma.PointLayerAndReturnCreateManyArgs> = z.object({
  data: z.union([ PointLayerCreateManyInputSchema,PointLayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PointLayerDeleteArgsSchema: z.ZodType<Prisma.PointLayerDeleteArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  where: PointLayerWhereUniqueInputSchema,
}).strict() ;

export const PointLayerUpdateArgsSchema: z.ZodType<Prisma.PointLayerUpdateArgs> = z.object({
  select: PointLayerSelectSchema.optional(),
  include: PointLayerIncludeSchema.optional(),
  data: z.union([ PointLayerUpdateInputSchema,PointLayerUncheckedUpdateInputSchema ]),
  where: PointLayerWhereUniqueInputSchema,
}).strict() ;

export const PointLayerUpdateManyArgsSchema: z.ZodType<Prisma.PointLayerUpdateManyArgs> = z.object({
  data: z.union([ PointLayerUpdateManyMutationInputSchema,PointLayerUncheckedUpdateManyInputSchema ]),
  where: PointLayerWhereInputSchema.optional(),
}).strict() ;

export const PointLayerDeleteManyArgsSchema: z.ZodType<Prisma.PointLayerDeleteManyArgs> = z.object({
  where: PointLayerWhereInputSchema.optional(),
}).strict() ;