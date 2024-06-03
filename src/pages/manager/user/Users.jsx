import { disableAUser, enableAUser, getAllUsersByOrganization, getLatestUsersByOrganization } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import UserModal from "@components/management/manager/modal/user/UserModal";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import PageHead from "components/shared/head/PageHead";
import { Avatar, Badge, Button, Modal, Pagination, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { MdBlock } from "react-icons/md";
import { useMatch, useNavigate } from "react-router-dom";
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

const disabledStatus = [
    { name: "Đang hoạt động", value: "false" },
    { name: "Đã chặn", value: "true" },
];

const genderData = [
    { name: "Nam", value: "0" },
    { name: "Nữ", value: "1" },
    { name: "Khác", value: "2" },
];

const ManagerUsers = () => {
    const tableHead = ["", "Ảnh", "Họ", "Tên", "Email", "Vai trò", "Trạng thái", ""];

    const renderHead = (item, index) => (
        <th key={index} className="text-center">
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer">
            <td className="text-center font-bold" onClick={() => handleDetail(item.userId)}>
                {(currentPage - 1) * 10 + index + 1}
            </td>
            <td className="w-1/12 w-full flex justify-center items-center" onClick={() => handleDetail(item.userId)}>
                <Avatar img={item.image} alt="Profile" size="md" rounded />
            </td>
            <td className="w-2/12 text-center text-sm" onClick={() => handleDetail(item.userId)}>
                {item.lastName}
            </td>
            <td className="w-2/12 text-center text-sm" onClick={() => handleDetail(item.userId)}>
                {item.firstName}
            </td>
            <td className="w-3/12 text-center text-sm" onClick={() => handleDetail(item.userId)}>
                {item.email}
            </td>
            <td className="w-2/12 text-center" onClick={() => handleDetail(item.userId)}>
                <div className="m-auto w-fit">
                    {item.disabled ? (
                        <Tooltip content="Kích hoạt người dùng" style="light">
                            <Badge
                                color="warning"
                                icon={HiX}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnable(item.userId);
                                }}>
                                Đã vô hiệu
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Badge icon={HiCheck} color="success">
                            Đang hoạt động
                        </Badge>
                    )}
                </div>
            </td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton onClick={() => handleDetail(item.userId)} icon="bx bx-show-alt" color="green" content="Xem chi tiết người dùng" />
                    <ActionButton onClick={() => handleEdit(item.userId)} icon="bx bx-pencil" color="amber" content="Chỉnh sửa người dùng" />
                    {!item.disabled && <ActionButton onClick={() => handleDisable(item.userId)} icon="bx bx-x-circle" color="red" content="Chặn người dùng" />}
                </div>
            </td>
        </tr>
    );

    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("profile"));

    const isLatestRoute = useMatch("/manager/users/latest");

    const handleDetail = (userId) => {
        navigate(`/manager/users/${userId}`);
    };

    const handleAdd = () => {
        setOpenUserModal(true);
        setIsCreatingNew(true);
        setTriggerModal(triggerModal + 1);
    };

    const handleEdit = (userId) => {
        setOpenUserModal(true);
        setIsCreatingNew(false);
        setUserId(userId);
        setTriggerModal(triggerModal + 1);
    };

    const handleDisable = (userId) => {
        setOpenModal(true);
        setUserId(userId);
    };

    const handleEnable = (userId) => {
        enableUser(userId);
    };

    usePrivateAxios();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [userList, setUserList] = useState([]);
    const [userId, setUserId] = useState("");

    const [openUserModal, setOpenUserModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(true);
    const [triggerModal, setTriggerModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [search, setSearch] = useState("");
    const [disabled, setDisabled] = useState("all");
    const [gender, setGender] = useState("all");

    useEffect(() => {
        if (isLatestRoute) getLatestUserList(currentPage);
        else getUserList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        if (isLatestRoute) getLatestUserList(currentPage);
        else getUserList(currentPage);
    }, [gender, disabled, search]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getUserList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getAllUsersByOrganization(user.organization.slug, {
                params: {
                    page: page - 1,
                    size: 10,
                    disabled: disabled,
                    gender: gender,
                    s: search,
                },
            });

            setIsFetching(false);

            if (response.status === 200) {
                setUserList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLatestUserList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getLatestUsersByOrganization(user.organization.slug, {
                params: {
                    page: page - 1,
                    size: 15,
                    disabled: disabled,
                    gender: gender,
                    s: search,
                },
            });

            setIsFetching(false);

            if (response.status === 200) {
                setUserList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const disableUser = async (userId) => {
        setIsLoading(true);

        try {
            const response = await disableAUser(userId);

            setIsLoading(false);

            setOpenModal(false);

            if (response.status === 200) {
                setCurrentPage(1);
                if (isLatestRoute) {
                    getLatestUserList(currentPage);
                } else {
                    getUserList(currentPage);
                }

                toast.success(<p className="pr-2">Chặn người dùng thành công!</p>, toastOptions);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
        }
    };

    const enableUser = async (userId) => {
        setIsLoading(true);

        try {
            const response = await enableAUser(userId);

            setIsLoading(false);

            if (response.status === 200) {
                setCurrentPage(1);
                if (isLatestRoute) {
                    getLatestUserList(currentPage);
                } else {
                    getUserList(currentPage);
                }

                toast.success(<p className="pr-2">Kích hoạt người dùng thành công!</p>, toastOptions);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
        }
    };

    const refreshUserList = () => {
        setCurrentPage(1);
        isLatestRoute ? getLatestUserList(currentPage) : getUserList(currentPage);
    };

    return (
        <div>
            <PageHead title="Quản lý người dùng - Quản lý" description="Quản lý người dùng - learniverse & shariverse" url={window.location.href} origin="both" />

            <div className="row">
                <div className="px-[15px]">
                    <h2 className="page-header">{isLatestRoute ? "Người dùng mới" : "Người dùng"}</h2>
                    <Button color="gray" className="mt-7 justify-self-end bg-white py-1.5" style={{ boxShadow: "var(--box-shadow)", borderRadius: "var(--border-radius)" }} onClick={handleAdd}>
                        <i className="bx bxs-calendar-plus mr-3 text-xl hover:text-white" style={{ color: "var(--main-color)" }}></i>
                        Thêm người dùng
                    </Button>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <div className="flex items-end justify-between gap-5">
                                <SelectFilter
                                    selectName="Trạng thái"
                                    options={disabledStatus}
                                    selectedValue={disabled}
                                    onChangeHandler={(e) => {
                                        setCurrentPage(1);
                                        setDisabled(e.target.value);
                                    }}
                                    name="name"
                                    field="value"
                                    required
                                />

                                <SelectFilter
                                    selectName="Giới tính"
                                    options={genderData}
                                    selectedValue={gender}
                                    onChangeHandler={(e) => {
                                        setCurrentPage(1);
                                        setGender(e.target.value);
                                    }}
                                    name="name"
                                    field="value"
                                    required
                                />

                                <div className="relative rounded-lg mb-2 w-1/4 ml-auto ">
                                    <input
                                        type="text"
                                        id="list-search"
                                        className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-lg"
                                        placeholder="Tìm kiếm"
                                        onChange={(e) => {
                                            setCurrentPage(1);
                                            setSearch(e.target.value);
                                        }}
                                        value={search}
                                        required
                                    />

                                    <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-lg">
                                        <svg className="w-4 h-4 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4"></div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__body">
                            {userList.length === 0 && <p className="mt-2 mb-4 font-medium">Không có kết quả!</p>}
                            <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={userList} renderBody={(item, index) => renderBody(item, index)} />

                            {isFetching && <Spinner className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                            <div className="flex overflow-x-auto sm:justify-center">
                                <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <MdBlock className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn chặn người dùng này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} onClick={() => disableUser(userId)}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <UserModal openUserModal={openUserModal} userId={userId} isCreatingNew={isCreatingNew} triggerModal={triggerModal} refreshUserList={refreshUserList} />
        </div>
    );
};

export default ManagerUsers;
