import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','firstName','lastName','email','imageUrl']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','slug','imageUrl']);

export const OrganizationMembershipScalarFieldEnumSchema = z.enum(['id','organizationId','userId','role']);

export const WorkspaceMembershipScalarFieldEnumSchema = z.enum(['id','userId','workspaceId','role']);

export const WorkspaceScalarFieldEnumSchema = z.enum(['id','name','slug','organizationId']);

export const FormScalarFieldEnumSchema = z.enum(['id','name','slug','stepOrder','workspaceId']);

export const StepScalarFieldEnumSchema = z.enum(['id','title','description','zoom','pitch','bearing','type','formOfDraftStepId','formOfPublishedStepId','locationId']);

export const ContentStepScalarFieldEnumSchema = z.enum(['id','value','stepId']);

export const ShortTextStepScalarFieldEnumSchema = z.enum(['id','value','required','stepId']);

export const LongTextStepScalarFieldEnumSchema = z.enum(['id','value','required','stepId']);

export const YesNoStepScalarFieldEnumSchema = z.enum(['id','value','required','stepId']);

export const LocationScalarFieldEnumSchema = z.enum(['id']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const WorkspaceMembershipRoleSchema = z.enum(['OWNER','MEMBER']);

export type WorkspaceMembershipRoleType = `${z.infer<typeof WorkspaceMembershipRoleSchema>}`

export const StepTypeSchema = z.enum(['CONTENT','SHORT_TEXT','LONG_TEXT','YES_NO']);

export type StepTypeType = `${z.infer<typeof StepTypeSchema>}`

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
  stepOrder: z.string().array(),
  workspaceId: z.string(),
})

export type Form = z.infer<typeof FormSchema>

// FORM RELATION SCHEMA
//------------------------------------------------------

export type FormRelations = {
  publishedSteps: StepWithRelations[];
  draftSteps: StepWithRelations[];
  workspace: WorkspaceWithRelations;
};

export type FormWithRelations = z.infer<typeof FormSchema> & FormRelations

export const FormWithRelationsSchema: z.ZodType<FormWithRelations> = FormSchema.merge(z.object({
  publishedSteps: z.lazy(() => StepWithRelationsSchema).array(),
  draftSteps: z.lazy(() => StepWithRelationsSchema).array(),
  workspace: z.lazy(() => WorkspaceWithRelationsSchema),
}))

/////////////////////////////////////////
// STEP SCHEMA
/////////////////////////////////////////

export const StepSchema = z.object({
  type: StepTypeSchema,
  id: z.string().uuid(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  formOfDraftStepId: z.string().nullable(),
  formOfPublishedStepId: z.string().nullable(),
  locationId: z.string(),
})

export type Step = z.infer<typeof StepSchema>

// STEP RELATION SCHEMA
//------------------------------------------------------

export type StepRelations = {
  content?: ContentStepWithRelations | null;
  shortText?: ShortTextStepWithRelations | null;
  longText?: LongTextStepWithRelations | null;
  yesNo?: YesNoStepWithRelations | null;
  formOfDraftStep?: FormWithRelations | null;
  formOfPublishedStep?: FormWithRelations | null;
  location: LocationWithRelations;
};

export type StepWithRelations = z.infer<typeof StepSchema> & StepRelations

export const StepWithRelationsSchema: z.ZodType<StepWithRelations> = StepSchema.merge(z.object({
  content: z.lazy(() => ContentStepWithRelationsSchema).nullable(),
  shortText: z.lazy(() => ShortTextStepWithRelationsSchema).nullable(),
  longText: z.lazy(() => LongTextStepWithRelationsSchema).nullable(),
  yesNo: z.lazy(() => YesNoStepWithRelationsSchema).nullable(),
  formOfDraftStep: z.lazy(() => FormWithRelationsSchema).nullable(),
  formOfPublishedStep: z.lazy(() => FormWithRelationsSchema).nullable(),
  location: z.lazy(() => LocationWithRelationsSchema),
}))

/////////////////////////////////////////
// CONTENT STEP SCHEMA
/////////////////////////////////////////

export const ContentStepSchema = z.object({
  id: z.string().uuid(),
  value: z.string(),
  stepId: z.string(),
})

export type ContentStep = z.infer<typeof ContentStepSchema>

// CONTENT STEP RELATION SCHEMA
//------------------------------------------------------

export type ContentStepRelations = {
  step: StepWithRelations;
};

export type ContentStepWithRelations = z.infer<typeof ContentStepSchema> & ContentStepRelations

export const ContentStepWithRelationsSchema: z.ZodType<ContentStepWithRelations> = ContentStepSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema),
}))

/////////////////////////////////////////
// SHORT TEXT STEP SCHEMA
/////////////////////////////////////////

export const ShortTextStepSchema = z.object({
  id: z.string().uuid(),
  value: z.string(),
  required: z.boolean(),
  stepId: z.string(),
})

export type ShortTextStep = z.infer<typeof ShortTextStepSchema>

// SHORT TEXT STEP RELATION SCHEMA
//------------------------------------------------------

export type ShortTextStepRelations = {
  step: StepWithRelations;
};

export type ShortTextStepWithRelations = z.infer<typeof ShortTextStepSchema> & ShortTextStepRelations

export const ShortTextStepWithRelationsSchema: z.ZodType<ShortTextStepWithRelations> = ShortTextStepSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema),
}))

/////////////////////////////////////////
// LONG TEXT STEP SCHEMA
/////////////////////////////////////////

export const LongTextStepSchema = z.object({
  id: z.string().uuid(),
  value: z.string(),
  required: z.boolean(),
  stepId: z.string(),
})

export type LongTextStep = z.infer<typeof LongTextStepSchema>

// LONG TEXT STEP RELATION SCHEMA
//------------------------------------------------------

export type LongTextStepRelations = {
  step: StepWithRelations;
};

export type LongTextStepWithRelations = z.infer<typeof LongTextStepSchema> & LongTextStepRelations

export const LongTextStepWithRelationsSchema: z.ZodType<LongTextStepWithRelations> = LongTextStepSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema),
}))

/////////////////////////////////////////
// YES NO STEP SCHEMA
/////////////////////////////////////////

export const YesNoStepSchema = z.object({
  id: z.string().uuid(),
  value: z.boolean(),
  required: z.boolean(),
  stepId: z.string(),
})

export type YesNoStep = z.infer<typeof YesNoStepSchema>

// YES NO STEP RELATION SCHEMA
//------------------------------------------------------

export type YesNoStepRelations = {
  step: StepWithRelations;
};

export type YesNoStepWithRelations = z.infer<typeof YesNoStepSchema> & YesNoStepRelations

