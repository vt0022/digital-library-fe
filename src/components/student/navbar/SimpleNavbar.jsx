import { Link, useNavigate } from "react-router-dom";

import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";

import logo from "../../../assets/images/logo.png";
const SimpleNavbar = () => {
    const navigate = useNavigate();
    
    const user = JSON.parse(sessionStorage.getItem("profile"));

    return (
        <Navbar fluid rounded className="w-full bg-transparent">
            <div className="ml-10">
                <Navbar.Brand as={Link} to="/home" className="hover:text-black">
                    <img src={logo} className="mr-3 h-20 sm:h-20" alt="Flowbite React Logo" />
                    <span className="self-center text-white whitespace-nowrap text-3xl font-semibold dark:text-white">THƯ VIỆN SỐ</span>
                </Navbar.Brand>
            </div>

            <div className="flex items-center gap-x-[5%] w-1/2 justify-end ">
                <div className="flex md:order-2 mr-10">
                    {user && (
                        <Dropdown arrowIcon={false} inline label={<Avatar alt={user.lastName} img={user.image} rounded />}>
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
                        <Button className="bg-white text-green-400 enabled:hover:bg-green-100 focus:ring-green-200 focus:ring-1" pill onClick={() => navigate("/login")}>
                            Đăng nhập
                        </Button>
                    )}
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse className="ml-0">
                    <Navbar.Link as={Link} to="/home" className="text-base text-white hover:text-gray-100">
                        Trang chủ
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/documents" className="text-base text-white hover:text-gray-100">
                        Thư viện
                    </Navbar.Link>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};
export default SimpleNavbar;
