import { approveAReview, deleteAReview, getReviewsOfOrganization } from "@api/main/reviewAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import Table from "@components/management/table/Table";
import { Button, Label, Modal, Pagination, Spinner, TextInput } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiDocumentRemove } from "react-icons/hi";
import { MdReportProblem, MdReviews } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Reviews = () => {
    const tableHead = ["", "Rating", "Nội dung", "Người đánh giá", "Tài liệu", ""];

    const renderHead = (item, index) => (
        <th key={index} className="text-center">
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer">
            <td className="text-center font-bold">{(currentPage - 1) * 15 + index + 1}</td>
            <td className="max-w-xs text-justify font-bold">
                {item.star} <i className="bx bxs-star" style={{ color: "green" }}></i>
            </td>
            <td className="max-w-xs text-justify">{item.content}</td>
            <td className="max-w-xs text-center" onClick={() => handleUser(item.user.userId)}>
                {item.user && item.user.lastName} {item.user && item.user.firstName}
            </td>
            <td className="max-w-xs text-justify" onClick={() => handleDocument(item.document.slug)}>
                {item.document && item.document.docName}
            </td>
            <td className="text-center">
                <div className="flex space-x-0">
                    <ActionButton onClick={() => handleDelete(item)} icon="bx bx-trash" color="red" content="Xoá đánh giá" />
                    {item.verifiedStatus === 0 && <ActionButton onClick={() => handleApprove(item)} icon="bx bx-check-double" color="green" content="Duyệt đánh giá" />}
                    {item.verifiedStatus !== 0 && <ActionButton onClick={() => handleReapprove(item)} icon="bx bx-revision" color="indigo" content="Phê duyệt lại" />}
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

    // const user = useSelector((state) => state.LoginReducer.user);
    const user = JSON.parse(sessionStorage.getItem("profile"));

    const handleUser = (userId) => {
        navigate(`/manager/users/${userId}`);
    };

    const handleDocument = (slug) => {
        navigate(`/manager/documents/${slug}`);
    };

    const handleDelete = (review) => {
        setOpenModal(true);
        setReview(review);
    };

    const handleApprove = (review) => {
        setOpenAppoveModal(true);
        setReview(review);
        setNote("");
    };

    const handleReapprove = (review) => {
        setOpenAppoveModal(true);
        setReview(review);
        setNote(review.note);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [reviewList, setReviewList] = useState([]);
    const [review, setReview] = useState();
    const [verifiedStatus, setVerifiedStatus] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [openAppoveModal, setOpenAppoveModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [approvedStatus, setApprovedStatus] = useState(true);
    const [note, setNote] = useState("");

    const unselected = "border border-green-600 hover:bg-green-100";
    const selected = "text-white bg-green-600 hover:bg-green-700";

    useEffect(() => {
        getReviewList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        refreshList();
    }, [verifiedStatus]);

    const refreshList = () => {
        setCurrentPage(1);
        getReviewList(1);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getReviewList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getReviewsOfOrganization(user.organization.orgId, {
                params: {
                    page: page - 1,
                    size: 15,
                    verifiedStatus: verifiedStatus,
                },
            });
            setIsFetching(false);
            if (response.status === 200) {
                setReviewList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                // navigate("/manager/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteReview = async (reviewId) => {
        setIsLoading(true);
        try {
            const response = await deleteAReview(reviewId);
            setIsLoading(false);
            setOpenModal(false);
            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá đánh giá thành công!</p>, toastOptions);

                getReviewList(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const approveReview = async (reviewId, approvedStatus) => {
        setIsLoading(true);
        try {
            const response = await approveAReview(reviewId, {
                params: {
                    isApproved: approvedStatus,
                    note: note,
                },
            });

            setIsLoading(false);
            if (approvedStatus) setOpenAppoveModal(false);
            else {
                setOpenRejectModal(false);
                setNote("");
            }

            if (response.status === 200) {
                if (approvedStatus) toast.success(<p className="pr-2">Đã chấp nhận đánh giá!</p>, toastOptions);
                else toast.success(<p className="pr-2">Đã từ chối đánh giá!</p>, toastOptions);

                refreshList();
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
                    <h2 className="page-header">Đánh giá</h2>
                </div>

                <div className="col-12">
                    <div className="rounded-[15px] p-3 bg-white mb-5 flex space-x-5 text-base font-medium text-center">
                        <div className={`w-28 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === 10 ? selected : unselected}`} onClick={() => setVerifiedStatus(10)}>
                            Tất cả
                        </div>

                        <div className={`w-28 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === 1 ? selected : unselected}`} onClick={() => setVerifiedStatus(1)}>
                            Đã duyệt
                        </div>

                        <div className={`w-28 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === 0 ? selected : unselected}`} onClick={() => setVerifiedStatus(0)}>
                            Chưa duyệt
                        </div>

                        <div className={`w-28 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === -1 ? selected : unselected}`} onClick={() => setVerifiedStatus(-1)}>
                            Từ chối
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__body">
                            <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={reviewList} renderBody={(item, index) => renderBody(item, index)} />

                            {isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                            {totalPages > 1 && (
                                <div className="flex overflow-x-auto sm:justify-center">
                                    <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-red-600" />
                        <h3 className="mb-5 text-2xl font-medium text-gray-500">Bạn có chắc chắn muốn xoá đánh giá này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} onClick={() => deleteReview(review.reviewId)}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={openAppoveModal} size="md" onClose={() => setOpenAppoveModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <MdReviews className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-4 text-2xl font-medium text-gray-600">Duyệt đánh giá</h3>

                        {review && review.verifiedStatus !== 0 && (
                            <div className="text-sm text-justify pl-10 space-y-2">
                                <p>
                                    Đánh giá này đã{" "}
                                    <span className="font-medium">
                                        {review && review.verifiedStatus === 1 && "được chấp nhận"}
                                        {review && review.verifiedStatus === -1 && "bị từ chối"}
                                    </span>
                                </p>

                                {review && review.verifiedStatus === -1 && (
                                    <p>
                                        Thời gian: <span className="font-medium">{review && review.note}</span>
                                    </p>
                                )}

                                <p>
                                    Thời gian: <span className="font-medium">{moment(review && review.verifiedAt).format("DD/MM/YYYY HH:mm")}</span>
                                </p>

                                <p>
                                    Người duyệt:{" "}
                                    <span className="font-medium">
                                        {review && review.userVerified && review.userVerified.lastName} {review && review.userVerified && review.userVerified.firstName}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 mt-7">
                            {review && review.verifiedStatus !== 1 && (
                                <Button color="success" isProcessing={isLoading} onClick={() => approveReview(review.reviewId, true)}>
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
                                {review && review.verifiedStatus === -1 ? "Chỉnh sửa lý do" : "Từ chối"}
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
                        <MdReportProblem className="mx-auto mb-4 h-14 w-14 text-red-400" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Bạn có chắc chắn muốn từ chối đánh giá này không?</h3>
                        <div className="mb-4">
                            <div className="mb-2 block">
                                <Label htmlFor="note" value="Lý do" />
                            </div>
                            <TextInput id="note" placeholder="Nhập lý do..." value={note} onChange={(event) => setNote(event.target.value)} required />
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button color="warning" isProcessing={isLoading} onClick={() => approveReview(review.reviewId, false)}>
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

export default Reviews;
