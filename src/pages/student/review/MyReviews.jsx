import { getMyReviews } from "@api/main/reviewAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import PageHead from "@components/shared/head/PageHead";
import ReviewCard from "@components/student/card/ReviewCard";
import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";
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

const MyReviews = () => {
    usePrivateAxios();

    const navigate = useNavigate();

    const [reviewList, setReviewList] = useState([]);
    const [verifiedStatus, setVerifiedStatus] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [openEditSection, setOpenEditSection] = useState(false);

    const unselected = "border border-green-600 hover:bg-green-100";
    const selected = "text-white bg-green-600 hover:bg-green-700";

    useEffect(() => {
        getReviews();
        onHideEditSection();
    }, [verifiedStatus, currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getReviews = async () => {
        try {
            const response = await getMyReviews({
                params: {
                    status: verifiedStatus,
                    page: currentPage - 1,
                    size: 10,
                },
            });

            if (response.status === 200) {
                setReviewList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const refreshList = () => {
        getReviews();
    };

    const onEditReviewSuccess = () => {
        toast.success(<p className="pr-2">Đánh giá của bạn sẽ được duyệt lại!</p>, toastOptions);
    };

    const onEditReviewFailure = () => {
        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
    };

    const onDeleteReviewSuccess = () => {
        toast.success(<p className="pr-2">Xoá đánh giá thành công!</p>, toastOptions);
        setCurrentPage(1);
    };

    const onDeleteReviewFailure = () => {
        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
    };

    const onOpenEditSection = () => {
        setOpenEditSection(true);
    };

    const onHideEditSection = () => {
        setOpenEditSection(false);
    };

    return (
        <>
            <PageHead title="Đánh giá của tôi" description="Đánh giá của tôi - learniverse & shariverse" url={window.location.href} origin="lib" />

            <div className="flex-1 p-4 h-full">
                <div className="w-5/6 rounded-lg bg-white py-8 px-8 m-auto">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-2xl font-medium text-green-400">Danh sách đánh giá của bạn</p>
                    </div>

                    <div className="rounded-[15px] bg-white mb-5 flex space-x-5 text-sm font-medium text-center">
                        <div className={`w-32 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === 10 ? selected : unselected}`} onClick={() => setVerifiedStatus(10)}>
                            Tất cả {verifiedStatus === 10 && `(${reviewList.length})`}
                        </div>

                        <div className={`w-32 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === 1 ? selected : unselected}`} onClick={() => setVerifiedStatus(1)}>
                            Đã duyệt {verifiedStatus === 1 && `(${reviewList.length})`}
                        </div>

                        <div className={`w-32 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === 0 ? selected : unselected}`} onClick={() => setVerifiedStatus(0)}>
                            Chưa duyệt {verifiedStatus === 0 && `(${reviewList.length})`}
                        </div>

                        <div className={`w-32 h-fit p-2 rounded-lg cursor-pointer ${verifiedStatus === -1 ? selected : unselected}`} onClick={() => setVerifiedStatus(-1)}>
                            Từ chối {verifiedStatus === -1 && `(${reviewList.length})`}
                        </div>
                    </div>

                    {reviewList.length === 0 && <p className="text-lg font-medium ">Bạn chưa có đánh giá nào!</p>}

                    <div className="space-y-5">
                        {reviewList.map((review, index) => (
                            <ReviewCard
                                review={review}
                                key={index}
                                refreshList={refreshList}
                                onDeleteSuccess={onDeleteReviewSuccess}
                                onDeleteFailure={onDeleteReviewFailure}
                                onEditSuccess={onEditReviewSuccess}
                                onEditFailure={onEditReviewFailure}
                                onOpenEditSection={onOpenEditSection}
                                onHideEditSection={onHideEditSection}
                                openEditSection={openEditSection}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex overflow-x-auto sm:justify-center mt-4">
                            <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyReviews;
