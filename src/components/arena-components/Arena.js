import { useState } from "react";
import Tags from "../Tags";
import PlayButton from "../PlayButton";
import { Routes, Route } from "react-router-dom";
import HorseRace from "./games/HorseRace";
import BlackJack from "./games/BlackJack";

const Arena = () => {

    const [participants, setParticipants] = useState([]);
    const [prizes, setPrizes] = useState([]);
    const [play, setPlay] = useState(false);
    const [winner, setWinner] = useState('');

    const clickPlay = () => {
        setPlay(!play);
    }

    return <div className='text-white w-auto flex flex-col'>
            <Routes>
                <Route
                    path='/horse-race'
                    element={<HorseRace participants={participants} play={play} setPlay={setPlay} setWinner={setWinner}/>} 
                />
                <Route path='/black-jack' element={<BlackJack/>} />
            </Routes>
            <PlayButton play={play} clickPlay={clickPlay}/>
            <div className='flex space-x-12'>
                <Tags 
                    name='Participants'
                    tags={participants}
                    setTags={setParticipants}
                    highlight={winner}
                    highlightColor=' bg-green-500'
                    color=' bg-yellow-400'
                    className={'text-black  hover:bg-red-600 rounded-2xl px-4 py-1 hover:cursor-pointer justify-center flex items-center'}
                />
                <Tags 
                    name='Prizes' 
                    tags={prizes}
                    setTags={setPrizes}
                    className='text-black text-4xl bg-cyan-400 rounded-2xl px-4 py-1 hover:cursor-pointer justify-center flex items-center'
                />
            </div>
    </div>
}

export default Arena;