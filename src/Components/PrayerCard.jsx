function PrayerCard({ timings }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)] text-white text-center">

      <h2 className="text-2xl font-semibold mb-6 tracking-wide">
        🕌 Today's Timings
      </h2>

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