import React from "react";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import RootRouters from "./routers/RootRouters";

function App() {
    return (
        <BrowserRouter>
            {/* <div className="App"> */}
            <ScrollToTop />
            <RootRouters />
            {/* </div> */}
        </BrowserRouter>
    );
}

export default App;
