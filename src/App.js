import Menu from "./components/Menu";
import Arena from "./components/arena-components/Arena";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Poker from "./components/arena-components/games/Poker";
import BlackJack from "./components/arena-components/games/BlackJack";
import Tags from "./components/Tags";
import TagsLocal from "./components/TagsLocal";
import {useState} from 'react';
import PlayButton from "./components/PlayButton";

function App() {

    return (
        <BrowserRouter>
            <div className='flex'>
                <Menu/>
                <Arena/>
                
            </div>
        </BrowserRouter>
    );
}

export default App;
