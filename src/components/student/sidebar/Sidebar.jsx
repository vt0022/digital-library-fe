import { Link, useLocation, useNavigate } from "react-router-dom";

import { Avatar, Button, Sidebar } from "flowbite-react";
import { HiBookmark, HiCollection, HiDuplicate, HiHeart } from "react-icons/hi";
import { MdRateReview } from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { PiListHeartFill } from "react-icons/pi";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import "./sidebar.css";
import { PiListPlusFill } from "react-icons/pi";
import { RiBookmark3Fill } from "react-icons/ri";
import { BiSolidBookHeart } from "react-icons/bi";

const CustomSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    const active = "side-bar-icon--active shadow-lg text-green-500 bg-white hover:bg-white";
    const inactive = "side-bar-icon text-gray-700 hover:bg-neutral-100 active:text-green-400 hover:text-green-400";

    return (
        <Sidebar aria-label="Sidebar" className="side-bar w-full min-h-screen">
            <Sidebar.Items className="bg-emerald-50 h-full p-4">
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
                            <p className="px-4 font-medium">Tài liệu</p>

                            <Sidebar.Item as={Link} to="/me/my-shared-documents" icon={HiCollection} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-shared-documents" ? active : inactive}`}>
                                Đã chia sẻ
                            </Sidebar.Item>

                            <Sidebar.Item as={Link} to="/me/my-liked-documents" icon={BiSolidBookHeart} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-liked-documents" ? active : inactive}`}>
                                Yêu thích
                            </Sidebar.Item>

                            <Sidebar.Item as={Link} to="/me/my-saved-documents" icon={RiBookmark3Fill} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-saved-documents" ? active : inactive}`}>
                                Đã lưu
                            </Sidebar.Item>

                            <Sidebar.Item as={Link} to="/me/my-reading" icon={HiDuplicate} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-reading" ? active : inactive}`}>
                                Gần đây
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>

                        <Sidebar.ItemGroup>
                            <p className="px-4 font-medium">Bộ sưu tập</p>

                            <Sidebar.Item as={Link} to="/me/my-created-collections" icon={PiListPlusFill} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-created-collections" ? active : inactive}`}>
                                Đã tạo
                            </Sidebar.Item>

                            <Sidebar.Item as={Link} to="/me/my-liked-collections" icon={PiListHeartFill} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-liked-collections" ? active : inactive}`}>
                                Yêu thích
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>

                        <Sidebar.ItemGroup>
                            <p className="px-4 font-medium">Đánh giá</p>

                            <Sidebar.Item as={Link} to="/me/my-reviews" icon={MdRateReview} className={`rounded-full gap-x-2 px-4 py-2 text-sm font-medium ${currentPath === "/me/my-reviews" ? active : inactive}`}>
                                Đã gửi
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
