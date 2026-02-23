import { useEffect, useState } from "react";

function Countdown({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date();
      const timeOnly = (targetTime || "").split(" ")[0];
      const [hours, minutes] = timeOnly.split(":");
      target.setHours(hours, minutes, 0);

      const diff = target - now;

      if (diff > 0) {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft("Iftar Time 🎉");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.85)] text-white text-center">
      <h3 className="text-xl mb-2 text-gray-300 tracking-wide">
        ⏳ Countdown to Iftar
      </h3>
      <p className="text-3xl font-bold text-amber-300">
        {timeLeft}
      </p>
    </div>
  );
}

export default Countdown;