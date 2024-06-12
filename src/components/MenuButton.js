import { Link } from "react-router-dom";

const MenuButton = (props) => {
    return <Link to={props.to} className='text-white border border-pink-600 text-lg p-6 w-full justify-center flex items-center rounded-3xl m-1 hover:cursor-pointer hover:bg-pink-400'>
        {props.children}
    </Link>
}

export default MenuButton;