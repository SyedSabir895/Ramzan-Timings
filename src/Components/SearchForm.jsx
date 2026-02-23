import { useEffect, useRef, useState } from "react";

function SearchForm({ onSearch, isLoading }) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (!city.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const query = encodeURIComponent(city.trim());
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=10`,
          { headers: { Accept: "application/json" } }
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        const processed = data
          .map((result) => {
            const address = result.address || {};
            const cityName =
              address.city ||
              address.town ||
              address.village ||
              result.name ||
              "";
            const countryName = address.country || "";

            return cityName && countryName ? { cityName, countryName } : null;
          })
          .filter(Boolean);

        const unique = Array.from(
          new Map(
            processed.map((item) => [
              `${item.cityName}-${item.countryName}`,
              item,
            ])
          ).values()
        );

        setSuggestions(unique);
        setShowSuggestions(unique.length > 0);
      } catch (error) {
        console.error("Suggestion fetch failed:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [city]);

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion.cityName);
    setCountry(suggestion.countryName);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim() || !country.trim()) return;
    onSearch(city.trim(), country.trim());
    setShowSuggestions(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] w-full max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="md:col-span-3 relative">
          <input
            type="text"
            placeholder="City"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300/80"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => city.trim() && suggestions.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
              {loadingSuggestions ? (
                <div className="px-4 py-3 text-sm text-slate-300">
                  Loading...
                </div>
              ) : (
                suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-100 hover:bg-amber-300/10 border-b border-white/5 last:border-b-0 transition"
                  >
                    <p className="font-semibold">{suggestion.cityName}</p>
                    <p className="text-xs text-slate-400">
                      {suggestion.countryName}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Country"
          className="md:col-span-3 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300/80"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          readOnly={city.trim() && suggestions.length > 0}
        />

        <button
          type="submit"
          className="md:col-span-1 px-6 py-3 bg-amber-300 text-slate-900 font-semibold rounded-xl hover:bg-amber-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;