import logo2 from "@assets/images/logo.png";
import manager_sidebar_items from "@assets/json-data/manager_sidebar_routes.json";
import sidebar_items from "@assets/json-data/sidebar_routes.json";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const SidebarItem = (props) => {
    const active = props.active ? "active" : "";

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>{props.title}</span>
            </div>
        </div>
    );
};

const Sidebar = () => {
    const location = useLocation();

    // const user = useSelector((state) => state.LoginReducer.user);
    const user = JSON.parse(sessionStorage.getItem("profile"));

    const checkRoutes = () => {
        if (user && user.role.roleName === "ROLE_MANAGER") return manager_sidebar_items;
        else if (user && user.role.roleName === "ROLE_ADMIN") return sidebar_items;
        else return sidebar_items;
    };

    const activeItem = checkRoutes().findIndex((item) => item.route === location.pathname);

    return (
        <div className="sidebar">
            <div className="sidebar__logo">
                <img src={logo2} alt="company logo" className="w-[100px]" />
            </div>
            {checkRoutes().map((item, index) => (
                <Link to={item.route} key={index}>
                    <SidebarItem title={item.display_name} icon={item.icon} active={index === activeItem} />
                </Link>
            ))}
        </div>
    );
};

export default Sidebar;
