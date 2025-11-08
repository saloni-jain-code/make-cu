'use client';
import { useEffect, useState } from 'react';

export default function Countdown() {
  const target = new Date(2025, 10, 9, 12, 0).getTime(); // Hackathon start

  const [timeLeft, setTimeLeft] = useState(getTimeDiff());

  function getTimeDiff() {
    const now = new Date().getTime();
    const diff = target - now;

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeDiff());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="text-white px-4 sm:px-6 pb-6 text-center">
      <h3 className="text-1xl sm:text-2xl md:text-3xl font-mono font-bold mb-6 sm:mb-8">
        Hacking Deadline
      </h3>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-10">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds },
        ].map((unit, idx) => (
          <div
            key={idx}
            className="w-20 sm:w-24 md:w-28 h-24 sm:h-28 md:h-32 rounded-xl flex flex-col items-center justify-center shadow backdrop-blur-sm"
          >
            <div className="text-5xl sm:text-6xl font-sans font-bold glow-text">{unit.value}</div>
            <div className="text-sm sm:text-base mt-1 font-sans uppercase tracking-wide">{unit.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
