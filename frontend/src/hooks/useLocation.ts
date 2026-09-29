"use client";

import { useState, useCallback } from "react";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError("Unable to retrieve your location. Please enter manually.");
        setIsLoading(false);
      }
    );
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number, city?: string) => {
    setLocation({ latitude: lat, longitude: lng, city });
  }, []);

  return { location, isLoading, error, getCurrentLocation, setManualLocation };
}
