import { pgTable, unique, uuid, varchar, text, boolean, foreignKey, timestamp, index, jsonb, doublePrecision, real, geometry, smallint, numeric, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const color = pgEnum("color", ['black', 'gray', ''])
export const columnType = pgEnum("column_type", ['string', 'bool', 'number', 'date', 'point', 'richtext', 'icon'])
export const contentSide = pgEnum("content_side", ['left', 'right'])
export const contentViewType = pgEnum("content_view_type", ['map', 'split', 'text'])
export const datasetType = pgEnum("dataset_type", ['default', 'submissions'])
export const layerType = pgEnum("layer_type", ['point', 'marker'])
export const teamspaceRole = pgEnum("teamspace_role", ['owner', 'member'])
export const workspaceRole = pgEnum("workspace_role", ['owner', 'member'])


export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 256 }),
	email: text().notNull(),
	image: text(),
	hasOnboarded: boolean().default(false).notNull(),
}, (table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => {
	return {
		sessionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const workspace = pgTable("workspace", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: varchar({ length: 256 }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		workspaceSlugUnique: unique("workspace_slug_unique").on(table.slug),
	}
});

export const project = pgTable("project", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 256 }).notNull(),
	icon: varchar({ length: 256 }),
	teamspaceId: uuid("teamspace_id").notNull(),
	isDirty: boolean("is_dirty").default(false).notNull(),
	rootProjectId: uuid("root_project_id"),
	datasetId: uuid("dataset_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		projectTeamspaceIdTeamspaceIdFk: foreignKey({
			columns: [table.teamspaceId],
			foreignColumns: [teamspace.id],
			name: "project_teamspace_id_teamspace_id_fk"
		}).onDelete("cascade"),
		projectRootProjectIdProjectIdFk: foreignKey({
			columns: [table.rootProjectId],
			foreignColumns: [table.id],
			name: "project_root_project_id_project_id_fk"
		}).onDelete("cascade"),
		projectDatasetIdDatasetIdFk: foreignKey({
			columns: [table.datasetId],
			foreignColumns: [dataset.id],
			name: "project_dataset_id_dataset_id_fk"
		}).onDelete("set null"),
	}
});

export const dataset = pgTable("dataset", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	icon: varchar({ length: 256 }),
	type: datasetType().default('default').notNull(),
	teamspaceId: uuid("teamspace_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		datasetTeamspaceIdTeamspaceIdFk: foreignKey({
			columns: [table.teamspaceId],
			foreignColumns: [teamspace.id],
			name: "dataset_teamspace_id_teamspace_id_fk"
		}).onDelete("cascade"),
	}
});

export const layer = pgTable("layer", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	type: layerType().notNull(),
	datasetId: uuid("dataset_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		layerDatasetIdDatasetIdFk: foreignKey({
			columns: [table.datasetId],
			foreignColumns: [dataset.id],
			name: "layer_dataset_id_dataset_id_fk"
		}).onDelete("cascade"),
	}
});

export const row = pgTable("row", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	datasetId: uuid("dataset_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		rowDatasetIdDatasetIdFk: foreignKey({
			columns: [table.datasetId],
			foreignColumns: [dataset.id],
			name: "row_dataset_id_dataset_id_fk"
		}).onDelete("cascade"),
	}
});

export const pointLayer = pgTable("point_layer", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	layerId: uuid("layer_id").notNull(),
	pointColumnId: uuid("point_column_id"),
	titleColumnId: uuid("title_column_id"),
	descriptionColumnId: uuid("description_column_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	color: text(),
	iconColumnId: uuid("icon_column_id"),
}, (table) => {
	return {
		pointLayerPointColumnIdColumnIdFk: foreignKey({
			columns: [table.pointColumnId],
			foreignColumns: [column.id],
			name: "point_layer_point_column_id_column_id_fk"
		}).onDelete("set null"),
		pointLayerTitleColumnIdColumnIdFk: foreignKey({
			columns: [table.titleColumnId],
			foreignColumns: [column.id],
			name: "point_layer_title_column_id_column_id_fk"
		}).onDelete("set null"),
		pointLayerDescriptionColumnIdColumnIdFk: foreignKey({
			columns: [table.descriptionColumnId],
			foreignColumns: [column.id],
			name: "point_layer_description_column_id_column_id_fk"
		}).onDelete("set null"),
		pointLayerLayerIdLayerIdFk: foreignKey({
			columns: [table.layerId],
			foreignColumns: [layer.id],
			name: "point_layer_layer_id_layer_id_fk"
		}).onDelete("cascade"),
		pointLayerIconColumnIdColumnIdFk: foreignKey({
			columns: [table.iconColumnId],
			foreignColumns: [column.id],
			name: "point_layer_icon_column_id_column_id_fk"
		}).onDelete("set null"),
		pointLayerLayerIdUnique: unique("point_layer_layer_id_unique").on(table.layerId),
	}
});

