import moment from "moment";
import "moment/locale/vi";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import RootRouters from "./routers/RootRouters";
import { initFlowbite } from "flowbite";

moment.locale("vi");

moment.updateLocale("vi", {
    week: {
        dow: 1,
    },
});

initFlowbite();

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <RootRouters />
        </BrowserRouter>
    );
}

export default App;
