import { Link, useLocation, useNavigate } from "react-router-dom";

import { Avatar, Button, Sidebar } from "flowbite-react";
import { HiBookmark, HiCollection, HiDuplicate, HiHeart } from "react-icons/hi";
import { MdRateReview } from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";

import "./sidebar.css";

const CustomSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    const active = "side-bar-icon--active shadow-lg text-green-500 bg-white hover:bg-white";
    const inactive = "side-bar-icon text-gray-700 hover:bg-neutral-100 active:text-green-400 hover:text-green-400";

    return (
        <Sidebar aria-label="Sidebar" className="side-bar w-full min-h-screen">
            <Sidebar.Items className="bg-emerald-50 h-full p-4 py-12">
                <Avatar alt="User settings" img={user && user.image ? user.image : ""} rounded bordered size="lg" className="mb-2 mt-2" />
                <p className="mb-3 text-base font-medium text-center">
                    {user && user.lastName} {user && user.firstName}
                </p>
                {user ? (
                    <>
                        <Button className="text-white bg-green-400 enabled:hover:bg-green-500 focus:ring-green-200 focus:ring-1 mb-6 m-auto" pill onClick={() => navigate("/documents/upload")}>
                            Tải lên
                        </Button>

                        <Sidebar.ItemGroup>
                            <Sidebar.Item
                                as={Link}
                                to="/me/uploads"
                                icon={HiCollection}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${
                                    currentPath === "/me/uploads" ? active : inactive
                                }`}>
                                Tài liệu của tôi
                            </Sidebar.Item>

                            <Sidebar.Item
                                as={Link}
                                to="/me/likes"
                                icon={HiHeart}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/likes" ? active : inactive}`}>
                                Yêu thích
                            </Sidebar.Item>

                            <Sidebar.Item
                                as={Link}
                                to="/me/saves"
                                icon={HiBookmark}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/saves" ? active : inactive}`}>
                                Đã lưu
                            </Sidebar.Item>

                            <Sidebar.Item
                                as={Link}
                                to="/me/recents"
                                icon={HiDuplicate}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${
                                    currentPath === "/me/recents" ? active : inactive
                                }`}>
                                Gần đây
                            </Sidebar.Item>

                            <Sidebar.Item
                                as={Link}
                                to="/me/collections"
                                icon={TbAppsFilled}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${
                                    currentPath === "/me/collections" ? active : inactive
                                }`}>
                                Bộ sưu tập
                            </Sidebar.Item>

                            <Sidebar.Item
                                as={Link}
                                to="/me/reviews"
                                icon={MdRateReview}
                                className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${
                                    currentPath === "/me/reviews" ? active : inactive
                                }`}>
                                Đánh giá của tôi
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </>
                ) : (
                    <>
                        <p className="mb-6 text-base font-medium text-center">{!user && "Khách"}</p>

                        <Button className="text-white bg-green-400 enabled:hover:bg-green-500 focus:ring-green-200 focus:ring-1 mb-6 m-auto" pill onClick={() => navigate("/login")}>
                            Đăng nhập
                        </Button>
                    </>
                )}
            </Sidebar.Items>
        </Sidebar>
    );
};
export default CustomSidebar;
