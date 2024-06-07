import Menu from "./components/Menu";
import Arena from "./components/arena-components/Arena";
import { BrowserRouter, HashRouter } from "react-router-dom";


function App() {

    return (
            <div className='flex'>
                <Menu/>
                <Arena/>
            </div>

    );
}

export default App;
