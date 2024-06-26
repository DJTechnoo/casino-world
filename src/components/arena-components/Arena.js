import { useEffect, useState } from "react";
import Tags from "../Tags";
import PlayButton from "../PlayButton";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HorseRace from "./games/HorseRace";
import BlackJack from "./games/BlackJack";
import ShareButton from "../ShareButton";

const Arena = () => {

    const [participants, setParticipants] = useState([]);
    const [prizes, setPrizes] = useState([]);
    const [play, setPlay] = useState(false);
    const [winner, setWinner] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    const clickPlay = () => {
        setPlay(!play);
    }
    
    const updateURL = () => {
        const encodedParticipantsArray = encodeURIComponent(JSON.stringify(participants)),
        encodedPrizesArray = encodeURIComponent(JSON.stringify(prizes));
        navigate(`/?participants=${encodedParticipantsArray}&prizes=${encodedPrizesArray}`);
    }
    
    // If get the params in the url for participants and prizes
    // then update both states. Yields a dependency warning, but can be safely ignored.
    useEffect(() => {
        const params = new URLSearchParams(location.search),
            participantsParam = params.get('participants'),
            prizesParam = params.get('prizes'),
            participantsArray = participantsParam ? JSON.parse(decodeURIComponent(participantsParam)) : [],
            prizesArray = prizesParam ? JSON.parse(decodeURIComponent(prizesParam)) : [];
        setParticipants(participantsArray);
        setPrizes(prizesArray);
    }, [])

    return <div className='text-white w-auto flex flex-col'>
            <div className='flex flex-row'>
                <Routes>
                    <Route
                        path='/horse-race'
                        element={<HorseRace
                            participants={participants}
                            play={play} setPlay={setPlay} 
                            setWinner={setWinner}
                        />}
                    />
                    <Route path='/black-jack' element={<BlackJack/>} />
                </Routes>
            </div>
            <div className='flex space-x-3'>
                <PlayButton play={play} clickPlay={clickPlay}/>
                <ShareButton name='Share' click={updateURL}/>
            </div>
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