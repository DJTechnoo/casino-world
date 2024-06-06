import Menu from "./components/Menu";
import Arena from "./components/arena-components/Arena";
import { BrowserRouter } from "react-router-dom";


function App() {

    return (
        <BrowserRouter basename='/casino-world'>
            <div className='flex'>
                <Menu/>
                <Arena/>
                
            </div>
        </BrowserRouter>
    );
}

export default App;
