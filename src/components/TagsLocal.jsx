import {useState} from 'react';

const TagsLocal = (props) => {
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]);
    const onChangeHandler = e => {
        setTag(e.target.value);
    }

    const addTag = tag => {
        setTags([...tags, tag])
    }
    
    const onKeyDownHandler = e => {
        if (e.key == 'Enter') {
            addTag(tag);
            setTag('');
        }
    }

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index))
    } 

    return <div>
        <h1 className='text-white'>{props.name}</h1>
        <input value={tag} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
        {tags.length?
        (<div className=' mt-2 flex flex-wrap items-center p-3 space-x-1 space-y-1 border-pink-600 border w-96'>
            {tags.map((tag, i) => {
                return <h1 onClick={() => {removeTag(i)}} className='text-black bg-orange-400 rounded-2xl px-4 py-1 hover:cursor-pointer'>{tag}</h1>
            })}
        </div>) : null}

    </div>
}

export default TagsLocal;