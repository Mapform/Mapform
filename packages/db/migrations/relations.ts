import { relations } from "drizzle-orm/relations";
import { user, session, teamspace, project, dataset, layer, row, column, pointLayer, workspace, page, cell, stringCell, booleanCell, dateCell, numberCell, richtextCell, pointCell, iconCell, markerLayer, plan, workspaceMembership, teamspaceMembership, layersToPages } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	workspaceMemberships: many(workspaceMembership),
	teamspaceMemberships: many(teamspaceMembership),
}));

export const projectRelations = relations(project, ({one, many}) => ({
	teamspace: one(teamspace, {
		fields: [project.teamspaceId],
		references: [teamspace.id]
	}),
	project: one(project, {
		fields: [project.rootProjectId],
		references: [project.id],
		relationName: "project_rootProjectId_project_id"
	}),
	projects: many(project, {
		relationName: "project_rootProjectId_project_id"
	}),
	dataset: one(dataset, {
		fields: [project.datasetId],
		references: [dataset.id]
	}),
	pages: many(page),
}));

export const teamspaceRelations = relations(teamspace, ({one, many}) => ({
	projects: many(project),
	datasets: many(dataset),
	workspace: one(workspace, {
		fields: [teamspace.workspaceSlug],
		references: [workspace.slug]
	}),
	teamspaceMemberships: many(teamspaceMembership),
}));

export const datasetRelations = relations(dataset, ({one, many}) => ({
	projects: many(project),
	teamspace: one(teamspace, {
		fields: [dataset.teamspaceId],
		references: [teamspace.id]
	}),
	layers: many(layer),
	rows: many(row),
	columns: many(column),
}));

export const layerRelations = relations(layer, ({one, many}) => ({
	dataset: one(dataset, {
		fields: [layer.datasetId],
		references: [dataset.id]
	}),
	pointLayers: many(pointLayer),
	markerLayers: many(markerLayer),
	layersToPages: many(layersToPages),
}));

export const rowRelations = relations(row, ({one, many}) => ({
	dataset: one(dataset, {
		fields: [row.datasetId],
		references: [dataset.id]
	}),
	cells: many(cell),
}));

export const pointLayerRelations = relations(pointLayer, ({one}) => ({
	column_pointColumnId: one(column, {
		fields: [pointLayer.pointColumnId],
		references: [column.id],
		relationName: "pointLayer_pointColumnId_column_id"
	}),
	column_titleColumnId: one(column, {
		fields: [pointLayer.titleColumnId],
		references: [column.id],
		relationName: "pointLayer_titleColumnId_column_id"
	}),
	column_descriptionColumnId: one(column, {
		fields: [pointLayer.descriptionColumnId],
		references: [column.id],
		relationName: "pointLayer_descriptionColumnId_column_id"
	}),
	layer: one(layer, {
		fields: [pointLayer.layerId],
		references: [layer.id]
	}),
	column_iconColumnId: one(column, {
		fields: [pointLayer.iconColumnId],
		references: [column.id],
		relationName: "pointLayer_iconColumnId_column_id"
	}),
}));

export const columnRelations = relations(column, ({one, many}) => ({
	pointLayers_pointColumnId: many(pointLayer, {
		relationName: "pointLayer_pointColumnId_column_id"
	}),
	pointLayers_titleColumnId: many(pointLayer, {
		relationName: "pointLayer_titleColumnId_column_id"
	}),
	pointLayers_descriptionColumnId: many(pointLayer, {
		relationName: "pointLayer_descriptionColumnId_column_id"
	}),
	pointLayers_iconColumnId: many(pointLayer, {
		relationName: "pointLayer_iconColumnId_column_id"
	}),
	dataset: one(dataset, {
		fields: [column.datasetId],
		references: [dataset.id]
	}),
	page: one(page, {
		fields: [column.pageId],
		references: [page.id]
	}),
	cells: many(cell),
	markerLayers_pointColumnId: many(markerLayer, {
		relationName: "markerLayer_pointColumnId_column_id"
	}),
	markerLayers_titleColumnId: many(markerLayer, {
		relationName: "markerLayer_titleColumnId_column_id"
	}),
	markerLayers_descriptionColumnId: many(markerLayer, {
		relationName: "markerLayer_descriptionColumnId_column_id"
	}),
	markerLayers_iconColumnId: many(markerLayer, {
		relationName: "markerLayer_iconColumnId_column_id"
	}),
}));