export const YesNoStepWithRelationsSchema: z.ZodType<YesNoStepWithRelations> = YesNoStepSchema.merge(z.object({
  step: z.lazy(() => StepWithRelationsSchema),
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
  publishedSteps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  draftSteps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
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
  publishedSteps: z.boolean().optional(),
  draftSteps: z.boolean().optional(),
}).strict();

export const FormSelectSchema: z.ZodType<Prisma.FormSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  stepOrder: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  publishedSteps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  draftSteps: z.union([z.boolean(),z.lazy(() => StepFindManyArgsSchema)]).optional(),
  workspace: z.union([z.boolean(),z.lazy(() => WorkspaceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict()

// STEP
//------------------------------------------------------

export const StepIncludeSchema: z.ZodType<Prisma.StepInclude> = z.object({
  content: z.union([z.boolean(),z.lazy(() => ContentStepArgsSchema)]).optional(),
  shortText: z.union([z.boolean(),z.lazy(() => ShortTextStepArgsSchema)]).optional(),
  longText: z.union([z.boolean(),z.lazy(() => LongTextStepArgsSchema)]).optional(),
  yesNo: z.union([z.boolean(),z.lazy(() => YesNoStepArgsSchema)]).optional(),
  formOfDraftStep: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  formOfPublishedStep: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
}).strict()

export const StepArgsSchema: z.ZodType<Prisma.StepDefaultArgs> = z.object({
  select: z.lazy(() => StepSelectSchema).optional(),
  include: z.lazy(() => StepIncludeSchema).optional(),
}).strict();

export const StepSelectSchema: z.ZodType<Prisma.StepSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  zoom: z.boolean().optional(),
  pitch: z.boolean().optional(),
  bearing: z.boolean().optional(),
  type: z.boolean().optional(),
  formOfDraftStepId: z.boolean().optional(),
  formOfPublishedStepId: z.boolean().optional(),
  locationId: z.boolean().optional(),
  content: z.union([z.boolean(),z.lazy(() => ContentStepArgsSchema)]).optional(),
  shortText: z.union([z.boolean(),z.lazy(() => ShortTextStepArgsSchema)]).optional(),
  longText: z.union([z.boolean(),z.lazy(() => LongTextStepArgsSchema)]).optional(),
  yesNo: z.union([z.boolean(),z.lazy(() => YesNoStepArgsSchema)]).optional(),
  formOfDraftStep: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  formOfPublishedStep: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
}).strict()

// CONTENT STEP
//------------------------------------------------------

export const ContentStepIncludeSchema: z.ZodType<Prisma.ContentStepInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const ContentStepArgsSchema: z.ZodType<Prisma.ContentStepDefaultArgs> = z.object({
  select: z.lazy(() => ContentStepSelectSchema).optional(),
  include: z.lazy(() => ContentStepIncludeSchema).optional(),
}).strict();

export const ContentStepSelectSchema: z.ZodType<Prisma.ContentStepSelect> = z.object({
  id: z.boolean().optional(),
  value: z.boolean().optional(),
  stepId: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// SHORT TEXT STEP
//------------------------------------------------------

export const ShortTextStepIncludeSchema: z.ZodType<Prisma.ShortTextStepInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const ShortTextStepArgsSchema: z.ZodType<Prisma.ShortTextStepDefaultArgs> = z.object({
  select: z.lazy(() => ShortTextStepSelectSchema).optional(),
  include: z.lazy(() => ShortTextStepIncludeSchema).optional(),
}).strict();

export const ShortTextStepSelectSchema: z.ZodType<Prisma.ShortTextStepSelect> = z.object({
  id: z.boolean().optional(),
  value: z.boolean().optional(),
  required: z.boolean().optional(),
  stepId: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// LONG TEXT STEP
//------------------------------------------------------

export const LongTextStepIncludeSchema: z.ZodType<Prisma.LongTextStepInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const LongTextStepArgsSchema: z.ZodType<Prisma.LongTextStepDefaultArgs> = z.object({
  select: z.lazy(() => LongTextStepSelectSchema).optional(),
  include: z.lazy(() => LongTextStepIncludeSchema).optional(),
}).strict();

export const LongTextStepSelectSchema: z.ZodType<Prisma.LongTextStepSelect> = z.object({
  id: z.boolean().optional(),
  value: z.boolean().optional(),
  required: z.boolean().optional(),
  stepId: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

// YES NO STEP
//------------------------------------------------------

export const YesNoStepIncludeSchema: z.ZodType<Prisma.YesNoStepInclude> = z.object({
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
}).strict()

export const YesNoStepArgsSchema: z.ZodType<Prisma.YesNoStepDefaultArgs> = z.object({
  select: z.lazy(() => YesNoStepSelectSchema).optional(),
  include: z.lazy(() => YesNoStepIncludeSchema).optional(),
}).strict();

export const YesNoStepSelectSchema: z.ZodType<Prisma.YesNoStepSelect> = z.object({
  id: z.boolean().optional(),
  value: z.boolean().optional(),
  required: z.boolean().optional(),
  stepId: z.boolean().optional(),
  step: z.union([z.boolean(),z.lazy(() => StepArgsSchema)]).optional(),
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
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  organizationMemberships: z.lazy(() => OrganizationMembershipListRelationFilterSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedSteps: z.lazy(() => StepListRelationFilterSchema).optional(),
  draftSteps: z.lazy(() => StepListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict();

export const FormOrderByWithRelationInputSchema: z.ZodType<Prisma.FormOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
  publishedSteps: z.lazy(() => StepOrderByRelationAggregateInputSchema).optional(),
  draftSteps: z.lazy(() => StepOrderByRelationAggregateInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceOrderByWithRelationInputSchema).optional()
}).strict();

export const FormWhereUniqueInputSchema: z.ZodType<Prisma.FormWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  workspaceId_slug: z.lazy(() => FormWorkspaceIdSlugCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema),z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedSteps: z.lazy(() => StepListRelationFilterSchema).optional(),
  draftSteps: z.lazy(() => StepListRelationFilterSchema).optional(),
  workspace: z.union([ z.lazy(() => WorkspaceRelationFilterSchema),z.lazy(() => WorkspaceWhereInputSchema) ]).optional(),
}).strict());

export const FormOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional(),
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
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const StepWhereInputSchema: z.ZodType<Prisma.StepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepWhereInputSchema),z.lazy(() => StepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumStepTypeFilterSchema),z.lazy(() => StepTypeSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => ContentStepNullableRelationFilterSchema),z.lazy(() => ContentStepWhereInputSchema) ]).optional().nullable(),
  shortText: z.union([ z.lazy(() => ShortTextStepNullableRelationFilterSchema),z.lazy(() => ShortTextStepWhereInputSchema) ]).optional().nullable(),
  longText: z.union([ z.lazy(() => LongTextStepNullableRelationFilterSchema),z.lazy(() => LongTextStepWhereInputSchema) ]).optional().nullable(),
  yesNo: z.union([ z.lazy(() => YesNoStepNullableRelationFilterSchema),z.lazy(() => YesNoStepWhereInputSchema) ]).optional().nullable(),
  formOfDraftStep: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  formOfPublishedStep: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
}).strict();

export const StepOrderByWithRelationInputSchema: z.ZodType<Prisma.StepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  formOfDraftStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  formOfPublishedStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => ContentStepOrderByWithRelationInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepOrderByWithRelationInputSchema).optional(),
  longText: z.lazy(() => LongTextStepOrderByWithRelationInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepOrderByWithRelationInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional()
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
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  type: z.union([ z.lazy(() => EnumStepTypeFilterSchema),z.lazy(() => StepTypeSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => ContentStepNullableRelationFilterSchema),z.lazy(() => ContentStepWhereInputSchema) ]).optional().nullable(),
  shortText: z.union([ z.lazy(() => ShortTextStepNullableRelationFilterSchema),z.lazy(() => ShortTextStepWhereInputSchema) ]).optional().nullable(),
  longText: z.union([ z.lazy(() => LongTextStepNullableRelationFilterSchema),z.lazy(() => LongTextStepWhereInputSchema) ]).optional().nullable(),
  yesNo: z.union([ z.lazy(() => YesNoStepNullableRelationFilterSchema),z.lazy(() => YesNoStepWhereInputSchema) ]).optional().nullable(),
  formOfDraftStep: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  formOfPublishedStep: z.union([ z.lazy(() => FormNullableRelationFilterSchema),z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
}).strict());

export const StepOrderByWithAggregationInputSchema: z.ZodType<Prisma.StepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  formOfDraftStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  formOfPublishedStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  zoom: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumStepTypeWithAggregatesFilterSchema),z.lazy(() => StepTypeSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ContentStepWhereInputSchema: z.ZodType<Prisma.ContentStepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContentStepWhereInputSchema),z.lazy(() => ContentStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentStepWhereInputSchema),z.lazy(() => ContentStepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict();

export const ContentStepOrderByWithRelationInputSchema: z.ZodType<Prisma.ContentStepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const ContentStepWhereUniqueInputSchema: z.ZodType<Prisma.ContentStepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    stepId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    stepId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  stepId: z.string().optional(),
  AND: z.union([ z.lazy(() => ContentStepWhereInputSchema),z.lazy(() => ContentStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentStepWhereInputSchema),z.lazy(() => ContentStepWhereInputSchema).array() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict());

export const ContentStepOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContentStepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContentStepCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContentStepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContentStepMinOrderByAggregateInputSchema).optional()
}).strict();

export const ContentStepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContentStepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContentStepScalarWhereWithAggregatesInputSchema),z.lazy(() => ContentStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentStepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentStepScalarWhereWithAggregatesInputSchema),z.lazy(() => ContentStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ShortTextStepWhereInputSchema: z.ZodType<Prisma.ShortTextStepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextStepWhereInputSchema),z.lazy(() => ShortTextStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextStepWhereInputSchema),z.lazy(() => ShortTextStepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  required: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict();

export const ShortTextStepOrderByWithRelationInputSchema: z.ZodType<Prisma.ShortTextStepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const ShortTextStepWhereUniqueInputSchema: z.ZodType<Prisma.ShortTextStepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    stepId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    stepId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  stepId: z.string().optional(),
  AND: z.union([ z.lazy(() => ShortTextStepWhereInputSchema),z.lazy(() => ShortTextStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextStepWhereInputSchema),z.lazy(() => ShortTextStepWhereInputSchema).array() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  required: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict());

export const ShortTextStepOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShortTextStepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ShortTextStepCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ShortTextStepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ShortTextStepMinOrderByAggregateInputSchema).optional()
}).strict();

export const ShortTextStepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ShortTextStepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ShortTextStepScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortTextStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortTextStepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortTextStepScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortTextStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  required: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const LongTextStepWhereInputSchema: z.ZodType<Prisma.LongTextStepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LongTextStepWhereInputSchema),z.lazy(() => LongTextStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LongTextStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LongTextStepWhereInputSchema),z.lazy(() => LongTextStepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  required: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict();

export const LongTextStepOrderByWithRelationInputSchema: z.ZodType<Prisma.LongTextStepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const LongTextStepWhereUniqueInputSchema: z.ZodType<Prisma.LongTextStepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    stepId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    stepId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  stepId: z.string().optional(),
  AND: z.union([ z.lazy(() => LongTextStepWhereInputSchema),z.lazy(() => LongTextStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LongTextStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LongTextStepWhereInputSchema),z.lazy(() => LongTextStepWhereInputSchema).array() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  required: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict());

export const LongTextStepOrderByWithAggregationInputSchema: z.ZodType<Prisma.LongTextStepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LongTextStepCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LongTextStepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LongTextStepMinOrderByAggregateInputSchema).optional()
}).strict();

