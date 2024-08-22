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
