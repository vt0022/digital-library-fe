import { approveADocument, getPendingDocuments } from "@api/main/documentAPI";
import { getAllOrganizations } from "@api/main/organizationAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import { Badge, Button, Label, Modal, Pagination, Spinner, TextInput } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiNotification } from "react-icons/bi";
import { HiCheck, HiX } from "react-icons/hi";
import { HiDocumentCheck } from "react-icons/hi2";
import { MdRemoveDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const PendingDocuments = () => {
    const verifiedStatus = [
        { name: "Chưa phê duyệt", value: 0 },
        { name: "Đã phê duyệt", value: 1 },
        { name: "Từ chối", value: -1 },
    ];

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

    const tableHead = ["", "Tên", "Giới thiệu", "Trạng thái", ""];

    const renderHead = (item, index) => (
        <th key={index} className="cursor-pointer text-center">
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer">
            <td className="w-1/12 text-center font-bold" onClick={() => handleDetail(item.slug)}>
                {(currentPage - 1) * 10 + index + 1}
            </td>
            <td className="w-3/12" onClick={() => handleDetail(item.slug)}>
                {item.docName}
            </td>
            <td className="w-5/12" onClick={() => handleDetail(item.slug)}>
                <p className="truncate whitespace-normal leading-6 line-clamp-3">{item.docIntroduction}</p>
            </td>
            <td className="w-2/12" onClick={() => handleDetail(item.slug)}>
                <div className="m-auto w-fit">
                    {item.verifiedStatus === -1 && (
                        <Badge color="failure" icon={HiX}>
                            Từ chối
                        </Badge>
                    )}
                    {item.verifiedStatus === 1 && (
                        <Badge color="success" icon={HiCheck}>
                            Chấp nhận
                        </Badge>
                    )}
                    {item.verifiedStatus === 0 && (
                        <Badge color="warning" icon={BiNotification}>
                            Đang chờ
                        </Badge>
                    )}
                </div>
            </td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton onClick={() => handleDetail(item.slug)} icon="bx bx-show-alt" color="green" content="Xem chi tiết" />
                    {item.verifiedStatus === 0 && <ActionButton onClick={() => handleApprove(item)} icon="bx bx-check-double" color="teal" content="Phê duyệt" />}
                    {item.verifiedStatus !== 0 && <ActionButton onClick={() => handleReapprove(item)} icon="bx bx-revision" color="indigo" content="Phê duyệt lại" />}
                </div>
            </td>
        </tr>
    );

    const navigate = useNavigate();

    usePrivateAxios();

    const handleDetail = (slug) => {
        window.open(`/admin/documents/${slug}`, "_blank");
    };

    const handleApprove = (doc) => {
        setOpenAppoveModal(true);
        setDoc(doc);
        setReason("")
    };

    const handleReapprove = (doc) => {
        setOpenAppoveModal(true);
        setDoc(doc);
        setReason(doc.note);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [documentList, setDocumentList] = useState([]);
    const [organizationList, setOrganizationList] = useState([]);
    const [openAppoveModal, setOpenAppoveModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [organization, setOrganization] = useState("all");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [doc, setDoc] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        getOrganizationList();
    }, []);

    useEffect(() => {
        getDocumentList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        getDocumentList(1);
    }, [organization, status]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getDocumentList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getPendingDocuments({
                params: {
                    page: page - 1,
                    size: 10,
                    organization: organization,
                    status: status,
                },
            });

            setIsFetching(false);

            if (response.status === 200) {
                setDocumentList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                // navigate("/admin/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getOrganizationList = async () => {
        try {
            setIsFetching(true);
            const response = await getAllOrganizations({
                params: {
                    size: 1000,
                },
            });

            setIsFetching(false);
            if (response.status === 200) {
                setOrganizationList(response.data.content);
            } else {
                //navigate("/admin/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const approveDocument = async (docId, approvedStatus) => {
        setIsLoading(true);
        try {
            const response = await approveADocument(docId, {
                params: {
                    isApproved: approvedStatus,
                    note: reason,
                },
            });

            setIsLoading(false);
            if (approvedStatus) setOpenAppoveModal(false);
            else {
                setOpenRejectModal(false);
                setReason("");
            }

            if (response.status === 200) {
                if (approvedStatus) toast.success(<p className="pr-2">Đã chấp nhận tài liệu!</p>, toastOptions);
                else toast.success(<p className="pr-2">Đã từ chối tài liệu!</p>, toastOptions);
                getDocumentList(1);
                setCurrentPage(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="px-[15px]">
                    <h2 className="page-header">Tài liệu được chia sẻ bởi người dùng</h2>
                </div>
                
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <div className="flex flex-wrap justify-between">
                                <SelectFilter
                                    selectName="Trường"
                                    options={organizationList}
                                    selectedValue={organization}
                                    onChangeHandler={(e) => {
                                        setOrganization(e.target.value);
                                    }}
                                    name="orgName"
                                    field="slug"
                                    required
                                />

                                <SelectFilter
                                    selectName="Trạng thái"
                                    options={verifiedStatus}
                                    selectedValue={status}
                                    onChangeHandler={(e) => {
                                        setStatus(e.target.value);
                                    }}
                                    name="name"
                                    field="value"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__body">
                            <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={documentList} renderBody={(item, index) => renderBody(item, index)} />

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

            <Modal show={openAppoveModal} size="md" onClose={() => setOpenAppoveModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiDocumentCheck className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
                        <h3 className="mb-4 text-2xl font-medium text-gray-600">Duyệt tài liệu</h3>

                        {doc && doc.verifiedStatus !== 0 && (
                            <div className="text-sm text-justify pl-10 space-y-2">
                                <p>
                                    Tài liệu này đã{" "}
                                    <span className="font-medium">
                                        {doc && doc.verifiedStatus === 1 && "được chấp nhận"}
                                        {doc && doc.verifiedStatus === -1 && "bị từ chối"}
                                    </span>
                                </p>
                                {doc && doc.verifiedStatus === -1 && (
                                    <p>
                                        Thời gian: <span className="font-medium">{doc && doc.note}</span>
                                    </p>
                                )}
                                <p>
                                    Thời gian: <span className="font-medium">{moment(doc && doc.verifiedAt).format("DD/MM/YYYY HH:mm")}</span>
                                </p>
                                <p>
                                    Người duyệt:{" "}
                                    <span className="font-medium">
                                        {doc && doc.userVerified && doc.userVerified.lastName} {doc && doc.userVerified && doc.userVerified.firstName}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 mt-7">
                            {doc && doc.verifiedStatus !== 1 && (
                                <Button color="success" isProcessing={isLoading} onClick={() => approveDocument(doc && doc.docId, true)}>
                                    Chấp nhận
                                </Button>
                            )}

                            <Button
                                color="warning"
                                disabled={isLoading}
                                onClick={() => {
                                    setOpenRejectModal(true);
                                    setOpenAppoveModal(false);
                                }}>
                                {doc && doc.verifiedStatus === -1 ? "Chỉnh sửa lý do" : "Từ chối"}
                            </Button>

                            <Button color="gray" disabled={isLoading} onClick={() => setOpenAppoveModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={openRejectModal} size="md" onClose={() => setOpenRejectModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <MdRemoveDone className="mx-auto mb-4 h-14 w-14 text-red-400" />
                        <h3 className="mb-5 text-2xl font-medium text-gray-600">Bạn có chắc chắn muốn từ chối tài liệu này không?</h3>
                        <div className="mb-4">
                            <div className="mb-2 block">
                                <Label htmlFor="reason" value="Lý do" />
                            </div>
                            <TextInput id="reason" placeholder="Nhập lý do..." value={reason} onChange={(event) => setReason(event.target.value)} required />
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button color="warning" isProcessing={isLoading} onClick={() => approveDocument(doc && doc.docId, false)}>
                                Từ chối
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenRejectModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PendingDocuments;
