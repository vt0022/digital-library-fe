import { Sidebar } from "flowbite-react";
import { LiaForumbee } from "react-icons/lia";
import { MdInsertChart } from "react-icons/md";
import { RiHomeWifiFill, RiPushpinFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { FaHouseSignal } from "react-icons/fa6";
import { BiSolidNews } from "react-icons/bi";

const CustomSidebar = ({ pinnedSections }) => {
    const location = useLocation();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    return (
        <Sidebar aria-label="Sidebar" className="side-bar w-full h-fit">
            <Sidebar.Items className="h-full px-4 py-12 bg-emerald-50">
                <Sidebar.ItemGroup>
                    <Sidebar.Item as={Link} to="/forum/posts/new" className="rounded-full shadow-lg gap-x-2 py-3 bg-green-400 text-white hover:text-green-400 hover:bg-green-100 mb-8 font-medium text-center">
                        Đăng bài
                    </Sidebar.Item>
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    <Sidebar.Item
                        as={Link}
                        to="/forum"
                        icon={FaHouseSignal}
                        className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/forum" || currentPath === "/forum/home" ? "side-bar-icon--active shadow-lg text-green-500 bg-white hover:bg-white" : "side-bar-icon text-gray-700 hover:bg-neutral-100 active:text-green-400 hover:text-green-400"
                        }`}>
                        Trang chủ
                    </Sidebar.Item>

                    <Sidebar.Item
                        as={Link}
                        to="/forum/posts"
                        icon={BiSolidNews}
                        className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/forum/posts" ? "side-bar-icon--active shadow-lg text-green-500 bg-white hover:bg-white" : "side-bar-icon text-gray-700 hover:bg-neutral-100 active:text-green-400 hover:text-green-400"}`}>
                        Bài đăng
                    </Sidebar.Item>

                    {user && (
                        <Sidebar.Item
                            as={Link}
                            to="/forum/users/my-activity"
                            icon={MdInsertChart}
                            className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/forum/users/my-activity" ? "side-bar-icon--active shadow-lg text-green-500 bg-white hover:bg-white" : "side-bar-icon text-gray-700 hover:bg-neutral-100 active:text-green-400 hover:text-green-400"
                            }`}>
                            Hoạt động
                        </Sidebar.Item>
                    )}
                </Sidebar.ItemGroup>

                {pinnedSections && (
                    <Sidebar.ItemGroup>
                        {pinnedSections.map((section, index) => (
                            <Sidebar.Item
                                as={Link}
                                to={`/forum/sections/${section.slug}`}
                                icon={RiPushpinFill}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${
                                    currentPath === `/forum/sections/${section.slug}` ? "side-bar-icon--active shadow-lg text-green-500 bg-white hover:bg-white" : "side-bar-icon text-gray-700 hover:bg-neutral-100 active:text-green-400 hover:text-green-400"
                                }`}>
                                {section?.subName}
                            </Sidebar.Item>
                        ))}
                    </Sidebar.ItemGroup>
                )}
            </Sidebar.Items>
        </Sidebar>
    );
};
export default CustomSidebar;
