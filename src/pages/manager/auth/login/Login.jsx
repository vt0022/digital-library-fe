import { login, loginWithGoogle, sendEmail } from "@api/main/authAPI";
import bg from "@assets/images/background.jpg";
import logo from "@assets/images/logo.png";
import PageHead from "@components/shared/head/PageHead";
import Spinner from "@components/shared/spinner/Spinner";
import { useGoogleLogin } from "@react-oauth/google";
import loginAction from "@redux/actions/AuthenAction";
import { emailRegrex } from "@utils/regrex";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import "./login.css";
import authVector from "@assets/images/authentication.png";

const toastOptions = {
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

const exclusivePaths = ["/login", "/admin/login", "/manager/login", "/register", "/forgot-password", "/admin/forgot-password", "/manager/forgot-password", "/verify", "/admin/verify", "/manager/verify", "/new-password", "/admin/new-password", "/manager/new-password", "/error-500", "/error-404"];

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [org, setOrg] = useState("");
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("profile");
    }, []);

    const validate = () => {
        let isValid = true;

        if (email.trim() === "") {
            setEmailMessage("Email không được để trống");
            isValid = false;
        } else if (!emailRegrex.test(email)) {
            setEmailMessage("Email không hợp lệ");
            isValid = false;
        }

        if (password.trim() === "") {
            setPasswordMessage("Mật khẩu không được để trống");
            isValid = false;
        }

        return isValid;
    };

    const onClickLogin = () => {
        const isValid = validate();

        if (isValid) {
            handleLogin();
        }
    };

    const handleSendEmail = async () => {
        try {
            const response = await sendEmail({
                params: {
                    email: email,
                    type: "register",
                },
            });

            if (response.status === 200) {
                navigate("/manager/verify", { state: { email: email, type: "register" } });
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);

        try {
            const response = await login({
                email: email,
                password: password,
            });

            setIsLoading(false);

            if (response.status === 401) {
                if (response.message === "Email not registered") {
                    toast.error(<p className="pr-2">Email không đúng!</p>, toastOptions);
                } else {
                    toast.error(<p className="pr-2">Mật khẩu không đúng!</p>, toastOptions);
                }
            } else if (response.status === 403) {
                toast.error(<p className="pr-2">Tài khoản không có quyền truy cập!</p>, toastOptions);
            } else if (response.status === 400) {
                if (response.message === "Account disabled") {
                    toast.error(<p className="pr-2">Tài khoản bị vô hiệu hoá!</p>, toastOptions);
                } else if (response.message === "Account needs activated") {
                    toast.warn(<p className="pr-2">Tài khoản cần được kích hoạt!</p>, toastOptions);

                    handleSendEmail();
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                }
            } else {
                toast.success(<p className="pr-2">Đăng nhập thành công!</p>, toastOptions);
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                sessionStorage.setItem("profile", JSON.stringify(response.data.profile));
                // dispatch(loginAction.setUserProfile(response.data.profile));

                navigate("/manager/home");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const onClickLoginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await loginGoogle(tokenResponse.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    const loginGoogle = async (accessToken) => {
        try {
            setIsLoading(true);

            const response = await loginWithGoogle({
                accessToken: accessToken,
            });

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đăng nhập thành công!</p>, toastOptions);

                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                sessionStorage.setItem("profile", JSON.stringify(response.data.profile));
                // dispatch(loginAction.setUser(response.data.profile));

                navigate("/manager/home");
            } else {
                if (response.message === "Account disabled") {
                    toast.error(<p className="pr-2">Tài khoản đã bị vô hiệu hoá!</p>, toastOptions);
                } else if (response.message === "Email not registered") {
                    toast.error(<p className="pr-2">Tài khoản không tồn tại!</p>, toastOptions);
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi khi đăng nhập với Google!</p>, toastOptions);
                }
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
        }
    };

    return (
        <>
            <PageHead title="Đăng nhập - Quản lý - miniverse" description="Đăng nhập - Quản lý - miniverse" url={window.location.href} />

            <div style={{ backgroundImage: `url(${bg})` }} className=" flex flex-col bg-cover bg-center">
                <div className="min-h-screen text-gray-900 flex justify-center">
                    <div className="max-w-screen-lg m-0 sm:m-10 bg-white shadow-lg rounded-lg sm:rounded-lg flex justify-center flex-1">
                        <div className="w-1/2 p-6 sm:p-12">
                            <div>
                                <img src={logo} className="mx-auto h-36" />
                            </div>
                            <div className="mt-6 flex flex-col items-center">
                                <div className="w-full flex-1 mt-6">
                                    <div className="flex flex-col items-center">
                                        <button
                                            className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                                            onClick={onClickLoginGoogle}>
                                            <div className="bg-white p-2 rounded-full">
                                                <svg className="w-4" viewBox="0 0 533.5 544.3">
                                                    <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                                                    <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                                                    <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                                                    <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                                                </svg>
                                            </div>
                                            <span className="ml-4">Đăng nhập với Google</span>
                                        </button>
                                    </div>

                                    <div className="my-12 border-b text-center">
                                        <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">Hoặc đăng nhập bằng email</div>
                                    </div>

                                    <div className="mx-auto max-w-xs">
                                        <input
                                            className="w-full px-8 py-3 rounded-lg border border-gray-200 outline-1 outline-white  focus:border focus:border-green-400 focus:bg-white focus:outline-1 focus:outline-green-200 focus:ring-0 hover:border-green-400"
                                            type="email"
                                            placeholder="Email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            required
                                        />

                                        {emailMessage && (
                                            <p className="mt-2">
                                                <div className="text-sm font-light text-red-600">* {emailMessage}</div>
                                            </p>
                                        )}

                                        <input
                                            className="w-full mt-5 px-8 py-3 rounded-lg border border-gray-200 outline-1 outline-white  focus:border focus:border-green-400 focus:bg-white focus:outline-1 focus:outline-green-200 focus:ring-0 hover:border-green-400"
                                            type="password"
                                            placeholder="Mật khẩu"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            required
                                        />

                                        {passwordMessage && (
                                            <p className="mt-2">
                                                <div className="text-sm font-light text-red-600">* {passwordMessage}</div>
                                            </p>
                                        )}

                                        <button
                                            className={`mt-5 tracking-wide font-semibold bg-emerald-400 text-white w-full py-4 rounded-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                                                email.trim() === "" || password.trim() === "" ? "disabled" : ""
                                            }`}
                                            onClick={onClickLogin}
                                            disabled={email.trim() === "" || password.trim() === ""}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <path d="M20 8v6M23 11h-6" />
                                            </svg>
                                            <span className="ml-4">Đăng nhập</span>
                                        </button>

                                        <div className="flex justify-end mt-4">
                                            <Link className="text-sm font-medium text-red-500 hover:!text-red-400" to="/forgot-password">
                                                Quên mật khẩu?
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-teal-50 text-center flex rounded-r-lg">
                            <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${authVector})` }}></div>
                        </div>
                    </div>

                    <Spinner loading={isLoading} />
                </div>
            </div>
        </>
    );
};

export default Login;
