import { useMemo, useState } from "react";

const DEFAULT_RADIUS_KM = 5;
const RADIUS_OPTIONS = [2, 5, 10, 15];

function buildOverpassQuery(lat, lon, radiusMeters) {
  return `
[out:json];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
  relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
);
out center 40;
`;
}

function normalizeMasjids(elements) {
  return elements
    .map((element) => {
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;
      if (!lat || !lon) return null;
      return {
        id: `${element.type}-${element.id}`,
        name: element.tags?.name || "Masjid",
        lat,
        lon,
        address: element.tags?.["addr:full"] ||
          [
            element.tags?.["addr:housenumber"],
            element.tags?.["addr:street"],
            element.tags?.["addr:city"],
          ]
            .filter(Boolean)
            .join(" "),
      };
    })
    .filter(Boolean);
}

function buildMapUrl(lat, lon, radiusKm) {
  const delta = Math.max(radiusKm / 111, 0.01);
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
}

function NearbyMasjids() {
  const [masjids, setMasjids] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const selectedMasjid = useMemo(
    () => masjids.find((masjid) => masjid.id === selectedId) || masjids[0],
    [masjids, selectedId]
  );

  const handleFindMasjids = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError("");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });

        try {
          const radiusMeters = radiusKm * 1000;
          const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: buildOverpassQuery(latitude, longitude, radiusMeters),
          });

          if (!response.ok) {
            throw new Error("Overpass request failed");
          }

          const data = await response.json();
          const results = normalizeMasjids(data.elements || []);

          if (results.length === 0) {
            setError("No masjids found nearby. Try increasing the radius.");
          }

          setMasjids(results);
          setSelectedId(results[0]?.id || null);
        } catch (err) {
          setError("Could not load nearby masjids. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location permission denied. Please allow location access.");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
            Nearby Masjids
          </p>
          <h3 className="text-2xl md:text-3xl font-semibold text-white">
            Find places of worship near you
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
          >
            {RADIUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} km radius
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleFindMasjids}
            className="rounded-full border border-white/10 bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Searching..." : "Find masjids"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          {masjids.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-200">
              Use your location to discover nearby masjids.
            </div>
          ) : (
            masjids.map((masjid) => (
              <button
                key={masjid.id}
                type="button"
                onClick={() => setSelectedId(masjid.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedMasjid?.id === masjid.id
                    ? "border-amber-300/80 bg-amber-300/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-semibold text-white">
                  {masjid.name}
                </p>
                <p className="text-xs text-slate-300">
                  {masjid.address || "Address unavailable"}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
          {selectedMasjid ? (
            <div className="space-y-3">
              <iframe
                title="Masjid location map"
                className="h-64 w-full rounded-2xl border-0"
                src={buildMapUrl(selectedMasjid.lat, selectedMasjid.lon, radiusKm)}
              />
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>
                  {selectedMasjid.name}
                </span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selectedMasjid.lat}&mlon=${selectedMasjid.lon}#map=16/${selectedMasjid.lat}/${selectedMasjid.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-200 hover:text-amber-100"
                >
                  Open in maps
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-slate-200">
              Map will appear after results load.
            </div>
          )}
        </div>
      </div>

      {userLocation && (
        <p className="mt-4 text-xs text-slate-400">
          Showing results near {userLocation.lat.toFixed(3)}, {userLocation.lon.toFixed(3)}
        </p>
      )}
    </div>
  );
}

export default NearbyMasjids;