export const workspaceRelations = relations(workspace, ({many}) => ({
	teamspaces: many(teamspace),
	plans: many(plan),
	workspaceMemberships: many(workspaceMembership),
}));

export const pageRelations = relations(page, ({one, many}) => ({
	project: one(project, {
		fields: [page.projectId],
		references: [project.id]
	}),
	columns: many(column),
	layersToPages: many(layersToPages),
}));

export const stringCellRelations = relations(stringCell, ({one}) => ({
	cell: one(cell, {
		fields: [stringCell.cellId],
		references: [cell.id]
	}),
}));

export const cellRelations = relations(cell, ({one, many}) => ({
	stringCells: many(stringCell),
	row: one(row, {
		fields: [cell.rowId],
		references: [row.id]
	}),
	column: one(column, {
		fields: [cell.columnId],
		references: [column.id]
	}),
	booleanCells: many(booleanCell),
	dateCells: many(dateCell),
	numberCells: many(numberCell),
	richtextCells: many(richtextCell),
	pointCells: many(pointCell),
	iconCells: many(iconCell),
}));

export const booleanCellRelations = relations(booleanCell, ({one}) => ({
	cell: one(cell, {
		fields: [booleanCell.cellId],
		references: [cell.id]
	}),
}));

export const dateCellRelations = relations(dateCell, ({one}) => ({
	cell: one(cell, {
		fields: [dateCell.cellId],
		references: [cell.id]
	}),
}));

export const numberCellRelations = relations(numberCell, ({one}) => ({
	cell: one(cell, {
		fields: [numberCell.cellId],
		references: [cell.id]
	}),
}));

export const richtextCellRelations = relations(richtextCell, ({one}) => ({
	cell: one(cell, {
		fields: [richtextCell.cellId],
		references: [cell.id]
	}),
}));

export const pointCellRelations = relations(pointCell, ({one}) => ({
	cell: one(cell, {
		fields: [pointCell.cellId],
		references: [cell.id]
	}),
}));

export const iconCellRelations = relations(iconCell, ({one}) => ({
	cell: one(cell, {
		fields: [iconCell.cellId],
		references: [cell.id]
	}),
}));

export const markerLayerRelations = relations(markerLayer, ({one}) => ({
	layer: one(layer, {
		fields: [markerLayer.layerId],
		references: [layer.id]
	}),
	column_pointColumnId: one(column, {
		fields: [markerLayer.pointColumnId],
		references: [column.id],
		relationName: "markerLayer_pointColumnId_column_id"
	}),
	column_titleColumnId: one(column, {
		fields: [markerLayer.titleColumnId],
		references: [column.id],
		relationName: "markerLayer_titleColumnId_column_id"
	}),
	column_descriptionColumnId: one(column, {
		fields: [markerLayer.descriptionColumnId],
		references: [column.id],
		relationName: "markerLayer_descriptionColumnId_column_id"
	}),
	column_iconColumnId: one(column, {
		fields: [markerLayer.iconColumnId],
		references: [column.id],
		relationName: "markerLayer_iconColumnId_column_id"
	}),
}));

export const planRelations = relations(plan, ({one}) => ({
	workspace: one(workspace, {
		fields: [plan.workspaceSlug],
		references: [workspace.slug]
	}),
}));

export const workspaceMembershipRelations = relations(workspaceMembership, ({one}) => ({
	workspace: one(workspace, {
		fields: [workspaceMembership.workspaceId],
		references: [workspace.id]
	}),
	user: one(user, {
		fields: [workspaceMembership.userId],
		references: [user.id]
	}),
}));

export const teamspaceMembershipRelations = relations(teamspaceMembership, ({one}) => ({
	user: one(user, {
		fields: [teamspaceMembership.userId],
		references: [user.id]
	}),
	teamspace: one(teamspace, {
		fields: [teamspaceMembership.teamspaceId],
		references: [teamspace.id]
	}),
}));

export const layersToPagesRelations = relations(layersToPages, ({one}) => ({
	layer: one(layer, {
		fields: [layersToPages.layerId],
		references: [layer.id]
	}),
	page: one(page, {
		fields: [layersToPages.pageId],
		references: [page.id]
	}),
}));