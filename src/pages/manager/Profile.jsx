import { deleteADocument, getUploadedDocuments } from "@api/main/documentAPI";
import { getProfile, updateAvatar, updatePassword, updateProfile } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import profileBackground from "@assets/images/default_background.jpg";
import profileImage from "@assets/images/default_profile.jpg";
import ActionButton from "@components/management/action-button/ActionButton";
import Select from "@components/management/select/Select";
import Table from "@components/management/table/Table";
import PageHead from "@components/shared/head/PageHead";
import { Button, Datepicker, FileInput, Label, Modal, Pagination, Spinner, TextInput } from "flowbite-react";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { HiAdjustments, HiAtSymbol, HiCake, HiDocumentRemove, HiUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

let selectedPage = 0;

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

const ManagerProfile = () => {
    const genderList = [
        { id: 0, name: "Nam" },
        { id: 1, name: "Nữ" },
        { id: 2, name: "Khác" },
    ];

    const roleList = {
        ROLE_ADMIN: "ADMIN",
        ROLE_STUDENT: "SINH VIÊN",
        ROLE_MANAGER: "QUẢN LÝ",
    };

    const tableHead = ["", "Tên", "Giới thiệu", "Lượt xem", ""];

    const renderHead = (item, index) => (
        <th key={index} className="cursor-pointer">
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index}>
            <td className="text-center font-bold" onClick={() => handleDetail(item.slug)}>
                {selectedPage * 20 + index + 1}
            </td>
            <td className="max-w-xs text-justify" onClick={() => handleDetail(item.slug)}>
                {item.docName}
            </td>
            <td className="max-w-xl text-justify" onClick={() => handleDetail(item.slug)}>
                <p className="truncate whitespace-normal leading-6 line-clamp-3">{item.docIntroduction}</p>
            </td>
            <td className="max-w-xl text-center" onClick={() => handleDetail(item.slug)}>
                {item.totalView}
            </td>
            <td className="text-center">
                <div className="flex space-x-0">
                    <ActionButton onClick={() => handleDetail(item.slug)} icon="bx bxs-calendar" color="green" content="Xem chi tiết tài liệu" />
                    <ActionButton onClick={() => handleEdit(item.slug)} icon="bx bxs-calendar-edit" color="yellow" content="Chỉnh sửa tài liệu" />
                    <ActionButton onClick={() => handleDelete(item.docId)} icon="bx bxs-calendar-x" color="red" content="Xoá tài liệu" />
                </div>
            </td>
        </tr>
    );

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [gender, setGender] = useState(0);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [email, setEmail] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(profileImage);

    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

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

    // Documents
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [documentList, setDocumentList] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [docId, setDocId] = useState("");

    usePrivateAxios();

    const navigate = useNavigate();

    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        getUploadedDocumentList(currentPage);
    }, [currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
        selectedPage = page - 1;
    };

    const getUploadedDocumentList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getUploadedDocuments({
                params: {
                    page: page - 1,
                    size: 10,
                },
            });
            setIsFetching(false);
            if (response.status === 200) {
                setDocumentList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getUserProfile = async () => {
        try {
            const response = await getProfile();

            if (response.status === 200) {
                const user = response.data;
                setUser(user);
                setLastName(user.lastName);
                setFirstName(user.firstName);
                setGender(user.gender);
                setDateOfBirth(user.dateOfBirth);
                setEmail(user.email);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteDocument = async (docId) => {
        setIsLoadingDelete(true);
        try {
            const response = await deleteADocument(docId);

            setIsLoadingDelete(false);

            setOpenModal(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá tài liệu thành công!</p>, toastOptions);

                getUploadedDocumentList(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleDetail = (slug) => {
        navigate(`/manager/documents/${slug}`);
    };

    const handleEdit = (slug) => {
        navigate(`/manager/documents/${slug}/edit`);
    };

    const handleDelete = (docId) => {
        setOpenModal(true);
        setDocId(docId);
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

    const validateInfo = () => {
        const isLastNameValid = validateLastName();
        const isFirstNameValid = validateFirstName();
        const isEmailValid = validateEmail();
        const isDateOfBirthValid = validateDateOfBirth();

        if (!isLastNameValid || !isFirstNameValid || !isEmailValid || !isDateOfBirthValid) {
            return false;
        } else return true;
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
                        toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
                    }
                }
            } catch (error) {
                setIsLoadingInfo(false);
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        }
    };

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();

        const isFileValid = validateFile();

        if (isFileValid) {
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
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
                }
            } catch (error) {
                setIsLoadingAvatar(false);
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
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
                        toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
                    }
                }
            } catch (error) {
                setIsLoadingPassword(false);
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        }
    };

    return (
        <div>
            <PageHead title={`${user && user.lastName} ${user && user.firstName} - Trang cá nhân - Quản lý - miniverse`} description={`Trang cá nhân ${user && user.lastName} ${user && user.firstName} - Quản lý - miniverse`} url={window.location.href} imageUrl={user && user.image} />

            <div className="row">
                <div className="col-12 flex">
                    <div className="card w-2/3 h-min mr-5">
                        <div className="card__body">
                            <div className="mb-9">
                                <div className="flex items-center mb-2 font-bold">
                                    <HiAdjustments className="w-8 h-8 mr-3 dark:text-white" />
                                    <span className="block text-2xl font-bold dark:text-white">Cập nhật thông tin</span>
                                </div>
                            </div>
                            <div className="block mb-4 text-xl font-medium dark:text-white">THÔNG TIN CƠ BẢN</div>
                            <form onSubmit={handleSubmitAvatar}>
                                <div className="mb-4 w-1/2 m-auto">
                                    <div className="flex flex-col items-center mb-2">
                                        <img alt="Profile" src={image} className="rounded-full w-24 h-24 shadow-lg" />
                                    </div>
                                    <div className="mb-2 mt-4">
                                        <Label htmlFor="avatar-upload" value="Tải ảnh đại diện" />
                                    </div>
                                    <FileInput id="avatar-upload" helperText="PNG, JPG, JPEG, BMP (Tối đa 5MB)." accept=".jpg, .png, .jpeg, .bmp" onChange={handleImageUpload} />
                                    {!isFileValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* {fileMessage}</p>}

                                    <div className="flex justify-center mb-11 mt-4">
                                        <Button type="submit" isProcessing={isLoadingAvatar} color="blue" className="w-28 right-0">
                                            Tải lên
                                        </Button>
                                    </div>
                                </div>
                            </form>

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
                                            <TextInput id="email" placeholder="thuan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                                                value={moment(new Date(dateOfBirth)).format("DD-MM-YYYY")}
                                                onSelectedDateChanged={(date) => {
                                                    setDateOfBirth(date);
                                                }}
                                                required
                                            />
                                            {!isDateOfBirthValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Người dùng cần ít nhất 15 tuổi</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="justify-between mb-11">
                                    <Button type="submit" isProcessing={isLoadingInfo} color="success" className="w-28 right-0">
                                        Lưu
                                    </Button>
                                </div>
                            </form>

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
                                <div className="justify-between mt-5">
                                    <Button type="submit" isProcessing={isLoadingPassword} className="w-28">
                                        Đổi
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card w-1/3 p-0 h-min">
                        <img alt="ProfileBonnie image" src={profileBackground} className="w-full m-0 image__profile__background" />
                        <div className="card__body">
                            <div className="flex flex-col items-center pb-5">
                                <img alt="Profile" src={user && user.image ? user.image : profileImage} className="mb-3 rounded-full border-solid border-4 border-white w-28 h-28" style={{ marginTop: "-3.5rem" }} />

                                <h5 className="mb-2 text-2xl font-medium dark:text-white">
                                    {user && user.lastName} {user && user.firstName}
                                </h5>
                                <div className="flex gap-x-1">
                                    <Button color="success" pill>
                                        {user && user.role && roleList && roleList[user.role.roleName]}
                                    </Button>
                                </div>
                                <div className="profile-info mt-5">
                                    <div className="flex text-center font-bold">
                                        <span className="block text-base uppercase font-medium dark:text-white">{user && user.organization && user.organization.orgName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col profile-info">
                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiUser className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium text-sky-500 dark:text-white">
                                            {user && user.gender === 0 && "Nam"}
                                            {user && user.gender === 1 && "Nữ"}
                                            {user && user.gender === 2 && "Khác"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiCake className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium text-sky-500 dark:text-white">{user && moment(user.dateOfBirth).format("DD/MM/yyyy")}</span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiAtSymbol className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium text-sky-500 dark:text-white">{user && user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <h2 className="page-header">tài liệu đã tải lên</h2>
                            <div className="card__body">
                                <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={documentList} renderBody={(item, index) => renderBody(item, index)} />

                                {isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                                <div className="flex overflow-x-auto sm:justify-center">
                                    <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup className="z-49">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá tài liệu này không?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" isProcessing={isLoadingDelete} onClick={() => deleteDocument(docId)}>
                                    {"Chắc chắn"}
                                </Button>
                                <Button color="gray" disabled={isLoadingDelete} onClick={() => setOpenModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default ManagerProfile;
