import logo from "@assets/images/logo.png";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CustomNavbar = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const currentPath = location.pathname;

    const user = JSON.parse(sessionStorage.getItem("profile"));

    return (
        <Navbar fluid rounded className="w-full">
            <div className="ml-10">
                <Navbar.Brand as={Link} to="/home" className="hover:text-black">
                    <img src={logo} className="mr-3 h-16 sm:h-16" alt="WISDO Logo" />
                </Navbar.Brand>
            </div>

            <div className="flex items-center gap-x-[5%] w-4/5 justify-end">
                <div className="flex order-2 mr-10">
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
                        <Button className="text-white bg-green-400 enabled:hover:bg-green-500 focus:ring-green-200 focus:ring-1" pill onClick={() => navigate("/login")}>
                            Đăng nhập
                        </Button>
                    )}
                    <Navbar.Toggle />
                </div>

                <Navbar.Collapse className="ml-0">
                    <Navbar.Link as={Link} to="/home" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/home" ? "text-green-400" : ""}`}>
                        Trang chủ
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/documents" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/documents" ? "text-green-400" : ""}`}>
                        Tài liệu
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/institutions" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/institutions" ? "text-green-400" : ""}`}>
                        Trường học
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/fields" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/fields" ? "text-green-400" : ""}`}>
                        Lĩnh vực
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/categories" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/categories" ? "text-green-400" : ""}`}>
                        Danh mục
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/collections" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/collections" ? "text-green-400" : ""}`}>
                        Bộ sưu tập
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/forum" className={`text-base active:!text-green-400 hover:!text-green-300 focus:!text-green-400 ${currentPath === "/forum" ? "text-green-400" : ""}`}>
                        Diễn đàn
                    </Navbar.Link>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};
export default CustomNavbar;
