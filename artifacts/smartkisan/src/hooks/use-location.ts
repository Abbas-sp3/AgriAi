import { useState, useEffect } from "react";

export interface LocationData {
  lat?: number;
  lon?: number;
  cityName?: string;
  error?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ error: "Geolocation is not supported by your browser" });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        let cityName: string | undefined;

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (resp.ok) {
            const geo = await resp.json();
            const addr = geo.address;
            cityName =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              addr.state_district ||
              addr.state;
          }
        } catch {
          // ignore reverse-geocoding errors, just show coordinates
        }

        setLocation({ lat, lon, cityName });
        setIsLoading(false);
      },
      (error) => {
        setLocation({ error: error.message });
        setIsLoading(false);
      }
    );
  }, []);

  return { location, isLoading };
}
