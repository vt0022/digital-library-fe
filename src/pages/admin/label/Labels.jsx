import { activateLabel, deleteLabel, getAllLabels } from "@api/main/labelAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import LabelModal from "@components/management/admin/modal/label/LabelModal";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import PageHead from "@components/shared/head/PageHead";
import { Badge, Button, Modal, Pagination, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCheck, HiDocumentRemove, HiX } from "react-icons/hi";
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

const Labels = () => {
    const disabledStatus = [
        { name: "Đang hoạt động", value: "false" },
        { name: "Đã vô hiệu", value: "true" },
    ];

    const tableHead = ["", "Tên", "Trạng thái", "Số bài đăng", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer">
            <td className="w-1/12 min-w-1/12 text-center font-bold">{(currentPage - 1) * 2 + index + 1}</td>
            <td className="w-4/12 min-w-4/12 text-center">
                <span className="px-3 py-1 rounded-2xl text-white" style={{ backgroundColor: item.color }}>
                    {item.labelName}
                </span>
            </td>
            <td className="w-2/12 text-center">
                <div className="m-auto w-fit">
                    {item.disabled ? (
                        <Tooltip content="Kích hoạt nhãn" style="light">
                            <Badge
                                color="warning"
                                icon={HiX}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    activateThisLabel(item.labelId);
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
            <td className="w-2/12 text-center">{item.totalPosts}</td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.labelId);
                        }}
                        icon="bx bx-pencil"
                        color="amber"
                        content="Chỉnh sửa nhãn"
                    />
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.labelId);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá nhãn"
                    />
                </div>
            </td>
        </tr>
    );

    const navigate = useNavigate();

    usePrivateAxios();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [labelList, setLabelList] = useState([]);
    const [labelId, setLabelId] = useState("");

    const [openLabelModal, setOpenLabelModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(true);
    const [triggerModal, setTriggerModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [search, setSearch] = useState("");
    const [disabled, setDisabled] = useState("all");

    useEffect(() => {
        getLabelList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getLabelList(currentPage);
    }, [disabled, search]);

    const handleAdd = () => {
        setOpenLabelModal(true);
        setIsCreatingNew(true);
        setTriggerModal(triggerModal + 1);
    };

    const handleEdit = (labelId) => {
        setOpenLabelModal(true);
        setIsCreatingNew(false);
        setLabelId(labelId);
        setTriggerModal(triggerModal + 1);
    };

    const handleDelete = (labelId) => {
        setOpenDeleteModal(true);
        setLabelId(labelId);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getLabelList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getAllLabels({
                params: {
                    page: page - 1,
                    size: 10,
                    s: search,
                    disabled: disabled,
                },
            });

            setIsFetching(false);
            if (response.status === 200) {
                setLabelList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteThisLabel = async (labelId) => {
        setIsLoading(true);
        try {
            const response = await deleteLabel(labelId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                if (response.message === "Delete label from system successfully") toast.success(<p className="pr-2">Xoá nhãn thành công!</p>, toastOptions);
                else toast.warn(<p className="pr-2">Nhãn có bài đăng, đã huỷ kích hoạt!</p>, toastOptions);

                refreshLabelList();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const activateThisLabel = async (labelId) => {
        try {
            const response = await activateLabel(labelId);
            if (response.status === 200) {
                toast.success(<p className="pr-2">Kích hoạt nhãn thành công!</p>, toastOptions);

                refreshLabelList();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const refreshLabelList = () => {
        setCurrentPage(1);
        getLabelList(1);
    };

    return (
        <>
            <PageHead title="Quản lý nhãn - Admin - miniverse" description="Quản lý nhãn - Admin - miniverse" url={window.location.href} />

            <div className="w-4/5 m-auto">
                <div className="row">
                    <div className="px-[15px]">
                        <h2 className="page-header">Nhãn</h2>
                        <Button color="gray" className="mt-7 justify-self-end bg-white py-1.5" style={{ boxShadow: "var(--box-shadow)", borderRadius: "var(--border-radius)" }} onClick={handleAdd}>
                            <i className="bx bxs-calendar-plus mr-3 text-xl hover:text-white" style={{ color: "var(--main-color)" }}></i>
                            Thêm nhãn
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
                                {labelList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Không có kết quả!</p>}

                                {labelList.length > 0 && <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={labelList} renderBody={(item, index) => renderBody(item, index)} />}

                                {isFetching && <Spinner className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

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
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá nhãn này không?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={() => deleteThisLabel(labelId)}>
                                    Chắc chắn
                                </Button>
                                <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <LabelModal openLabelModal={openLabelModal} labelId={labelId} isCreatingNew={isCreatingNew} triggerModal={triggerModal} refreshLabelList={refreshLabelList} />
            </div>
        </>
    );
};

export default Labels;
