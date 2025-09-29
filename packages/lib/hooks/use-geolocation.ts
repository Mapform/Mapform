import { useEffect, useRef, useState } from "react";

export interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface UseGeolocationOptions {
  highAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
  watch?: boolean;
}

export interface UseGeolocationResult {
  coords: GeolocationCoords | null;
  permissionGranted: boolean;
  isSupported: boolean;
  getCurrentPosition: () => void;
}

/**
 * useGeolocation
 * A resilient, browser-friendly hook for retrieving user location with optional watch fallback.
 */
export function useGeolocation(
  options: UseGeolocationOptions = {},
): UseGeolocationResult {
  const {
    highAccuracy = true,
    timeoutMs = 8000,
    maximumAgeMs = 0,
    watch = true,
  } = options;

  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const isSupported =
    typeof window !== "undefined" && "geolocation" in navigator;
  const watchIdRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const hasRequestedCurrentOnceRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (watchIdRef.current !== null && isSupported) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isSupported]);

  // Track permission state when available
  useEffect(() => {
    if (!isSupported) {
      setPermissionGranted(false);
      return;
    }

    let permissionStatus: PermissionStatus | null = null;
    const handleChange = () => {
      if (!permissionStatus) return;
      setPermissionGranted(permissionStatus.state === "granted");
    };

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((status) => {
        if (!isMountedRef.current) return;
        permissionStatus = status;
        setPermissionGranted(status.state === "granted");
        status.addEventListener("change", handleChange);
      })
      .catch(() => {
        if (!isMountedRef.current) return;
        // If Permissions API fails, we can't know upfront. Keep false until success.
        setPermissionGranted(false);
      });

    return () => {
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handleChange);
      }
    };
  }, [isSupported]);

  // If permission becomes granted but we still don't have coords, proactively fetch once
  useEffect(() => {
    if (!isSupported) return;
    if (permissionGranted && !coords && !hasRequestedCurrentOnceRef.current) {
      hasRequestedCurrentOnceRef.current = true;
      // Triggers a one-time retrieval; falls back to a short watch on platforms like iOS Safari
      getCurrentPosition();
    }
  }, [isSupported, permissionGranted, coords]);

  const positionOptions: PositionOptions = {
    enableHighAccuracy: highAccuracy,
    timeout: timeoutMs,
    maximumAge: maximumAgeMs,
  };

  const applyPosition = (pos: GeolocationPosition) => {
    if (!isMountedRef.current) return;
    setCoords({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy:
        typeof pos.coords.accuracy === "number"
          ? pos.coords.accuracy
          : undefined,
    });
  };

  const startWatchFallback = () => {
    if (!isSupported) return;
    // Use a short watch and clear after the first fix
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        applyPosition(pos);
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      },
      () => {
        if (!isMountedRef.current) return;
        setCoords(null);
      },
      positionOptions,
    );
  };

  const getCurrentPosition = () => {
    if (!isSupported) return;
    navigator.geolocation.getCurrentPosition(
      applyPosition,
      () => {
        // Fallback for some browsers (e.g., iOS Safari)
        startWatchFallback();
      },
      positionOptions,
    );
  };

  // Optional continuous watch
  useEffect(() => {
    if (!isSupported || !watch) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      () => {
        if (!isMountedRef.current) return;
        setCoords(null);
      },
      positionOptions,
    );
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [
    isSupported,
    watch,
    positionOptions.enableHighAccuracy,
    positionOptions.timeout,
    positionOptions.maximumAge,
  ]);

  return {
    coords,
    permissionGranted,
    isSupported,
    getCurrentPosition,
  };
}

export default useGeolocation;
