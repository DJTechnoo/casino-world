import Menu from "./components/Menu";
import Arena from "./components/arena-components/Arena";
import { HashRouter } from "react-router-dom";


function App() {

    return (
        <HashRouter>
            <div className='flex mt-4'>
                <Menu/>
                <Arena/>
            </div>
        </HashRouter>
    );
}

export default App;
