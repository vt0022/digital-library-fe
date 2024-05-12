import { activateSubsection, deleteSubsection, getAllSubsections } from "@api/main/sectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import SubsectionModal from "@components/management/admin/modal/subsection/SubsectionModal";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import { Badge, Button, Modal, Pagination, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCheck, HiDocumentRemove, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Subsections = () => {
    const disabledStatus = [
        { name: "Đang hoạt động", value: "false" },
        { name: "Đã vô hiệu", value: "true" },
    ];

    const editableStatus = [
        { name: "Không cho phép thành viên đăng", value: "false" },
        { name: "Cho phép thành viên đăng", value: "true" },
    ];

    const tableHead = ["", "Tên", "Trạng thái", "Quyền đăng", "Số bài đăng", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer" onClick={() => navigate("/admin/subsections/" + item.slug)}>
            <td className="w-1/12 min-w-1/12 text-center font-bold">{(currentPage - 1) * 2 + index + 1}</td>
            <td className="w-4/12 min-w-4/12 text-center">{item.subName}</td>
            <td className="w-2/12 text-center">
                <div className="m-auto w-fit">
                    {item.disabled ? (
                        <Tooltip content="Kích hoạt chuyên mục" style="light">
                            <Badge
                                color="warning"
                                icon={HiX}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    activateThisSubsection(item.subId);
                                }}
                                className="cursor-pointer">
                                Vô hiệu
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Badge color="green" icon={HiCheck}>
                            Hoạt động
                        </Badge>
                    )}
                </div>
            </td>
            <td className="w-2/12 text-center">
                <div className="m-auto w-fit">
                    {item.editable ? (
                        <Badge color="indigo" icon={HiCheck}>
                            Có
                        </Badge>
                    ) : (
                        <Badge color="red" icon={HiX}>
                            Không
                        </Badge>
                    )}
                </div>
            </td>
            <td className="w-2/12 text-center">{item.totalPosts}</td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.subId);
                        }}
                        icon="bx bx-pencil"
                        color="amber"
                        content="Chỉnh sửa chuyên mục"
                    />
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.subId);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá chuyên mục"
                    />
                </div>
            </td>
        </tr>
    );

    const toastOptions = {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    const navigate = useNavigate();

    usePrivateAxios();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [subsectionList, setSubsectionList] = useState([]);
    const [subsectionId, setSubsectionId] = useState("");

    const [openSubsectionModal, setOpenSubsectionModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(true);
    const [triggerModal, setTriggerModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [search, setSearch] = useState("");
    const [disabled, setDisabled] = useState("all");
    const [editable, setEditable] = useState("all");

    useEffect(() => {
        getSubsectionList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getSubsectionList(currentPage);
    }, [disabled, search, editable]);

    const handleAdd = () => {
        setOpenSubsectionModal(true);
        setIsCreatingNew(true);
        setTriggerModal(triggerModal + 1);
    };

    const handleEdit = (subsectionId) => {
        setOpenSubsectionModal(true);
        setIsCreatingNew(false);
        setSubsectionId(subsectionId);
        setTriggerModal(triggerModal + 1);
    };

    const handleDelete = (subsectionId) => {
        setOpenDeleteModal(true);
        setSubsectionId(subsectionId);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getSubsectionList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getAllSubsections({
                params: {
                    page: page - 1,
                    size: 10,
                    s: search,
                    disabled: disabled,
                    editable: editable,
                },
            });

            setIsFetching(false);
            if (response.status === 200) {
                setSubsectionList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteThisSubsection = async (subsectionId) => {
        setIsLoading(true);
        try {
            const response = await deleteSubsection(subsectionId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                if (response.message === "Delete subsection from system successfully") toast.success(<p className="pr-2">Xoá chuyên mục thành công!</p>, toastOptions);
                else toast.warn(<p className="pr-2">Chuyên mục có bài đăng, đã huỷ kích hoạt!</p>, toastOptions);

                getSubsectionList(1);
                setCurrentPage(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const activateThisSubsection = async (subsectionId) => {
        try {
            const response = await activateSubsection(subsectionId);
            if (response.status === 200) {
                toast.success(<p className="pr-2">Kích hoạt chuyên mục thành công!</p>, toastOptions);

                getSubsectionList(1);
                setCurrentPage(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const refreshSubsectionList = () => {
        setCurrentPage(1);
        getSubsectionList(1);
    };

    return (
        <div className="w-4/5 m-auto">
            <div className="row">
                <div className="px-[15px]">
                    <h2 className="page-header">Chuyên mục</h2>
                    <Button color="gray" className="mt-7 justify-self-end bg-white py-1.5" style={{ boxShadow: "var(--box-shadow)", borderRadius: "var(--border-radius)" }} onClick={handleAdd}>
                        <i className="bx bxs-calendar-plus mr-3 text-xl hover:text-white" style={{ color: "var(--main-color)" }}></i>
                        Thêm chuyên mục
                    </Button>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card__body flex items-end justify-between">
                            <div>
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
                            </div>

                            <div>
                                <SelectFilter
                                    selectName="Quyền đăng bài"
                                    options={editableStatus}
                                    selectedValue={editable}
                                    onChangeHandler={(e) => {
                                        setCurrentPage(1);
                                        setEditable(e.target.value);
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
                            {subsectionList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Không có kết quả!</p>}

                            {subsectionList.length > 0 && <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={subsectionList} renderBody={(item, index) => renderBody(item, index)} />}

                            {isFetching && <Spinner aria-label="Default status example" className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                            {totalPages > 1 && (
                                <div className="flex overflow-x-auto sm:justify-center">
                                    <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá chuyên mục này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={() => deleteThisSubsection(subsectionId)}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <SubsectionModal openSubsectionModal={openSubsectionModal} subsectionId={subsectionId} isCreatingNew={isCreatingNew} triggerModal={triggerModal} refreshSubsectionList={refreshSubsectionList} />
        </div>
    );
};

export default Subsections;
