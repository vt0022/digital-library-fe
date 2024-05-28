import usePrivateAxios from "@api/usePrivateAxios";
import AdminLayout from "@components/management/layout/AdminLayout";
import ManagerLayout from "@components/management/layout/ManagerLayout";
import AdminForgotPassword from "@pages/admin/auth/forgot-password/ForgotPassword";
import AdminLogin from "@pages/admin/auth/login/Login";
import AdminNewPassword from "@pages/admin/auth/new-password/NewPassword";
import AdminVerifyOTP from "@pages/admin/auth/verifyotp/VerifyOTP";
import Forum from "@pages/forum/main/Forum";
import ManagerForgotPassword from "@pages/manager/auth/forgot-password/ForgotPassword";
import ManagerLogin from "@pages/manager/auth/login/Login";
import ManagerNewPassword from "@pages/manager/auth/new-password/NewPassword";
import ManagerVerifyOTP from "@pages/manager/auth/verifyotp/VerifyOTP";
import Home from "@pages/student/Home";
import Main from "@pages/student/Main";
import StudentForgotPassword from "@pages/student/auth/forgot-password/ForgotPassword";
import StudentLogin from "@pages/student/auth/login/Login";
import StudentNewPassword from "@pages/student/auth/new-password/NewPassword";
import StudentSignup from "@pages/student/auth/signup/Signup";
import StudentVerifyOTP from "@pages/student/auth/verifyotp/VerifyOTP";
import Error404 from "@pages/student/error/Error404";
import Error500 from "@pages/student/error/Error500";
import { Route, Routes, useLocation } from "react-router-dom";
import "./../App.css";

const RootRouters = () => {
    usePrivateAxios();

    const location = useLocation();

    return (
        <Routes>
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/verify" element={<StudentVerifyOTP />} />
            <Route path="/register" element={<StudentSignup />} />
            <Route path="/new-password" element={<StudentNewPassword />} />
            <Route path="/forgot-password" element={<StudentForgotPassword />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/verify" element={<AdminVerifyOTP />} />
            <Route path="/admin/new-password" element={<AdminNewPassword />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

            <Route path="/manager/login" element={<ManagerLogin />} />
            <Route path="/manager/verify" element={<ManagerVerifyOTP />} />
            <Route path="/manager/new-password" element={<ManagerNewPassword />} />
            <Route path="/manager/forgot-password" element={<ManagerForgotPassword />} />

            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/manager/*" element={<ManagerLayout />} />

            <Route path="/home" element={<Home />} />

            <Route path="/error-404" element={<Error404 />} />
            <Route path="/error-500" element={<Error500 />} />

            <Route path="/forum/*" element={<Forum />} />

            <Route path="/" exact element={<Home />} />
            <Route path="/*" element={<Main />} />
        </Routes>
    );

    // const a =  </CSSTransition>
    //     </TransitionGroup>
};

export default RootRouters;
