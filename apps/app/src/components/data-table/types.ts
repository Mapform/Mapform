export interface TextCell {
  value: string | null;
}

export interface NumberCell {
  value: number | null;
}

export interface DateCell {
  value: string | null; // ISO date string
}

export interface PointCell {
  value: {
    x: number;
    y: number;
  } | null;
}

export interface LineCell {
  value: {
    coordinates: Array<{
      x: number;
      y: number;
    }>;
  } | null;
}

export interface PolygonCell {
  value: {
    coordinates: Array<{
      x: number;
      y: number;
    }>;
  } | null;
}

export interface Cell {
  text_cell?: TextCell;
  number_cell?: NumberCell;
  date_cell?: DateCell;
  point_cell?: PointCell;
  line_cell?: LineCell;
  polygon_cell?: PolygonCell;
}

export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "point"
  | "line"
  | "polygon";
