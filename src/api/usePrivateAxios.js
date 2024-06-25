import { useEffect } from "react";
import { privateAxios } from "./axios";
// import useRefreshToken from "./useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const toastOptions = {
    toastId: "entry-toast",
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

const usePrivateAxios = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;

    useEffect(() => {
        const requestInterceptor = privateAxios.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem("accessToken");
                const user = JSON.parse(sessionStorage.getItem("profile"));

                if (!accessToken || !user) {
                    if (currentPath.includes("/admin")) {
                        navigate("/admin/login");
                    } else if (currentPath.includes("/manager")) {
                        navigate("/manager/login");
                    } else {
                        navigate("/login");
                    }

                    toast.error(<p className="pr-2">Vui lòng đăng nhập trước!</p>, toastOptions);
                } else {
                    // const decodedToken = jwtDecode(accessToken);
                    // console.log(decodedToken)

                    config.headers.Authorization = `Bearer ${accessToken}`;
                    sessionStorage.removeItem("entryMessage");
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        const responseInterceptor = privateAxios.interceptors.response.use(
            (response) => {
                const user = JSON.parse(sessionStorage.getItem("profile"));

                if (response.data.status === 401 || response.data.status === 403) {
                    if (response.data.status === 401) {
                        toast.error(<p className="pr-2">Vui lòng đăng nhập trước!</p>, toastOptions);
                    } else if (response.data.status === 403) {
                        toast.error(<p className="pr-2">Tài khoản không có quyền truy cập!</p>, toastOptions);
                    }

                    if (user && user.role && user.role.roleName === "ROLE_ADMIN") {
                        navigate("/admin/login");
                    } else if (user && user.role && user.role.roleName === "ROLE_MANAGER") {
                        navigate("/manager/login");
                    } else {
                        navigate("/login");
                    }
                }
                return response;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        return () => {
            privateAxios.interceptors.request.eject(requestInterceptor);
            privateAxios.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate]);
    return privateAxios;
};

export default usePrivateAxios;
