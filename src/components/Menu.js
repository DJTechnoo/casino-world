import MenuButton from "./MenuButton";

const Menu = () => {
    return (
        <div className=' border-pink-600 rounded-md w-60 flex flex-col items-center p-6'>
                <MenuButton to='/poker'>Poker</MenuButton>
                <MenuButton to='/horse-race'>Horse race</MenuButton>
                <MenuButton to='/black-jack'>Black Jack</MenuButton>
        </div>
    )
}

export default Menu;