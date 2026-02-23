function PrayerCard({ timings, displayDate, isToday, onPrev, onNext }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)] text-white text-center">

      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onPrev}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-lg text-amber-200 transition hover:bg-white/10"
          aria-label="Show yesterday timings"
        >
          ←
        </button>
        <div>
          <h2 className="text-2xl font-semibold tracking-wide">
            🕌 {isToday ? "Today's Timings" : "Daily Timings"}
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            {displayDate}
          </p>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-lg text-amber-200 transition hover:bg-white/10"
          aria-label="Show tomorrow timings"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 text-lg">
        <div className="rounded-2xl bg-white/5 border border-white/10 py-4">
          <p className="text-gray-300">🌅 Sehar</p>
          <p className="text-2xl font-bold text-amber-300">
            {timings.Fajr}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 py-4">
          <p className="text-gray-300">🌇 Iftar</p>
          <p className="text-2xl font-bold text-amber-300">
            {timings.Maghrib}
          </p>
        </div>
      </div>

    </div>
  );
}

export default PrayerCard;