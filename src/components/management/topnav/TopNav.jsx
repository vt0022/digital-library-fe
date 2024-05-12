import profileImage from "@assets/images/default_profile.jpg";
import notifications from "@assets/json-data/notification.json";
import user_menu from "@assets/json-data/user_menus.json";
import Dropdown from "@components/management/dropdown/Dropdown";
import ThemeMenu from "@components/management/thememenu/ThemeMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./topnav.css";

const Topnav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const renderNotificationItem = (item, index) => (
        <div className="notification-item" key={index}>
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    );

    const renderUserToggle = (user) => (
        <div className="topnav__right-user">
            <div className="topnav__right-user__image">
                <img src={user && user.image ? user.image : profileImage} alt="Avatar" />
            </div>
            {/* <div className="topnav__right-user__name">
                {user && user.lastName} {user && user.firstName}
            </div> */}
        </div>
    );

    const renderUserMenu = (item, index) => (
        <Link to={item.link} key={index} onClick={handleMenuClick(item)}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>
                    {item.content} {item.content === "Hello, " ? user && user.firstName : ""}
                </span>
            </div>
        </Link>
    );

    const handleMenuClick = (item) => {
        if (item.content === "Đăng xuất") {
            return handleLogoutClick;
        } else if (item.content === "Trang cá nhân") {
            return handleProfileClick;
        } else {
            // Xử lý cho các trường hợp khác
            return null;
        }
    };

    const handleLogoutClick = (event) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (currentPath.includes("/manager")) navigate("/manager/login");
        else navigate("/admin/login");

        event.preventDefault();
    };

    const handleProfileClick = (event) => {
        if (user) {
            if (user.role.roleName === "ROLE_MANAGER") navigate("/manager/profile");
            else navigate("/admin/profile");
        }

        event.preventDefault();
    };

    // const user = useSelector((state) => state.LoginReducer.user);
    const currentPath = location.pathname;

    let user = sessionStorage.getItem("profile");

    // Kiểm tra xem thông tin người dùng có tồn tại không
    if (user === null) {
        if (currentPath.includes("/manager")) navigate("/manager/login");
        else navigate("/admin/login");
    } else {
        user = JSON.parse(user);
    }
    // if (!user) {
    //     if (currentPath.includes("/manager")) navigate("/manager/login");
    //     else navigate("/admin/login");
    // }

    return (
        <div className="topnav">
            <div>
                {user && user.role && user.role.roleName === "ROLE_MANAGER" && (
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl p-2 self-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-green-400 self-center">{user && user.organization && user.organization.orgName}</span>
                    </h1>
                )}
            </div>
            <div className="topnav__right flex right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    <Dropdown customToggle={() => renderUserToggle(user)} contentData={user_menu} renderItems={(item, index) => renderUserMenu(item, index)} />
                </div>
                <div className="topnav__right-item">
                    <Dropdown icon="bx bx-bell" badge="12" contentData={notifications} renderItems={(item, index) => renderNotificationItem(item, index)} renderFooter={() => <Link to="/">Xem tất cả</Link>} />
                    {/* dropdown here */}
                </div>
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    );
};

export default Topnav;
