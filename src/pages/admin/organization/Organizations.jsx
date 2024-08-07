import { activateAnOrganization, deleteAnOrganization, getAllOrganizations } from "@api/main/organizationAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import OrganizationModal from "@components/management/admin/modal/organization/OrganizationModal";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import PageHead from "@components/shared/head/PageHead";
import { Badge, Button, Modal, Pagination, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCheck, HiDocumentRemove, HiX } from "react-icons/hi";
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

const Organizations = () => {
    const deletedStatus = [
        { name: "Đang hoạt động", value: "false" },
        { name: "Đã vô hiệu", value: "true" },
    ];

    const tableHead = ["", "Tên", "Trạng thái", "Số tài liệu", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );
    //
    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer" onClick={() => navigate("/admin/organizations/" + item.slug)}>
            <td className="w-1/12 text-center font-bold">{selectedPage * 10 + index + 1}</td>
            <td className="w-5/12 text-center">{item.orgName}</td>
            <td className="w-3/12 text-center">
                <div className="m-auto w-fit">
                    {item.deleted ? (
                        <Tooltip content="Kích hoạt trường" style="light">
                            <Badge
                                color="warning"
                                icon={HiX}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    activateOrganization(item.orgId);
                                }}
                                className="cursor-pointer">
                                Đã vô hiệu
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Badge icon={HiCheck}>Đang hoạt động</Badge>
                    )}
                </div>
            </td>
            <td className="w-2/12 text-center">{item.totalDocuments}</td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    {/* <ActionButton onClick={() => handleDetail(item.orgId)} icon="bx bxs-user-detail" color="green" content="Xem chi tiết người dùng" /> */}
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.orgId);
                        }}
                        icon="bx bx-pencil"
                        color="amber"
                        content="Chỉnh sửa trường"
                    />
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.orgId);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá trường"
                    />
                </div>
            </td>
        </tr>
    );

    const navigate = useNavigate();
    usePrivateAxios();

    // const handleDetail = (organizationId) => {
    //     navigate(`/admin/users/${organizationId}`);
    // };

    const handleAdd = () => {
        setOpenOrganizationModal(true);
        setIsCreatingNew(true);
        setTriggerModal(triggerModal + 1);
    };

    const handleEdit = (organizationId) => {
        setOpenOrganizationModal(true);
        setIsCreatingNew(false);
        setOrganizationId(organizationId);
        setTriggerModal(triggerModal + 1);
    };

    const handleDelete = (organizationId) => {
        setOpenDeleteModal(true);
        setOrganizationId(organizationId);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [organizationList, setOrganizationList] = useState([]);
    const [organizationId, setOrganizationId] = useState("");

    const [openOrganizationModal, setOpenOrganizationModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(true);
    const [triggerModal, setTriggerModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [search, setSearch] = useState("");
    const [deleted, setDeleted] = useState("all");

    useEffect(() => {
        selectedPage = currentPage - 1;
        getOrganizationList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getOrganizationList(currentPage);
    }, [deleted, search]);

    const onPageChange = (page) => {
        setCurrentPage(page);
        selectedPage = page - 1;
    };

    const getOrganizationList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getAllOrganizations({
                params: {
                    page: page - 1,
                    size: 10,
                    s: search,
                    deleted: deleted,
                },
            });

            setIsFetching(false);
            if (response.status === 200) {
                setOrganizationList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteOrganization = async (organizationId) => {
        setIsLoading(true);
        try {
            const response = await deleteAnOrganization(organizationId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                if (response.message === "Delete organization from system successfully") {
                    toast.success(<p className="pr-2">Xoá trường thành công!</p>, toastOptions);
                } else {
                    toast.warn(<p className="pr-2">Đã vô hiệu hoá trường do tồn tại tài liệu và người dùng liên quan!</p>, toastOptions);
                }

                getOrganizationList(1);
                setCurrentPage(1);
                selectedPage = 0;
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const activateOrganization = async (organizationId) => {
        try {
            const response = await activateAnOrganization(organizationId);
            if (response.status === 200) {
                {
                    toast.success(<p className="pr-2">Kích hoạt trường thành công!</p>, toastOptions);
                }

                getOrganizationList(1);
                setCurrentPage(1);
                selectedPage = 0;
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const refreshOrganizationList = () => {
        selectedPage = 0;
        setCurrentPage(1);
        getOrganizationList(1);
    };

    return (
        <>
            <PageHead title="Quản lý trường - Admin - miniverse" description="Quản lý trường - Admin - miniverse" url={window.location.href} />

            <div className="w-4/5 m-auto">
                <div className="row">
                    <div className="px-[15px]">
                        <h2 className="page-header">Trường</h2>
                        <Button color="gray" className="mt-7 justify-self-end bg-white py-1.5" style={{ boxShadow: "var(--box-shadow)", borderRadius: "var(--border-radius)" }} onClick={handleAdd}>
                            <i className="bx bxs-calendar-plus mr-3 text-xl hover:text-white" style={{ color: "var(--main-color)" }}></i>
                            Tạo trường
                        </Button>
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card__body flex items-end justify-between">
                                <div>
                                    <SelectFilter
                                        selectName="Trạng thái"
                                        options={deletedStatus}
                                        selectedValue={deleted}
                                        onChangeHandler={(e) => {
                                            setCurrentPage(1);
                                            setDeleted(e.target.value);
                                        }}
                                        name="name"
                                        field="value"
                                        required
                                    />
                                </div>

                                <div className="relative rounded-lg mb-2 w-1/3">
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
                        </div>

                        <div className="card">
                            <div className="card__body">
                                {organizationList.length === 0 && <p className="mt-2 mb-4 font-medium">Không có kết quả!</p>}

                                <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={organizationList} renderBody={(item, index) => renderBody(item, index)} />

                                {isFetching && <Spinner className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                                <div className="flex overflow-x-auto sm:justify-center">
                                    <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="z-40">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá trường này không?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" isProcessing={isLoading} onClick={() => deleteOrganization(organizationId)}>
                                    Chắc chắn
                                </Button>
                                <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <OrganizationModal openOrganizationModal={openOrganizationModal} organizationId={organizationId} isCreatingNew={isCreatingNew} triggerModal={triggerModal} refreshOrganizationList={refreshOrganizationList} />
            </div>
        </>
    );
};

export default Organizations;
