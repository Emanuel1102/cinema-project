import React ,{useState, useEffect} from 'react';

interface CountdownTimerProps{
    targetDate: string;
}

export const  CountdownTimer: React.FC<CountdownTimerProps> = ({targetDate}) => {
    const calculateTimeleft = () =>{
        const difference = +new Date(targetDate) - +new Date();
        if(difference <=0) return null;

        return {
            dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
            horas: Math.floor((difference / (1000 * 60 * 60 )) % 24),
            minutos: Math.floor((difference / 1000 / 60) % 60),
            segundos: Math.floor((difference / 1000) % 60),

        };
    };

    const [timeleft, setTimeleft] = useState(calculateTimeleft());

    useEffect(() =>{
        const timer = setInterval(()=> {
            setTimeleft(calculateTimeleft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeleft){
        return <span className= "text-emerald-500 font-bold">¡Ya en cines!</span>;
    }

    return (
        <div className="flex gap-2 text-xs font-mono bg-slate-800 text-white p-2 rounded justify-center">
            <div><span className="font-bold text-lg">{timeleft.dias}</span>d</div>
            <div><span className="font-bold text-lg">{timeleft.horas}</span>h</div>
            <div><span className="font-bold text-lg">{timeleft.minutos}</span>m</div>
            <div><span className="font-bold text-lg">{timeleft.segundos}</span>s</div>
        </div>
    );
};