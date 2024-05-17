import CustomFooter from "../../../components/student/footer/Footer";
import ForumRouters from "../../../routers/ForumRouters";
import Sidebar from "../../../components/forum/sidebar/Sidebar";
import TopBar from "../../../components/forum/topbar/TopBar";

const Forum = () => {
    return (
        <div className="bg-gray-50">
            <div className="border-b border-gray-300">
                <TopBar />
            </div>

            <div className="flex">
                <div className="w-1/5 border-r border-gray-300">
                    <Sidebar />
                </div>

                <div className="w-4/5">
                    <ForumRouters />
                </div>
            </div>

            <CustomFooter />
        </div>
    );
};

export default Forum;
