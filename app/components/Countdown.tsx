'use client';
import { useEffect, useState } from 'react';

export default function Countdown() {
  const target = new Date(2025, 10, 8, 9, 0).getTime(); // Hackathon start

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
    <section className="text-white px-6 pb-5 text-center">
      <div className="flex justify-center gap-4 sm:gap-20">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds },
        ].map((unit, idx) => (
          <div
            key={idx}
            className="w-20 sm:w-24 h-24 sm:h-28 text-white rounded-lg flex flex-col items-center justify-center shadow"
          >
            <div className="text-5xl sm:text-6xl font-orbitron font-bold glow-text">{unit.value}</div>
            <div className="text-sm sm:text-base mt-1 uppercase tracking-wide">{unit.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
