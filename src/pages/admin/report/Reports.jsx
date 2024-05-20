import { deletePostReport, deleteReplyReport, getAllPostReports, getAllReplyReports, getRelatedPostReport, getRelatedReplyReport, handlePostReport, readPostReport, readReplyReport } from "@api/main/reportAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import reportReasons from "@assets/json-data/report_reasons.json";
import ActionButton from "@components/management/action-button/ActionButton";
import ReportModal from "@components/management/admin/modal/report/ReportModal";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import DetailReportModal from "components/management/admin/modal/report/DetailReportModal";
import { Button, Modal, Pagination, Spinner } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiDocumentRemove } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Reports = () => {
    const processStatus = [
        { name: "Đang chờ", value: "PENDING" },
        { name: "Đã đọc", value: "REVIEWED" },
        { name: "Đã gỡ nội dung", value: "DISABLED" },
        { name: "Đã xoá nội dung", value: "DELETED" },
    ];

    const tableHead = ["", "Nội dung", "Loại vi phạm", "Người báo báo", "Thời gian", "Trạng thái", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer text-sm">
            <td className="w-1/12 text-center font-bold">{(currentPage - 1) * 2 + index + 1}</td>

            <td className="w-3/12">
                <p className="w-full truncate whitespace-normal line-clamp-3">{target === "POST" ? item.post && item.post.title : item.reply && item.reply.content.replace(/(<([^>]+)>)/gi, "")}</p>
            </td>

            <td className="w-2/12 font-medium text-center">{findReasonByType(item.type)}</td>

            <td className="w-2/12 text-center">
                {item.user && item.user.lastName} {item.user && item.user.firstName}
            </td>

            <td className="w-2/12 text-center">{moment(item.reportedAt).calendar()}</td>

            <td className="w-1/12 text-center text-xs">
                {item.status === "PENDING" && <p className="m-auto text-white bg-violet-500 px-3 py-1 rounded-2xl w-fit">Đang chờ</p>}
                {item.status === "REVIEWED" && <p className="m-auto text-white bg-sky-500 px-3 py-1 rounded-2xl w-fit">Đã đọc</p>}
                {item.status === "DISABLED" && <p className="m-auto text-white bg-amber-500 px-3 py-1 rounded-2xl w-fit">Đã gỡ nội dung</p>}
                {/* {item.status === "DELETED" && <p className="text-sm text-white bg-amber-500 px-3 py-2">Đang chờ</p>} */}
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
                        <ActionButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDisableTarget(item);
                            }}
                            icon="bx bx-error-circle"
                            color="amber"
                            content="Gỡ nội dung"
                        />
                    )}
                    
                    {/* <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.status === "PENDING") readThisReport(item.reportId);
                            handleDeleteTarget(item.reportId);
                        }}
                        icon="bx bx-minus-circle"
                        color="orange"
                        content="Xoá nội dung"
                    /> */}
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(item);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá báo cáo"
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
    const [reportList, setReportList] = useState([]);
    const [reportId, setReportId] = useState("");
    const [content, setContent] = useState("");
    const [relatedContent, setRelatedContent] = useState([]);
    const [action, setAction] = useState("disable");

    const [openReportModal, setOpenReportModal] = useState(false);
    const [openDeleteReportModal, setOpenDeleteReportModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [triggerReportModal, setTriggerReportModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [status, setStatus] = useState("all");
    const [type, setType] = useState("all");
    const [target, setTarget] = useState("POST");

    useEffect(() => {
        getReportList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getReportList(currentPage);
    }, [type, status, target]);

    const findReasonByType = (name) => {
        const item = reportReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    const handleView = (report) => {
        if (report.status === "PENDING") readThisReport(report.reportId);
        setContent(report);
        getRelatedReports(report.reportId);
        setOpenViewModal(true);
    };

    const handleDisableTarget = (report) => {
        if (report.status === "PENDING") readThisReport(report.reportId);
        setOpenReportModal(true);
        setTriggerReportModal(triggerReportModal + 1);
        setReportId(report.reportId);
        setAction("disable");
    };

    const handleDeleteReport = (report) => {
        setOpenDeleteReportModal(true);
        setReportId(report.reportId);
        if (report.status === "PENDING") readThisReport(report.reportId);
    };

    const handleDeleteTarget = (reportId) => {
        setOpenReportModal(true);
        setTriggerReportModal(triggerReportModal + 1);
        setReportId(reportId);
        setAction("delete");
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const onCloseViewModal = () => {
        setOpenViewModal(false);
    };

    const getReportList = async (page) => {
        try {
            setIsFetching(true);
            const params = {
                page: page - 1,
                type: type,
                status: status,
            };
            let response = null;
            if (target === "POST") response = await getAllPostReports({ params });
            else response = await getAllReplyReports({ params });

            setIsFetching(false);

            if (response.status === 200) {
                setReportList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getRelatedReports = async (reportId) => {
        try {
            let response = null;
            if (target === "POST") response = await getRelatedPostReport(reportId);
            else response = await getRelatedReplyReport(reportId);

            if (response.status === 200) {
                setRelatedContent(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteThisReport = async (reportId) => {
        setIsLoading(true);
        try {
            let response = null;
            if (target === "POST") response = await deletePostReport(reportId);
            else response = await deleteReplyReport(reportId);

            setIsLoading(false);

            setOpenDeleteReportModal(false);
            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá báo cáo thành công!</p>, toastOptions);

                setCurrentPage(1);
                getReportList(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const readThisReport = async (reportId) => {
        try {
            let response = null;
            if (target === "POST") response = await readPostReport(reportId);
            else response = await readReplyReport(reportId);

            if (response.status === 200) {
                getReportList(currentPage);
            }
        } catch (error) {}
    };

    const deleteTarget = async (reportId) => {
        try {
            let params = {
                type: "delete",
            };
            let response = null;

            if (target === "POST")
                response = await handlePostReport(reportId, {
                    params,
                });
            else
                response = await readReplyReport(reportId, {
                    params,
                });

            if (response.status === 200) {
                getReportList(currentPage);

                toast.success(<p className="pr-2">Xoá {target === "POST" ? "bài đăng" : "phản hồi"} thành công!</p>, toastOptions);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {}
    };

    // const markReportAsStatus = (reportId) => {
    //     setReportList((prevList) => prevList.map((report) => (report.reportId === reportId ? { ...report, read: true } : report)));
    // };

    const refresh = () => {
        getReportList(currentPage);
    };

    return (
        <div className="w-full m-auto">
            <div className="row">
                <div className="px-[15px]">
                    <h2 className="page-header">Báo cáo vi phạm</h2>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card__body flex space-x-10 items-end justify-between">
                            <div className="flex space-x-5 items-end">
                                <SelectFilter
                                    selectName="Loại vi phạm"
                                    options={reportReasons}
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
                            {reportList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Không có kết quả!</p>}

                            {reportList.length > 0 && <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={reportList} renderBody={(item, index) => renderBody(item, index)} />}

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

            <ReportModal target={target} reportId={reportId} action={action} openReportModal={openReportModal} triggerReportModal={triggerReportModal} refresh={refresh} />

            <DetailReportModal target={target} content={content} relatedContent={relatedContent} openViewModal={openViewModal} onCloseViewModal={onCloseViewModal} handleView={handleView} />

            <Modal show={openDeleteReportModal} size="md" onClose={() => setOpenDeleteReportModal(false)} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá báo cáo {target === "POST" ? "bài đăng" : "phản hồi"} này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={() => deleteThisReport(reportId)}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteReportModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Reports;
