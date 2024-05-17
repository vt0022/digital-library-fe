import moment from "moment";
import "moment/dist/locale/vi";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import RootRouters from "./routers/RootRouters";

moment.locale("vi");

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
