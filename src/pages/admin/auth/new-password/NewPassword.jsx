import { resetPassword } from "@api/main/userAPI";
import bg from "@assets/images/background.jpg";
import Spinner from "@components/shared/spinner/Spinner";
import PageHead from "@components/shared/head/PageHead";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import "./new-password.css";
import logo from "@assets/images/logo.png";

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

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordMessage, setNewPasswordMessage] = useState("");
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        let isValid = true;

        if (newPassword.trim() === "") {
            setNewPasswordMessage("Mật khẩu không được để trống");
            isValid = false;
        } else if (newPassword.trim().length < 8) {
            setNewPasswordMessage("Mật khẩu phải có ít nhất 8 ký tự");
            isValid = false;
        }

        if (confirmPassword !== newPassword) {
            setConfirmPasswordMessage("Mật khẩu không khớp");
            isValid = false;
        }

        return isValid;
    };

    const onClickReset = () => {
        const isValid = validate();

        if (isValid) {
            handleReset();
        }
    };

    const handleReset = async () => {
        try {
            setIsLoading(true);

            const data = {
                email: email,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            };

            const response = await resetPassword(data);

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Khôi phục mật khẩu thành công! Vui lòng đăng nhập lại!</p>, toastOptions);

                navigate("/admin/login");
            } else {
                if (response.message === "Passwords not matched") {
                    toast.error(<p className="pr-2">Mật khẩu không khớp!</p>, toastOptions);
                } else if (response.message === "User not found") {
                    toast.error(<p className="pr-2">Người dùng không tồn tại!</p>, toastOptions);
                } else if (response.message === "Account disabled") {
                    toast.error(<p className="pr-2">Tài khoản đã bị vô hiệu!</p>, toastOptions);
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
                }
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title="Mật khẩu mới - Admin - miniverse" description="Mật khẩu mới - Admin - miniverse" url={window.location.href} />

            <div style={{ backgroundImage: `url(${bg})` }} className="h-screen flex flex-col bg-cover bg-center">
                <div className="text-gray-900 flex justify-center">
                    <div className="max-w-lg m-0 h-fit bg-white shadow-lg rounded-lg flex justify-center flex-1">
                        <div className="w-full p-10">
                            <div className="">
                                <img src={logo} className="mx-auto h-36" />
                            </div>
                            <div className="mt-6 flex flex-col items-center">
                                <h1 className="text-2xl font-semibold text-center mb-10">Nhập mật khẩu mới</h1>

                                <div className="mx-auto max-w-xs">
                                    <input
                                        className="w-full px-8 py-3 rounded-lg border border-gray-200 outline-1 outline-white  focus:border focus:border-green-400 focus:bg-white focus:outline-1 focus:outline-green-200 focus:ring-0 hover:border-green-400"
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                        required
                                    />

                                    {newPasswordMessage && (
                                        <p className="mt-2">
                                            <div className="text-sm font-light text-red-600">* {newPasswordMessage}</div>
                                        </p>
                                    )}

                                    <input
                                        className="w-full mt-5 px-8 py-3 rounded-lg border border-gray-200 outline-1 outline-white  focus:border focus:border-green-400 focus:bg-white focus:outline-1 focus:outline-green-200 focus:ring-0 hover:border-green-400"
                                        type="password"
                                        placeholder="Xác nhận mật khẩu mới"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        required
                                    />

                                    {confirmPasswordMessage && (
                                        <p className="mt-2">
                                            <div className="text-sm font-light text-red-600">* {confirmPasswordMessage}</div>
                                        </p>
                                    )}

                                    <button
                                        className={`mt-5 tracking-wide font-semibold bg-emerald-400 text-white w-full py-4 rounded-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                                            newPassword.trim() === "" ? "disabled" : ""
                                        }`}
                                        onClick={onClickReset}
                                        disabled={newPassword.trim() === ""}>
                                        <span className="ml-4">Khôi phục mật khẩu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Spinner loading={isLoading} />
                </div>
                {/* 
            <div>
                <CustomFooter />
            </div> */}
            </div>
        </>
    );
};

export default NewPassword;
