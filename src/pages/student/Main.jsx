import React from "react";
import CustomNavbar from "@components/student/navbar/Navbar";
import CustomSidebar from "@components/student/sidebar/Sidebar";
import UserRoute from "@routers/UserRouters";
import CustomFooter from "@components/student/footer/Footer";

const Main = () => {
    return (
        <div className="relative bg-emerald-50">
            <div className="sticky top-0 bg-white w-full z-40 shadow-lg">
                <CustomNavbar />
            </div>

            <div className="h-full flex">
                <div className="w-[18%] h-full">
                    <CustomSidebar />
                </div>

                <div className="w-[82%] min-h-screen">
                    <UserRoute />
                </div>
            </div>

            <div>
                <CustomFooter />
            </div>
        </div>
    );
};

export default Main;
