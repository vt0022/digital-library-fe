import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Sidebar } from "flowbite-react";
import { FaShareNodes } from "react-icons/fa6";
import { HiChat, HiChatAlt2 } from "react-icons/hi";
import { RiQuestionFill } from "react-icons/ri";
import { SiHomeadvisor } from "react-icons/si";
import "./sidebar.css";

const CustomSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    return (
        <Sidebar aria-label="Sidebar" className="side-bar w-full bg-white">
            <Sidebar.Items className="bg-white h-full px-10 py-12">
                <Sidebar.ItemGroup>
                    <Sidebar.Item as={Link} to="/forum/posts/new" className="gap-x-2 py-3 bg-green-400 text-white hover:text-green-400 hover:bg-green-100 mb-10 font-medium text-center">
                        Tạo bài đăng mới
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to="/forum" icon={HiChatAlt2} className={`gap-x-2 py-3 active:text-green-400 hover:text-green-400 ${currentPath === "/me/uploads" ? "text-green-400 bg-green-100" : ""}`}>
                        Tất cả bài đăng
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to="/forum" icon={SiHomeadvisor} className={`gap-x-2 py-3 active:text-green-400 hover:text-green-400 ${currentPath === "/me/uploads" ? "text-green-400 bg-green-100" : ""}`}>
                        Trang chủ
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to="/me/uploads" icon={HiChat} className={`mb-10 gap-x-2 py-3 active:text-green-400 hover:text-green-400 ${currentPath === "/me/uploads" ? "text-green-400 bg-green-100" : ""}`}>
                        Bài đăng của tôi
                    </Sidebar.Item>
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    <Sidebar.Item as={Link} to="/me/recents" icon={RiQuestionFill} className={`mt-5 gap-x-2 py-3 active:bg-green-300 active:text-white hover:text-green-400 hover:bg-green-100 ${currentPath === "/me/recents" ? "text-green-400 bg-green-100" : ""}`}>
                        Thắc mắc
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to="/me/recents" icon={FaShareNodes} className={`gap-x-2 py-3 active:bg-green-300 active:text-white hover:text-green-400 hover:bg-green-100 ${currentPath === "/me/recents" ? "text-green-400 bg-green-100" : ""}`}>
                        Chia sẻ
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};
export default CustomSidebar;
