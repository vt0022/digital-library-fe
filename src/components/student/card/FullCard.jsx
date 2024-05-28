import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

import { HiBadgeCheck, HiOutlineCalendar, HiOutlineEye, HiOutlineHeart } from "react-icons/hi";

import "./card.css";
const FullCard = (props) => {
    const { docName, thumbnail, docIntroduction, totalView, totalFavorite, averageRating, isContributed, updatedAt, slug } = props;

    const navigate = useNavigate();

    return (
        <>
            <Link to={`/documents/${slug}`} className="flex w-full rounded-lg h-[11.5rem] border-gray-50 border shadow-lg bg-white cursor-pointer hover:bg-green-100 focus:bg-green-50 active:bg-green-50 focus:border-green-200 active:border-green-200 focus:border-2 active:border-2">
                <div className="w-2/12 rounded-lg m-4 shadow-lg border ">
                    <img src={thumbnail} className="h-full w-full object-cover m-auto rounded-lg" alt={docName} />
                </div>
                <div className="w-8/12 p-3">
                    <div className="mb-2">
                        <h5 className="text-lg font-medium text-justify text-green-400 truncate whitespace-normal line-clamp-2">{docName}</h5>
                    </div>

                    <div className="mb-2">
                        <h5 className="text-sm text-justify truncate whitespace-normal line-clamp-3">{docIntroduction}</h5>
                    </div>

                    <div className="flex gap-10 text-base">
                        <div className="flex items-center">
                            <HiOutlineCalendar className="w-5 h-5 mr-2 text-gray-500 dark:text-white" />
                            <span className="block text-base text-red-500 dark:text-white">{moment(updatedAt).format("DD/MM/yyyy")}</span>
                        </div>

                        <div className="flex items-center">
                            <HiOutlineEye className="w-5 h-5 mr-2 text-gray-500 dark:text-white" />
                            <span className="block text-red-500 dark:text-white">{totalView}</span>
                        </div>

                        <div className="flex items-center">
                            <HiOutlineHeart className="w-5 h-5 mr-2 text-gray-500 dark:text-white" />
                            <span className="block text-base text-red-500 dark:text-white">{totalFavorite}</span>
                        </div>
                    </div>
                </div>
                <div className="w-2/12 p-1 flex space-y-4 flex-col justify-center">
                    {isContributed && (
                        <div className="flex items-center space-x-2 w-fit rounded-full px-3 py-1 text-white text-xs font-medium bg-rose-500">
                            <p className="w-2 h-2 rounded-full bg-white" />
                            <p>#bởi người dùng</p>
                        </div>
                    )}

                    {totalView > 200 && (
                        <div className="flex items-center space-x-2 w-fit rounded-full px-3 py-1 text-white text-xs font-medium bg-emerald-500">
                            <p className="w-2 h-2 rounded-full bg-white" />
                            <p>#xem nhiều</p>
                        </div>
                    )}

                    {averageRating > 4.9 && (
                        <div className="flex items-center space-x-2 w-fit rounded-full px-3 py-1 text-white text-xs font-medium bg-sky-400">
                            <p className="w-2 h-2 rounded-full bg-white" />
                            <p>#đánh giá cao</p>
                        </div>
                    )}
                </div>
            </Link>
        </>
    );
};

export default FullCard;