export const teamspace = pgTable("teamspace", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: varchar({ length: 256 }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	workspaceSlug: varchar("workspace_slug").notNull(),
}, (table) => {
	return {
		teamspaceWorkspaceSlugWorkspaceSlugFk: foreignKey({
			columns: [table.workspaceSlug],
			foreignColumns: [workspace.slug],
			name: "teamspace_workspace_slug_workspace_slug_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		teamspaceWorkspaceSlugSlugUnique: unique("teamspace_workspace_slug_slug_unique").on(table.slug, table.workspaceSlug),
	}
});

export const page = pgTable("page", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	bannerImage: text("banner_image"),
	icon: varchar({ length: 256 }),
	title: text(),
	content: jsonb(),
	zoom: doublePrecision().notNull(),
	pitch: real().notNull(),
	bearing: real().notNull(),
	center: geometry({ type: "point" }).notNull(),
	position: smallint().notNull(),
	contentViewType: contentViewType("content_view_type").default('split').notNull(),
	contentSide: contentSide("content_side").default('left').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		spatialIdx: index("page_spatial_index").using("gist", table.center.asc().nullsLast().op("gist_geometry_ops_2d")),
		pageProjectIdProjectIdFk: foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "page_project_id_project_id_fk"
		}).onDelete("cascade"),
	}
});

export const column = pgTable("column", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	type: columnType().notNull(),
	datasetId: uuid("dataset_id").notNull(),
	blockNoteId: text("block_note_id"),
	pageId: uuid("page_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		columnDatasetIdDatasetIdFk: foreignKey({
			columns: [table.datasetId],
			foreignColumns: [dataset.id],
			name: "column_dataset_id_dataset_id_fk"
		}).onDelete("cascade"),
		columnPageIdPageIdFk: foreignKey({
			columns: [table.pageId],
			foreignColumns: [page.id],
			name: "column_page_id_page_id_fk"
		}).onDelete("cascade"),
		columnDatasetIdNameUnique: unique("column_dataset_id_name_unique").on(table.name, table.datasetId),
		columnBlockNoteIdUnique: unique("column_block_note_id_unique").on(table.blockNoteId),
	}
});

export const stringCell = pgTable("string_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: text(),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		stringCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "string_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		stringCellUnq: unique("string_cell_unq").on(table.cellId),
	}
});

export const cell = pgTable("cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rowId: uuid("row_id").notNull(),
	columnId: uuid("column_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		cellRowIdRowIdFk: foreignKey({
			columns: [table.rowId],
			foreignColumns: [row.id],
			name: "cell_row_id_row_id_fk"
		}).onDelete("cascade"),
		cellColumnIdColumnIdFk: foreignKey({
			columns: [table.columnId],
			foreignColumns: [column.id],
			name: "cell_column_id_column_id_fk"
		}).onDelete("cascade"),
		cellRowIdColumnIdUnique: unique("cell_row_id_column_id_unique").on(table.rowId, table.columnId),
	}
});

export const booleanCell = pgTable("boolean_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: boolean(),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		booleanCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "boolean_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		boolCellUnq: unique("bool_cell_unq").on(table.cellId),
	}
});

export const dateCell = pgTable("date_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: timestamp({ withTimezone: true, mode: 'string' }),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		dateCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "date_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		dateCellUnq: unique("date_cell_unq").on(table.cellId),
	}
});

export const numberCell = pgTable("number_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: numeric(),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		numberCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "number_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		numberCellUnq: unique("number_cell_unq").on(table.cellId),
	}
});

export const richtextCell = pgTable("richtext_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: jsonb(),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		richtextCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "richtext_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		richtextCellUnq: unique("richtext_cell_unq").on(table.cellId),
	}
});

export const pointCell = pgTable("point_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: geometry({ type: "point" }),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		pointSpatialIdx: index("point_spatial_index").using("gist", table.value.asc().nullsLast().op("gist_geometry_ops_2d")),
		pointCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "point_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		pointCellUnq: unique("point_cell_unq").on(table.cellId),
	}
});

