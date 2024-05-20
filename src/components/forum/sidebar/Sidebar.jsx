import { Sidebar } from "flowbite-react";
import { LiaForumbee } from "react-icons/lia";
import { MdInsertChart } from "react-icons/md";
import { RiHomeWifiFill, RiPushpinFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const CustomSidebar = ({ pinnedSections }) => {
    const location = useLocation();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    return (
        <Sidebar aria-label="Sidebar" className="side-bar w-full bg-white">
            <Sidebar.Items className="bg-white h-full px-8 py-12">
                <Sidebar.ItemGroup>
                    <Sidebar.Item as={Link} to="/forum/posts/new" className="gap-x-2 py-3 bg-green-400 text-white hover:text-green-400 hover:bg-green-100 mb-10 font-medium text-center">
                        Tạo bài đăng mới
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to="/forum" icon={RiHomeWifiFill} className={`gap-x-2 py-3 active:text-green-400 hover:text-green-400 ${currentPath === "/forum" || currentPath === "/forum/home" ? "text-green-400 bg-green-100" : ""}`}>
                        Trang chủ
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to="/forum/posts" icon={LiaForumbee} className={`gap-x-2 py-3 active:text-green-400 hover:text-green-400 ${currentPath === "/forum/posts" ? "text-green-400 bg-green-100" : ""}`}>
                        Tất cả bài đăng
                    </Sidebar.Item>

                    {user && (
                        <Sidebar.Item as={Link} to="/forum/users/my-activity" icon={MdInsertChart} className={`gap-x-2 py-3 active:text-green-400 hover:text-green-400 ${currentPath === "/forum/users/my-activity" ? "text-green-400 bg-green-100" : ""}`}>
                            Hoạt động của tôi
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
                                className={`gap-x-2 py-3 active:bg-teal-300 active:text-white hover:text-green-400 hover:bg-teal-100 ${currentPath === `/forum/sections/${section.slug}` ? "text-teal-400 bg-teal-100" : ""}`}>
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
