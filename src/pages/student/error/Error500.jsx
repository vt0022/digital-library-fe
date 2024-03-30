import React from "react";
import { useNavigate } from "react-router-dom";

import CustomNavbar from "../../../components/student/navbar/Navbar";

import icon500 from "../../../assets/images/500.svg";

const Error500 = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col h-screen">
            <div className="sticky top-0 bg-white w-full z-40  border-b">
                <CustomNavbar />
            </div>

            <div className="w-full h-full flex flex-grow items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0 bg-[#f7fafc]">
                <div className="w-2/5 h-2/3  flex flex-col items-center justify-center text-center">
                    <p className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider">500</p>
                    <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mt-2">Server Error</p>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">Whoops, something went wrong on our servers.</p>

                    <button
                        className="px-4 rounded-full shadow-lg inline py-3 text-sm font-medium leading-5 shadow text-green-400 transition-colors duration-150 border border-transparent focus:outline-none focus:shadow-outline-green bg-white active:bg-green-500 hover:bg-green-400 hover:text-white"
                        onClick={() => navigate("/home")}>
                        Quay về trang chủ
                    </button>
                </div>
                <div className="w-2/5 h-fit flex justify-center p-4">
                    <img src={icon500} alt="500" />
                </div>
            </div>
        </div>
    );
};

export default Error500;
