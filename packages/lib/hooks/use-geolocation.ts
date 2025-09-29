import { useCallback, useEffect, useState } from "react";

export type GeolocationState = {
  isLoading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  coords: {
    lat: number;
    lng: number;
  } | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
};

export function useGeolocation(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
) {
  const [state, setState] = useState<GeolocationState>({
    isLoading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    coords: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const onSuccess = useCallback(
    ({ coords, timestamp }: GeolocationPosition) => {
      setState({
        isLoading: false,
        timestamp,
        coords: {
          lat: coords.latitude,
          lng: coords.longitude,
        },
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
        error: null,
      });
    },
    [],
  );

  const onError = useCallback((error: GeolocationPositionError) => {
    setState((s) => ({
      ...s,
      isLoading: false,
      error,
    }));
  }, []);

  const getCurrentPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, [onSuccess, onError, options]);

  useEffect(() => {
    const resultHandler = (result: PermissionStatus) => {
      if (result.state === "granted") {
        getCurrentPosition();
      } else {
        setState((s) => ({
          ...s,
          coords: null,
          isLoading: false,
        }));
      }
    };

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        resultHandler(result);

        result.onchange = () => {
          resultHandler(result);
        };
      })
      .catch((error) => {
        console.error("Error querying geolocation permission", error);
      });

    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return {
    ...state,
    getCurrentPosition,
  };
}
