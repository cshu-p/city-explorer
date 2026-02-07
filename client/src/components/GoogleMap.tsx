import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

type Props = { query: string };

let configured = false;
let mapsLoaded: Promise<void> | null = null;

function ensureMapsLoaded() {
  if (!configured) {
    setOptions({
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      v: "weekly",
    });
    configured = true;
  }

  if (!mapsLoaded) {
    mapsLoaded = (async () => {
      await importLibrary("maps");
    })();
  }

  return mapsLoaded;
}

export default function GoogleMap({ query }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await ensureMapsLoaded();
      if (cancelled || !divRef.current) return;

      const center = { lat: 39.8283, lng: -98.5795 };

      mapRef.current = new google.maps.Map(divRef.current, {
        center,
        zoom: 4,
      });

      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: center,
      });

      geocoderRef.current = new google.maps.Geocoder();
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    const geocoder = geocoderRef.current;

    const q = query?.trim();
    if (!map || !marker || !geocoder || !q) return;

    geocoder.geocode({ address: q }, (results, status) => {
      if (status !== "OK" || !results?.[0]) {
        console.warn("Geocode failed:", status, q);
        return;
      }

      const loc = results[0].geometry.location;
      const pos = { lat: loc.lat(), lng: loc.lng() };

      map.setCenter(pos);
      map.setZoom(11);
      marker.setPosition(pos);
    });
  }, [query]);

  return <div ref={divRef} style={{ width: "100%", height: 360, borderRadius: 12 }} />;
}