export const LongTextStepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LongTextStepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LongTextStepScalarWhereWithAggregatesInputSchema),z.lazy(() => LongTextStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LongTextStepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LongTextStepScalarWhereWithAggregatesInputSchema),z.lazy(() => LongTextStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  required: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const YesNoStepWhereInputSchema: z.ZodType<Prisma.YesNoStepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => YesNoStepWhereInputSchema),z.lazy(() => YesNoStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => YesNoStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => YesNoStepWhereInputSchema),z.lazy(() => YesNoStepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  required: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  stepId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict();

export const YesNoStepOrderByWithRelationInputSchema: z.ZodType<Prisma.YesNoStepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  step: z.lazy(() => StepOrderByWithRelationInputSchema).optional()
}).strict();

export const YesNoStepWhereUniqueInputSchema: z.ZodType<Prisma.YesNoStepWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    stepId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    stepId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  stepId: z.string().optional(),
  AND: z.union([ z.lazy(() => YesNoStepWhereInputSchema),z.lazy(() => YesNoStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => YesNoStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => YesNoStepWhereInputSchema),z.lazy(() => YesNoStepWhereInputSchema).array() ]).optional(),
  value: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  required: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  step: z.union([ z.lazy(() => StepRelationFilterSchema),z.lazy(() => StepWhereInputSchema) ]).optional(),
}).strict());

export const YesNoStepOrderByWithAggregationInputSchema: z.ZodType<Prisma.YesNoStepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => YesNoStepCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => YesNoStepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => YesNoStepMinOrderByAggregateInputSchema).optional()
}).strict();

export const YesNoStepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.YesNoStepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => YesNoStepScalarWhereWithAggregatesInputSchema),z.lazy(() => YesNoStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => YesNoStepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => YesNoStepScalarWhereWithAggregatesInputSchema),z.lazy(() => YesNoStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  required: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  stepId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
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
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepCreateNestedManyWithoutFormOfPublishedStepInputSchema).optional(),
  draftSteps: z.lazy(() => StepCreateNestedManyWithoutFormOfDraftStepInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema)
}).strict();

export const FormUncheckedCreateInputSchema: z.ZodType<Prisma.FormUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedSteps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormOfPublishedStepInputSchema).optional(),
  draftSteps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormOfDraftStepInputSchema).optional()
}).strict();

export const FormUpdateInputSchema: z.ZodType<Prisma.FormUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepUpdateManyWithoutFormOfPublishedStepNestedInputSchema).optional(),
  draftSteps: z.lazy(() => StepUpdateManyWithoutFormOfDraftStepNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateInputSchema: z.ZodType<Prisma.FormUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedSteps: z.lazy(() => StepUncheckedUpdateManyWithoutFormOfPublishedStepNestedInputSchema).optional(),
  draftSteps: z.lazy(() => StepUncheckedUpdateManyWithoutFormOfDraftStepNestedInputSchema).optional()
}).strict();

export const FormCreateManyInputSchema: z.ZodType<Prisma.FormCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string()
}).strict();

export const FormUpdateManyMutationInputSchema: z.ZodType<Prisma.FormUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
}).strict();

export const FormUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepCreateInputSchema: z.ZodType<Prisma.StepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateInputSchema: z.ZodType<Prisma.StepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepUpdateInputSchema: z.ZodType<Prisma.StepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateInputSchema: z.ZodType<Prisma.StepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateManyInputSchema: z.ZodType<Prisma.StepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string()
}).strict();

export const StepUpdateManyMutationInputSchema: z.ZodType<Prisma.StepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentStepCreateInputSchema: z.ZodType<Prisma.ContentStepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  step: z.lazy(() => StepCreateNestedOneWithoutContentInputSchema)
}).strict();

export const ContentStepUncheckedCreateInputSchema: z.ZodType<Prisma.ContentStepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  stepId: z.string()
}).strict();

export const ContentStepUpdateInputSchema: z.ZodType<Prisma.ContentStepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutContentNestedInputSchema).optional()
}).strict();

export const ContentStepUncheckedUpdateInputSchema: z.ZodType<Prisma.ContentStepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentStepCreateManyInputSchema: z.ZodType<Prisma.ContentStepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  stepId: z.string()
}).strict();

export const ContentStepUpdateManyMutationInputSchema: z.ZodType<Prisma.ContentStepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentStepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContentStepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextStepCreateInputSchema: z.ZodType<Prisma.ShortTextStepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional(),
  step: z.lazy(() => StepCreateNestedOneWithoutShortTextInputSchema)
}).strict();

export const ShortTextStepUncheckedCreateInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional(),
  stepId: z.string()
}).strict();

export const ShortTextStepUpdateInputSchema: z.ZodType<Prisma.ShortTextStepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutShortTextNestedInputSchema).optional()
}).strict();

export const ShortTextStepUncheckedUpdateInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextStepCreateManyInputSchema: z.ZodType<Prisma.ShortTextStepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional(),
  stepId: z.string()
}).strict();

export const ShortTextStepUpdateManyMutationInputSchema: z.ZodType<Prisma.ShortTextStepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextStepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LongTextStepCreateInputSchema: z.ZodType<Prisma.LongTextStepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional(),
  step: z.lazy(() => StepCreateNestedOneWithoutLongTextInputSchema)
}).strict();

export const LongTextStepUncheckedCreateInputSchema: z.ZodType<Prisma.LongTextStepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional(),
  stepId: z.string()
}).strict();

export const LongTextStepUpdateInputSchema: z.ZodType<Prisma.LongTextStepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutLongTextNestedInputSchema).optional()
}).strict();

export const LongTextStepUncheckedUpdateInputSchema: z.ZodType<Prisma.LongTextStepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LongTextStepCreateManyInputSchema: z.ZodType<Prisma.LongTextStepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional(),
  stepId: z.string()
}).strict();

export const LongTextStepUpdateManyMutationInputSchema: z.ZodType<Prisma.LongTextStepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LongTextStepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LongTextStepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const YesNoStepCreateInputSchema: z.ZodType<Prisma.YesNoStepCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.boolean(),
  required: z.boolean().optional(),
  step: z.lazy(() => StepCreateNestedOneWithoutYesNoInputSchema)
}).strict();

export const YesNoStepUncheckedCreateInputSchema: z.ZodType<Prisma.YesNoStepUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.boolean(),
  required: z.boolean().optional(),
  stepId: z.string()
}).strict();

export const YesNoStepUpdateInputSchema: z.ZodType<Prisma.YesNoStepUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  step: z.lazy(() => StepUpdateOneRequiredWithoutYesNoNestedInputSchema).optional()
}).strict();

export const YesNoStepUncheckedUpdateInputSchema: z.ZodType<Prisma.YesNoStepUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const YesNoStepCreateManyInputSchema: z.ZodType<Prisma.YesNoStepCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.boolean(),
  required: z.boolean().optional(),
  stepId: z.string()
}).strict();

export const YesNoStepUpdateManyMutationInputSchema: z.ZodType<Prisma.YesNoStepUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const YesNoStepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.YesNoStepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  stepId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  imageUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional()
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

export const StepOrderByRelationAggregateInputSchema: z.ZodType<Prisma.StepOrderByRelationAggregateInput> = z.object({
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
  stepOrder: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FormMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  workspaceId: z.lazy(() => SortOrderSchema).optional()
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

export const EnumStepTypeFilterSchema: z.ZodType<Prisma.EnumStepTypeFilter> = z.object({
  equals: z.lazy(() => StepTypeSchema).optional(),
  in: z.lazy(() => StepTypeSchema).array().optional(),
  notIn: z.lazy(() => StepTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => NestedEnumStepTypeFilterSchema) ]).optional(),
}).strict();

export const ContentStepNullableRelationFilterSchema: z.ZodType<Prisma.ContentStepNullableRelationFilter> = z.object({
  is: z.lazy(() => ContentStepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ContentStepWhereInputSchema).optional().nullable()
}).strict();

export const ShortTextStepNullableRelationFilterSchema: z.ZodType<Prisma.ShortTextStepNullableRelationFilter> = z.object({
  is: z.lazy(() => ShortTextStepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ShortTextStepWhereInputSchema).optional().nullable()
}).strict();

export const LongTextStepNullableRelationFilterSchema: z.ZodType<Prisma.LongTextStepNullableRelationFilter> = z.object({
  is: z.lazy(() => LongTextStepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LongTextStepWhereInputSchema).optional().nullable()
}).strict();

