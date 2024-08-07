import { getProfile, updateAvatar, updatePassword, updateProfile } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import profileImage from "@assets/images/default_profile.jpg";
import Select from "@components/management/select/Select";
import PageHead from "@components/shared/head/PageHead";
import { Button, Datepicker, FileInput, Label, TextInput } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiAdjustments } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

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

const StudentProfile = () => {
    const genderList = [
        { id: 0, name: "Nam" },
        { id: 1, name: "Nữ" },
        { id: 2, name: "Khác" },
    ];

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [gender, setGender] = useState(0);
    const [dateOfBirth, setDateOfBirth] = useState("1900-01-01");
    const [email, setEmail] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(profileImage);

    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);
    const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [isFileValid, setIsFileValid] = useState(true);
    const [fileMessage, setFileMessage] = useState("");
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");

    const [user, setUser] = useState(null);

    usePrivateAxios();
    const navigate = useNavigate();

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = async () => {
        try {
            const response = await getProfile();

            if (response.status === 200) {
                const user = response.data;
                setUser(user);
                setLastName(user.lastName);
                setFirstName(user.firstName);
                setGender(user.gender);
                setDateOfBirth(user.dateOfBirth ? user.dateOfBirth : new Date());
                setEmail(user.email);

                sessionStorage.setItem("profile", JSON.stringify(user));
            } else {
                navigate("/error-500");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const validateLastName = () => {
        if (lastName === "" || lastName.trim() === "") {
            setIsLastNameValid(false);
            return false;
        } else {
            setIsLastNameValid(true);
            return true;
        }
    };

    const validateFirstName = () => {
        if (firstName === "" || firstName.trim() === "") {
            setIsFirstNameValid(false);
            return false;
        } else {
            setIsFirstNameValid(true);
            return true;
        }
    };

    const validateEmail = () => {
        if (email === "" || email.trim() === "") {
            setIsEmailValid(false);
            return false;
        } else {
            setIsEmailValid(true);
            return true;
        }
    };

    const validateDateOfBirth = () => {
        const fifteenYearsAgo = new Date();
        fifteenYearsAgo.setFullYear(new Date().getFullYear() - 15);
        if (dateOfBirth > fifteenYearsAgo) {
            setIsDateOfBirthValid(false);
            return false;
        } else {
            setIsDateOfBirthValid(true);
            return true;
        }
    };

    const validateInfo = () => {
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isDateOfBirthValid = validateDateOfBirth();

        if(isFirstNameValid && isLastNameValid && isEmailValid && isDateOfBirthValid) {
            return true;
        } else {
            return false;
        }
    }

    const validateOldPassword = () => {
        if (oldPassword === "" || oldPassword.trim() === "") {
            setIsOldPasswordValid(false);
            return false;
        } else {
            setIsOldPasswordValid(true);
            return true;
        }
    };

    const validateNewPassword = () => {
        if (newPassword === "" || newPassword.trim() === "") {
            setIsNewPasswordValid(false);
            return false;
        } else {
            setIsNewPasswordValid(true);
            return true;
        }
    };

    const validateConfirmPassword = () => {
        if (confirmPassword === "" || confirmPassword.trim() === "") {
            setIsConfirmPasswordValid(false);
            setConfirmPasswordMessage("Vui lòng nhập mật khẩu.");
            return false;
        } else if (confirmPassword !== newPassword) {
            setIsConfirmPasswordValid(false);
            setConfirmPasswordMessage("Mật khẩu không khớp.");
            return false;
        } else {
            setIsConfirmPasswordValid(true);
            return true;
        }
    };

    const validatePassword = () => {
        const isOldPasswordValid = validateOldPassword();
        const isNewPasswordValid = validateNewPassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid) {
            return true;
        } else {
            return false;
        }
    };

    const validateFile = () => {
        if (imageFile === null) {
            setFileMessage("Vui lòng chọn ảnh đại diện");
            setIsFileValid(false);
            return false;
        } else if (imageFile !== null && (imageFile.size > 5 * 1024 * 1024 || imageFile.size === 0)) {
            setFileMessage("Vui lòng chọn ảnh hợp lệ và nhỏ hơn 5MB");
            setIsFileValid(false);
            return false;
        } else if (imageFile !== null && imageFile.type !== "image/jpeg" && imageFile.type !== "image/png" && imageFile.type !== "image/jpg" && imageFile.type !== "image/bmp") {
            setFileMessage("Vui lòng chỉ chọn tệp ảnh JPG, JPEG, PNG, BMP");
            setIsFileValid(false);
            return false;
        } else {
            return true;
        }
    };

    const handleSubmitInfo = async (e) => {
        e.preventDefault();

        const isInfoValid = validateInfo();

        if (isInfoValid) {
            setIsLoadingInfo(true);

            try {
                const data = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    gender: gender,
                    dateOfBirth: dateOfBirth,
                };

                const response = await updateProfile(data);

                setIsLoadingInfo(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">Cập nhật thông tin thành công!</p>, toastOptions);

                    setUser(response.data);

                    sessionStorage.setItem("profile", JSON.stringify(response.data));

                    setLastName(response.data.lastName);
                    setFirstName(response.data.firstName);
                    setGender(response.data.gender);
                    setDateOfBirth(new Date(response.data.dateOfBirth));
                    setEmail(response.data.email);
                } else {
                    if (response.message === "Email already registered") {
                        toast.error(<p className="pr-2">Email đã tồn tại!</p>, toastOptions);
                    } else if (response.message === "User not found") {
                        toast.error(<p className="pr-2">Người dùng không tồn tại!</p>, toastOptions);
                    } else {
                        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                    }
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();

        if (validateFile()) {
            setIsLoadingAvatar(true);

            try {
                const formData = new FormData();
                if (imageFile) formData.append("avatar", imageFile);
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
                const response = await updateAvatar(formData, config);

                setIsLoadingAvatar(false);

                if (response.status === 200) {
                    setImage(profileImage);
                    setImageFile(null);

                    toast.success(<p className="pr-2">Cập nhật ảnh đại diện thành công!</p>, toastOptions);

                    setUser(response.data);

                    sessionStorage.setItem("profile", JSON.stringify(response.data));
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        const isPasswordValid = validatePassword();

        if (isPasswordValid) {
            setIsLoadingPassword(true);

            try {
                const data = {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                };

                const response = await updatePassword(data);

                setIsLoadingPassword(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">Cập nhật mật khẩu thành công!</p>, toastOptions);

                    setUser(response.data);
                } else {
                    if (response.message === "Password incorrect") {
                        toast.error(<p className="pr-2">Mật khẩu cũ không đúng!</p>, toastOptions);
                    } else if (response.message === "Passwords not matched") {
                        toast.error(<p className="pr-2">Mật khẩu mới không khớp!</p>, toastOptions);
                    } else if (response.message === "User not found") {
                        toast.error(<p className="pr-2">Người dùng không tồn tại!</p>, toastOptions);
                    } else {
                        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                    }
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    return (
        <div>
            <PageHead title="Trang cá nhân - miniverse" description="Trang cá nhân - miniverse" url={window.location.href} />

            <div className="p-4">
                <div className="flex">
                    <div className="flex flex-col w-2/3 ">
                        <div className="bg-white rounded-lg h-min mr-5 p-8 shadow-lg">
                            <div className="mb-9">
                                <div className="flex items-center mb-2 font-bold">
                                    <HiAdjustments className="w-8 h-8 mr-3 dark:text-white" />
                                    <span className="block text-2xl font-bold dark:text-white">Thông tin cá nhân</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitInfo}>
                                <div className="flex gap-x-9">
                                    <div className="w-1/2">
                                        <div className="mb-6">
                                            <div className="mb-2 block">
                                                <Label htmlFor="lastName" value="Họ" style={{ color: "var(--txt-color)" }} />
                                            </div>
                                            <TextInput id="lastName" placeholder="Nguyễn" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
                                            {!isLastNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập họ</p>}
                                        </div>

                                        <Select
                                            selectName="Giới tính"
                                            options={genderList}
                                            selectedValue={gender}
                                            onChangeHandler={(e) => {
                                                setGender(e.target.value);
                                            }}
                                            name="name"
                                            field="id"
                                            className="mt-0 mb-2"
                                        />

                                        <div className="mb-6 mt-5">
                                            <div className="mb-2 block">
                                                <Label htmlFor="email" value="Email" style={{ color: "var(--txt-color)" }} />
                                            </div>
                                            <TextInput id="email" placeholder="thuan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                                            {!isEmailValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập email</p>}
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="mb-2">
                                            <div className="mb-2 block">
                                                <Label htmlFor="firstName" value="Tên" style={{ color: "var(--txt-color)" }} />
                                            </div>
                                            <TextInput id="firstName" placeholder="Văn Thuận" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
                                            {!isFirstNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên</p>}
                                        </div>

                                        <div className="mb-5 mt-6">
                                            <div className="mb-2 block">
                                                <Label htmlFor="firstName" value="Ngày sinh" style={{ color: "var(--txt-color)" }} />
                                            </div>
                                            <Datepicker
                                                language="vi-VN"
                                                labelTodayButton="Hôm nay"
                                                labelClearButton="Xoá"
                                                id="dateOfBirth"
                                                // defaultDate={new Date(dateOfBirth)}
                                                value={moment(new Date(dateOfBirth)).format("DD/MM/YYYY")}
                                                // date={moment(new Date(dateOfBirth)).format("DD/MM/YYYY")}
                                                // datepicker-format="dd/MM/yyyy"
                                                onSelectedDateChanged={(date) => {
                                                    setDateOfBirth(date);
                                                }}
                                                required
                                            />
                                            {!isDateOfBirthValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Người dùng cần ít nhất 15 tuổi</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="justify-between mb-2">
                                    <Button type="submit" isProcessing={isLoadingInfo} color="success" className="w-28 right-0">
                                        Lưu
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="h-min mr-5 mt-4 rounded-lg p-8 bg-white shadow-lg">
                            <div className="block mb-2 text-xl font-medium dark:text-white">MẬT KHẨU</div>

                            <form onSubmit={handleSubmitPassword}>
                                <div className="w-1/2 mb-4">
                                    <div className="mb-2 block">
                                        <Label htmlFor="password" value="Mật khẩu cũ" style={{ color: "var(--txt-color)" }} />
                                    </div>
                                    <TextInput id="oldPassword" type="password" placeholder="********" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mr-9" />
                                    {!isOldPasswordValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập mật khẩu cũ</p>}
                                </div>
                                <div className="flex gap-x-9 mb-4">
                                    <div className="w-1/2">
                                        <div className="mb-2 block">
                                            <Label htmlFor="newPassword" value="Mật khẩu mới" style={{ color: "var(--txt-color)" }} />
                                        </div>
                                        <TextInput id="newPassword" type="password" placeholder="********" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        {!isNewPasswordValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập mật khẩu mới</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <div className="mb-2 block">
                                            <Label htmlFor="confirmPassword" value="Xác nhận mật khẩu" style={{ color: "var(--txt-color)" }} />
                                        </div>
                                        <TextInput id="confirmPassword" type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        {!isConfirmPasswordValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* {confirmPasswordMessage}</p>}
                                    </div>
                                </div>
                                <div className="justify-between mt-5 mb-2">
                                    <Button type="submit" isProcessing={isLoadingPassword} className="w-28">
                                        Đổi
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-col w-1/3">
                        <div className="p-0 h-min rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col items-center mt-5">
                                <img alt="Profile" src={user && user.image ? user.image : profileImage} className="mb-3 rounded-full border-solid border-4 border-gray w-28 h-28" />

                                <h5 className="text-2xl font-medium dark:text-white">
                                    {user && user.lastName} {user && user.firstName}
                                </h5>

                                <div className="profile-info mt-5 mb-5">
                                    <div className="flex text-center font-bold">
                                        <span className="block text-base uppercase text-green-400 font-medium dark:text-white">{user && user.organization && user.organization.orgName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center m-auto profile-info h-full">
                                <div className="items-center mb-2 font-bold bg-red-200 rounded-full w-1/2 py-1">
                                    <a href="/me/my-shared-documents" className="text-center block text-base font-medium text-sky-500 dark:text-white">
                                        {user && user.totalDocuments} tài liệu
                                    </a>
                                </div>

                                <div className="items-center mb-2 font-bold bg-red-200 rounded-full w-1/2 py-1">
                                    <span className="block text-center text-base font-medium text-sky-500 dark:text-white">{user && user.totalViews} lượt xem</span>
                                </div>

                                <div className="items-center mb-5 font-bold bg-red-200 rounded-full w-1/2 py-1">
                                    <span className="block text-center text-base font-medium text-sky-500 dark:text-white">{user && user.totalLikes} lượt thích</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-0 h-min rounded-lg shadow-lg bg-white p-4 mt-4">
                            <form onSubmit={handleSubmitAvatar}>
                                <div className="mb-2 mt-2 w-1/2 m-auto">
                                    <div className="flex flex-col items-center mb-2">
                                        <img alt="Profile" src={image} className="rounded-full w-24 h-24 shadow-lg" />
                                    </div>
                                    <div className="mb-2 mt-4">
                                        <Label htmlFor="avatar-upload" value="Tải ảnh đại diện" />
                                    </div>
                                    <FileInput id="avatar-upload" helperText="PNG, JPG, JPEG, BMP (Tối đa 5MB)." accept=".jpg, .png, .jpeg, .bmp" onChange={handleImageUpload} />
                                    {!isFileValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* {fileMessage}</p>}

                                    <div className="flex justify-center mt-4">
                                        <Button type="submit" isProcessing={isLoadingAvatar} color="blue" className="w-28 right-0">
                                            Tải lên
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
