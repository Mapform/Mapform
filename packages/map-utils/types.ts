export type Points = {
  id: number;
  longitude: number;
  latitude: number;
  zIndex: number;
}[];

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
  data: {
    results: {
      fsq_id: string;
      name: string;
      location: {
        address: string;
        country: string;
        cross_street: string;
        formatted_address: string;
        locality: string;
        postcode: string;
        region: string;
      };
      geocodes: {
        main: {
          latitude: number;
          longitude: number;
        };
        roof: {
          latitude: number;
          longitude: number;
        };
      };
      distance: number;
      categories: {
        id: number;
        name: string;
        short_name: string;
        plural_name: string;
        icon: {
          prefix: string;
          suffix: string;
        };
      }[];
    }[];
  };
}
