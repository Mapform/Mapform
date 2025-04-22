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

export interface GeoapifyPlace {
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
      result_type:
        | "unknown"
        | "amenity"
        | "building"
        | "street"
        | "suburb"
        | "district"
        | "postcode"
        | "city"
        | "county"
        | "state"
        | "country";
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

export interface GeoapifyRoute {
  results: {
    mode: string;
    waypoints: {
      location: [number, number];
      original_index: number;
    }[];
    units: string;
    distance: number;
    distance_units: string;
    time: number;
    legs: {
      distance: number;
      time: number;
      steps: {
        from_index: number;
        to_index: number;
        distance: number;
        time: number;
        instruction: {
          text: string;
        };
      }[];
    }[];
    geometry: {
      lon: number;
      lat: number;
    }[][];
  }[];
  properties: {
    mode: string;
    waypoints: {
      lat: number;
      lon: number;
    }[];
    units: string;
  };
}
