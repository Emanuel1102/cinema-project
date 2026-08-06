import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeleft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return null;

    return {
      dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
      horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((difference / 1000 / 60) % 60),
      segundos: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeleft, setTimeleft] = useState(calculateTimeleft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeleft(calculateTimeleft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeleft) {
    return <span className="text-emerald-400 font-bold text-xs">¡Ya en cines!</span>;
  }

  return (
    <div className="bg-purple-950/80 backdrop-blur-md text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shadow-lg inline-flex items-center gap-1.5">
      <span>{timeleft.dias}d</span>
      <span>•</span>
      <span>{timeleft.horas.toString().padStart(2, '0')}h</span>
      <span>•</span>
      <span>{timeleft.minutos.toString().padStart(2, '0')}m</span>
      <span>•</span>
      <span>{timeleft.segundos.toString().padStart(2, '0')}s</span>
    </div>
  );
};