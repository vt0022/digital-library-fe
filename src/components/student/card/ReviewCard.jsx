import { Button, Modal, Toast, Tooltip } from "flowbite-react";
import moment from "moment";
import React, { useState } from "react";
import { HiOutlineCheck, HiX } from "react-icons/hi";
import { MdReviews } from "react-icons/md";
import { RiDeleteBinLine, RiEditCircleLine, RiEye2Line } from "react-icons/ri";
import { deleteAReview } from "../../../api/main/reviewAPI";
import StarRating from "../rating/StarRating";
import Review from "../review/Review";

const ReviewCard = (props) => {
    const { review, refreshList, onEditSuccess, onEditFailure, onDeleteSuccess, onDeleteFailure } = props;

    const [openEditSection, setOpenEditSection] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const cancel = () => {
        setOpenEditSection(false);
    };

    const deleteReview = async () => {
        setIsLoading(true);
        try {
            const response = await deleteAReview(review.reviewId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                onDeleteSuccess();
                refreshList();
            } else {
                onDeleteFailure();
            }
        } catch (error) {
            console.log(error);
        }
    };

        const onEditReviewSuccess = () => {
            onEditSuccess();
        };

        const onEditReviewFailure = () => {
            onEditFailure();
        };

    return (
        <div className="flex p-5 space-x-5 rounded-lg shadow-lg border">
            <div className="w-2/12 h-fit rounded-lg shadow-lg border ">
                <img src={review && review.document && review.document.thumbnail} className="aspect-square w-full object-cover m-auto rounded-lg" alt={review.document && review.document.docName} />
            </div>

            <div className="w-9/12 space-y-3">
                <p className="text-lg font-medium truncate whitespace-normal line-clamp-2">{review && review.document && review.document.docName}</p>

                <StarRating rating={review && review.star} size="large" />

                <div className="bg-gray-100 rounded-lg p-5 space-y-3">
                    <p>{review && review.content}</p>

                    {review && review.updatedAt && <p className="text-xs text-gray-600">Đã chỉnh sửa vào {moment(review && review.updatedAt).format("DD-MM-yyyy HH:mm")}</p>}

                    {review && !review.updatedAt && <p className="text-xs text-gray-600">{moment(review && review.createdAt).format("DD-MM-yyyy HH:mm")}</p>}
                </div>

                {openEditSection && <Review reviewId={review && review.reviewId} oldStar={review && review.star} oldContent={review && review.content} isEditted={true} refreshList={refreshList} cancel={cancel} onSuccess={onEditReviewSuccess} onFailure={onEditReviewFailure} />}
            </div>

            <div className="w-1/12 text-center flex flex-col items-center space-y-5">
                {(review.timesLeft !== 0 || review.verifiedStatus !== 1) && (
                    <Tooltip content="Chỉnh sửa" style="light">
                        <RiEditCircleLine className="w-7 h-7 text-yellow-500 hover:text-yellow-300 active:text-yellow-200 cursor-pointer" onClick={() => setOpenEditSection(!openEditSection)} />
                    </Tooltip>
                )}

                <Tooltip content="Xoá" style="light">
                    <RiDeleteBinLine className="w-7 h-7 text-red-500 hover:text-red-300 active:text-red-200 cursor-pointer" onClick={() => setOpenDeleteModal(true)}/>
                </Tooltip>

                {review.verifiedStatus === -1 && (
                    <Tooltip content={review.note ? "Lý do bị từ chối: " + review.note : "Từ chối không có lý do"} style="light" trigger="click">
                        <RiEye2Line className="w-7 h-7 text-green-500 hover:text-green-300 active:text-yellow-200 cursor-pointer" />
                    </Tooltip>
                )}
            </div>

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <MdReviews className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá đánh giá này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={deleteReview}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" isProcessing={isLoading} disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ReviewCard;
