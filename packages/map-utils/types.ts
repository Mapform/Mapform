import type { PointCell } from "@mapform/db/schema";

export type PageData = {
  pointData: PointCell[];
};

export type PaddingOptions = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: PaddingOptions;
};

export interface PlacesSearchResponse {
  type: string;
  features: {
    type?: string;
    properties?: {
      place_id: string;
      name?: string;
      country: string;
      country_code: string;
      region: string;
      state: string;
      city: string;
      lon: number;
      lat: number;
      result_type: string;
      formatted: string;
      address_line1: string;
      address_line2: string;
      category: string;
      rank: {
        importance: number;
        confidence: number;
        confidence_city_level: number;
        match_type: string;
      };
      geometry?: {
        type: "Point" | unknown;
        coordinates: [number, number] | unknown;
      };
    };
    bbox?: [number, number, number, number];
  }[];
}
