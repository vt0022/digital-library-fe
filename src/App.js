import moment from "moment";
import "moment/locale/vi";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import RootRouters from "./routers/RootRouters";

moment.locale("vi");

moment.updateLocale("vi", {
    week: {
        dow: 1,
    },
});

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
