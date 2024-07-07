import bg from "@assets/images/main-bg.png";
import PageHead from "@components/shared/head/PageHead";
import CustomFooter from "@components/student/footer/Footer";
import SimpleNavbar from "@components/student/navbar/SimpleNavbar";
import TypeWriter from "components/student/typing/TypeWriter";
import React from "react";
import { FaRobot } from "react-icons/fa6";
import { IoChatbubbles } from "react-icons/io5";
import { PiNotepadFill, PiRobotFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    const [searchQuery, setSearchQuery] = React.useState("");

    return (
        <>
            <PageHead title="Trang chủ - miniverse" description="Trang chủ - miniverse" url={window.location.href} />

            <div style={{ backgroundImage: `url(${bg})` }} className="flex flex-col bg-cover bg-center">
                <div className="sticky top-0 bg-transparent w-full z-40">
                    <SimpleNavbar />
                </div>

                <div className="w-full px-[10%] py-[20vh] bg-transparent">
                    <div className="relative m-auto flex flex-col justify-center items-center mb-20">
                        <div className="text-center typewriter w-fit">
                            <h1 className="mb-4 p-3 text-[2.8rem] font-bold leading-none tracking-tight text-white">
                                Chào mừng đến với <mark className="px-2 text-white bg-green-400 rounded dark:bg-green-400">Miniverse</mark>
                            </h1>
                        </div>

                        <div className="text-center w-fit">
                            <p className="mt-5 text-lg font-normal text-white">Nơi bạn có thể bắt đầu hành trình tìm kiếm kiến thức</p>
                        </div>

                        <div className="w-1/2 mt-10">
                            <div className="relative rounded-full">
                                <input
                                    type="text"
                                    id="home-search"
                                    className="text-lg block w-full p-4 ps-5 text-gray-900 border border-gray-300 bg-white focus:ring-green-400 focus:border-green-400 rounded-full shadow-lg"
                                    placeholder="Tìm kiếm"
                                    required
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") navigate(`/search/${searchQuery}`);
                                    }}
                                />

                                <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer" onClick={() => navigate(`/search/${searchQuery}`)}>
                                    <svg className="w-6 h-6 text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-10 px-[20%]">
                        <div className="flex items-start space-x-2">
                            <FaRobot className="text-5xl p-2 bg-white text-sky-600 rounded-full" />

                            <div className="w-fit bg-white p-3 rounded-r-3xl rounded-bl-3xl shadow-lg flex space-x-2 items-center" style={{ maxWidth: 60 + "%" }}>
                                <PiNotepadFill className="text-5xl text-sky-500 shrink-0" />
                                <TypeWriter id="bot1" text="Kho tài liệu phong phú từ nhiều trường thành viên" />
                            </div>
                        </div>

                        <div className="flex items-start space-x-2">
                            <div className="w-fit bg-white p-3 rounded-l-3xl rounded-br-3xl shadow-lg flex space-x-2 items-center ml-auto" style={{ maxWidth: 60 + "%" }}>
                                <IoChatbubbles className="text-5xl text-rose-500 shrink-0" />
                                <TypeWriter id="bot2" text="Tham gia diễn đàn hỏi đáp và chia sẻ" />
                            </div>

                            <PiRobotFill className="text-5xl p-2 bg-white text-rose-600 rounded-full" />
                        </div>
                    </div>
                </div>

                <div>
                    <CustomFooter />
                </div>
            </div>
        </>
    );
};

export default Home;

