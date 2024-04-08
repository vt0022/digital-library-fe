import { initFlowbite } from "flowbite";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./../../assets/images/logo.png";
const TopBar = () => {
    initFlowbite();

    const navigate = useNavigate();

    const location = useLocation();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

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

                <div className="flex items-center gap-x-[5%] w-1/3 justify-end">
                    <div className="flex md:order-2 mr-10">
                        {user && (
                            <Dropdown arrowIcon={false} inline label={<Avatar alt={user.lastName} img={user.image ? user.image : ""} rounded bordered />}>
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

                    {/* <Dropdown
                        label=""
                        inline
                        renderTrigger={() => (
                            <button type="button" class="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg ">
                                <HiOutlineTrash className="text-gray-700 text-2xl hover:text-red-500 active:text-red-400 cursor-pointer" />

                                <span class="sr-only">Notifications</span>
                                <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">20</div>
                            </button>
                        )}>
                        <Dropdown.Item className="z-20 w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700">
                            <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">Notifications</div>
                        </Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>Earnings</Dropdown.Item>
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown> */}

                    <button id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400" type="button">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                            <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                        </svg>
                        {/* 
                        <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900">245</div> */}
                    </button>

                    <div id="dropdownNotification" className="z-20 hidden w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
                        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">Notifications</div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <a href="#" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="flex-shrink-0">
                                    <img className="rounded-full w-11 h-11" src="https://picsum.photos/200" alt="Bonnie image" />
                                    <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-red-600 border border-white rounded-full dark:border-gray-800">
                                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-full ps-3">
                                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                        <span className="font-semibold text-gray-900 dark:text-white">Phan Anh Tú</span> and <span className="font-medium text-gray-900 dark:text-white">10 người khác</span> thích bài đăng của bạn.
                                    </div>
                                    <div className="text-xs text-blue-600 dark:text-blue-500">10 phút trước</div>
                                </div>
                            </a>

                            <a href="#" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="flex-shrink-0">
                                    <img className="rounded-full w-11 h-11" src="https://picsum.photos/200" alt="Leslie image" />
                                    <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800">
                                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-full ps-3">
                                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                        <span className="font-semibold text-gray-900 dark:text-white">Nguyễn Văn Thuận</span> đã phản hồi bạn:{" "}
                                        <span className="font-medium text-blue-500" href="#">
                                            @vanthuan2724
                                        </span>{" "}
                                        Em cảm ơn ạ
                                    </div>
                                    <div className="text-xs text-blue-600 dark:text-blue-500">1 giờ trước</div>
                                </div>
                            </a>
                        </div>
                        <a href="#" className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                            <div className="inline-flex items-center ">
                                <svg className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                </svg>
                                View all
                            </div>
                        </a>
                    </div>
                </div>
            </Navbar>
        </>
    );
};

export default TopBar;