export const YesNoStepNullableRelationFilterSchema: z.ZodType<Prisma.YesNoStepNullableRelationFilter> = z.object({
  is: z.lazy(() => YesNoStepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => YesNoStepWhereInputSchema).optional().nullable()
}).strict();

export const FormNullableRelationFilterSchema: z.ZodType<Prisma.FormNullableRelationFilter> = z.object({
  is: z.lazy(() => FormWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => FormWhereInputSchema).optional().nullable()
}).strict();

export const LocationRelationFilterSchema: z.ZodType<Prisma.LocationRelationFilter> = z.object({
  is: z.lazy(() => LocationWhereInputSchema).optional(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const StepCountOrderByAggregateInputSchema: z.ZodType<Prisma.StepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  formOfDraftStepId: z.lazy(() => SortOrderSchema).optional(),
  formOfPublishedStepId: z.lazy(() => SortOrderSchema).optional(),
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
  description: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  formOfDraftStepId: z.lazy(() => SortOrderSchema).optional(),
  formOfPublishedStepId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepMinOrderByAggregateInputSchema: z.ZodType<Prisma.StepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  formOfDraftStepId: z.lazy(() => SortOrderSchema).optional(),
  formOfPublishedStepId: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StepSumOrderByAggregateInputSchema: z.ZodType<Prisma.StepSumOrderByAggregateInput> = z.object({
  zoom: z.lazy(() => SortOrderSchema).optional(),
  pitch: z.lazy(() => SortOrderSchema).optional(),
  bearing: z.lazy(() => SortOrderSchema).optional()
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

export const EnumStepTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStepTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StepTypeSchema).optional(),
  in: z.lazy(() => StepTypeSchema).array().optional(),
  notIn: z.lazy(() => StepTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => NestedEnumStepTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStepTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStepTypeFilterSchema).optional()
}).strict();

export const StepRelationFilterSchema: z.ZodType<Prisma.StepRelationFilter> = z.object({
  is: z.lazy(() => StepWhereInputSchema).optional(),
  isNot: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const ContentStepCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContentStepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContentStepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContentStepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContentStepMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContentStepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const ShortTextStepCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextStepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortTextStepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextStepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortTextStepMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShortTextStepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const LongTextStepCountOrderByAggregateInputSchema: z.ZodType<Prisma.LongTextStepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LongTextStepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LongTextStepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LongTextStepMinOrderByAggregateInputSchema: z.ZodType<Prisma.LongTextStepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const YesNoStepCountOrderByAggregateInputSchema: z.ZodType<Prisma.YesNoStepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const YesNoStepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.YesNoStepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const YesNoStepMinOrderByAggregateInputSchema: z.ZodType<Prisma.YesNoStepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  stepId: z.lazy(() => SortOrderSchema).optional()
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

export const StepCreateNestedManyWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepCreateNestedManyWithoutFormOfPublishedStepInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfPublishedStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StepCreateNestedManyWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepCreateNestedManyWithoutFormOfDraftStepInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfDraftStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceCreateNestedOneWithoutFormsInputSchema: z.ZodType<Prisma.WorkspaceCreateNestedOneWithoutFormsInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutFormsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional()
}).strict();

export const StepUncheckedCreateNestedManyWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUncheckedCreateNestedManyWithoutFormOfPublishedStepInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfPublishedStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StepUncheckedCreateNestedManyWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUncheckedCreateNestedManyWithoutFormOfDraftStepInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfDraftStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FormUpdatestepOrderInputSchema: z.ZodType<Prisma.FormUpdatestepOrderInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const StepUpdateManyWithoutFormOfPublishedStepNestedInputSchema: z.ZodType<Prisma.StepUpdateManyWithoutFormOfPublishedStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfPublishedStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepUpdateManyWithWhereWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUpdateManyWithWhereWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const StepUpdateManyWithoutFormOfDraftStepNestedInputSchema: z.ZodType<Prisma.StepUpdateManyWithoutFormOfDraftStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfDraftStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepUpdateManyWithWhereWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUpdateManyWithWhereWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema: z.ZodType<Prisma.WorkspaceUpdateOneRequiredWithoutFormsNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkspaceCreateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedCreateWithoutFormsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkspaceCreateOrConnectWithoutFormsInputSchema).optional(),
  upsert: z.lazy(() => WorkspaceUpsertWithoutFormsInputSchema).optional(),
  connect: z.lazy(() => WorkspaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkspaceUpdateToOneWithWhereWithoutFormsInputSchema),z.lazy(() => WorkspaceUpdateWithoutFormsInputSchema),z.lazy(() => WorkspaceUncheckedUpdateWithoutFormsInputSchema) ]).optional(),
}).strict();

export const StepUncheckedUpdateManyWithoutFormOfPublishedStepNestedInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormOfPublishedStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfPublishedStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepUpdateManyWithWhereWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUpdateManyWithWhereWithoutFormOfPublishedStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const StepUncheckedUpdateManyWithoutFormOfDraftStepNestedInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormOfDraftStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema).array(),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema),z.lazy(() => StepCreateOrConnectWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUpsertWithWhereUniqueWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepCreateManyFormOfDraftStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepWhereUniqueInputSchema),z.lazy(() => StepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUpdateWithWhereUniqueWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepUpdateManyWithWhereWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUpdateManyWithWhereWithoutFormOfDraftStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContentStepCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.ContentStepCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ContentStepCreateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContentStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => ContentStepWhereUniqueInputSchema).optional()
}).strict();

export const ShortTextStepCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextStepCreateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ShortTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => ShortTextStepWhereUniqueInputSchema).optional()
}).strict();

export const LongTextStepCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => LongTextStepCreateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LongTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => LongTextStepWhereUniqueInputSchema).optional()
}).strict();

export const YesNoStepCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => YesNoStepCreateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => YesNoStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => YesNoStepWhereUniqueInputSchema).optional()
}).strict();

export const FormCreateNestedOneWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutDraftStepsInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDraftStepsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const FormCreateNestedOneWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutPublishedStepsInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutPublishedStepsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional()
}).strict();

export const LocationCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutStepInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const ContentStepUncheckedCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.ContentStepUncheckedCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ContentStepCreateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContentStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => ContentStepWhereUniqueInputSchema).optional()
}).strict();

export const ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextStepCreateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ShortTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => ShortTextStepWhereUniqueInputSchema).optional()
}).strict();

export const LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepUncheckedCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => LongTextStepCreateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LongTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => LongTextStepWhereUniqueInputSchema).optional()
}).strict();

export const YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepUncheckedCreateNestedOneWithoutStepInput> = z.object({
  create: z.union([ z.lazy(() => YesNoStepCreateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => YesNoStepCreateOrConnectWithoutStepInputSchema).optional(),
  connect: z.lazy(() => YesNoStepWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumStepTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStepTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StepTypeSchema).optional()
}).strict();

export const ContentStepUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.ContentStepUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContentStepCreateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContentStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => ContentStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ContentStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ContentStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ContentStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContentStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => ContentStepUpdateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const ShortTextStepUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.ShortTextStepUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextStepCreateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ShortTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => ShortTextStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ShortTextStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ShortTextStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ShortTextStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ShortTextStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => ShortTextStepUpdateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const LongTextStepUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.LongTextStepUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => LongTextStepCreateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LongTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => LongTextStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LongTextStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LongTextStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LongTextStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LongTextStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => LongTextStepUpdateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const YesNoStepUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.YesNoStepUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => YesNoStepCreateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => YesNoStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => YesNoStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => YesNoStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => YesNoStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => YesNoStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => YesNoStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => YesNoStepUpdateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const FormUpdateOneWithoutDraftStepsNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutDraftStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutDraftStepsInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutDraftStepsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutDraftStepsInputSchema),z.lazy(() => FormUpdateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftStepsInputSchema) ]).optional(),
}).strict();

export const FormUpdateOneWithoutPublishedStepsNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutPublishedStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutPublishedStepsInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutPublishedStepsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutPublishedStepsInputSchema),z.lazy(() => FormUpdateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedStepsInputSchema) ]).optional(),
}).strict();

export const LocationUpdateOneRequiredWithoutStepNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneRequiredWithoutStepNestedInput> = z.object({
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => LocationUpdateWithoutStepInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.ContentStepUncheckedUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContentStepCreateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContentStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => ContentStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ContentStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ContentStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ContentStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContentStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => ContentStepUpdateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortTextStepCreateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ShortTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => ShortTextStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ShortTextStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ShortTextStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ShortTextStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ShortTextStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => ShortTextStepUpdateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.LongTextStepUncheckedUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => LongTextStepCreateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LongTextStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => LongTextStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LongTextStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LongTextStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LongTextStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LongTextStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => LongTextStepUpdateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema: z.ZodType<Prisma.YesNoStepUncheckedUpdateOneWithoutStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => YesNoStepCreateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedCreateWithoutStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => YesNoStepCreateOrConnectWithoutStepInputSchema).optional(),
  upsert: z.lazy(() => YesNoStepUpsertWithoutStepInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => YesNoStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => YesNoStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => YesNoStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => YesNoStepUpdateToOneWithWhereWithoutStepInputSchema),z.lazy(() => YesNoStepUpdateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedUpdateWithoutStepInputSchema) ]).optional(),
}).strict();

export const StepCreateNestedOneWithoutContentInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutContentInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutContentInputSchema),z.lazy(() => StepUncheckedCreateWithoutContentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutContentInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const StepUpdateOneRequiredWithoutContentNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutContentNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutContentInputSchema),z.lazy(() => StepUncheckedCreateWithoutContentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutContentInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutContentInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutContentInputSchema),z.lazy(() => StepUpdateWithoutContentInputSchema),z.lazy(() => StepUncheckedUpdateWithoutContentInputSchema) ]).optional(),
}).strict();

export const StepCreateNestedOneWithoutShortTextInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutShortTextInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutShortTextInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const StepUpdateOneRequiredWithoutShortTextNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutShortTextNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutShortTextInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutShortTextInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutShortTextInputSchema),z.lazy(() => StepUpdateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedUpdateWithoutShortTextInputSchema) ]).optional(),
}).strict();

export const StepCreateNestedOneWithoutLongTextInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutLongTextInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutLongTextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLongTextInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const StepUpdateOneRequiredWithoutLongTextNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutLongTextNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutLongTextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutLongTextInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutLongTextInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutLongTextInputSchema),z.lazy(() => StepUpdateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLongTextInputSchema) ]).optional(),
}).strict();

export const StepCreateNestedOneWithoutYesNoInputSchema: z.ZodType<Prisma.StepCreateNestedOneWithoutYesNoInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedCreateWithoutYesNoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutYesNoInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional()
}).strict();

export const StepUpdateOneRequiredWithoutYesNoNestedInputSchema: z.ZodType<Prisma.StepUpdateOneRequiredWithoutYesNoNestedInput> = z.object({
  create: z.union([ z.lazy(() => StepCreateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedCreateWithoutYesNoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => StepCreateOrConnectWithoutYesNoInputSchema).optional(),
  upsert: z.lazy(() => StepUpsertWithoutYesNoInputSchema).optional(),
  connect: z.lazy(() => StepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => StepUpdateToOneWithWhereWithoutYesNoInputSchema),z.lazy(() => StepUpdateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedUpdateWithoutYesNoInputSchema) ]).optional(),
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

export const NestedEnumStepTypeFilterSchema: z.ZodType<Prisma.NestedEnumStepTypeFilter> = z.object({
  equals: z.lazy(() => StepTypeSchema).optional(),
  in: z.lazy(() => StepTypeSchema).array().optional(),
  notIn: z.lazy(() => StepTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => NestedEnumStepTypeFilterSchema) ]).optional(),
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

export const NestedEnumStepTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStepTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StepTypeSchema).optional(),
  in: z.lazy(() => StepTypeSchema).array().optional(),
  notIn: z.lazy(() => StepTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => NestedEnumStepTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStepTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStepTypeFilterSchema).optional()
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
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
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
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workspaceMemberships: z.lazy(() => WorkspaceMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().optional().nullable(),
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
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationMemberships: z.lazy(() => OrganizationMembershipUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutWorkspaceMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkspaceMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepCreateNestedManyWithoutFormOfPublishedStepInputSchema).optional(),
  draftSteps: z.lazy(() => StepCreateNestedManyWithoutFormOfDraftStepInputSchema).optional()
}).strict();

export const FormUncheckedCreateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutWorkspaceInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormOfPublishedStepInputSchema).optional(),
  draftSteps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormOfDraftStepInputSchema).optional()
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
  stepOrder: z.lazy(() => StringNullableListFilterSchema).optional(),
  workspaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const StepCreateWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepCreateWithoutFormOfPublishedStepInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutFormOfPublishedStepInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  locationId: z.string(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutFormOfPublishedStepInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema) ]),
}).strict();

export const StepCreateManyFormOfPublishedStepInputEnvelopeSchema: z.ZodType<Prisma.StepCreateManyFormOfPublishedStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => StepCreateManyFormOfPublishedStepInputSchema),z.lazy(() => StepCreateManyFormOfPublishedStepInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const StepCreateWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepCreateWithoutFormOfDraftStepInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutFormOfDraftStepInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutFormOfDraftStepInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema) ]),
}).strict();

export const StepCreateManyFormOfDraftStepInputEnvelopeSchema: z.ZodType<Prisma.StepCreateManyFormOfDraftStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => StepCreateManyFormOfDraftStepInputSchema),z.lazy(() => StepCreateManyFormOfDraftStepInputSchema).array() ]),
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

export const StepUpsertWithWhereUniqueWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUpsertWithWhereUniqueWithoutFormOfPublishedStepInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => StepUpdateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedUpdateWithoutFormOfPublishedStepInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfPublishedStepInputSchema) ]),
}).strict();

export const StepUpdateWithWhereUniqueWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUpdateWithWhereUniqueWithoutFormOfPublishedStepInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => StepUpdateWithoutFormOfPublishedStepInputSchema),z.lazy(() => StepUncheckedUpdateWithoutFormOfPublishedStepInputSchema) ]),
}).strict();

export const StepUpdateManyWithWhereWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUpdateManyWithWhereWithoutFormOfPublishedStepInput> = z.object({
  where: z.lazy(() => StepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => StepUpdateManyMutationInputSchema),z.lazy(() => StepUncheckedUpdateManyWithoutFormOfPublishedStepInputSchema) ]),
}).strict();

export const StepScalarWhereInputSchema: z.ZodType<Prisma.StepScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepScalarWhereInputSchema),z.lazy(() => StepScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  zoom: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  pitch: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  bearing: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumStepTypeFilterSchema),z.lazy(() => StepTypeSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  locationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const StepUpsertWithWhereUniqueWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUpsertWithWhereUniqueWithoutFormOfDraftStepInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => StepUpdateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedUpdateWithoutFormOfDraftStepInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedCreateWithoutFormOfDraftStepInputSchema) ]),
}).strict();

export const StepUpdateWithWhereUniqueWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUpdateWithWhereUniqueWithoutFormOfDraftStepInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => StepUpdateWithoutFormOfDraftStepInputSchema),z.lazy(() => StepUncheckedUpdateWithoutFormOfDraftStepInputSchema) ]),
}).strict();

export const StepUpdateManyWithWhereWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUpdateManyWithWhereWithoutFormOfDraftStepInput> = z.object({
  where: z.lazy(() => StepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => StepUpdateManyMutationInputSchema),z.lazy(() => StepUncheckedUpdateManyWithoutFormOfDraftStepInputSchema) ]),
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

export const ContentStepCreateWithoutStepInputSchema: z.ZodType<Prisma.ContentStepCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string()
}).strict();

export const ContentStepUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.ContentStepUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string()
}).strict();

export const ContentStepCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.ContentStepCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => ContentStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContentStepCreateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const ShortTextStepCreateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional()
}).strict();

export const ShortTextStepUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional()
}).strict();

export const ShortTextStepCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => ShortTextStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortTextStepCreateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const LongTextStepCreateWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional()
}).strict();

export const LongTextStepUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.string(),
  required: z.boolean().optional()
}).strict();

export const LongTextStepCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => LongTextStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LongTextStepCreateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const YesNoStepCreateWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.boolean(),
  required: z.boolean().optional()
}).strict();

export const YesNoStepUncheckedCreateWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepUncheckedCreateWithoutStepInput> = z.object({
  id: z.string().uuid().optional(),
  value: z.boolean(),
  required: z.boolean().optional()
}).strict();

export const YesNoStepCreateOrConnectWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepCreateOrConnectWithoutStepInput> = z.object({
  where: z.lazy(() => YesNoStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => YesNoStepCreateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedCreateWithoutStepInputSchema) ]),
}).strict();

export const FormCreateWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormCreateWithoutDraftStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepCreateNestedManyWithoutFormOfPublishedStepInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema)
}).strict();

export const FormUncheckedCreateWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutDraftStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  publishedSteps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormOfPublishedStepInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutDraftStepsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftStepsInputSchema) ]),
}).strict();

export const FormCreateWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormCreateWithoutPublishedStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  draftSteps: z.lazy(() => StepCreateNestedManyWithoutFormOfDraftStepInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceCreateNestedOneWithoutFormsInputSchema)
}).strict();

export const FormUncheckedCreateWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutPublishedStepsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string(),
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.string(),
  draftSteps: z.lazy(() => StepUncheckedCreateNestedManyWithoutFormOfDraftStepInputSchema).optional()
}).strict();

