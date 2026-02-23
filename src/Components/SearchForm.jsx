import { useState } from "react";

function SearchForm({ onSearch, isLoading }) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city || !country) return;
    onSearch(city, country);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] w-full max-w-3xl grid grid-cols-1 md:grid-cols-7 gap-4"
    >
      <input
        type="text"
        placeholder="City"
        className="md:col-span-3 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300/80"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="text"
        placeholder="Country"
        className="md:col-span-3 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300/80"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <button
        type="submit"
        className="md:col-span-1 px-6 py-3 bg-amber-300 text-slate-900 font-semibold rounded-xl hover:bg-amber-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchForm;