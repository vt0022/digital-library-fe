import logo from "@assets/images/logo.png";
import NotificationPanel from "@components/forum/notification/NotificationPanel";
import { countMyNotifications } from "api/main/notificationAPI";
import { initFlowbite } from "flowbite";
import { Avatar, Button, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TopBar = () => {
    initFlowbite();

    const navigate = useNavigate();

    const location = useLocation();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    const [query, setQuery] = useState("");

    return (
        <>
            <Navbar fluid rounded className="w-full">
                <div className="ml-10">
                    <Navbar.Brand as={Link} to="/home" className="hover:text-black">
                        <img src={logo} className="mr-3 h-16 sm:h-16" alt="WISDO Logo" />
                    </Navbar.Brand>
                </div>

                <div className="w-1/3">
                    <div className="relative rounded-full">
                        <input
                            type="text"
                            id="list-search"
                            className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-full"
                            placeholder="Tìm kiếm"
                            required
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    navigate("/forum?query=" + query);
                                }
                            }}
                        />

                        <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-full">
                            <svg className="w-4 h-4 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-x-10 w-1/3 justify-end">
                    <div className="flex md:order-2 mr-10">
                        {user && (
                            <Tooltip content="Tài khoản" placement="bottom" style="light">
                                <Dropdown arrowIcon={false} inline label={<Avatar alt={user.lastName} img={user.image} rounded size="md" />}>
                                    <Dropdown.Header>
                                        <span className="block text-lg font-normal text-green-400 mb-3">
                                            {user.lastName} {user.firstName}
                                        </span>
                                        <span className="block truncate text-sm font-medium">@{user.email}</span>
                                    </Dropdown.Header>
                                    <Dropdown.Item as={Link} to="/me">
                                        Trang cá nhân
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/login">
                                        Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown>
                            </Tooltip>
                        )}

                        {!user && (
                            <Button className="text-white bg-green-400 enabled:hover:bg-green-500 focus:ring-green-200 focus:ring-1" pill onClick={() => navigate("/login")}>
                                Đăng nhập
                            </Button>
                        )}
                        <Navbar.Toggle />
                    </div>

                    <Navbar.Collapse className="ml-0">
                        <Navbar.Link as={Link} to="/home" active={currentPath === "/home"} className={`text-base md:active:text-green-400 md:hover:text-green-500 ${currentPath === "/home" ? "md:text-green-400" : ""}`}>
                            Trang chủ
                        </Navbar.Link>
                        <Navbar.Link as={Link} to="/documents" active={currentPath === "/documents"} className={`text-base md:active:text-green-400 md:hover:text-green-500 ${currentPath === "/documents" ? "md:text-green-400" : ""}`}>
                            Tài liệu
                        </Navbar.Link>
                    </Navbar.Collapse>

                    {user && accessToken && <NotificationPanel />}
                </div>
            </Navbar>
        </>
    );
};

export default TopBar;
