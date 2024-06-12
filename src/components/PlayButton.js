const PlayButton = ({clickPlay, play}) => {
    return <div className='bg-pink-600 w-16 h-8 hover:cursor-pointer justify-center flex items-center rounded-lg' onClick={clickPlay}>
        {play? 'RESET' : 'PLAY'}
    </div>
}

export default PlayButton;