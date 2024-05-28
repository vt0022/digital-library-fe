import { sendEmail, verify } from "@api/main/authAPI";
import bg from "@assets/images/background.jpg";
import Spinner from "@components/shared/spinner/Spinner";
import SimpleNavbar from "@components/student/navbar/SimpleNavbar";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import loginAction from "redux/actions/AuthenAction";
import "./verify.css";

const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const email = location.state?.email;
    const type = location.state?.type;

    const [no1, setNo1] = useState("");
    const [no2, setNo2] = useState("");
    const [no3, setNo3] = useState("");
    const [no4, setNo4] = useState("");
    const [no5, setNo5] = useState("");
    const [no6, setNo6] = useState("");
    const [countdown, setCountdown] = useState(15 * 60 - 1);
    const [isLoading, setIsLoading] = useState(false);

    const inputRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [countdown]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (value.length <= 1) {
            switch (index) {
                case 0:
                    setNo1(value);
                    break;
                case 1:
                    setNo2(value);
                    break;
                case 2:
                    setNo3(value);
                    break;
                case 3:
                    setNo4(value);
                    break;
                case 4:
                    setNo5(value);
                    break;
                case 5:
                    setNo6(value);
                    break;
                default:
                    break;
            }
        }

        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        } else if (value.length === 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const validate = () => {
        if (no1 === "" || no2 === "" || no3 === "" || no4 === "" || no5 === "" || no6 === "") return false;
        return true;
    };

    const handleVerify = async () => {
        let verificationCode = no1.toString() + no2.toString() + no3.toString() + no4.toString() + no5.toString() + no6.toString();

        try {
            setIsLoading(true);

            const response = await verify({
                params: {
                    email: email,
                    code: verificationCode,
                    type: type,
                },
            });

            setIsLoading(false);

            if (response.status === 200) {
                if (type === "register") {
                    toast.success(<p className="pr-2">Xác thực tài khoản thành công!</p>, toastOptions);

                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    sessionStorage.setItem("profile", JSON.stringify(response.data.profile));
                    dispatch(loginAction.setUser(response.data.profile));
                    navigate("/home");
                } else {
                    toast.success(<p className="pr-2">Bạn có thể tạo mật khẩu mới!</p>, toastOptions);

                    navigate("/new-password", { state: { email: email } });
                }
            } else {
                if (response.message === "User not found") {
                    toast.error(<p className="pr-2">Email chưa được đăng ký!</p>, toastOptions);
                } else if (response.message === "Account disabled") {
                    toast.error(<p className="pr-2">Tài khoản đã bị vô hiệu!</p>, toastOptions);
                } else if (response.message === "Verification code is expired") {
                    toast.error(<p className="pr-2">Mã xác thực đã hết hạn!</p>, toastOptions);
                } else if (response.message === "Wrong verification code") {
                    toast.error(<p className="pr-2">Mã xác thực không hợp lệ!</p>, toastOptions);
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
                }
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        if (minutes === 0 && seconds === 0) return "00:00";
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSendEmail = async () => {
        try {
            setIsLoading(true);

            const response = await sendEmail({
                params: {
                    email: email,
                    type: type,
                },
            });

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Gửi lại mã OTP thành công!</p>, toastOptions);

                setCountdown(15 * 60 - 1);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
        }
    };
    // if(!email || !target) navigate("/error-404")

    return (
        <div style={{ backgroundImage: `url(${bg})` }} className="flex flex-col h-screen bg-cover bg-center">
            <div className="sticky top-0 bg-transparent w-full z-40">
                <SimpleNavbar />
            </div>

            <div className="bg-transparent text-gray-900 flex justify-center items-center">
                <div className="w-full h-fit max-w-lg px-8 py-10 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-6">Nhập mã OTP để {type === "reset" ? "khôi phục mật khẩu" : "kích hoạt tài khoản"}</h1>
                    <p className="text-gray-600 text-center mb-4">Mã được gửi tới {email}</p>
                    <div className="grid grid-cols-6 gap-x-4 my-6">
                        {[no1, no2, no3, no4, no5, no6].map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(e, index)}
                                required
                                className="no-spinner rounded-lg bg-white cursor-text text-center text-2xl font-medium w-14 aspect-square text-gray-700 rounded-lg border border-gray-200 outline-1 outline-white focus:border focus:border-green-400 focus:bg-white focus:outline-1 focus:outline-green-200 focus:ring-0 hover:border-green-400"
                            />
                        ))}
                    </div>

                    <div className="flex items-center flex-col justify-between mb-6">
                        <p className="text-gray-600 text-sm">Không nhận được mã?</p>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 text-sm font-medium text-center rounded text-gray-500 hover:text-emerald-500" onClick={handleSendEmail}>
                                Gửi lại ({formatTime(countdown)})
                            </button>
                        </div>
                    </div>

                    <button
                        className={`w-full px-4 py-2 rounded-lg font-medium text-white bg-emerald-400 hover:scale-105 hover:bg-emerald-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${validate() ? "" : "disabled"}`}
                        disabled={!validate()}
                        onClick={handleVerify}>
                        Xác nhận
                    </button>
                </div>
            </div>

            <Spinner loading={isLoading} />
        </div>
    );
};

export default VerifyOTP;
