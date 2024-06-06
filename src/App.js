import Menu from "./components/Menu";
import Arena from "./components/arena-components/Arena";
import { BrowserRouter } from "react-router-dom";


function App() {

    return (
        <BrowserRouter>
            <div className='flex'>
                <Menu/>
                <Arena/>
                
            </div>
        </BrowserRouter>
    );
}

export default App;
