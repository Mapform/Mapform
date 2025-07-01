import { eq, and, isNull, asc } from "drizzle-orm";
import { db } from "../../index";
import { fileTreePositions, type itemTypeEnum } from "./schema";

type ItemType = (typeof itemTypeEnum.enumValues)[number];

/**
 * Get the next available position within a folder or root
 */
export async function getNextPosition(
  teamspaceId: string,
  folderId?: string | null,
): Promise<number> {
  const existingPositions = await db
    .select({ position: fileTreePositions.position })
    .from(fileTreePositions)
    .where(
      and(
        eq(fileTreePositions.teamspaceId, teamspaceId),
        folderId
          ? eq(fileTreePositions.parentId, folderId)
          : isNull(fileTreePositions.parentId),
      ),
    )
    .orderBy(asc(fileTreePositions.position));

  if (existingPositions.length === 0) {
    return 0;
  }

  // Find the first gap in positions, or use the next position after the highest
  let expectedPosition = 0;
  for (const { position } of existingPositions) {
    if (position !== expectedPosition) {
      return expectedPosition;
    }
    expectedPosition++;
  }

  return expectedPosition;
}

/**
 * Reorder positions when an item is moved or deleted
 */
export async function reorderPositions(
  teamspaceId: string,
  folderId?: string | null,
): Promise<void> {
  const positions = await db
    .select({ id: fileTreePositions.id, position: fileTreePositions.position })
    .from(fileTreePositions)
    .where(
      and(
        eq(fileTreePositions.teamspaceId, teamspaceId),
        folderId
          ? eq(fileTreePositions.parentId, folderId)
          : isNull(fileTreePositions.parentId),
      ),
    )
    .orderBy(asc(fileTreePositions.position));

  // Update positions to be sequential starting from 0
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    if (position && position.position !== i) {
      await db
        .update(fileTreePositions)
        .set({ position: i })
        .where(eq(fileTreePositions.id, position.id));
    }
  }
}

/**
 * Move an item to a new position, shifting other items as needed
 */
export async function moveToPosition(
  itemId: string,
  itemType: ItemType,
  newPosition: number,
  teamspaceId: string,
  folderId?: string | null,
): Promise<void> {
  // Get current position
  const currentPosition = await db
    .select({ position: fileTreePositions.position })
    .from(fileTreePositions)
    .where(
      and(
        eq(fileTreePositions.id, itemId),
        eq(fileTreePositions.itemType, itemType),
      ),
    )
    .limit(1);

  if (currentPosition.length === 0) {
    throw new Error("Item position not found");
  }

  const currentPos = currentPosition[0]?.position;
  if (currentPos === undefined) {
    throw new Error("Item position is undefined");
  }

  if (currentPos === newPosition) {
    return; // No change needed
  }

  // Get all positions in the target context
  const allPositions = await db
    .select({ id: fileTreePositions.id, position: fileTreePositions.position })
    .from(fileTreePositions)
    .where(
      and(
        eq(fileTreePositions.teamspaceId, teamspaceId),
        folderId
          ? eq(fileTreePositions.parentId, folderId)
          : isNull(fileTreePositions.parentId),
      ),
    )
    .orderBy(asc(fileTreePositions.position));

  // Update the target item's position
  await db
    .update(fileTreePositions)
    .set({ position: newPosition })
    .where(
      and(
        eq(fileTreePositions.id, itemId),
        eq(fileTreePositions.itemType, itemType),
      ),
    );

  // Shift other items
  if (currentPos < newPosition) {
    // Moving down: shift items between current and new position up by 1
    for (const pos of allPositions) {
      if (pos.position > currentPos && pos.position <= newPosition) {
        await db
          .update(fileTreePositions)
          .set({ position: pos.position - 1 })
          .where(eq(fileTreePositions.id, pos.id));
      }
    }
  } else {
    // Moving up: shift items between new and current position down by 1
    for (const pos of allPositions) {
      if (pos.position >= newPosition && pos.position < currentPos) {
        await db
          .update(fileTreePositions)
          .set({ position: pos.position + 1 })
          .where(eq(fileTreePositions.id, pos.id));
      }
    }
  }
}

/**
 * Check if a position is available within a folder or root
 */
export async function isPositionAvailable(
  position: number,
  teamspaceId: string,
  folderId?: string | null,
): Promise<boolean> {
  const existing = await db
    .select({ id: fileTreePositions.id })
    .from(fileTreePositions)
    .where(
      and(
        eq(fileTreePositions.teamspaceId, teamspaceId),
        folderId
          ? eq(fileTreePositions.parentId, folderId)
          : isNull(fileTreePositions.parentId),
        eq(fileTreePositions.position, position),
      ),
    )
    .limit(1);

  return existing.length === 0;
}
