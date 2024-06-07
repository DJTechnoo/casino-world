import Menu from "./components/Menu";
import Arena from "./components/arena-components/Arena";
import { BrowserRouter, HashRouter } from "react-router-dom";


function App() {

    return (
        <HashRouter basename='/casino-world'>
            <div className='flex'>
                <Menu/>
                <Arena/>
            </div>
        </HashRouter>
    );
}

export default App;
