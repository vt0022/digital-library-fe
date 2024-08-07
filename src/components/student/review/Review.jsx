import { editAReview, postAReview } from "@api/main/reviewAPI";
import ClickableStarRating from "@components/student/rating/ClickableStarRating";
import { Button, Label, Textarea } from "flowbite-react";
import { useState } from "react";
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

const Review = (props) => {
    const { docId, reviewId, refreshDoc, oldStar, oldContent, isEditted, refreshList, cancelEdit } = props;
    const navigate = useNavigate();

    const [star, setStar] = useState(oldStar ? oldStar : 0);
    const [content, setContent] = useState(oldContent ? oldContent : "");
    const [isStarValid, setIsStarValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    const handleReview = async () => {
        if (star !== 0) {
            setIsLoading(true);
            try {
                const data = {
                    star: star,
                    content: content,
                };

                let response = null;
                if (isEditted) response = await editAReview(reviewId, data);
                else response = await postAReview(docId, data);

                setIsLoading(false);

                if (response.status === 200) {
                    if (isEditted) {
                        toast.success(<p className="pr-2">Đánh giá của bạn sẽ được duyệt lại!</p>, toastOptions);
                        cancelEdit();
                        refreshList();
                    } else {
                        toast.success(<p className="pr-2">Đánh giá của bạn sẽ được duyệt trước khi hiển thị!</p>, toastOptions);
                        setStar(0);
                        setContent("");
                        refreshDoc();
                    }
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                }
            } catch (error) {
                navigate("/error-500");
            }
        } else {
            setIsStarValid(false);
        }
    };

    const handleRatingChange = (newRating) => {
        setStar(newRating);
        setIsStarValid(true);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-5 h-fit">
                <div className=" mb-5">
                    <div className="mb-2 block">
                        <Label htmlFor="star" value="Rating" />
                    </div>
                    <ClickableStarRating initialRating={star} onChange={handleRatingChange} />
                    {!isStarValid && <p className="block mt-2 text-xs font-medium text-red-600 italic">Vui lòng chọn rating</p>}
                </div>

                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="content" value="Nội dung" />
                    </div>
                    <Textarea id="content" className="focus:border-green-500 focus:border-2 focus:ring-0 text-justify" placeholder="Nhập nội dung..." value={content} required rows={5} onChange={(e) => setContent(e.target.value)} />
                </div>

                {isEditted && <div className="mb-4 text-xs text-red-500 italic">* Mỗi người có thể chỉnh sửa đánh giá nhiều lần. Nếu đánh giá của bạn đã được duyệt 2 lần thì bạn không thể chỉnh sửa nữa.</div>}

                <div className="flex justify-between">
                    {user && accessToken && (
                        <Button pill className="bg-green-400 text-white enabled:hover:bg-green-300 enabled:active:bg-green-350 focus:border focus:ring-0 focus:bg-green-350 border border-solid px-3" onClick={handleReview} disabled={isLoading} isProcessing={isLoading}>
                            <span className="text-base">Gửi</span>
                        </Button>
                    )}

                    {isEditted && (
                        <Button pill className="bg-red-500 text-white enabled:hover:bg-red-400 enabled:active:bg-red-450 focus:border focus:ring-0 focus:bg-red-450 border border-solid px-3" onClick={cancelEdit} disabled={isLoading}>
                            <span className="text-base">Huỷ bỏ</span>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Review;
