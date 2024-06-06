

import {useState, memo } from 'react';

const Tags = (props) => {
    const [tag, setTag] = useState('');
    const onChangeHandler = e => {
        setTag(e.target.value);
    }

    const addTag = tag => {
        props.setTags([...props.tags, tag])
    }
    
    const onKeyDownHandler = e => {
        if (e.key == 'Enter') {
            addTag(tag);
            setTag('');
        }
    }

    const definedColor = (col) => {
        if (col) {
            return col;
        } 
        return ''
    }

    const removeTag = (index) => {
        props.setTags(props.tags.filter((_, i) => i !== index))
    } 
    debugger;
    // TODO:
    // Put this in a new component to share between Tags and TagsLocal
    // OR: test this component with memo on prizes and participants together like before
    return <div>
        <h1 className='text-white'>{props.name}</h1>
        <input className='text-black' value={tag} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
        {props.tags.length?
        (<div className=' mt-2 flex flex-wrap items-center p-3 space-x-1 space-y-1 bg-zinc-800 rounded-lg w-96' >
            {props.tags.map((tag, i) => {
                return <h1 onClick={() => {removeTag(i)}} className={props.className + (props.highlight == tag? definedColor(props.highlightColor): definedColor(props.color))}>{tag}</h1>
            })}
        </div>) : null}

    </div>
}

//export default Tags;
export default memo(Tags)