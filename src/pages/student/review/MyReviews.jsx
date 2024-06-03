import { Pagination, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineCheck, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getMyReviews } from "../../../api/main/reviewAPI";
import usePrivateAxios from "../../../api/usePrivateAxios";
import ReviewCard from "../../../components/student/card/ReviewCard";
import PageHead from "components/shared/head/PageHead";

const MyReviews = () => {
    usePrivateAxios();

    const navigate = useNavigate();

    const [reviewList, setReviewList] = useState([]);
    const [verifiedStatus, setVerifiedStatus] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(0);

    const unselected = "border border-green-600 hover:bg-green-100";
    const selected = "text-white bg-green-600 hover:bg-green-700";

    useEffect(() => {
        getReviews();
    }, [verifiedStatus, currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getReviews = async () => {
        try {
            const response = await getMyReviews({
                params: {
                    status: verifiedStatus,
                },
            });

            if (response.status === 200) {
                setReviewList(response.data);
                //setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const refreshList = () => {
        getReviews();
    };

    const onEditReviewSuccess = () => {
        setStatus(1);
        setMessage("Đánh giá của bạn sẽ được duyệt lại!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    const onEditReviewFailure = () => {
        setStatus(-1);
        setMessage("Có lỗi xảy ra! Vui lòng thử lại!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    const onDeleteReviewSuccess = () => {
        setStatus(1);
        setMessage("Xoá đánh giá thành công!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    const onDeleteReviewFailure = () => {
        setStatus(-1);
        setMessage("Có lỗi xảy ra! Vui lòng thử lại!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    return (
        <>
            <PageHead title="Đánh giá của tôi" description="Đánh giá của tôi - learniverse & shariverse" url={window.location.href} origin="lib" />

            <div className="flex-1 p-4 bg-gray-50 h-full">
                <div className="rounded-lg bg-white py-8 px-8 ">
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
                            <ReviewCard review={review} key={index} refreshList={refreshList} onDeleteSuccess={onDeleteReviewSuccess} onDeleteFailure={onDeleteReviewFailure} onEditSuccess={onEditReviewSuccess} onEditFailure={onEditReviewFailure} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex overflow-x-auto sm:justify-center mt-4">
                            <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                        </div>
                    )}
                </div>
            </div>

            {status === -1 && (
                <Toast className="top-1/4 right-5 w-100 fixed z-50">
                    <HiX className="h-5 w-5 bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}

            {status === 1 && (
                <Toast className="top-1/4 right-5 fixed w-100 z-50">
                    <HiOutlineCheck className="h-5 w-5 bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}
        </>
    );
};

export default MyReviews;
