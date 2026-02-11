import MenuButton from "./MenuButton";

const Menu = () => {
    return (
        <div className=' border-pink-600 rounded-md w-60 flex flex-col items-center p-6'>
                <MenuButton to='/horse-race'>Horse race</MenuButton>
                <MenuButton to='/wheel-of-fortune'>Wheel of Fortune</MenuButton>
                <MenuButton to='/deathmatch'>Deathmatch</MenuButton>
        </div>
    )
}

export default Menu;