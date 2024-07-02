import { Marker } from "react-map-gl";

interface PointsProps {
  points: { id: number; latitude: number; longitude: number }[];
}

export function Points({ points }: PointsProps) {
  return (
    <>
      {points.map((point) => (
        <Marker
          key={point.id}
          latitude={point.latitude}
          longitude={point.longitude}
        />
      ))}
    </>
  );
}