export const FormCreateOrConnectWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutPublishedStepsInput> = z.object({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedStepsInputSchema) ]),
}).strict();

export const ContentStepUpsertWithoutStepInputSchema: z.ZodType<Prisma.ContentStepUpsertWithoutStepInput> = z.object({
  update: z.union([ z.lazy(() => ContentStepUpdateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => ContentStepCreateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedCreateWithoutStepInputSchema) ]),
  where: z.lazy(() => ContentStepWhereInputSchema).optional()
}).strict();

export const ContentStepUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.ContentStepUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => ContentStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ContentStepUpdateWithoutStepInputSchema),z.lazy(() => ContentStepUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const ContentStepUpdateWithoutStepInputSchema: z.ZodType<Prisma.ContentStepUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentStepUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.ContentStepUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextStepUpsertWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepUpsertWithoutStepInput> = z.object({
  update: z.union([ z.lazy(() => ShortTextStepUpdateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => ShortTextStepCreateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedCreateWithoutStepInputSchema) ]),
  where: z.lazy(() => ShortTextStepWhereInputSchema).optional()
}).strict();

export const ShortTextStepUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => ShortTextStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ShortTextStepUpdateWithoutStepInputSchema),z.lazy(() => ShortTextStepUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const ShortTextStepUpdateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortTextStepUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.ShortTextStepUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LongTextStepUpsertWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepUpsertWithoutStepInput> = z.object({
  update: z.union([ z.lazy(() => LongTextStepUpdateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => LongTextStepCreateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedCreateWithoutStepInputSchema) ]),
  where: z.lazy(() => LongTextStepWhereInputSchema).optional()
}).strict();

export const LongTextStepUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => LongTextStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LongTextStepUpdateWithoutStepInputSchema),z.lazy(() => LongTextStepUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const LongTextStepUpdateWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LongTextStepUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.LongTextStepUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const YesNoStepUpsertWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepUpsertWithoutStepInput> = z.object({
  update: z.union([ z.lazy(() => YesNoStepUpdateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedUpdateWithoutStepInputSchema) ]),
  create: z.union([ z.lazy(() => YesNoStepCreateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedCreateWithoutStepInputSchema) ]),
  where: z.lazy(() => YesNoStepWhereInputSchema).optional()
}).strict();

export const YesNoStepUpdateToOneWithWhereWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepUpdateToOneWithWhereWithoutStepInput> = z.object({
  where: z.lazy(() => YesNoStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => YesNoStepUpdateWithoutStepInputSchema),z.lazy(() => YesNoStepUncheckedUpdateWithoutStepInputSchema) ]),
}).strict();

export const YesNoStepUpdateWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const YesNoStepUncheckedUpdateWithoutStepInputSchema: z.ZodType<Prisma.YesNoStepUncheckedUpdateWithoutStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FormUpsertWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormUpsertWithoutDraftStepsInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftStepsInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutDraftStepsInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutDraftStepsInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutDraftStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutDraftStepsInputSchema) ]),
}).strict();

export const FormUpdateWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormUpdateWithoutDraftStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepUpdateManyWithoutFormOfPublishedStepNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutDraftStepsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutDraftStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedSteps: z.lazy(() => StepUncheckedUpdateManyWithoutFormOfPublishedStepNestedInputSchema).optional()
}).strict();

export const FormUpsertWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormUpsertWithoutPublishedStepsInput> = z.object({
  update: z.union([ z.lazy(() => FormUpdateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedStepsInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedCreateWithoutPublishedStepsInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional()
}).strict();

export const FormUpdateToOneWithWhereWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutPublishedStepsInput> = z.object({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutPublishedStepsInputSchema),z.lazy(() => FormUncheckedUpdateWithoutPublishedStepsInputSchema) ]),
}).strict();

export const FormUpdateWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormUpdateWithoutPublishedStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  draftSteps: z.lazy(() => StepUpdateManyWithoutFormOfDraftStepNestedInputSchema).optional(),
  workspace: z.lazy(() => WorkspaceUpdateOneRequiredWithoutFormsNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutPublishedStepsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutPublishedStepsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  workspaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  draftSteps: z.lazy(() => StepUncheckedUpdateManyWithoutFormOfDraftStepNestedInputSchema).optional()
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

export const StepCreateWithoutContentInputSchema: z.ZodType<Prisma.StepCreateWithoutContentInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutContentInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutContentInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutContentInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutContentInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutContentInputSchema),z.lazy(() => StepUncheckedCreateWithoutContentInputSchema) ]),
}).strict();

export const StepUpsertWithoutContentInputSchema: z.ZodType<Prisma.StepUpsertWithoutContentInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutContentInputSchema),z.lazy(() => StepUncheckedUpdateWithoutContentInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutContentInputSchema),z.lazy(() => StepUncheckedCreateWithoutContentInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutContentInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutContentInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutContentInputSchema),z.lazy(() => StepUncheckedUpdateWithoutContentInputSchema) ]),
}).strict();

export const StepUpdateWithoutContentInputSchema: z.ZodType<Prisma.StepUpdateWithoutContentInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutContentInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutContentInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateWithoutShortTextInputSchema: z.ZodType<Prisma.StepCreateWithoutShortTextInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutShortTextInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutShortTextInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutShortTextInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutShortTextInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputSchema) ]),
}).strict();

export const StepUpsertWithoutShortTextInputSchema: z.ZodType<Prisma.StepUpsertWithoutShortTextInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedUpdateWithoutShortTextInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutShortTextInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutShortTextInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutShortTextInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutShortTextInputSchema),z.lazy(() => StepUncheckedUpdateWithoutShortTextInputSchema) ]),
}).strict();

export const StepUpdateWithoutShortTextInputSchema: z.ZodType<Prisma.StepUpdateWithoutShortTextInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutShortTextInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutShortTextInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateWithoutLongTextInputSchema: z.ZodType<Prisma.StepCreateWithoutLongTextInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutLongTextInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutLongTextInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutLongTextInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutLongTextInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutLongTextInputSchema) ]),
}).strict();

export const StepUpsertWithoutLongTextInputSchema: z.ZodType<Prisma.StepUpsertWithoutLongTextInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLongTextInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedCreateWithoutLongTextInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutLongTextInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutLongTextInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutLongTextInputSchema),z.lazy(() => StepUncheckedUpdateWithoutLongTextInputSchema) ]),
}).strict();

export const StepUpdateWithoutLongTextInputSchema: z.ZodType<Prisma.StepUpdateWithoutLongTextInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutLongTextInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutLongTextInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateWithoutYesNoInputSchema: z.ZodType<Prisma.StepCreateWithoutYesNoInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutStepInputSchema)
}).strict();

export const StepUncheckedCreateWithoutYesNoInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutYesNoInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
}).strict();

export const StepCreateOrConnectWithoutYesNoInputSchema: z.ZodType<Prisma.StepCreateOrConnectWithoutYesNoInput> = z.object({
  where: z.lazy(() => StepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepCreateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedCreateWithoutYesNoInputSchema) ]),
}).strict();

export const StepUpsertWithoutYesNoInputSchema: z.ZodType<Prisma.StepUpsertWithoutYesNoInput> = z.object({
  update: z.union([ z.lazy(() => StepUpdateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedUpdateWithoutYesNoInputSchema) ]),
  create: z.union([ z.lazy(() => StepCreateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedCreateWithoutYesNoInputSchema) ]),
  where: z.lazy(() => StepWhereInputSchema).optional()
}).strict();

export const StepUpdateToOneWithWhereWithoutYesNoInputSchema: z.ZodType<Prisma.StepUpdateToOneWithWhereWithoutYesNoInput> = z.object({
  where: z.lazy(() => StepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => StepUpdateWithoutYesNoInputSchema),z.lazy(() => StepUncheckedUpdateWithoutYesNoInputSchema) ]),
}).strict();

export const StepUpdateWithoutYesNoInputSchema: z.ZodType<Prisma.StepUpdateWithoutYesNoInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutYesNoInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutYesNoInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  content: z.lazy(() => ContentStepCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepCreateNestedOneWithoutStepInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormCreateNestedOneWithoutDraftStepsInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormCreateNestedOneWithoutPublishedStepsInputSchema).optional()
}).strict();

export const StepUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedCreateWithoutLocationInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  formOfPublishedStepId: z.string().optional().nullable(),
  content: z.lazy(() => ContentStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedCreateNestedOneWithoutStepInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedCreateNestedOneWithoutStepInputSchema).optional()
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
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
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
  stepOrder: z.union([ z.lazy(() => FormCreatestepOrderInputSchema),z.string().array() ]).optional(),
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
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepUpdateManyWithoutFormOfPublishedStepNestedInputSchema).optional(),
  draftSteps: z.lazy(() => StepUpdateManyWithoutFormOfDraftStepNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
  publishedSteps: z.lazy(() => StepUncheckedUpdateManyWithoutFormOfPublishedStepNestedInputSchema).optional(),
  draftSteps: z.lazy(() => StepUncheckedUpdateManyWithoutFormOfDraftStepNestedInputSchema).optional()
}).strict();

