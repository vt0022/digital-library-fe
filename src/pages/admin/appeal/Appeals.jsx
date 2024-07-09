import { deletePostAppeal, deleteReplyAppeal, getAllPostAppeals, getAllReplyAppeals, handlePostAppeal, handleReplyAppeal, readPostAppeal, readReplyAppeal } from "@api/main/appealAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import appealReasons from "@assets/json-data/appeal_reasons.json";
import reportReasons from "@assets/json-data/report_reasons.json";
import ActionButton from "@components/management/action-button/ActionButton";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import PageHead from "@components/shared/head/PageHead";
import DetailAppealModal from "components/management/admin/modal/appeal/DetailAppealModal";
import { Button, Modal, Pagination, Spinner } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { TbFlag3Filled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Appeals = () => {
    const processStatus = [
        { name: "Đang chờ", value: "PENDING" },
        { name: "Đã đọc", value: "REVIEWED" },
        { name: "Đã khôi phục", value: "RESTORED" },
        { name: "Giữ nguyên", value: "REMAIN" },
    ];

    const tableHead = ["", "Vi phạm", "Lý do khiếu nại", "Người báo báo", "Thời gian", "Trạng thái", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className={`cursor-pointer ${item.read ? "bg-gray-100" : ""}`} >
            <td className="w-1/12 text-center font-bold">{(currentPage - 1) * 2 + index + 1}</td>

            <td className="w-2/12 font-medium">{findReportReasonByType(target === "POST" ? item.postReport && item.postReport.type : item.replyReport && item.replyReport.type)}</td>

            <td className="w-2/12 font-medium">{findAppealReasonByType(item.type)}</td>

            <td className="w-2/12 text-center">
                {item.user && item.user.lastName} {item.user && item.user.firstName}
            </td>

            <td className="w-2/12 text-center">{moment(item.appealedAt).calendar()}</td>

            <td className="w-2/12 text-center">
                {item.status === "PENDING" && <p className="m-auto text-sm text-white bg-violet-500 px-3 py-1 rounded-2xl w-fit">Đang chờ</p>}
                {item.status === "REVIEWED" && <p className="m-auto text-sm text-white bg-sky-500 px-3 py-1 rounded-2xl w-fit">Đã đọc</p>}
                {item.status === "RESTORED" && <p className="m-auto text-sm text-white bg-green-500 px-3 py-1 rounded-2xl w-fit">Rút quyết định</p>}
                {item.status === "REMAIN" && <p className="m-auto text-sm text-white bg-amber-500 px-3 py-1 rounded-2xl w-fit">Giữ nguyên</p>}
            </td>

            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(item);
                        }}
                        icon="bx bx-show-alt"
                        color="green"
                        content="Xem nội dung"
                    />

                    {(item.status === "PENDING" || item.status === "REVIEWED") && (
                        <>
                            <ActionButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore(item);
                                }}
                                icon="bx bx-reset"
                                color="amber"
                                content="Gỡ quyết định"
                            />
                            <ActionButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemain(item);
                                }}
                                icon="bx bx-transfer"
                                color="orange"
                                content="Giữ nguyên quyết định"
                            />
                        </>
                    )}
                    {/* 
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.status === "PENDING") readThisAppeal(item.appealId);
                            handleDeleteAppeal(item.appealId);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá khiếu nại"
                    /> */}
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
    const [appealList, setAppealList] = useState([]);
    const [appealId, setAppealId] = useState("");
    const [content, setContent] = useState("");
    const [notSolved, setNotSolved] = useState(false);

    const [openRestoreModal, setOpenRestoreModal] = useState(false);
    const [openRemainModal, setOpenRemainModal] = useState(false);
    const [openDeleteAppealModal, setOpenDeleteAppealModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [status, setStatus] = useState("PENDING");
    const [type, setType] = useState("all");
    const [target, setTarget] = useState("POST");

    useEffect(() => {
        getAppealList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getAppealList(currentPage);
    }, [type, status, target]);

    const findReportReasonByType = (name) => {
        const item = reportReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    const findAppealReasonByType = (name) => {
        const item = appealReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    const onCloseViewModal = () => {
        setOpenViewModal(false);
    };

    const handleView = (appeal) => {
        if (appeal.status === "PENDING") readThisAppeal(appeal.appealId);
        setNotSolved(appeal.status === "PENDING" || appeal.status === "REVIEWED");
        setAppealId(appeal.appealId);
        setContent(appeal);
        setOpenViewModal(true);
    };

    const handleRestoreAction = () => {
        setOpenViewModal(false);
        setOpenRestoreModal(true);
    };

    const handleRemainAction = () => {
        setOpenViewModal(false);
        setOpenRemainModal(true);
    };

    const handleRemain = (appeal) => {
        if (appeal.status === "PENDING") readThisAppeal(appeal.appealId);
        setOpenRemainModal(true);
        setAppealId(appeal.appealId);
    };

    const handleRestore = (appeal) => {
        if (appeal.status === "PENDING") readThisAppeal(appeal.appealId);
        setOpenRestoreModal(true);
        setAppealId(appeal.appealId);
    };

    const handleDeleteAppeal = (appeal) => {
        if (appeal.status === "PENDING") readThisAppeal(appeal.appealId);
        setOpenDeleteAppealModal(true);
        setAppealId(appeal.appealId);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getAppealList = async (page) => {
        try {
            setIsFetching(true);
            const params = {
                page: page - 1,
                type: type,
                status: status,
            };
            let response = null;
            if (target === "POST") response = await getAllPostAppeals({ params });
            else response = await getAllReplyAppeals({ params });

            setIsFetching(false);

            if (response.status === 200) {
                setAppealList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleAppeal = async (appealId, type) => {
        try {
            setIsFetching(true);

            let response = null;
            if (target === "POST")
                response = await handlePostAppeal(appealId, {
                    params: {
                        type: type,
                    },
                });
            else
                response = await handleReplyAppeal(appealId, {
                    params: {
                        type: type,
                    },
                });

            setIsLoading(false);

            if (type === "restore") setOpenRestoreModal(false);
            else setOpenRemainModal(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">{type === "restore" ? "Khôi phục" : "Giữ nguyên"} quyết định xử lý thành công!</p>, toastOptions);

                getAppealList(currentPage);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteThisAppeal = async (appealId) => {
        setIsLoading(true);
        try {
            let response = null;
            if (target === "POST") response = await deletePostAppeal(appealId);
            else response = await deleteReplyAppeal(appealId);

            setIsLoading(false);

            setOpenDeleteAppealModal(false);
            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá khiếu nại thành công!</p>, toastOptions);

                setCurrentPage(1);
                getAppealList(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const readThisAppeal = async (appealId) => {
        try {
            let response = null;
            if (target === "POST") response = await readPostAppeal(appealId);
            else response = await readReplyAppeal(appealId);

            if (response.status === 200) {
                getAppealList(currentPage);
            }
        } catch (error) {}
    };

    return (
        <>
            <PageHead title="Quản lý khiếu nại - Admin - miniverse" description="Quản lý khiếu nại - Admin - miniverse" url={window.location.href} />

            <div className="w-full m-auto">
                <div className="row">
                    <div className="px-[15px]">
                        <h2 className="page-header">Khiếu nại xử lý vi phạm</h2>
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card__body flex space-x-10 items-end justify-between">
                                <div className="flex space-x-5 items-end">
                                    <SelectFilter
                                        selectName="Lý do khiếu nại"
                                        options={appealReasons}
                                        selectedValue={type}
                                        onChangeHandler={(e) => {
                                            setCurrentPage(1);
                                            setType(e.target.value);
                                        }}
                                        name="value"
                                        field="name"
                                        required
                                    />

                                    <SelectFilter
                                        selectName="Trạng thái"
                                        options={processStatus}
                                        selectedValue={status}
                                        onChangeHandler={(e) => {
                                            setCurrentPage(1);
                                            setStatus(e.target.value);
                                        }}
                                        name="name"
                                        field="value"
                                        required
                                    />
                                </div>

                                <div className="flex mb-2 font-medium">
                                    <div className={`px-5 py-3 rounded-s-lg h-fit shadow-md cursor-pointer ${target === "POST" ? "text-white" : ""}`} style={{ backgroundColor: target === "POST" ? "var(--main-color)" : "white" }} onClick={() => setTarget("POST")}>
                                        Bài đăng
                                    </div>

                                    <div className={`px-5 py-3 rounded-e-lg h-fit shadow-md cursor-pointer ${target === "REPLY" ? "text-white" : ""}`} style={{ backgroundColor: target === "REPLY" ? "var(--main-color)" : "white" }} onClick={() => setTarget("REPLY")}>
                                        Phản hồi
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card__body">
                                {appealList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Không có kết quả!</p>}

                                {appealList.length > 0 && <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={appealList} renderBody={(item, index) => renderBody(item, index)} />}

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

                <Modal show={openRestoreModal} size="md" onClose={() => setOpenRestoreModal(false)} popup className="z-40">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <TbFlag3Filled className="mx-auto mb-4 h-14 w-14 text-green-600" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Bạn có chắc chắn muốn khôi phục {target === "POST" ? "bài đăng" : "phản hồi"} này không?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="success" isProcessing={isLoading} disabled={isLoading} onClick={() => handleAppeal(appealId, "restore")}>
                                    Chắc chắn
                                </Button>
                                <Button color="gray" disabled={isLoading} onClick={() => setOpenRestoreModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={openRemainModal} size="md" onClose={() => setOpenRemainModal(false)} popup className="z-40">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <TbFlag3Filled className="mx-auto mb-4 h-14 w-14 text-amber-600" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 ">Bạn có chắc chắn muốn giữ nguyên quyết định xử lý vi phạm {target === "POST" ? "bài đăng" : "phản hồi"} này không?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="warning" isProcessing={isLoading} disabled={isLoading} onClick={() => handleAppeal(appealId, "remain")}>
                                    Chắc chắn
                                </Button>
                                <Button color="gray" disabled={isLoading} onClick={() => setOpenRemainModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={openDeleteAppealModal} size="md" onClose={() => setOpenDeleteAppealModal(false)} popup className="z-40">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <TbFlag3Filled className="mx-auto mb-4 h-14 w-14 text-red-600" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Bạn có chắc chắn muốn xoá khiếu nại {target === "POST" ? "bài đăng" : "phản hồi"} này không?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={() => deleteThisAppeal(appealId)}>
                                    Chắc chắn
                                </Button>
                                <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteAppealModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <DetailAppealModal target={target} content={content} openViewModal={openViewModal} onCloseViewModal={onCloseViewModal} restore={handleRestoreAction} remain={handleRemainAction} notSolved={notSolved} />
            </div>
        </>
    );
};

export default Appeals;
