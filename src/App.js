import React from "react";
import { BrowserRouter} from "react-router-dom";
import RootRouters from "./routers/RootRouters"

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <RootRouters />
            </div>
        </BrowserRouter>
    );
}

export default App;
