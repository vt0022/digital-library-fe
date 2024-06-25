import { Avatar, Pagination, Rating } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { countReviewsOfDocument, getReviewsOfDocument } from "../../../api/main/reviewAPI";
import StarRating from "../rating/StarRating";

const ReviewList = (props) => {
    const navigate = useNavigate();

    const { slug, totalReviews, averageRating } = props;

    const [reviewList, setReviewList] = useState([]);
    const [reviewCount, setReviewCount] = useState([]);
    const [rating, setRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const unselected = "border border-cyan-600 hover:bg-cyan-100";
    const selected = "text-white bg-cyan-600 hover:bg-cyan-700";

    useEffect(() => {
        getReviewCountByDocument();
    }, []);

    useEffect(() => {
        getReviewsByDocument();
        setCurrentPage(1);
    }, [rating]);

    useEffect(() => {
        getReviewsByDocument();
    }, [currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getReviewsByDocument = async () => {
        try {
            const response = await getReviewsOfDocument(slug, {
                params: {
                    rating: rating,
                    page: currentPage - 1,
                },
            });

            if (response.status === 200) {
                setReviewList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getReviewCountByDocument = async () => {
        try {
            const response = await countReviewsOfDocument(slug);

            if (response.status === 200) {
                setReviewCount(response.data);
            } else {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const findCount = (targetStar) => {
        const count = reviewCount.find(([star, count]) => star === targetStar);
        return count ? count[1] : 0;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 w-full h-fit">
            <div>
                <Rating className="mb-2">
                    <Rating.Star fill={~~averageRating >= 1} />
                    <Rating.Star fill={~~averageRating >= 2} />
                    <Rating.Star fill={~~averageRating >= 3} />
                    <Rating.Star fill={~~averageRating >= 4} />
                    <Rating.Star fill={~~averageRating >= 5} />
                    <p className="ml-2 text-base font-medium">
                        <span className="text-2xl">{averageRating}</span> trên 5 <span className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">({totalReviews} đánh giá)</span>
                    </p>
                </Rating>

                <div className="flex w-full justity-around">
                    <div className="w-1/2 space-y-2">
                        <Rating.Advanced percentFilled={totalReviews === 0 ? 0 : (findCount(5) / totalReviews) * 100}>5 star</Rating.Advanced>
                        <Rating.Advanced percentFilled={totalReviews === 0 ? 0 : (findCount(4) / totalReviews) * 100}>4 star</Rating.Advanced>
                        <Rating.Advanced percentFilled={totalReviews === 0 ? 0 : (findCount(3) / totalReviews) * 100}>3 star</Rating.Advanced>
                        <Rating.Advanced percentFilled={totalReviews === 0 ? 0 : (findCount(2) / totalReviews) * 100}>2 star</Rating.Advanced>
                        <Rating.Advanced percentFilled={totalReviews === 0 ? 0 : (findCount(1) / totalReviews) * 100}>1 star</Rating.Advanced>
                    </div>

                    <div className="w-1/2 grid grid-cols-3 text-black text-sm font-medium text-center gap-5">
                        <div className={`w-full h-fit p-2 rounded-lg cursor-pointer ${rating === 0 ? selected : unselected}`} onClick={() => setRating(0)}>
                            Tất cả ({totalReviews})
                        </div>
                        <div className={`w-full h-fit p-2 rounded-lg cursor-pointer ${rating === 5 ? selected : unselected}`} onClick={() => setRating(5)}>
                            5 sao ({findCount(5)})
                        </div>
                        <div className={`w-full h-fit p-2 rounded-lg cursor-pointer ${rating === 4 ? selected : unselected}`} onClick={() => setRating(4)}>
                            4 sao ({findCount(4)})
                        </div>
                        <div className={`w-full h-fit p-2 rounded-lg cursor-pointer ${rating === 3 ? selected : unselected}`} onClick={() => setRating(3)}>
                            3 sao ({findCount(3)})
                        </div>
                        <div className={`w-full h-fit p-2 rounded-lg cursor-pointer ${rating === 2 ? selected : unselected}`} onClick={() => setRating(2)}>
                            2 sao ({findCount(2)})
                        </div>
                        <div className={`w-full h-fit p-2 rounded-lg cursor-pointer ${rating === 1 ? selected : unselected}`} onClick={() => setRating(1)}>
                            1 sao ({findCount(1)})
                        </div>
                    </div>
                </div>
            </div>

            {reviewList.length === 0 && <p className="text-sm font-medium mt-8 text-center">Không có đánh giá nào!</p>}

            {reviewList.length > 0 && (
                <div className="grid grid-cols-2 gap-5 mt-8">
                    {reviewList.map((review, index) => (
                        <div className="shadow-lg rounded-lg border p-3">
                            <div className="flex items-center  gap-2" key={index}>
                                <Avatar alt={review.user.firstName} img={review.user.image} rounded />

                                <div>
                                    <p className="text-sm font-medium">
                                        {review.user.lastName} {review.user.firstName}
                                    </p>
                                    <p className="text-xs text-gray-600">{moment(review.createdAt).format("DD-MM-yyyy HH:mm")}</p>
                                </div>

                                <StarRating rating={review.star} />
                            </div>

                            <p className="text-xs text-justify mt-2">{review.content}</p>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex overflow-x-auto justify-center mt-4">
                    <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                </div>
            )}
        </div>
    );
};

export default ReviewList;
