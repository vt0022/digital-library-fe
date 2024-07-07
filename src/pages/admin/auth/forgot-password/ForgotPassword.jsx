import { sendEmail } from "@api/main/authAPI";
import bg from "@assets/images/background.jpg";
import logo from "@assets/images/logo.png";
import PageHead from "@components/shared/head/PageHead";
import Spinner from "@components/shared/spinner/Spinner";
import { emailRegrex } from "@utils/regrex";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import "./forgot-password.css";

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

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        let isValid = true;

        if (email.trim() === "") {
            setEmailMessage("Email không được để trống");
            isValid = false;
        } else if (!emailRegrex.test(email)) {
            setEmailMessage("Email không hợp lệ");
            isValid = false;
        }

        return isValid;
    };

    const onClickSendEmail = () => {
        const isValid = validate();

        if (isValid) {
            handleSendEmail();
        }
    };

    const handleSendEmail = async () => {
        try {
            setIsLoading(true);

            const response = await sendEmail({
                params: {
                    email: email,
                    type: "reset",
                },
            });

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã gửi mã xác nhận tới email của bạn!</p>, toastOptions);
                navigate("/admin/verify", { state: { email: email, type: "reset" } });
            } else if (response.message === "Email not registered") {
                toast.error(<p className="pr-2">Email chưa đăng ký tài khoản!</p>, toastOptions);
            } else if (response.message === "Account disabled") {
                toast.error(<p className="pr-2">Tài khoản của bạn đã bị vô hiệu hoá!</p>, toastOptions);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title="Quên mật khẩu - Admin - miniverse" description="Quên mật khẩu - Admin - miniverse" url={window.location.href} />

            <div style={{ backgroundImage: `url(${bg})` }} className="h-screen flex flex-col bg-cover bg-center">
                <div className="text-gray-900 flex justify-center">
                    <div className="max-w-lg m-0 h-fit bg-white shadow-lg rounded-lg flex justify-center flex-1">
                        <div className="w-full p-10">
                            <div className="">
                                <img src={logo} className="mx-auto h-36" />
                            </div>
                            <div className="mt-6 flex flex-col items-center">
                                <h1 className="text-2xl font-semibold text-center mb-10">Nhập email muốn lấy lại mật khẩu</h1>

                                <div className="mx-auto w-4/5 max-w-md">
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

                                    <button
                                        className={`mt-5 tracking-wide font-semibold bg-emerald-400 text-white w-full py-4 rounded-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                                            email.trim() === "" ? "disabled" : ""
                                        }`}
                                        onClick={onClickSendEmail}
                                        disabled={email.trim() === ""}>
                                        <span className="ml-4">Gửi mã OTP</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Spinner loading={isLoading} />
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
