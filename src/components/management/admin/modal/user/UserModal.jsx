import { getAccessibleOrganizations } from "@api/main/organizationAPI";
import { createUser, getAUser, updateUser } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import profileImage from "@assets/images/default_profile.jpg";
import Select from "@components/management/select/Select";
import { Button, Datepicker, FileInput, Label, Modal, TextInput } from "flowbite-react";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronUp } from "react-icons/hi";
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

const UserModal = (props) => {
    usePrivateAxios();

    const { userId, openUserModal, isCreatingNew, triggerModal, refreshUserList } = props;

    const genderList = [
        { id: 0, name: "Nam" },
        { id: 1, name: "Nữ" },
        { id: 2, name: "Khác" },
    ];
    const roleList = [
        { id: "c0a801b9-8ac0-1a60-818a-c04a8fb50038", roleName: "Admin" },
        { id: "c0a801b9-8ac0-1a60-818a-c04a8fa60037", roleName: "Quản lý" },
        { id: "c0a801b9-8ac0-1a60-818a-c04a8f950035", roleName: "Sinh viên" },
    ];

    const [openModal, setOpenModal] = useState(openUserModal);
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [gender, setGender] = useState(0);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [email, setEmail] = useState("");
    const [orgId, setOrgId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [organizationList, setOrganizationList] = useState([{}]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);
    const [isOrganizationValid, setIsOrganizationValid] = useState(true);
    const [isRoleValid, setIsRoleValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [isFileValid, setIsFileValid] = useState(true);
    const [fileMessage, setFileMessage] = useState("");
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
            if (!isCreatingNew) {
                getUserByUserId();
            } else {
                setImage(profileImage);
            }
            getOrganizationList();
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setLastName("");
        setFirstName("");
        setImage(profileImage);
        setGender(0);
        setDateOfBirth(new Date());
        setEmail("");
        setOrgId("");
        setRoleId("");
        setPassword("");
        setConfirmPassword("");
        setFileMessage("");
    };

    const getUserByUserId = async () => {
        try {
            const response = await getAUser(userId);

            if (response.status === 200) {
                const user = response.data;
                setLastName(user.lastName);
                setFirstName(user.firstName);
                user.image ? setImage(user.image) : setImage(profileImage);
                setGender(user.gender);
                setDateOfBirth(new Date(user.dateOfBirth));
                setEmail(user.email);
                user.organization ? setOrgId(user.organization.orgId) : setOrgId("");
                user.role ? setRoleId(user.role.id) : setRoleId("");
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getOrganizationList = async () => {
        try {
            const response = await getAccessibleOrganizations();

            if (response.status === 200) {
                setOrganizationList(response.data);
            } else {
            }
        } catch (error) {
            console.log(error);
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

    const validateOrganization = () => {
        if (roleId !== "c0a801b9-8ac0-1a60-818a-c04a8fb50038") {
            if (orgId === "" || orgId.trim() === "") {
                setIsOrganizationValid(false);
                return false;
            } else {
                setIsOrganizationValid(true);
                return true;
            }
        } else {
            setIsOrganizationValid(true);
            return true;
        }
    };

    const validateRole = () => {
        if (roleId === "" || roleId.trim() === "") {
            setIsRoleValid(false);
            return false;
        } else {
            setIsRoleValid(true);
            return true;
        }
    };

    const validatePassword = () => {
        if (isCreatingNew) {
            if (password === "" || password.trim() === "") {
                setIsPasswordValid(false);
                return false;
            } else {
                setIsPasswordValid(true);
                return true;
            }
        } else {
            setIsPasswordValid(true);
            return true;
        }
    };

    const validateConfirmPassword = () => {
        if (isCreatingNew) {
            if (confirmPassword === "" || confirmPassword.trim() === "") {
                setIsConfirmPasswordValid(false);
                setConfirmPasswordMessage("Vui lòng mật khẩu xác thực.");
                return false;
            } else if (confirmPassword !== password) {
                setIsConfirmPasswordValid(false);
                setConfirmPasswordMessage("Mật khẩu không khớp.");
                return false;
            } else {
                setIsConfirmPasswordValid(true);
                return true;
            }
        } else {
            setIsConfirmPasswordValid(true);
            return true;
        }
    };

    const validateFile = () => {
        if (imageFile === null && isCreatingNew) {
            setFileMessage("Vui lòng chọn ảnh đại diện");
            return false;
        } else if (imageFile !== null && (imageFile.size > 5 * 1024 * 1024 || imageFile.size === 0)) {
            setFileMessage("Vui lòng chọn ảnh hợp lệ và nhỏ hơn 5MB");
            return false;
        } else if (imageFile !== null && imageFile.type !== "image/jpeg" && imageFile.type !== "image/png" && imageFile.type !== "image/jpg" && imageFile.type !== "image/bmp") {
            setFileMessage("Vui lòng chỉ chọn tệp ảnh JPG, JPEG, PNG, BMP");
            return false;
        } else {
            return true;
        }
    };

    const validateInput = () => {
        const isLastNameValid = validateLastName();
        const isFirstNameValid = validateFirstName();
        const isEmailValid = validateEmail();
        const isDateOfBirthValid = validateDateOfBirth();
        const isOrganizationValid = validateOrganization();
        const isRoleValid = validateRole();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        setIsFileValid(validateFile());

        if (!isLastNameValid || !isFirstNameValid || !isEmailValid || !isDateOfBirthValid || !isOrganizationValid || !isRoleValid || !isPasswordValid || !isConfirmPasswordValid || !validateFile()) {
            return false;
        } else return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateInput()) {
            setIsLoading(true);

            try {
                const user = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    gender: gender,
                    dateOfBirth: dateOfBirth,
                    orgId: orgId,
                    roleId: roleId,
                    password: password,
                    confirmPassword: confirmPassword,
                };

                const formData = new FormData();
                formData.append("user", JSON.stringify(user));
                if (imageFile) formData.append("file", imageFile);

                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };

                let response = null;
                if (isCreatingNew) response = await createUser(formData, config);
                else response = await updateUser(userId, formData, config);

                setIsLoading(false);

                if (response.status === 200) {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setImage(profileImage);
                    setRoleId("");
                    setOrgId("");
                    setGender(0);

                    setOpenModal(false);

                    toast.success(<p className="pr-2">{isCreatingNew ? "Tạo người dùng" : "Cập nhật người dùng"} thành công!</p>, toastOptions);

                    refreshUserList();
                } else {
                    if (response.message === "Email already registered") {
                        toast.error(<p className="pr-2">Email đã được đăng ký trước đó!</p>, toastOptions);
                    } else if (response.message === "User not found") {
                        toast.error(<p className="pr-2">Không tìm thấy người dùng!</p>, toastOptions);
                    } else if (response.message === "Passwords not match") {
                        toast.error(<p className="pr-2">Mật khẩu không trùng khớp!</p>, toastOptions);
                    } else {
                        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                    }
                }
            } catch (error) {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } else {
        }
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Thêm người dùng mới"}
                            {!isCreatingNew && "Cập nhật người dùng"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <div className="flex flex-col items-center mb-5">
                                    <img alt="Profile" src={image} className="rounded-full w-24 h-24" />
                                </div>
                                <div>
                                    <Label htmlFor="avatar-upload" value="Tải ảnh đại diện" />
                                </div>
                                <FileInput id="avatar-upload" helperText="PNG, JPG, JPEG, BMP (Tối đa 5MB)." accept=".jpg, .png, .jpeg, .bmp" onChange={handleImageUpload} />
                                {!isFileValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* {fileMessage}</p>}
                            </div>

                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="lastName" value="Họ" />
                                </div>
                                <TextInput id="lastName" placeholder="Nguyễn" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
                                {!isLastNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập họ</p>}
                            </div>

                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="firstName" value="Tên" />
                                </div>
                                <TextInput id="firstName" placeholder="Văn Thuận" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
                                {!isFirstNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên</p>}
                            </div>

                            <div className="mb-6">
                                <Select
                                    selectName="Giới tính"
                                    options={genderList}
                                    selectedValue={gender}
                                    onChangeHandler={(e) => {
                                        setGender(e.target.value);
                                    }}
                                    name="name"
                                    field="id"
                                />
                            </div>

                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="firstName" value="Ngày sinh" />
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

                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Email" />
                                </div>
                                <TextInput id="email" placeholder="thuan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                {!isEmailValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập email</p>}
                            </div>

                            <div className="mb-6">
                                <Select
                                    selectName="Trường học"
                                    options={organizationList}
                                    selectedValue={orgId}
                                    onChangeHandler={(e) => {
                                        setOrgId(e.target.value);
                                    }}
                                    name="orgName"
                                    field="orgId"
                                />
                                {!isOrganizationValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng chọn trường</p>}
                            </div>

                            <div className="mb-6">
                                <Select
                                    selectName="Vai trò"
                                    options={roleList}
                                    selectedValue={roleId}
                                    onChangeHandler={(e) => {
                                        setRoleId(e.target.value);
                                    }}
                                    name="roleName"
                                    field="id"
                                    required
                                    className="mb-4"
                                />
                                {!isRoleValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng chọn vai trò</p>}
                            </div>

                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="password" value="Mật khẩu" />
                                </div>
                                <TextInput id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {!isPasswordValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập mật khẩu</p>}
                            </div>

                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="confirmPassword" value="Xác nhận mật khẩu" />
                                </div>
                                <TextInput id="confirmPassword" type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                {!isConfirmPasswordValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* {confirmPasswordMessage}</p>}
                            </div>

                            <div className="flex justify-between mt-5">
                                <Button
                                    onClick={() => {
                                        setOpenModal(false);
                                    }}
                                    disabled={isLoading}
                                    color="failure"
                                    className="w-auto">
                                    <HiChevronLeft className="mr-2 h-5 w-5" />
                                    Huỷ bỏ
                                </Button>

                                <Button type="submit" isProcessing={isLoading} color="success" className="w-auto">
                                    Lưu
                                    <HiChevronUp className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default UserModal;
