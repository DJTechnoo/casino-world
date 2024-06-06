const PlayButton = ({clickPlay, play}) => {
    
    return <div className='bg-pink-600 w-12' onClick={clickPlay}>
        {play? 'RESET' : 'PLAY'}
    </div>
}

export default PlayButton