export const magicLink = pgTable("magic_link", {
	token: text().primaryKey().notNull(),
	email: text().notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const iconCell = pgTable("icon_cell", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	icon: varchar({ length: 256 }),
	cellId: uuid("cell_id").notNull(),
}, (table) => {
	return {
		iconCellCellIdCellIdFk: foreignKey({
			columns: [table.cellId],
			foreignColumns: [cell.id],
			name: "icon_cell_cell_id_cell_id_fk"
		}).onDelete("cascade"),
		iconCellUnq: unique("icon_cell_unq").on(table.cellId),
	}
});

export const markerLayer = pgTable("marker_layer", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	layerId: uuid("layer_id").notNull(),
	pointColumnId: uuid("point_column_id"),
	titleColumnId: uuid("title_column_id"),
	descriptionColumnId: uuid("description_column_id"),
	iconColumnId: uuid("icon_column_id"),
	color: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		markerLayerLayerIdLayerIdFk: foreignKey({
			columns: [table.layerId],
			foreignColumns: [layer.id],
			name: "marker_layer_layer_id_layer_id_fk"
		}).onDelete("cascade"),
		markerLayerPointColumnIdColumnIdFk: foreignKey({
			columns: [table.pointColumnId],
			foreignColumns: [column.id],
			name: "marker_layer_point_column_id_column_id_fk"
		}).onDelete("set null"),
		markerLayerTitleColumnIdColumnIdFk: foreignKey({
			columns: [table.titleColumnId],
			foreignColumns: [column.id],
			name: "marker_layer_title_column_id_column_id_fk"
		}).onDelete("set null"),
		markerLayerDescriptionColumnIdColumnIdFk: foreignKey({
			columns: [table.descriptionColumnId],
			foreignColumns: [column.id],
			name: "marker_layer_description_column_id_column_id_fk"
		}).onDelete("set null"),
		markerLayerIconColumnIdColumnIdFk: foreignKey({
			columns: [table.iconColumnId],
			foreignColumns: [column.id],
			name: "marker_layer_icon_column_id_column_id_fk"
		}).onDelete("set null"),
		markerLayerLayerIdUnique: unique("marker_layer_layer_id_unique").on(table.layerId),
	}
});

export const plan = pgTable("plan", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 64 }).notNull(),
	stripeCustomerId: text("stripe_customer_id").notNull(),
	stripeSubscriptionId: text("stripe_subscription_id"),
	stripeProductId: text("stripe_product_id"),
	subscriptionStatus: varchar("subscription_status", { length: 20 }),
	position: integer().notNull(),
	workspaceSlug: varchar("workspace_slug").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		planWorkspaceSlugWorkspaceSlugFk: foreignKey({
			columns: [table.workspaceSlug],
			foreignColumns: [workspace.slug],
			name: "plan_workspace_slug_workspace_slug_fk"
		}).onDelete("cascade"),
		planStripeCustomerIdUnique: unique("plan_stripe_customer_id_unique").on(table.stripeCustomerId),
		planStripeSubscriptionIdUnique: unique("plan_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
		planWorkspaceSlugUnique: unique("plan_workspace_slug_unique").on(table.workspaceSlug),
	}
});

export const workspaceMembership = pgTable("workspace_membership", {
	userId: uuid("user_id").notNull(),
	workspaceId: uuid("workspace_id").notNull(),
	workspaceRole: workspaceRole("workspace_role").notNull(),
}, (table) => {
	return {
		workspaceMembershipWorkspaceIdWorkspaceIdFk: foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "workspace_membership_workspace_id_workspace_id_fk"
		}).onDelete("cascade"),
		workspaceMembershipUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "workspace_membership_user_id_user_id_fk"
		}).onDelete("cascade"),
		workspaceMembershipUserIdWorkspaceIdPk: primaryKey({ columns: [table.userId, table.workspaceId], name: "workspace_membership_user_id_workspace_id_pk"}),
	}
});

export const teamspaceMembership = pgTable("teamspace_membership", {
	userId: uuid("user_id").notNull(),
	teamspaceId: uuid("teamspace_id").notNull(),
	teamspaceRole: teamspaceRole("teamspace_role").notNull(),
}, (table) => {
	return {
		teamspaceMembershipUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "teamspace_membership_user_id_user_id_fk"
		}).onDelete("cascade"),
		teamspaceMembershipTeamspaceIdTeamspaceIdFk: foreignKey({
			columns: [table.teamspaceId],
			foreignColumns: [teamspace.id],
			name: "teamspace_membership_teamspace_id_teamspace_id_fk"
		}).onDelete("cascade"),
		teamspaceMembershipUserIdTeamspaceIdPk: primaryKey({ columns: [table.userId, table.teamspaceId], name: "teamspace_membership_user_id_teamspace_id_pk"}),
	}
});

export const layersToPages = pgTable("layers_to_pages", {
	layerId: uuid("layer_id").notNull(),
	pageId: uuid("page_id").notNull(),
	position: smallint().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		layersToPagesLayerIdLayerIdFk: foreignKey({
			columns: [table.layerId],
			foreignColumns: [layer.id],
			name: "layers_to_pages_layer_id_layer_id_fk"
		}).onDelete("cascade"),
		layersToPagesPageIdPageIdFk: foreignKey({
			columns: [table.pageId],
			foreignColumns: [page.id],
			name: "layers_to_pages_page_id_page_id_fk"
		}).onDelete("cascade"),
		layersToPagesLayerIdPageIdPk: primaryKey({ columns: [table.layerId, table.pageId], name: "layers_to_pages_layer_id_page_id_pk"}),
	}
});
