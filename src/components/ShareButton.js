const ShareButton = props => {
    return <div className='bg-pink-600 w-16 h-8 hover:cursor-pointer justify-center flex items-center rounded-lg' onClick={props.click}>
        {props.name}
    </div>
}

export default ShareButton;