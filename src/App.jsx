import { useMemo, useState } from "react";
import axios from "axios";
import SearchForm from "./Components/SearchForm";
import PrayerCard from "./Components/PrayerCard";
import Countdown from "./Components/Countdown";
import CalendarTable from "./Components/CalendarTable";
import NearbyMasjids from "./Components/NearbyMasjids";

function App() {
  const [timings, setTimings] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [location, setLocation] = useState(null);
  const [hijriYear, setHijriYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoadingTimings, setIsLoadingTimings] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [error, setError] = useState("");

  const formatDateForApi = (dateValue) => {
    const day = String(dateValue.getDate()).padStart(2, "0");
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const year = dateValue.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const isToday = useMemo(() => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }, [selectedDate]);

  const displayDate = useMemo(
    () =>
      selectedDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [selectedDate]
  );

  const fetchTimings = async (city, country, dateValue = new Date()) => {
    try {
      setIsLoadingTimings(true);
      setError("");
      const res = await axios.get(
        "https://api.aladhan.com/v1/timingsByCity",
        {
          params: { city, country, method: 2, date: formatDateForApi(dateValue) },
        }
      );
      setTimings(res.data.data.timings);
      setLocation({ city, country });
      setHijriYear(res.data.data.date.hijri.year);
      setSelectedDate(dateValue);
      setCalendar([]);
      setIsCalendarOpen(false);
    } catch (error) {
      setError("Could not fetch timings. Please try again.");
    } finally {
      setIsLoadingTimings(false);
    }
  };

  const shiftDay = async (deltaDays) => {
    if (!location) return;
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + deltaDays);
    await fetchTimings(location.city, location.country, nextDate);
  };

  const fetchCalendar = async () => {
    if (!location || !hijriYear) return;
    try {
      setIsLoadingCalendar(true);
      const res = await axios.get(
        "https://api.aladhan.com/v1/hijriCalendarByCity",
        {
          params: {
            city: location.city,
            country: location.country,
            method: 2,
            month: 9,
            year: hijriYear,
          },
        }
      );
      setCalendar(res.data.data);
    } catch (error) {
      setError("Could not load the Ramadan calendar. Please try again.");
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f1a] px-4 py-12 text-white">
      <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-amber-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-112 w-md rounded-full bg-cyan-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/10 blur-[120px]" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
            Ramadan 2026
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold text-white">
            🌙 Ramadan Timings
          </h1>
          <p className="mt-3 text-slate-300">
            Find today's Sehar & Iftar timings instantly
          </p>
        </div>

        <SearchForm onSearch={fetchTimings} isLoading={isLoadingTimings} />

        {error && (
          <div className="w-full max-w-3xl rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        {timings && (
          <div className="w-full">
            <div className="grid gap-6 md:grid-cols-2">
              <PrayerCard
                timings={timings}
                displayDate={displayDate}
                isToday={isToday}
                onPrev={() => shiftDay(-1)}
                onNext={() => shiftDay(1)}
              />
              {isToday ? (
                <Countdown targetTime={timings.Maghrib} />
              ) : (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.85)] text-center text-slate-200">
                  Countdown is available for today only.
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={async () => {
                  const nextOpen = !isCalendarOpen;
                  setIsCalendarOpen(nextOpen);
                  if (nextOpen && calendar.length === 0) {
                    await fetchCalendar();
                  }
                }}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-200 transition hover:border-white/20 hover:bg-white/10"
              >
                {isCalendarOpen ? "Hide Ramadan calendar" : "View full Ramadan calendar"}
              </button>

              {isCalendarOpen && (
                <div className="w-full">
                  {isLoadingCalendar ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-200">
                      Loading Ramadan calendar...
                    </div>
                  ) : (
                    calendar.length > 0 && <CalendarTable calendar={calendar} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full">
          <NearbyMasjids />
        </div>
      </div>
    </div>
  );
}

export default App;