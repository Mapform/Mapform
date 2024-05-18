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

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','createdAt','updatedAt']);

export const AccountScalarFieldEnumSchema = z.enum(['userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['sessionToken','userId','expires','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const AuthenticatorScalarFieldEnumSchema = z.enum(['credentialID','userId','providerAccountId','credentialPublicKey','counter','credentialDeviceType','credentialBackedUp','transports']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','slug','imageUrl']);

export const OrganizationMembershipScalarFieldEnumSchema = z.enum(['id','organizationId','userId','role']);

export const WorkspaceMembershipScalarFieldEnumSchema = z.enum(['id','userId','workspaceId','role']);

export const WorkspaceScalarFieldEnumSchema = z.enum(['id','name','slug','organizationId']);

export const FormScalarFieldEnumSchema = z.enum(['id','name','slug','isPublished','stepOrder','workspaceId','publishedFormId']);

export const StepScalarFieldEnumSchema = z.enum(['id','title','description','zoom','pitch','bearing','formId','locationId']);

export const FormSubmissionScalarFieldEnumSchema = z.enum(['id','formId']);

export const ShortTextInputFieldScalarFieldEnumSchema = z.enum(['id','blockNoteId','stepId']);

export const ShortTextInputResponseScalarFieldEnumSchema = z.enum(['id','formSubmissionId','shortTextInputFieldId','value']);

export const LocationScalarFieldEnumSchema = z.enum(['id']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const WorkspaceMembershipRoleSchema = z.enum(['OWNER','MEMBER']);

export type WorkspaceMembershipRoleType = `${z.infer<typeof WorkspaceMembershipRoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  accounts: AccountWithRelations[];
  sessions: SessionWithRelations[];
  Authenticator: AuthenticatorWithRelations[];
  organizationMemberships: OrganizationMembershipWithRelations[];
  workspaceMemberships: WorkspaceMembershipWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  accounts: z.lazy(() => AccountWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  Authenticator: z.lazy(() => AuthenticatorWithRelationsSchema).array(),
  organizationMemberships: z.lazy(() => OrganizationMembershipWithRelationsSchema).array(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// AUTHENTICATOR SCHEMA
/////////////////////////////////////////

export const AuthenticatorSchema = z.object({
  credentialID: z.string(),
  userId: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().nullable(),
})

export type Authenticator = z.infer<typeof AuthenticatorSchema>

// AUTHENTICATOR RELATION SCHEMA
//------------------------------------------------------

export type AuthenticatorRelations = {
  user: UserWithRelations;
};

export type AuthenticatorWithRelations = z.infer<typeof AuthenticatorSchema> & AuthenticatorRelations

export const AuthenticatorWithRelationsSchema: z.ZodType<AuthenticatorWithRelations> = AuthenticatorSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable(),
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
})

export type Workspace = z.infer<typeof WorkspaceSchema>

// WORKSPACE RELATION SCHEMA
//------------------------------------------------------

export type WorkspaceRelations = {
  members: WorkspaceMembershipWithRelations[];
  organization: OrganizationWithRelations;
  forms: FormWithRelations[];
};

export type WorkspaceWithRelations = z.infer<typeof WorkspaceSchema> & WorkspaceRelations

export const WorkspaceWithRelationsSchema: z.ZodType<WorkspaceWithRelations> = WorkspaceSchema.merge(z.object({
  members: z.lazy(() => WorkspaceMembershipWithRelationsSchema).array(),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
  forms: z.lazy(() => FormWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// FORM SCHEMA
/////////////////////////////////////////

export const FormSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean(),
  stepOrder: z.string().array(),
  workspaceId: z.string(),
  publishedFormId: z.string().nullable(),
})

export type Form = z.infer<typeof FormSchema>

// FORM RELATION SCHEMA
//------------------------------------------------------

export type FormRelations = {
  steps: StepWithRelations[];
  workspace: WorkspaceWithRelations;
  formSubmission: FormSubmissionWithRelations[];
  publishedForm?: FormWithRelations | null;
  draftForm?: FormWithRelations | null;
};

export type FormWithRelations = z.infer<typeof FormSchema> & FormRelations

export const FormWithRelationsSchema: z.ZodType<FormWithRelations> = FormSchema.merge(z.object({
  steps: z.lazy(() => StepWithRelationsSchema).array(),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema).array(),
  publishedForm: z.lazy(() => FormWithRelationsSchema).nullable(),
  draftForm: z.lazy(() => FormWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// STEP SCHEMA
/////////////////////////////////////////

export const StepSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  description: JsonValueSchema,
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().nullable(),
  locationId: z.string(),
})

export type Step = z.infer<typeof StepSchema>

// STEP RELATION SCHEMA
//------------------------------------------------------

export type StepRelations = {
  form?: FormWithRelations | null;
  location: LocationWithRelations;
  shortTextInputFields: ShortTextInputFieldWithRelations[];
};

export type StepWithRelations = Omit<z.infer<typeof StepSchema>, "description"> & {
  description?: JsonValueType | null;
} & StepRelations

export const StepWithRelationsSchema: z.ZodType<StepWithRelations> = StepSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema).nullable(),
  location: z.lazy(() => LocationWithRelationsSchema),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// FORM SUBMISSION SCHEMA
/////////////////////////////////////////

export const FormSubmissionSchema = z.object({
  id: z.string().uuid(),
  formId: z.string(),
})

export type FormSubmission = z.infer<typeof FormSubmissionSchema>

// FORM SUBMISSION RELATION SCHEMA
//------------------------------------------------------

export type FormSubmissionRelations = {
  form: FormWithRelations;
  shortTextInputResponse: ShortTextInputResponseWithRelations[];
};

export type FormSubmissionWithRelations = z.infer<typeof FormSubmissionSchema> & FormSubmissionRelations

export const FormSubmissionWithRelationsSchema: z.ZodType<FormSubmissionWithRelations> = FormSubmissionSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHORT TEXT INPUT FIELD SCHEMA
/////////////////////////////////////////

export const ShortTextInputFieldSchema = z.object({
  id: z.string().uuid(),
  blockNoteId: z.string(),
  stepId: z.string(),
})

export type ShortTextInputField = z.infer<typeof ShortTextInputFieldSchema>

// SHORT TEXT INPUT FIELD RELATION SCHEMA
//------------------------------------------------------

export type ShortTextInputFieldRelations = {
  step: StepWithRelations;
  shortTextInputResponse: ShortTextInputResponseWithRelations[];
};

export type ShortTextInputFieldWithRelations = z.infer<typeof ShortTextInputFieldSchema> & ShortTextInputFieldRelations

export const ShortTextInputFieldWithRelationsSchema: z.ZodType<ShortTextInputFieldWithRelations> = ShortTextInputFieldSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SHORT TEXT INPUT RESPONSE SCHEMA
/////////////////////////////////////////

export const ShortTextInputResponseSchema = z.object({
  id: z.string().uuid(),
  formSubmissionId: z.string(),
  shortTextInputFieldId: z.string(),
  value: z.string(),
})

export type ShortTextInputResponse = z.infer<typeof ShortTextInputResponseSchema>

// SHORT TEXT INPUT RESPONSE RELATION SCHEMA
//------------------------------------------------------

export type ShortTextInputResponseRelations = {
  formSubmission: FormSubmissionWithRelations;
  shortTextInputField: ShortTextInputFieldWithRelations;
};

export type ShortTextInputResponseWithRelations = z.infer<typeof ShortTextInputResponseSchema> & ShortTextInputResponseRelations

export const ShortTextInputResponseWithRelationsSchema: z.ZodType<ShortTextInputResponseWithRelations> = ShortTextInputResponseSchema.merge(z.object({
  formSubmission: z.lazy(() => FormSubmissionWithRelationsSchema),
  shortTextInputField: z.lazy(() => ShortTextInputFieldWithRelationsSchema),
}))

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  id: z.string().uuid(),
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
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  Authenticator: z.union([z.boolean(),z.lazy(() => AuthenticatorFindManyArgsSchema)]).optional(),
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
  Authenticator: z.boolean().optional(),
  organizationMemberships: z.boolean().optional(),
  workspaceMemberships: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  Authenticator: z.union([z.boolean(),z.lazy(() => AuthenticatorFindManyArgsSchema)]).optional(),
  organizationMemberships: z.union([z.boolean(),z.lazy(() => OrganizationMembershipFindManyArgsSchema)]).optional(),
  workspaceMemberships: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

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
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
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
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// AUTHENTICATOR
//------------------------------------------------------

export const AuthenticatorIncludeSchema: z.ZodType<Prisma.AuthenticatorInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AuthenticatorArgsSchema: z.ZodType<Prisma.AuthenticatorDefaultArgs> = z.object({
  select: z.lazy(() => AuthenticatorSelectSchema).optional(),
  include: z.lazy(() => AuthenticatorIncludeSchema).optional(),
}).strict();

export const AuthenticatorSelectSchema: z.ZodType<Prisma.AuthenticatorSelect> = z.object({
  credentialID: z.boolean().optional(),
  userId: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  credentialPublicKey: z.boolean().optional(),
  counter: z.boolean().optional(),
  credentialDeviceType: z.boolean().optional(),
  credentialBackedUp: z.boolean().optional(),
  transports: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
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
}).strict();

export const WorkspaceSelectSchema: z.ZodType<Prisma.WorkspaceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  members: z.union([z.boolean(),z.lazy(() => WorkspaceMembershipFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  forms: z.union([z.boolean(),z.lazy(() => FormFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkspaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FORM
//------------------------------------------------------

export const FormIncludeSchema: z.ZodType<Prisma.FormInclude> = z.object({
  steps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionFindManyArgsSchema)]).optional(),
  publishedForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  draftForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
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
}).strict();

export const FormSelectSchema: z.ZodType<Prisma.FormSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  stepOrder: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  publishedFormId: z.boolean().optional(),
  steps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionFindManyArgsSchema)]).optional(),
  publishedForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  draftForm: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict()

// STEP
//------------------------------------------------------

export const StepIncludeSchema: z.ZodType<Prisma.StepInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  shortTextInputFields: z.union([z.boolean(),z.lazy(() => ShortTextInputFieldFindManyArgsSchema)]).optional(),
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
  shortTextInputFields: z.boolean().optional(),
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
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  shortTextInputFields: z.union([z.boolean(),z.lazy(() => ShortTextInputFieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => StepCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FORM SUBMISSION
//------------------------------------------------------

export const FormSubmissionIncludeSchema: z.ZodType<Prisma.FormSubmissionInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  shortTextInputResponse: z.union([z.boolean(),z.lazy(() => ShortTextInputResponseFindManyArgsSchema)]).optional(),
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
  shortTextInputResponse: z.boolean().optional(),
}).strict();

export const FormSubmissionSelectSchema: z.ZodType<Prisma.FormSubmissionSelect> = z.object({
  id: z.boolean().optional(),
  formId: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  shortTextInputResponse: z.union([z.boolean(),z.lazy(() => ShortTextInputResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormSubmissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SHORT TEXT INPUT FIELD
//------------------------------------------------------

export const ShortTextInputFieldIncludeSchema: z.ZodType<Prisma.ShortTextInputFieldInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
  shortTextInputResponse: z.union([z.boolean(),z.lazy(() => ShortTextInputResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ShortTextInputFieldCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ShortTextInputFieldArgsSchema: z.ZodType<Prisma.ShortTextInputFieldDefaultArgs> = z.object({
  select: z.lazy(() => ShortTextInputFieldSelectSchema).optional(),
  include: z.lazy(() => ShortTextInputFieldIncludeSchema).optional(),
}).strict();

export const ShortTextInputFieldCountOutputTypeArgsSchema: z.ZodType<Prisma.ShortTextInputFieldCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ShortTextInputFieldCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ShortTextInputFieldCountOutputTypeSelectSchema: z.ZodType<Prisma.ShortTextInputFieldCountOutputTypeSelect> = z.object({
  shortTextInputResponse: z.boolean().optional(),
}).strict();

export const ShortTextInputFieldSelectSchema: z.ZodType<Prisma.ShortTextInputFieldSelect> = z.object({
  id: z.boolean().optional(),
  blockNoteId: z.boolean().optional(),
  stepId: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
  shortTextInputResponse: z.union([z.boolean(),z.lazy(() => ShortTextInputResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ShortTextInputFieldCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SHORT TEXT INPUT RESPONSE
//------------------------------------------------------

export const ShortTextInputResponseIncludeSchema: z.ZodType<Prisma.ShortTextInputResponseInclude> = z.object({
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  shortTextInputField: z.union([z.boolean(),z.lazy(() => ShortTextInputFieldArgsSchema)]).optional(),
}).strict()

export const ShortTextInputResponseArgsSchema: z.ZodType<Prisma.ShortTextInputResponseDefaultArgs> = z.object({
  select: z.lazy(() => ShortTextInputResponseSelectSchema).optional(),
  include: z.lazy(() => ShortTextInputResponseIncludeSchema).optional(),
}).strict();

export const ShortTextInputResponseSelectSchema: z.ZodType<Prisma.ShortTextInputResponseSelect> = z.object({
  id: z.boolean().optional(),
  formSubmissionId: z.boolean().optional(),
  shortTextInputFieldId: z.boolean().optional(),
  value: z.boolean().optional(),
  formSubmission: z.union([z.boolean(),z.lazy(() => FormSubmissionArgsSchema)]).optional(),
  shortTextInputField: z.union([z.boolean(),z.lazy(() => ShortTextInputFieldArgsSchema)]).optional(),
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


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorListRelationFilterSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorOrderByRelationAggregateInputSchema).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorListRelationFilterSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
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
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
})
.and(z.object({
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
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
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  sessionToken: z.string()
})
.and(z.object({
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
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

export const AuthenticatorWhereInputSchema: z.ZodType<Prisma.AuthenticatorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AuthenticatorWhereInputSchema),z.lazy(() => AuthenticatorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthenticatorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthenticatorWhereInputSchema),z.lazy(() => AuthenticatorWhereInputSchema).array() ]).optional(),
  credentialID: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  credentialPublicKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  counter: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  credentialDeviceType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  credentialBackedUp: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  transports: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AuthenticatorOrderByWithRelationInputSchema: z.ZodType<Prisma.AuthenticatorOrderByWithRelationInput> = z.object({
  credentialID: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
  counter: z.lazy(() => SortOrderSchema).optional(),
  credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
  credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
  transports: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AuthenticatorWhereUniqueInputSchema: z.ZodType<Prisma.AuthenticatorWhereUniqueInput> = z.union([
  z.object({
    userId_credentialID: z.lazy(() => AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema),
    credentialID: z.string()
  }),
  z.object({
    userId_credentialID: z.lazy(() => AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema),
  }),
  z.object({
    credentialID: z.string(),
  }),
])
.and(z.object({
  credentialID: z.string().optional(),
  userId_credentialID: z.lazy(() => AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AuthenticatorWhereInputSchema),z.lazy(() => AuthenticatorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthenticatorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthenticatorWhereInputSchema),z.lazy(() => AuthenticatorWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  credentialPublicKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  counter: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  credentialDeviceType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  credentialBackedUp: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  transports: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AuthenticatorOrderByWithAggregationInputSchema: z.ZodType<Prisma.AuthenticatorOrderByWithAggregationInput> = z.object({
  credentialID: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
  counter: z.lazy(() => SortOrderSchema).optional(),
  credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
  credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
  transports: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AuthenticatorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AuthenticatorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AuthenticatorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AuthenticatorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AuthenticatorSumOrderByAggregateInputSchema).optional()
}).strict();

export const AuthenticatorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AuthenticatorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema),z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema),z.lazy(() => AuthenticatorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  credentialID: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  credentialPublicKey: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  counter: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  credentialDeviceType: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  credentialBackedUp: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  transports: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  members: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaces: z.lazy(() => WorkspaceListRelationFilterSchema).optional()
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  members: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaces: z.lazy(() => WorkspaceListRelationFilterSchema).optional()
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
}).strict();

export const OrganizationMembershipWhereInputSchema: z.ZodType<Prisma.OrganizationMembershipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMembershipWhereInputSchema),z.lazy(() => OrganizationMembershipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationMembershipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
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
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationMembershipOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationMembershipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
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
  members: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  forms: z.lazy(() => FormListRelationFilterSchema).optional()
}).strict();

export const WorkspaceOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkspaceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  members: z.lazy(() => WorkspaceMembershipOrderByRelationAggregateInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  forms: z.lazy(() => FormOrderByRelationAggregateInputSchema).optional()
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
  members: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  forms: z.lazy(() => FormListRelationFilterSchema).optional()
}).strict());

export const WorkspaceOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkspaceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
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
}).strict();

export const FormWhereInputSchema: z.ZodType<Prisma.FormWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isPublished: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  steps: z.lazy(() => StepListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionListRelationFilterSchema).optional(),
  publishedForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  draftForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
}).strict();

export const FormOrderByWithRelationInputSchema: z.ZodType<Prisma.FormOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  steps: z.lazy(() => StepOrderByRelationAggregateInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByRelationAggregateInputSchema).optional(),
  publishedForm: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  draftForm: z.lazy(() => FormOrderByWithRelationInputSchema).optional()
}).strict();

export const FormWhereUniqueInputSchema: z.ZodType<Prisma.FormWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    publishedFormId: z.string(),
    workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
    publishedFormId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    publishedFormId: z.string(),
    workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema),
  }),
  z.object({
    publishedFormId: z.string(),
  }),
  z.object({
    workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  publishedFormId: z.string().optional(),
  workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isPublished: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  steps: z.lazy(() => StepListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionListRelationFilterSchema).optional(),
  publishedForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  draftForm: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
}).strict());

export const FormOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => FormCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FormMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FormMinOrderByAggregateInputSchema).optional()
}).strict();

export const FormScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FormScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FormScalarWhereWithAggregatesInputSchema),z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormScalarWhereWithAggregatesInputSchema),z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isPublished: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  publishedFormId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
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
  locationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldListRelationFilterSchema).optional()
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
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldOrderByRelationAggregateInputSchema).optional()
}).strict();

export const StepWhereUniqueInputSchema: z.ZodType<Prisma.StepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    locationId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    locationId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  locationId: z.string().optional(),
  AND: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.lazy(() => JsonNullableFilterSchema).optional(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  formId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  form: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldListRelationFilterSchema).optional()
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
  locationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const FormSubmissionWhereInputSchema: z.ZodType<Prisma.FormSubmissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormSubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormSubmissionWhereInputSchema),z.lazy(() => FormSubmissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  form: z.union([ z.lazy(() => FormRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseListRelationFilterSchema).optional()
}).strict();

export const FormSubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.FormSubmissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseOrderByRelationAggregateInputSchema).optional()
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
  form: z.union([ z.lazy(() => FormRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseListRelationFilterSchema).optional()
}).strict());

export const FormSubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormSubmissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
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
}).strict();

export const ShortTextInputFieldWhereInputSchema: z.ZodType<Prisma.ShortTextInputFieldWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextInputFieldWhereInputSchema),z.lazy(() => ShortTextInputFieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputFieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputFieldWhereInputSchema),z.lazy(() => ShortTextInputFieldWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseListRelationFilterSchema).optional()
}).strict();

export const ShortTextInputFieldOrderByWithRelationInputSchema: z.ZodType<Prisma.ShortTextInputFieldOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ShortTextInputFieldWhereUniqueInputSchema: z.ZodType<Prisma.ShortTextInputFieldWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    blockNoteId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    blockNoteId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string().optional(),
  AND: z.union([ z.lazy(() => ShortTextInputFieldWhereInputSchema),z.lazy(() => ShortTextInputFieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputFieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputFieldWhereInputSchema),z.lazy(() => ShortTextInputFieldWhereInputSchema).array() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseListRelationFilterSchema).optional()
}).strict());

export const ShortTextInputFieldOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShortTextInputFieldOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ShortTextInputFieldCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ShortTextInputFieldMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ShortTextInputFieldMinOrderByAggregateInputSchema).optional()
}).strict();

export const ShortTextInputFieldScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ShortTextInputFieldScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextInputFieldScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortTextInputFieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputFieldScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputFieldScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortTextInputFieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ShortTextInputResponseWhereInputSchema: z.ZodType<Prisma.ShortTextInputResponseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextInputResponseWhereInputSchema),z.lazy(() => ShortTextInputResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputResponseWhereInputSchema),z.lazy(() => ShortTextInputResponseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  shortTextInputFieldId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  shortTextInputField: z.union([ z.lazy(() => ShortTextInputFieldRelationFilterSchema),z.lazy(() => ShortTextInputFieldWhereInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseOrderByWithRelationInputSchema: z.ZodType<Prisma.ShortTextInputResponseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  shortTextInputFieldId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionOrderByWithRelationInputSchema).optional(),
  shortTextInputField: z.lazy(() => ShortTextInputFieldOrderByWithRelationInputSchema).optional()
}).strict();

export const ShortTextInputResponseWhereUniqueInputSchema: z.ZodType<Prisma.ShortTextInputResponseWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ShortTextInputResponseWhereInputSchema),z.lazy(() => ShortTextInputResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputResponseWhereInputSchema),z.lazy(() => ShortTextInputResponseWhereInputSchema).array() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  shortTextInputFieldId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmission: z.union([ z.lazy(() => FormSubmissionRelationFilterSchema),z.lazy(() => FormSubmissionWhereInputSchema) ]).optional(),
  shortTextInputField: z.union([ z.lazy(() => ShortTextInputFieldRelationFilterSchema),z.lazy(() => ShortTextInputFieldWhereInputSchema) ]).optional(),
}).strict());

export const ShortTextInputResponseOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShortTextInputResponseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  shortTextInputFieldId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ShortTextInputResponseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ShortTextInputResponseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ShortTextInputResponseMinOrderByAggregateInputSchema).optional()
}).strict();

export const ShortTextInputResponseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ShortTextInputResponseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputResponseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  shortTextInputFieldId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
}).strict();

export const LocationOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const LocationWhereUniqueInputSchema: z.ZodType<Prisma.LocationWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  step: z.union([ z.lazy(() => StepNullableRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional().nullable(),
}).strict());

export const LocationOrderByWithAggregationInputSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputSchema).optional()
}).strict();

export const LocationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
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
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
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
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const AuthenticatorCreateInputSchema: z.ZodType<Prisma.AuthenticatorCreateInput> = z.object({
  credentialID: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAuthenticatorInputSchema)
}).strict();

export const AuthenticatorUncheckedCreateInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedCreateInput> = z.object({
  credentialID: z.string(),
  userId: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().optional().nullable()
}).strict();

export const AuthenticatorUpdateInputSchema: z.ZodType<Prisma.AuthenticatorUpdateInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAuthenticatorNestedInputSchema).optional()
}).strict();

export const AuthenticatorUncheckedUpdateInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AuthenticatorCreateManyInputSchema: z.ZodType<Prisma.AuthenticatorCreateManyInput> = z.object({
  credentialID: z.string(),
  userId: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().optional().nullable()
}).strict();

export const AuthenticatorUpdateManyMutationInputSchema: z.ZodType<Prisma.AuthenticatorUpdateManyMutationInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AuthenticatorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateManyInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  members: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
  members: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  workspaces: z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationMembershipCreateInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateInput> = z.object({
  id: z.string(),
  role: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMembershipsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string()
}).strict();

export const OrganizationMembershipUpdateInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipCreateManyInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string()
}).strict();

export const OrganizationMembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUpdateInputSchema: z.ZodType<Prisma.WorkspaceUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceCreateManyInputSchema: z.ZodType<Prisma.WorkspaceCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string()
}).strict();

export const WorkspaceUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkspaceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormCreateInputSchema: z.ZodType<Prisma.FormCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutDraftFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateInputSchema: z.ZodType<Prisma.FormUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedFormId: z.string().optional().nullable(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormUpdateInputSchema: z.ZodType<Prisma.FormUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  publishedForm: z.lazy(() => FormUpdateOneWithoutDraftFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateInputSchema: z.ZodType<Prisma.FormUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormCreateManyInputSchema: z.ZodType<Prisma.FormCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedFormId: z.string().optional().nullable()
}).strict();

export const FormUpdateManyMutationInputSchema: z.ZodType<Prisma.FormUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
}).strict();

export const FormUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StepCreateInputSchema: z.ZodType<Prisma.StepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateInputSchema: z.ZodType<Prisma.StepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.string(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUncheckedCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUpdateInputSchema: z.ZodType<Prisma.StepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateInputSchema: z.ZodType<Prisma.StepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateManyInputSchema: z.ZodType<Prisma.StepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.string()
}).strict();

export const StepUpdateManyMutationInputSchema: z.ZodType<Prisma.StepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionCreateInputSchema: z.ZodType<Prisma.FormSubmissionCreateInput> = z.object({
  id: z.string().uuid().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUpdateInputSchema: z.ZodType<Prisma.FormSubmissionUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionCreateManyInputSchema: z.ZodType<Prisma.FormSubmissionCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string()
}).strict();

export const FormSubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.FormSubmissionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputFieldCreateInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  step: z.lazy(() => StepCreateNestedOneWithoutShortTextInputFieldsInputSchema),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseCreateNestedManyWithoutShortTextInputFieldInputSchema).optional()
}).strict();

export const ShortTextInputFieldUncheckedCreateInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  stepId: z.string(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedCreateNestedManyWithoutShortTextInputFieldInputSchema).optional()
}).strict();

export const ShortTextInputFieldUpdateInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutShortTextInputFieldsNestedInputSchema).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUpdateManyWithoutShortTextInputFieldNestedInputSchema).optional()
}).strict();

export const ShortTextInputFieldUncheckedUpdateInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldNestedInputSchema).optional()
}).strict();

export const ShortTextInputFieldCreateManyInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  stepId: z.string()
}).strict();

export const ShortTextInputFieldUpdateManyMutationInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputFieldUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseCreateInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutShortTextInputResponseInputSchema),
  shortTextInputField: z.lazy(() => ShortTextInputFieldCreateNestedOneWithoutShortTextInputResponseInputSchema)
}).strict();

export const ShortTextInputResponseUncheckedCreateInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  formSubmissionId: z.string(),
  shortTextInputFieldId: z.string(),
  value: z.string()
}).strict();

export const ShortTextInputResponseUpdateInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutShortTextInputResponseNestedInputSchema).optional(),
  shortTextInputField: z.lazy(() => ShortTextInputFieldUpdateOneRequiredWithoutShortTextInputResponseNestedInputSchema).optional()
}).strict();

export const ShortTextInputResponseUncheckedUpdateInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseCreateManyInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  formSubmissionId: z.string(),
  shortTextInputFieldId: z.string(),
  value: z.string()
}).strict();

export const ShortTextInputResponseUpdateManyMutationInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUncheckedUpdateOneWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const AuthenticatorListRelationFilterSchema: z.ZodType<Prisma.AuthenticatorListRelationFilter> = z.object({
  every: z.lazy(() => AuthenticatorWhereInputSchema).optional(),
  some: z.lazy(() => AuthenticatorWhereInputSchema).optional(),
  none: z.lazy(() => AuthenticatorWhereInputSchema).optional()
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

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AuthenticatorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AuthenticatorOrderByRelationAggregateInput> = z.object({
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
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
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

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
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
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
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
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
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
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
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

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
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

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const AuthenticatorUserIdCredentialIDCompoundUniqueInputSchema: z.ZodType<Prisma.AuthenticatorUserIdCredentialIDCompoundUniqueInput> = z.object({
  userId: z.string(),
  credentialID: z.string()
}).strict();

export const AuthenticatorCountOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorCountOrderByAggregateInput> = z.object({
  credentialID: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
  counter: z.lazy(() => SortOrderSchema).optional(),
  credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
  credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
  transports: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AuthenticatorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorAvgOrderByAggregateInput> = z.object({
  counter: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AuthenticatorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorMaxOrderByAggregateInput> = z.object({
  credentialID: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
  counter: z.lazy(() => SortOrderSchema).optional(),
  credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
  credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
  transports: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AuthenticatorMinOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorMinOrderByAggregateInput> = z.object({
  credentialID: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  credentialPublicKey: z.lazy(() => SortOrderSchema).optional(),
  counter: z.lazy(() => SortOrderSchema).optional(),
  credentialDeviceType: z.lazy(() => SortOrderSchema).optional(),
  credentialBackedUp: z.lazy(() => SortOrderSchema).optional(),
  transports: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AuthenticatorSumOrderByAggregateInputSchema: z.ZodType<Prisma.AuthenticatorSumOrderByAggregateInput> = z.object({
  counter: z.lazy(() => SortOrderSchema).optional()
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

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
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
  imageUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationRelationFilterSchema: z.ZodType<Prisma.OrganizationRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationMembershipCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMembershipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMembershipMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMembershipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
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

export const FormOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FormOrderByRelationAggregateInput> = z.object({
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
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkspaceMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkspaceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
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

export const FormWorkspaceIdSlugCompoundUniqueInputSchema: z.ZodType<Prisma.FormWorkspaceIdSlugCompoundUniqueInput> = z.object({
  workspaceId: z.string(),
  slug: z.string()
}).strict();

export const FormCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  publishedFormId: z.lazy(() => SortOrderSchema).optional()
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

export const LocationRelationFilterSchema: z.ZodType<Prisma.LocationRelationFilter> = z.object({
  is: z.lazy(() => LocationWhereInputSchema).optional(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const ShortTextInputFieldListRelationFilterSchema: z.ZodType<Prisma.ShortTextInputFieldListRelationFilter> = z.object({
  every: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional(),
  some: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional(),
  none: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional()
}).strict();

export const ShortTextInputFieldOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ShortTextInputFieldOrderByRelationAggregateInput> = z.object({
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
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepAvgOrderByAggregateInputSchema: z.ZodType<Prisma.StepAvgOrderByAggregateInput> = z.object({
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepMinOrderByAggregateInputSchema: z.ZodType<Prisma.StepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepSumOrderByAggregateInputSchema: z.ZodType<Prisma.StepSumOrderByAggregateInput> = z.object({
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional()
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

export const FormRelationFilterSchema: z.ZodType<Prisma.FormRelationFilter> = z.object({
  is: z.lazy(() => FormWhereInputSchema).optional(),
  isNot: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const ShortTextInputResponseListRelationFilterSchema: z.ZodType<Prisma.ShortTextInputResponseListRelationFilter> = z.object({
  every: z.lazy(() => ShortTextInputResponseWhereInputSchema).optional(),
  some: z.lazy(() => ShortTextInputResponseWhereInputSchema).optional(),
  none: z.lazy(() => ShortTextInputResponseWhereInputSchema).optional()
}).strict();

export const ShortTextInputResponseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ShortTextInputResponseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormSubmissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepRelationFilterSchema: z.ZodType<Prisma.StepRelationFilter> = z.object({
  is: z.lazy(() => StepWhereInputSchema).optional(),
  isNot: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const ShortTextInputFieldCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextInputFieldCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortTextInputFieldMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextInputFieldMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortTextInputFieldMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextInputFieldMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockNoteId: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormSubmissionRelationFilterSchema: z.ZodType<Prisma.FormSubmissionRelationFilter> = z.object({
  is: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  isNot: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const ShortTextInputFieldRelationFilterSchema: z.ZodType<Prisma.ShortTextInputFieldRelationFilter> = z.object({
  is: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional(),
  isNot: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional()
}).strict();

export const ShortTextInputResponseCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextInputResponseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  shortTextInputFieldId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortTextInputResponseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextInputResponseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  shortTextInputFieldId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortTextInputResponseMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextInputResponseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  formSubmissionId: z.lazy(() => SortOrderSchema).optional(),
  shortTextInputFieldId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepNullableRelationFilterSchema: z.ZodType<Prisma.StepNullableRelationFilter> = z.object({
  is: z.lazy(() => StepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => StepWhereInputSchema).optional().nullable()
}).strict();

export const LocationCountOrderByAggregateInputSchema: z.ZodType<Prisma.LocationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMinOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
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

export const AuthenticatorCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
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

export const AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
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

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
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

export const AuthenticatorUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthenticatorUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AuthenticatorScalarWhereInputSchema),z.lazy(() => AuthenticatorScalarWhereInputSchema).array() ]).optional(),
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

export const AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateWithoutUserInputSchema).array(),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema),z.lazy(() => AuthenticatorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AuthenticatorCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AuthenticatorWhereUniqueInputSchema),z.lazy(() => AuthenticatorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AuthenticatorUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AuthenticatorScalarWhereInputSchema),z.lazy(() => AuthenticatorScalarWhereInputSchema).array() ]).optional(),
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

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
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

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAuthenticatorInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAuthenticatorInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAuthenticatorNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAuthenticatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAuthenticatorInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAuthenticatorInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAuthenticatorInputSchema),z.lazy(() => UserUpdateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAuthenticatorInputSchema) ]).optional(),
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

export const FormCreateNestedOneWithoutDraftFormInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutDraftFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const FormCreateNestedOneWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutPublishedFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutPublishedFormInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
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

export const FormUncheckedCreateNestedOneWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateNestedOneWithoutPublishedFormInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutPublishedFormInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
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

export const FormUpdateOneWithoutDraftFormNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutDraftFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDraftFormInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutDraftFormInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutDraftFormInputSchema),z.lazy(() => FormUpdateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftFormInputSchema) ]).optional(),
}).strict();

export const FormUpdateOneWithoutPublishedFormNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutPublishedFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutPublishedFormInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutPublishedFormInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutPublishedFormInputSchema),z.lazy(() => FormUpdateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedFormInputSchema) ]).optional(),
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

export const FormUncheckedUpdateOneWithoutPublishedFormNestedInputSchema: z.ZodType<Prisma.FormUncheckedUpdateOneWithoutPublishedFormNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutPublishedFormInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutPublishedFormInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutPublishedFormInputSchema),z.lazy(() => FormUpdateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedFormInputSchema) ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutStepsInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutStepsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const LocationCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutStepInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const ShortTextInputFieldCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema).array(),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputFieldCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortTextInputFieldUncheckedCreateNestedManyWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedCreateNestedManyWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema).array(),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputFieldCreateManyStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
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

export const ShortTextInputFieldUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema).array(),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortTextInputFieldUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputFieldCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortTextInputFieldUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortTextInputFieldUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortTextInputFieldScalarWhereInputSchema),z.lazy(() => ShortTextInputFieldScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortTextInputFieldUncheckedUpdateManyWithoutStepNestedInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedUpdateManyWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema).array(),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortTextInputFieldUpsertWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUpsertWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputFieldCreateManyStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortTextInputFieldUpdateWithWhereUniqueWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUpdateWithWhereUniqueWithoutStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortTextInputFieldUpdateManyWithWhereWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUpdateManyWithWhereWithoutStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortTextInputFieldScalarWhereInputSchema),z.lazy(() => ShortTextInputFieldScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormCreateNestedOneWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const ShortTextInputResponseCreateNestedManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateNestedManyWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedCreateNestedManyWithoutFormSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.FormUpdateOneRequiredWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFormSubmissionInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutFormSubmissionInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => FormUpdateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedUpdateWithoutFormSubmissionInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseUpdateManyWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateManyWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyFormSubmissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const StepCreateNestedOneWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutShortTextInputFieldsInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutShortTextInputFieldsInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const ShortTextInputResponseCreateNestedManyWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateNestedManyWithoutShortTextInputFieldInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyShortTextInputFieldInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedCreateNestedManyWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedCreateNestedManyWithoutShortTextInputFieldInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyShortTextInputFieldInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StepUpdateOneRequiredWithoutShortTextInputFieldsNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutShortTextInputFieldsNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutShortTextInputFieldsInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutShortTextInputFieldsInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUpdateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedUpdateWithoutShortTextInputFieldsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseUpdateManyWithoutShortTextInputFieldNestedInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateManyWithoutShortTextInputFieldNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyShortTextInputFieldInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldNestedInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema).array(),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUpsertWithWhereUniqueWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortTextInputResponseCreateManyShortTextInputFieldInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUpdateWithWhereUniqueWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUpdateManyWithWhereWithoutShortTextInputFieldInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FormSubmissionCreateNestedOneWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionCreateNestedOneWithoutShortTextInputResponseInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutShortTextInputResponseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutShortTextInputResponseInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional()
}).strict();

export const ShortTextInputFieldCreateNestedOneWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateNestedOneWithoutShortTextInputResponseInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutShortTextInputResponseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutShortTextInputResponseInputSchema).optional(),
  connect: z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).optional()
}).strict();

export const FormSubmissionUpdateOneRequiredWithoutShortTextInputResponseNestedInputSchema: z.ZodType<Prisma.FormSubmissionUpdateOneRequiredWithoutShortTextInputResponseNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutShortTextInputResponseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormSubmissionCreateOrConnectWithoutShortTextInputResponseInputSchema).optional(),
  upsert: z.lazy(() => FormSubmissionUpsertWithoutShortTextInputResponseInputSchema).optional(),
  connect: z.lazy(() => FormSubmissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormSubmissionUpdateToOneWithWhereWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUpdateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutShortTextInputResponseInputSchema) ]).optional(),
}).strict();

export const ShortTextInputFieldUpdateOneRequiredWithoutShortTextInputResponseNestedInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateOneRequiredWithoutShortTextInputResponseNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutShortTextInputResponseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ShortTextInputFieldCreateOrConnectWithoutShortTextInputResponseInputSchema).optional(),
  upsert: z.lazy(() => ShortTextInputFieldUpsertWithoutShortTextInputResponseInputSchema).optional(),
  connect: z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ShortTextInputFieldUpdateToOneWithWhereWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUpdateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedUpdateWithoutShortTextInputResponseInputSchema) ]).optional(),
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

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
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

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
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

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
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
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AuthenticatorCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateWithoutUserInput> = z.object({
  credentialID: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().optional().nullable()
}).strict();

export const AuthenticatorUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedCreateWithoutUserInput> = z.object({
  credentialID: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().optional().nullable()
}).strict();

export const AuthenticatorCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AuthenticatorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AuthenticatorCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AuthenticatorCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AuthenticatorCreateManyUserInputSchema),z.lazy(() => AuthenticatorCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationMembershipCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateWithoutUserInput> = z.object({
  id: z.string(),
  role: z.string(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  role: z.string()
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
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
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AuthenticatorUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AuthenticatorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AuthenticatorUpdateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AuthenticatorCreateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AuthenticatorUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AuthenticatorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AuthenticatorUpdateWithoutUserInputSchema),z.lazy(() => AuthenticatorUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AuthenticatorUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AuthenticatorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AuthenticatorUpdateManyMutationInputSchema),z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AuthenticatorScalarWhereInputSchema: z.ZodType<Prisma.AuthenticatorScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AuthenticatorScalarWhereInputSchema),z.lazy(() => AuthenticatorScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthenticatorScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthenticatorScalarWhereInputSchema),z.lazy(() => AuthenticatorScalarWhereInputSchema).array() ]).optional(),
  credentialID: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  credentialPublicKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  counter: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  credentialDeviceType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  credentialBackedUp: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  transports: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
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

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserCreateWithoutAuthenticatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAuthenticatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAuthenticatorInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema) ]),
}).strict();

export const UserUpsertWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUpsertWithoutAuthenticatorInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAuthenticatorInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutAuthenticatorInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAuthenticatorInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAuthenticatorInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAuthenticatorInputSchema) ]),
}).strict();

export const UserUpdateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUpdateWithoutAuthenticatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAuthenticatorInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAuthenticatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateWithoutOrganizationInput> = z.object({
  id: z.string(),
  role: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMembershipsInputSchema)
}).strict();

export const OrganizationMembershipUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.string()
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
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
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
}).strict();

export const UserCreateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
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
  workspaces: z.lazy(() => WorkspaceCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
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
  workspaces: z.lazy(() => WorkspaceUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workspaces: z.lazy(() => WorkspaceUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
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
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema),
  forms: z.lazy(() => FormCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutMembersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  forms: z.lazy(() => FormUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Authenticator: z.lazy(() => AuthenticatorUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
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
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
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
  members: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutWorkspacesInput> = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional().nullable(),
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
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutDraftFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedFormId: z.string().optional().nullable(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutWorkspaceInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutWorkspaceInputSchema),z.lazy(() => FormUncheckedCreateWithoutWorkspaceInputSchema) ]),
}).strict();

export const FormCreateManyWorkspaceInputEnvelopeSchema: z.ZodType<Prisma.FormCreateManyWorkspaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormCreateManyWorkspaceInputSchema),z.lazy(() => FormCreateManyWorkspaceInputSchema).array() ]),
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
  members: z.lazy(() => OrganizationMembershipUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutWorkspacesInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutWorkspacesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  isPublished: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedFormId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const StepCreateWithoutFormInputSchema: z.ZodType<Prisma.StepCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  locationId: z.string(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUncheckedCreateNestedManyWithoutStepInputSchema).optional()
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
  members: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutWorkspaceInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutWorkspacesInputSchema)
}).strict();

export const WorkspaceUncheckedCreateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedCreateWithoutFormsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  members: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutWorkspaceInputSchema).optional()
}).strict();

export const WorkspaceCreateOrConnectWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateOrConnectWithoutFormsInput> = z.object({
  where: z.lazy(() => WorkspaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]),
}).strict();

export const FormSubmissionCreateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutFormInput> = z.object({
  id: z.string().uuid().optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedCreateNestedManyWithoutFormSubmissionInputSchema).optional()
}).strict();

export const FormSubmissionCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutFormInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutFormInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutFormInputSchema) ]),
}).strict();

export const FormSubmissionCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.FormSubmissionCreateManyFormInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FormSubmissionCreateManyFormInputSchema),z.lazy(() => FormSubmissionCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FormCreateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormCreateWithoutDraftFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutDraftFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutDraftFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedFormId: z.string().optional().nullable(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutDraftFormInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutDraftFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema) ]),
}).strict();

export const FormCreateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormCreateWithoutPublishedFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutPublishedFormInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutPublishedFormInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedFormInputSchema) ]),
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
  locationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
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
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutWorkspacesNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutFormsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
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
}).strict();

export const FormUpsertWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpsertWithoutDraftFormInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftFormInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutDraftFormInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutDraftFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftFormInputSchema) ]),
}).strict();

export const FormUpdateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUpdateWithoutDraftFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  publishedForm: z.lazy(() => FormUpdateOneWithoutDraftFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutDraftFormInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutDraftFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional()
}).strict();

export const FormUpsertWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormUpsertWithoutPublishedFormInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedFormInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutPublishedFormInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutPublishedFormInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedFormInputSchema) ]),
}).strict();

export const FormUpdateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormUpdateWithoutPublishedFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutPublishedFormInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutPublishedFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormCreateWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateWithoutStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedManyWithoutFormInputSchema).optional(),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutDraftFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutStepsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedFormId: z.string().optional().nullable(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutStepsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutStepsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutStepsInputSchema) ]),
}).strict();

export const ShortTextInputFieldCreateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseCreateNestedManyWithoutShortTextInputFieldInputSchema).optional()
}).strict();

export const ShortTextInputFieldUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedCreateNestedManyWithoutShortTextInputFieldInputSchema).optional()
}).strict();

export const ShortTextInputFieldCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const ShortTextInputFieldCreateManyStepInputEnvelopeSchema: z.ZodType<Prisma.ShortTextInputFieldCreateManyStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShortTextInputFieldCreateManyStepInputSchema),z.lazy(() => ShortTextInputFieldCreateManyStepInputSchema).array() ]),
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
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  publishedForm: z.lazy(() => FormUpdateOneWithoutDraftFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutStepsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const LocationUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutStepInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const LocationUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputFieldUpsertWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpsertWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShortTextInputFieldUpdateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const ShortTextInputFieldUpdateWithWhereUniqueWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateWithWhereUniqueWithoutStepInput> = z.object({
  where: z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShortTextInputFieldUpdateWithoutStepInputSchema),z.lazy(() => ShortTextInputFieldUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const ShortTextInputFieldUpdateManyWithWhereWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateManyWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => ShortTextInputFieldScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShortTextInputFieldUpdateManyMutationInputSchema),z.lazy(() => ShortTextInputFieldUncheckedUpdateManyWithoutStepInputSchema) ]),
}).strict();

export const ShortTextInputFieldScalarWhereInputSchema: z.ZodType<Prisma.ShortTextInputFieldScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextInputFieldScalarWhereInputSchema),z.lazy(() => ShortTextInputFieldScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputFieldScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputFieldScalarWhereInputSchema),z.lazy(() => ShortTextInputFieldScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  blockNoteId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const FormCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepCreateNestedManyWithoutFormInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema),
  publishedForm: z.lazy(() => FormCreateNestedOneWithoutDraftFormInputSchema).optional(),
  draftForm: z.lazy(() => FormCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedFormId: z.string().optional().nullable(),
  steps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedCreateNestedOneWithoutPublishedFormInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutFormSubmissionInputSchema),z.lazy(() => FormUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const ShortTextInputResponseCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  shortTextInputField: z.lazy(() => ShortTextInputFieldCreateNestedOneWithoutShortTextInputResponseInputSchema)
}).strict();

export const ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  shortTextInputFieldId: z.string(),
  value: z.string()
}).strict();

export const ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateOrConnectWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const ShortTextInputResponseCreateManyFormSubmissionInputEnvelopeSchema: z.ZodType<Prisma.ShortTextInputResponseCreateManyFormSubmissionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShortTextInputResponseCreateManyFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseCreateManyFormSubmissionInputSchema).array() ]),
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
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional(),
  publishedForm: z.lazy(() => FormUpdateOneWithoutDraftFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const ShortTextInputResponseUpsertWithWhereUniqueWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpsertWithWhereUniqueWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const ShortTextInputResponseUpdateWithWhereUniqueWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateWithWhereUniqueWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithoutFormSubmissionInputSchema),z.lazy(() => ShortTextInputResponseUncheckedUpdateWithoutFormSubmissionInputSchema) ]),
}).strict();

export const ShortTextInputResponseUpdateManyWithWhereWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateManyWithWhereWithoutFormSubmissionInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShortTextInputResponseUpdateManyMutationInputSchema),z.lazy(() => ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionInputSchema) ]),
}).strict();

export const ShortTextInputResponseScalarWhereInputSchema: z.ZodType<Prisma.ShortTextInputResponseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),z.lazy(() => ShortTextInputResponseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  formSubmissionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  shortTextInputFieldId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const StepCreateWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepCreateWithoutShortTextInputFieldsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutShortTextInputFieldsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  locationId: z.string()
}).strict();

export const StepCreateOrConnectWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutShortTextInputFieldsInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputFieldsInputSchema) ]),
}).strict();

export const ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateWithoutShortTextInputFieldInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  formSubmission: z.lazy(() => FormSubmissionCreateNestedOneWithoutShortTextInputResponseInputSchema)
}).strict();

export const ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInput> = z.object({
  id: z.string().uuid().optional(),
  formSubmissionId: z.string(),
  value: z.string()
}).strict();

export const ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateOrConnectWithoutShortTextInputFieldInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema) ]),
}).strict();

export const ShortTextInputResponseCreateManyShortTextInputFieldInputEnvelopeSchema: z.ZodType<Prisma.ShortTextInputResponseCreateManyShortTextInputFieldInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShortTextInputResponseCreateManyShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseCreateManyShortTextInputFieldInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const StepUpsertWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepUpsertWithoutShortTextInputFieldsInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedUpdateWithoutShortTextInputFieldsInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputFieldsInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutShortTextInputFieldsInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutShortTextInputFieldsInputSchema),z.lazy(() => StepUncheckedUpdateWithoutShortTextInputFieldsInputSchema) ]),
}).strict();

export const StepUpdateWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepUpdateWithoutShortTextInputFieldsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutShortTextInputFieldsInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutShortTextInputFieldsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseUpsertWithWhereUniqueWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpsertWithWhereUniqueWithoutShortTextInputFieldInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedUpdateWithoutShortTextInputFieldInputSchema) ]),
  create: z.union([ z.lazy(() => ShortTextInputResponseCreateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedCreateWithoutShortTextInputFieldInputSchema) ]),
}).strict();

export const ShortTextInputResponseUpdateWithWhereUniqueWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateWithWhereUniqueWithoutShortTextInputFieldInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShortTextInputResponseUpdateWithoutShortTextInputFieldInputSchema),z.lazy(() => ShortTextInputResponseUncheckedUpdateWithoutShortTextInputFieldInputSchema) ]),
}).strict();

export const ShortTextInputResponseUpdateManyWithWhereWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateManyWithWhereWithoutShortTextInputFieldInput> = z.object({
  where: z.lazy(() => ShortTextInputResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShortTextInputResponseUpdateManyMutationInputSchema),z.lazy(() => ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldInputSchema) ]),
}).strict();

export const FormSubmissionCreateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionCreateWithoutShortTextInputResponseInput> = z.object({
  id: z.string().uuid().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutFormSubmissionInputSchema)
}).strict();

export const FormSubmissionUncheckedCreateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedCreateWithoutShortTextInputResponseInput> = z.object({
  id: z.string().uuid().optional(),
  formId: z.string()
}).strict();

export const FormSubmissionCreateOrConnectWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionCreateOrConnectWithoutShortTextInputResponseInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutShortTextInputResponseInputSchema) ]),
}).strict();

export const ShortTextInputFieldCreateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateWithoutShortTextInputResponseInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  step: z.lazy(() => StepCreateNestedOneWithoutShortTextInputFieldsInputSchema)
}).strict();

export const ShortTextInputFieldUncheckedCreateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedCreateWithoutShortTextInputResponseInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string(),
  stepId: z.string()
}).strict();

export const ShortTextInputFieldCreateOrConnectWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateOrConnectWithoutShortTextInputResponseInput> = z.object({
  where: z.lazy(() => ShortTextInputFieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutShortTextInputResponseInputSchema) ]),
}).strict();

export const FormSubmissionUpsertWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionUpsertWithoutShortTextInputResponseInput> = z.object({
  update: z.union([ z.lazy(() => FormSubmissionUpdateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutShortTextInputResponseInputSchema) ]),
  create: z.union([ z.lazy(() => FormSubmissionCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedCreateWithoutShortTextInputResponseInputSchema) ]),
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional()
}).strict();

export const FormSubmissionUpdateToOneWithWhereWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionUpdateToOneWithWhereWithoutShortTextInputResponseInput> = z.object({
  where: z.lazy(() => FormSubmissionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormSubmissionUpdateWithoutShortTextInputResponseInputSchema),z.lazy(() => FormSubmissionUncheckedUpdateWithoutShortTextInputResponseInputSchema) ]),
}).strict();

export const FormSubmissionUpdateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutShortTextInputResponseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutShortTextInputResponseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputFieldUpsertWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpsertWithoutShortTextInputResponseInput> = z.object({
  update: z.union([ z.lazy(() => ShortTextInputFieldUpdateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedUpdateWithoutShortTextInputResponseInputSchema) ]),
  create: z.union([ z.lazy(() => ShortTextInputFieldCreateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedCreateWithoutShortTextInputResponseInputSchema) ]),
  where: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional()
}).strict();

export const ShortTextInputFieldUpdateToOneWithWhereWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateToOneWithWhereWithoutShortTextInputResponseInput> = z.object({
  where: z.lazy(() => ShortTextInputFieldWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ShortTextInputFieldUpdateWithoutShortTextInputResponseInputSchema),z.lazy(() => ShortTextInputFieldUncheckedUpdateWithoutShortTextInputResponseInputSchema) ]),
}).strict();

export const ShortTextInputFieldUpdateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateWithoutShortTextInputResponseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutShortTextInputFieldsNestedInputSchema).optional()
}).strict();

export const ShortTextInputFieldUncheckedUpdateWithoutShortTextInputResponseInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedUpdateWithoutShortTextInputResponseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  form: z.lazy(() => FormCreateNestedOneWithoutStepsInputSchema).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldCreateNestedManyWithoutStepInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formId: z.string().optional().nullable(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUncheckedCreateNestedManyWithoutStepInputSchema).optional()
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
  form: z.lazy(() => FormUpdateOneWithoutStepsNestedInputSchema).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AuthenticatorCreateManyUserInputSchema: z.ZodType<Prisma.AuthenticatorCreateManyUserInput> = z.object({
  credentialID: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().optional().nullable()
}).strict();

export const OrganizationMembershipCreateManyUserInputSchema: z.ZodType<Prisma.OrganizationMembershipCreateManyUserInput> = z.object({
  id: z.string(),
  organizationId: z.string(),
  role: z.string()
}).strict();

export const WorkspaceMembershipCreateManyUserInputSchema: z.ZodType<Prisma.WorkspaceMembershipCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string(),
  role: z.lazy(() => WorkspaceMembershipRoleSchema)
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AuthenticatorUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUpdateWithoutUserInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AuthenticatorUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateWithoutUserInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AuthenticatorUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AuthenticatorUncheckedUpdateManyWithoutUserInput> = z.object({
  credentialID: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialPublicKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  counter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  credentialDeviceType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  credentialBackedUp: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationMembershipUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  role: z.string()
}).strict();

export const WorkspaceCreateManyOrganizationInputSchema: z.ZodType<Prisma.WorkspaceCreateManyOrganizationInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string()
}).strict();

export const OrganizationMembershipUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInputSchema).optional()
}).strict();

export const OrganizationMembershipUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkspaceUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional(),
  forms: z.lazy(() => FormUncheckedUpdateManyWithoutWorkspaceNestedInputSchema).optional()
}).strict();

export const WorkspaceUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.WorkspaceUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  isPublished: z.boolean().optional(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedFormId: z.string().optional().nullable()
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
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  steps: z.lazy(() => StepUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateManyWithoutFormNestedInputSchema).optional(),
  publishedForm: z.lazy(() => FormUpdateOneWithoutDraftFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  steps: z.lazy(() => StepUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  formSubmission: z.lazy(() => FormSubmissionUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  draftForm: z.lazy(() => FormUncheckedUpdateOneWithoutPublishedFormNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedFormId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StepCreateManyFormInputSchema: z.ZodType<Prisma.StepCreateManyFormInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  locationId: z.string()
}).strict();

export const FormSubmissionCreateManyFormInputSchema: z.ZodType<Prisma.FormSubmissionCreateManyFormInput> = z.object({
  id: z.string().uuid().optional()
}).strict();

export const StepUpdateWithoutFormInputSchema: z.ZodType<Prisma.StepUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputFields: z.lazy(() => ShortTextInputFieldUncheckedUpdateManyWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormSubmissionUpdateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionNestedInputSchema).optional()
}).strict();

export const FormSubmissionUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.FormSubmissionUncheckedUpdateManyWithoutFormInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputFieldCreateManyStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldCreateManyStepInput> = z.object({
  id: z.string().uuid().optional(),
  blockNoteId: z.string()
}).strict();

export const ShortTextInputFieldUpdateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUpdateManyWithoutShortTextInputFieldNestedInputSchema).optional()
}).strict();

export const ShortTextInputFieldUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputResponse: z.lazy(() => ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldNestedInputSchema).optional()
}).strict();

export const ShortTextInputFieldUncheckedUpdateManyWithoutStepInputSchema: z.ZodType<Prisma.ShortTextInputFieldUncheckedUpdateManyWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockNoteId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseCreateManyFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateManyFormSubmissionInput> = z.object({
  id: z.string().uuid().optional(),
  shortTextInputFieldId: z.string(),
  value: z.string()
}).strict();

export const ShortTextInputResponseUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputField: z.lazy(() => ShortTextInputFieldUpdateOneRequiredWithoutShortTextInputResponseNestedInputSchema).optional()
}).strict();

export const ShortTextInputResponseUncheckedUpdateWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateManyWithoutFormSubmissionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortTextInputFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseCreateManyShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseCreateManyShortTextInputFieldInput> = z.object({
  id: z.string().uuid().optional(),
  formSubmissionId: z.string(),
  value: z.string()
}).strict();

export const ShortTextInputResponseUpdateWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateWithoutShortTextInputFieldInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmission: z.lazy(() => FormSubmissionUpdateOneRequiredWithoutShortTextInputResponseNestedInputSchema).optional()
}).strict();

export const ShortTextInputResponseUncheckedUpdateWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateWithoutShortTextInputFieldInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldInputSchema: z.ZodType<Prisma.ShortTextInputResponseUncheckedUpdateManyWithoutShortTextInputFieldInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formSubmissionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const AuthenticatorFindFirstArgsSchema: z.ZodType<Prisma.AuthenticatorFindFirstArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereInputSchema.optional(),
  orderBy: z.union([ AuthenticatorOrderByWithRelationInputSchema.array(),AuthenticatorOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthenticatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthenticatorScalarFieldEnumSchema,AuthenticatorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AuthenticatorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AuthenticatorFindFirstOrThrowArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereInputSchema.optional(),
  orderBy: z.union([ AuthenticatorOrderByWithRelationInputSchema.array(),AuthenticatorOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthenticatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthenticatorScalarFieldEnumSchema,AuthenticatorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AuthenticatorFindManyArgsSchema: z.ZodType<Prisma.AuthenticatorFindManyArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereInputSchema.optional(),
  orderBy: z.union([ AuthenticatorOrderByWithRelationInputSchema.array(),AuthenticatorOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthenticatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthenticatorScalarFieldEnumSchema,AuthenticatorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AuthenticatorAggregateArgsSchema: z.ZodType<Prisma.AuthenticatorAggregateArgs> = z.object({
  where: AuthenticatorWhereInputSchema.optional(),
  orderBy: z.union([ AuthenticatorOrderByWithRelationInputSchema.array(),AuthenticatorOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthenticatorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AuthenticatorGroupByArgsSchema: z.ZodType<Prisma.AuthenticatorGroupByArgs> = z.object({
  where: AuthenticatorWhereInputSchema.optional(),
  orderBy: z.union([ AuthenticatorOrderByWithAggregationInputSchema.array(),AuthenticatorOrderByWithAggregationInputSchema ]).optional(),
  by: AuthenticatorScalarFieldEnumSchema.array(),
  having: AuthenticatorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AuthenticatorFindUniqueArgsSchema: z.ZodType<Prisma.AuthenticatorFindUniqueArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereUniqueInputSchema,
}).strict() ;

export const AuthenticatorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AuthenticatorFindUniqueOrThrowArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereUniqueInputSchema,
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

export const ShortTextInputFieldFindFirstArgsSchema: z.ZodType<Prisma.ShortTextInputFieldFindFirstArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputFieldOrderByWithRelationInputSchema.array(),ShortTextInputFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputFieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextInputFieldScalarFieldEnumSchema,ShortTextInputFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextInputFieldFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ShortTextInputFieldFindFirstOrThrowArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputFieldOrderByWithRelationInputSchema.array(),ShortTextInputFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputFieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextInputFieldScalarFieldEnumSchema,ShortTextInputFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextInputFieldFindManyArgsSchema: z.ZodType<Prisma.ShortTextInputFieldFindManyArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputFieldOrderByWithRelationInputSchema.array(),ShortTextInputFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputFieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextInputFieldScalarFieldEnumSchema,ShortTextInputFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextInputFieldAggregateArgsSchema: z.ZodType<Prisma.ShortTextInputFieldAggregateArgs> = z.object({
  where: ShortTextInputFieldWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputFieldOrderByWithRelationInputSchema.array(),ShortTextInputFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputFieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortTextInputFieldGroupByArgsSchema: z.ZodType<Prisma.ShortTextInputFieldGroupByArgs> = z.object({
  where: ShortTextInputFieldWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputFieldOrderByWithAggregationInputSchema.array(),ShortTextInputFieldOrderByWithAggregationInputSchema ]).optional(),
  by: ShortTextInputFieldScalarFieldEnumSchema.array(),
  having: ShortTextInputFieldScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortTextInputFieldFindUniqueArgsSchema: z.ZodType<Prisma.ShortTextInputFieldFindUniqueArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputFieldFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShortTextInputFieldFindUniqueOrThrowArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputResponseFindFirstArgsSchema: z.ZodType<Prisma.ShortTextInputResponseFindFirstArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputResponseOrderByWithRelationInputSchema.array(),ShortTextInputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextInputResponseScalarFieldEnumSchema,ShortTextInputResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextInputResponseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ShortTextInputResponseFindFirstOrThrowArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputResponseOrderByWithRelationInputSchema.array(),ShortTextInputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextInputResponseScalarFieldEnumSchema,ShortTextInputResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextInputResponseFindManyArgsSchema: z.ZodType<Prisma.ShortTextInputResponseFindManyArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputResponseOrderByWithRelationInputSchema.array(),ShortTextInputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextInputResponseScalarFieldEnumSchema,ShortTextInputResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextInputResponseAggregateArgsSchema: z.ZodType<Prisma.ShortTextInputResponseAggregateArgs> = z.object({
  where: ShortTextInputResponseWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputResponseOrderByWithRelationInputSchema.array(),ShortTextInputResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextInputResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortTextInputResponseGroupByArgsSchema: z.ZodType<Prisma.ShortTextInputResponseGroupByArgs> = z.object({
  where: ShortTextInputResponseWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextInputResponseOrderByWithAggregationInputSchema.array(),ShortTextInputResponseOrderByWithAggregationInputSchema ]).optional(),
  by: ShortTextInputResponseScalarFieldEnumSchema.array(),
  having: ShortTextInputResponseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortTextInputResponseFindUniqueArgsSchema: z.ZodType<Prisma.ShortTextInputResponseFindUniqueArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputResponseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShortTextInputResponseFindUniqueOrThrowArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereUniqueInputSchema,
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

export const AuthenticatorCreateArgsSchema: z.ZodType<Prisma.AuthenticatorCreateArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  data: z.union([ AuthenticatorCreateInputSchema,AuthenticatorUncheckedCreateInputSchema ]),
}).strict() ;

export const AuthenticatorUpsertArgsSchema: z.ZodType<Prisma.AuthenticatorUpsertArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereUniqueInputSchema,
  create: z.union([ AuthenticatorCreateInputSchema,AuthenticatorUncheckedCreateInputSchema ]),
  update: z.union([ AuthenticatorUpdateInputSchema,AuthenticatorUncheckedUpdateInputSchema ]),
}).strict() ;

export const AuthenticatorCreateManyArgsSchema: z.ZodType<Prisma.AuthenticatorCreateManyArgs> = z.object({
  data: z.union([ AuthenticatorCreateManyInputSchema,AuthenticatorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AuthenticatorDeleteArgsSchema: z.ZodType<Prisma.AuthenticatorDeleteArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  where: AuthenticatorWhereUniqueInputSchema,
}).strict() ;

export const AuthenticatorUpdateArgsSchema: z.ZodType<Prisma.AuthenticatorUpdateArgs> = z.object({
  select: AuthenticatorSelectSchema.optional(),
  include: AuthenticatorIncludeSchema.optional(),
  data: z.union([ AuthenticatorUpdateInputSchema,AuthenticatorUncheckedUpdateInputSchema ]),
  where: AuthenticatorWhereUniqueInputSchema,
}).strict() ;

export const AuthenticatorUpdateManyArgsSchema: z.ZodType<Prisma.AuthenticatorUpdateManyArgs> = z.object({
  data: z.union([ AuthenticatorUpdateManyMutationInputSchema,AuthenticatorUncheckedUpdateManyInputSchema ]),
  where: AuthenticatorWhereInputSchema.optional(),
}).strict() ;

export const AuthenticatorDeleteManyArgsSchema: z.ZodType<Prisma.AuthenticatorDeleteManyArgs> = z.object({
  where: AuthenticatorWhereInputSchema.optional(),
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

export const ShortTextInputFieldCreateArgsSchema: z.ZodType<Prisma.ShortTextInputFieldCreateArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  data: z.union([ ShortTextInputFieldCreateInputSchema,ShortTextInputFieldUncheckedCreateInputSchema ]),
}).strict() ;

export const ShortTextInputFieldUpsertArgsSchema: z.ZodType<Prisma.ShortTextInputFieldUpsertArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereUniqueInputSchema,
  create: z.union([ ShortTextInputFieldCreateInputSchema,ShortTextInputFieldUncheckedCreateInputSchema ]),
  update: z.union([ ShortTextInputFieldUpdateInputSchema,ShortTextInputFieldUncheckedUpdateInputSchema ]),
}).strict() ;

export const ShortTextInputFieldCreateManyArgsSchema: z.ZodType<Prisma.ShortTextInputFieldCreateManyArgs> = z.object({
  data: z.union([ ShortTextInputFieldCreateManyInputSchema,ShortTextInputFieldCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShortTextInputFieldDeleteArgsSchema: z.ZodType<Prisma.ShortTextInputFieldDeleteArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  where: ShortTextInputFieldWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputFieldUpdateArgsSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateArgs> = z.object({
  select: ShortTextInputFieldSelectSchema.optional(),
  include: ShortTextInputFieldIncludeSchema.optional(),
  data: z.union([ ShortTextInputFieldUpdateInputSchema,ShortTextInputFieldUncheckedUpdateInputSchema ]),
  where: ShortTextInputFieldWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputFieldUpdateManyArgsSchema: z.ZodType<Prisma.ShortTextInputFieldUpdateManyArgs> = z.object({
  data: z.union([ ShortTextInputFieldUpdateManyMutationInputSchema,ShortTextInputFieldUncheckedUpdateManyInputSchema ]),
  where: ShortTextInputFieldWhereInputSchema.optional(),
}).strict() ;

export const ShortTextInputFieldDeleteManyArgsSchema: z.ZodType<Prisma.ShortTextInputFieldDeleteManyArgs> = z.object({
  where: ShortTextInputFieldWhereInputSchema.optional(),
}).strict() ;

export const ShortTextInputResponseCreateArgsSchema: z.ZodType<Prisma.ShortTextInputResponseCreateArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  data: z.union([ ShortTextInputResponseCreateInputSchema,ShortTextInputResponseUncheckedCreateInputSchema ]),
}).strict() ;

export const ShortTextInputResponseUpsertArgsSchema: z.ZodType<Prisma.ShortTextInputResponseUpsertArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereUniqueInputSchema,
  create: z.union([ ShortTextInputResponseCreateInputSchema,ShortTextInputResponseUncheckedCreateInputSchema ]),
  update: z.union([ ShortTextInputResponseUpdateInputSchema,ShortTextInputResponseUncheckedUpdateInputSchema ]),
}).strict() ;

export const ShortTextInputResponseCreateManyArgsSchema: z.ZodType<Prisma.ShortTextInputResponseCreateManyArgs> = z.object({
  data: z.union([ ShortTextInputResponseCreateManyInputSchema,ShortTextInputResponseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShortTextInputResponseDeleteArgsSchema: z.ZodType<Prisma.ShortTextInputResponseDeleteArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  where: ShortTextInputResponseWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputResponseUpdateArgsSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateArgs> = z.object({
  select: ShortTextInputResponseSelectSchema.optional(),
  include: ShortTextInputResponseIncludeSchema.optional(),
  data: z.union([ ShortTextInputResponseUpdateInputSchema,ShortTextInputResponseUncheckedUpdateInputSchema ]),
  where: ShortTextInputResponseWhereUniqueInputSchema,
}).strict() ;

export const ShortTextInputResponseUpdateManyArgsSchema: z.ZodType<Prisma.ShortTextInputResponseUpdateManyArgs> = z.object({
  data: z.union([ ShortTextInputResponseUpdateManyMutationInputSchema,ShortTextInputResponseUncheckedUpdateManyInputSchema ]),
  where: ShortTextInputResponseWhereInputSchema.optional(),
}).strict() ;

export const ShortTextInputResponseDeleteManyArgsSchema: z.ZodType<Prisma.ShortTextInputResponseDeleteManyArgs> = z.object({
  where: ShortTextInputResponseWhereInputSchema.optional(),
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