export const FormUncheckedUpdateManyWithoutWorkspaceInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyWithoutWorkspaceInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stepOrder: z.union([ z.lazy(() => FormUpdatestepOrderInputSchema),z.string().array() ]).optional(),
}).strict();

export const StepCreateManyFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepCreateManyFormOfPublishedStepInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfDraftStepId: z.string().optional().nullable(),
  locationId: z.string()
}).strict();

export const StepCreateManyFormOfDraftStepInputSchema: z.ZodType<Prisma.StepCreateManyFormOfDraftStepInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  zoom: z.number().int(),
  pitch: z.number().int(),
  bearing: z.number().int(),
  type: z.lazy(() => StepTypeSchema),
  formOfPublishedStepId: z.string().optional().nullable(),
  locationId: z.string()
}).strict();

export const StepUpdateWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUpdateWithoutFormOfPublishedStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfDraftStep: z.lazy(() => FormUpdateOneWithoutDraftStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutFormOfPublishedStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateManyWithoutFormOfPublishedStepInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormOfPublishedStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfDraftStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StepUpdateWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUpdateWithoutFormOfDraftStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUpdateOneWithoutStepNestedInputSchema).optional(),
  formOfPublishedStep: z.lazy(() => FormUpdateOneWithoutPublishedStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUncheckedUpdateWithoutFormOfDraftStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.lazy(() => ContentStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  shortText: z.lazy(() => ShortTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  longText: z.lazy(() => LongTextStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional(),
  yesNo: z.lazy(() => YesNoStepUncheckedUpdateOneWithoutStepNestedInputSchema).optional()
}).strict();

export const StepUncheckedUpdateManyWithoutFormOfDraftStepInputSchema: z.ZodType<Prisma.StepUncheckedUpdateManyWithoutFormOfDraftStepInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zoom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  pitch: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bearing: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => StepTypeSchema),z.lazy(() => EnumStepTypeFieldUpdateOperationsInputSchema) ]).optional(),
  formOfPublishedStepId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ContentStepFindFirstArgsSchema: z.ZodType<Prisma.ContentStepFindFirstArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereInputSchema.optional(),
  orderBy: z.union([ ContentStepOrderByWithRelationInputSchema.array(),ContentStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContentStepScalarFieldEnumSchema,ContentStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContentStepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContentStepFindFirstOrThrowArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereInputSchema.optional(),
  orderBy: z.union([ ContentStepOrderByWithRelationInputSchema.array(),ContentStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContentStepScalarFieldEnumSchema,ContentStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContentStepFindManyArgsSchema: z.ZodType<Prisma.ContentStepFindManyArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereInputSchema.optional(),
  orderBy: z.union([ ContentStepOrderByWithRelationInputSchema.array(),ContentStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContentStepScalarFieldEnumSchema,ContentStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContentStepAggregateArgsSchema: z.ZodType<Prisma.ContentStepAggregateArgs> = z.object({
  where: ContentStepWhereInputSchema.optional(),
  orderBy: z.union([ ContentStepOrderByWithRelationInputSchema.array(),ContentStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContentStepGroupByArgsSchema: z.ZodType<Prisma.ContentStepGroupByArgs> = z.object({
  where: ContentStepWhereInputSchema.optional(),
  orderBy: z.union([ ContentStepOrderByWithAggregationInputSchema.array(),ContentStepOrderByWithAggregationInputSchema ]).optional(),
  by: ContentStepScalarFieldEnumSchema.array(),
  having: ContentStepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContentStepFindUniqueArgsSchema: z.ZodType<Prisma.ContentStepFindUniqueArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereUniqueInputSchema,
}).strict() ;

export const ContentStepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContentStepFindUniqueOrThrowArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereUniqueInputSchema,
}).strict() ;

export const ShortTextStepFindFirstArgsSchema: z.ZodType<Prisma.ShortTextStepFindFirstArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextStepOrderByWithRelationInputSchema.array(),ShortTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextStepScalarFieldEnumSchema,ShortTextStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextStepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ShortTextStepFindFirstOrThrowArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextStepOrderByWithRelationInputSchema.array(),ShortTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextStepScalarFieldEnumSchema,ShortTextStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextStepFindManyArgsSchema: z.ZodType<Prisma.ShortTextStepFindManyArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextStepOrderByWithRelationInputSchema.array(),ShortTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortTextStepScalarFieldEnumSchema,ShortTextStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortTextStepAggregateArgsSchema: z.ZodType<Prisma.ShortTextStepAggregateArgs> = z.object({
  where: ShortTextStepWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextStepOrderByWithRelationInputSchema.array(),ShortTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortTextStepGroupByArgsSchema: z.ZodType<Prisma.ShortTextStepGroupByArgs> = z.object({
  where: ShortTextStepWhereInputSchema.optional(),
  orderBy: z.union([ ShortTextStepOrderByWithAggregationInputSchema.array(),ShortTextStepOrderByWithAggregationInputSchema ]).optional(),
  by: ShortTextStepScalarFieldEnumSchema.array(),
  having: ShortTextStepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortTextStepFindUniqueArgsSchema: z.ZodType<Prisma.ShortTextStepFindUniqueArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereUniqueInputSchema,
}).strict() ;

export const ShortTextStepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShortTextStepFindUniqueOrThrowArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereUniqueInputSchema,
}).strict() ;

export const LongTextStepFindFirstArgsSchema: z.ZodType<Prisma.LongTextStepFindFirstArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereInputSchema.optional(),
  orderBy: z.union([ LongTextStepOrderByWithRelationInputSchema.array(),LongTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: LongTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LongTextStepScalarFieldEnumSchema,LongTextStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LongTextStepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LongTextStepFindFirstOrThrowArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereInputSchema.optional(),
  orderBy: z.union([ LongTextStepOrderByWithRelationInputSchema.array(),LongTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: LongTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LongTextStepScalarFieldEnumSchema,LongTextStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LongTextStepFindManyArgsSchema: z.ZodType<Prisma.LongTextStepFindManyArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereInputSchema.optional(),
  orderBy: z.union([ LongTextStepOrderByWithRelationInputSchema.array(),LongTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: LongTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LongTextStepScalarFieldEnumSchema,LongTextStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LongTextStepAggregateArgsSchema: z.ZodType<Prisma.LongTextStepAggregateArgs> = z.object({
  where: LongTextStepWhereInputSchema.optional(),
  orderBy: z.union([ LongTextStepOrderByWithRelationInputSchema.array(),LongTextStepOrderByWithRelationInputSchema ]).optional(),
  cursor: LongTextStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LongTextStepGroupByArgsSchema: z.ZodType<Prisma.LongTextStepGroupByArgs> = z.object({
  where: LongTextStepWhereInputSchema.optional(),
  orderBy: z.union([ LongTextStepOrderByWithAggregationInputSchema.array(),LongTextStepOrderByWithAggregationInputSchema ]).optional(),
  by: LongTextStepScalarFieldEnumSchema.array(),
  having: LongTextStepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LongTextStepFindUniqueArgsSchema: z.ZodType<Prisma.LongTextStepFindUniqueArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereUniqueInputSchema,
}).strict() ;

export const LongTextStepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LongTextStepFindUniqueOrThrowArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereUniqueInputSchema,
}).strict() ;

export const YesNoStepFindFirstArgsSchema: z.ZodType<Prisma.YesNoStepFindFirstArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereInputSchema.optional(),
  orderBy: z.union([ YesNoStepOrderByWithRelationInputSchema.array(),YesNoStepOrderByWithRelationInputSchema ]).optional(),
  cursor: YesNoStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ YesNoStepScalarFieldEnumSchema,YesNoStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const YesNoStepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.YesNoStepFindFirstOrThrowArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereInputSchema.optional(),
  orderBy: z.union([ YesNoStepOrderByWithRelationInputSchema.array(),YesNoStepOrderByWithRelationInputSchema ]).optional(),
  cursor: YesNoStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ YesNoStepScalarFieldEnumSchema,YesNoStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const YesNoStepFindManyArgsSchema: z.ZodType<Prisma.YesNoStepFindManyArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereInputSchema.optional(),
  orderBy: z.union([ YesNoStepOrderByWithRelationInputSchema.array(),YesNoStepOrderByWithRelationInputSchema ]).optional(),
  cursor: YesNoStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ YesNoStepScalarFieldEnumSchema,YesNoStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const YesNoStepAggregateArgsSchema: z.ZodType<Prisma.YesNoStepAggregateArgs> = z.object({
  where: YesNoStepWhereInputSchema.optional(),
  orderBy: z.union([ YesNoStepOrderByWithRelationInputSchema.array(),YesNoStepOrderByWithRelationInputSchema ]).optional(),
  cursor: YesNoStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const YesNoStepGroupByArgsSchema: z.ZodType<Prisma.YesNoStepGroupByArgs> = z.object({
  where: YesNoStepWhereInputSchema.optional(),
  orderBy: z.union([ YesNoStepOrderByWithAggregationInputSchema.array(),YesNoStepOrderByWithAggregationInputSchema ]).optional(),
  by: YesNoStepScalarFieldEnumSchema.array(),
  having: YesNoStepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const YesNoStepFindUniqueArgsSchema: z.ZodType<Prisma.YesNoStepFindUniqueArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereUniqueInputSchema,
}).strict() ;

export const YesNoStepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.YesNoStepFindUniqueOrThrowArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereUniqueInputSchema,
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

export const ContentStepCreateArgsSchema: z.ZodType<Prisma.ContentStepCreateArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  data: z.union([ ContentStepCreateInputSchema,ContentStepUncheckedCreateInputSchema ]),
}).strict() ;

export const ContentStepUpsertArgsSchema: z.ZodType<Prisma.ContentStepUpsertArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereUniqueInputSchema,
  create: z.union([ ContentStepCreateInputSchema,ContentStepUncheckedCreateInputSchema ]),
  update: z.union([ ContentStepUpdateInputSchema,ContentStepUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContentStepCreateManyArgsSchema: z.ZodType<Prisma.ContentStepCreateManyArgs> = z.object({
  data: z.union([ ContentStepCreateManyInputSchema,ContentStepCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContentStepDeleteArgsSchema: z.ZodType<Prisma.ContentStepDeleteArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  where: ContentStepWhereUniqueInputSchema,
}).strict() ;

export const ContentStepUpdateArgsSchema: z.ZodType<Prisma.ContentStepUpdateArgs> = z.object({
  select: ContentStepSelectSchema.optional(),
  include: ContentStepIncludeSchema.optional(),
  data: z.union([ ContentStepUpdateInputSchema,ContentStepUncheckedUpdateInputSchema ]),
  where: ContentStepWhereUniqueInputSchema,
}).strict() ;

export const ContentStepUpdateManyArgsSchema: z.ZodType<Prisma.ContentStepUpdateManyArgs> = z.object({
  data: z.union([ ContentStepUpdateManyMutationInputSchema,ContentStepUncheckedUpdateManyInputSchema ]),
  where: ContentStepWhereInputSchema.optional(),
}).strict() ;

export const ContentStepDeleteManyArgsSchema: z.ZodType<Prisma.ContentStepDeleteManyArgs> = z.object({
  where: ContentStepWhereInputSchema.optional(),
}).strict() ;

export const ShortTextStepCreateArgsSchema: z.ZodType<Prisma.ShortTextStepCreateArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  data: z.union([ ShortTextStepCreateInputSchema,ShortTextStepUncheckedCreateInputSchema ]),
}).strict() ;

export const ShortTextStepUpsertArgsSchema: z.ZodType<Prisma.ShortTextStepUpsertArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereUniqueInputSchema,
  create: z.union([ ShortTextStepCreateInputSchema,ShortTextStepUncheckedCreateInputSchema ]),
  update: z.union([ ShortTextStepUpdateInputSchema,ShortTextStepUncheckedUpdateInputSchema ]),
}).strict() ;

export const ShortTextStepCreateManyArgsSchema: z.ZodType<Prisma.ShortTextStepCreateManyArgs> = z.object({
  data: z.union([ ShortTextStepCreateManyInputSchema,ShortTextStepCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShortTextStepDeleteArgsSchema: z.ZodType<Prisma.ShortTextStepDeleteArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  where: ShortTextStepWhereUniqueInputSchema,
}).strict() ;

export const ShortTextStepUpdateArgsSchema: z.ZodType<Prisma.ShortTextStepUpdateArgs> = z.object({
  select: ShortTextStepSelectSchema.optional(),
  include: ShortTextStepIncludeSchema.optional(),
  data: z.union([ ShortTextStepUpdateInputSchema,ShortTextStepUncheckedUpdateInputSchema ]),
  where: ShortTextStepWhereUniqueInputSchema,
}).strict() ;

export const ShortTextStepUpdateManyArgsSchema: z.ZodType<Prisma.ShortTextStepUpdateManyArgs> = z.object({
  data: z.union([ ShortTextStepUpdateManyMutationInputSchema,ShortTextStepUncheckedUpdateManyInputSchema ]),
  where: ShortTextStepWhereInputSchema.optional(),
}).strict() ;

export const ShortTextStepDeleteManyArgsSchema: z.ZodType<Prisma.ShortTextStepDeleteManyArgs> = z.object({
  where: ShortTextStepWhereInputSchema.optional(),
}).strict() ;

export const LongTextStepCreateArgsSchema: z.ZodType<Prisma.LongTextStepCreateArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  data: z.union([ LongTextStepCreateInputSchema,LongTextStepUncheckedCreateInputSchema ]),
}).strict() ;

export const LongTextStepUpsertArgsSchema: z.ZodType<Prisma.LongTextStepUpsertArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereUniqueInputSchema,
  create: z.union([ LongTextStepCreateInputSchema,LongTextStepUncheckedCreateInputSchema ]),
  update: z.union([ LongTextStepUpdateInputSchema,LongTextStepUncheckedUpdateInputSchema ]),
}).strict() ;

export const LongTextStepCreateManyArgsSchema: z.ZodType<Prisma.LongTextStepCreateManyArgs> = z.object({
  data: z.union([ LongTextStepCreateManyInputSchema,LongTextStepCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LongTextStepDeleteArgsSchema: z.ZodType<Prisma.LongTextStepDeleteArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  where: LongTextStepWhereUniqueInputSchema,
}).strict() ;

export const LongTextStepUpdateArgsSchema: z.ZodType<Prisma.LongTextStepUpdateArgs> = z.object({
  select: LongTextStepSelectSchema.optional(),
  include: LongTextStepIncludeSchema.optional(),
  data: z.union([ LongTextStepUpdateInputSchema,LongTextStepUncheckedUpdateInputSchema ]),
  where: LongTextStepWhereUniqueInputSchema,
}).strict() ;

export const LongTextStepUpdateManyArgsSchema: z.ZodType<Prisma.LongTextStepUpdateManyArgs> = z.object({
  data: z.union([ LongTextStepUpdateManyMutationInputSchema,LongTextStepUncheckedUpdateManyInputSchema ]),
  where: LongTextStepWhereInputSchema.optional(),
}).strict() ;

export const LongTextStepDeleteManyArgsSchema: z.ZodType<Prisma.LongTextStepDeleteManyArgs> = z.object({
  where: LongTextStepWhereInputSchema.optional(),
}).strict() ;

export const YesNoStepCreateArgsSchema: z.ZodType<Prisma.YesNoStepCreateArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  data: z.union([ YesNoStepCreateInputSchema,YesNoStepUncheckedCreateInputSchema ]),
}).strict() ;

export const YesNoStepUpsertArgsSchema: z.ZodType<Prisma.YesNoStepUpsertArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereUniqueInputSchema,
  create: z.union([ YesNoStepCreateInputSchema,YesNoStepUncheckedCreateInputSchema ]),
  update: z.union([ YesNoStepUpdateInputSchema,YesNoStepUncheckedUpdateInputSchema ]),
}).strict() ;

export const YesNoStepCreateManyArgsSchema: z.ZodType<Prisma.YesNoStepCreateManyArgs> = z.object({
  data: z.union([ YesNoStepCreateManyInputSchema,YesNoStepCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const YesNoStepDeleteArgsSchema: z.ZodType<Prisma.YesNoStepDeleteArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  where: YesNoStepWhereUniqueInputSchema,
}).strict() ;

export const YesNoStepUpdateArgsSchema: z.ZodType<Prisma.YesNoStepUpdateArgs> = z.object({
  select: YesNoStepSelectSchema.optional(),
  include: YesNoStepIncludeSchema.optional(),
  data: z.union([ YesNoStepUpdateInputSchema,YesNoStepUncheckedUpdateInputSchema ]),
  where: YesNoStepWhereUniqueInputSchema,
}).strict() ;

export const YesNoStepUpdateManyArgsSchema: z.ZodType<Prisma.YesNoStepUpdateManyArgs> = z.object({
  data: z.union([ YesNoStepUpdateManyMutationInputSchema,YesNoStepUncheckedUpdateManyInputSchema ]),
  where: YesNoStepWhereInputSchema.optional(),
}).strict() ;

export const YesNoStepDeleteManyArgsSchema: z.ZodType<Prisma.YesNoStepDeleteManyArgs> = z.object({
  where: YesNoStepWhereInputSchema.optional(),
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