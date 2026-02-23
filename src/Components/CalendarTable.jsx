function CalendarTable({ calendar }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-200/80">
            Full Ramadan Calendar
          </p>
          <h3 className="text-2xl md:text-3xl font-semibold text-white">
            Sehri and Iftar schedule
          </h3>
        </div>
        <p className="text-sm text-slate-300">
          Times are shown in your selected city
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-amber-100/80">
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 font-medium">Day</th>
              <th className="py-3 pr-4 font-medium">Gregorian</th>
              <th className="py-3 pr-4 font-medium">Hijri</th>
              <th className="py-3 pr-4 font-medium">Sehar (Fajr)</th>
              <th className="py-3 font-medium">Iftar (Maghrib)</th>
            </tr>
          </thead>
          <tbody className="text-slate-100">
            {calendar.map((entry, index) => (
              <tr
                key={`${entry.date.gregorian.date}-${index}`}
                className="border-b border-white/5 last:border-none"
              >
                <td className="py-3 pr-4 text-amber-200/90 font-semibold">
                  {index + 1}
                </td>
                <td className="py-3 pr-4 text-slate-200">
                  {entry.date.gregorian.date}
                </td>
                <td className="py-3 pr-4 text-slate-300">
                  {entry.date.hijri.date}
                </td>
                <td className="py-3 pr-4 text-amber-200">
                  {entry.timings.Fajr}
                </td>
                <td className="py-3 text-amber-200">
                  {entry.timings.Maghrib}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CalendarTable;
