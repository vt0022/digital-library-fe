import rankingImage from "@assets/images/ranking.png";
import PageHead from "@components/shared/head/PageHead";
import { getUserRanking } from "api/main/userAPI";
import { vi } from "date-fns/locale/vi";
import { Avatar, Pagination, Spinner, Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiErrorCircle, BiSolidMessageCheck, BiSolidMessageRoundedCheck } from "react-icons/bi";
import { BsFillChatHeartFill, BsFillChatLeftHeartFill } from "react-icons/bs";
import { HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./user-ranking.css";

registerLocale("vi", vi);

const UserRanking = () => {
    const navigate = useNavigate();

    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [query, setQuery] = useState("");
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    const [tab, setTab] = useState("all");

    const active = "border-b-2 border-red-500 font-medium text-red-500";
    const inactive = "hover:border-b-2 hover:border-red-400 hover:text-red-400";

    useEffect(() => {
        getUserList(currentPage);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    useEffect(() => {
        if (query === "") {
            setCurrentPage(1);
            getUserList(1);
        }
    }, [query]);

    useEffect(() => {
        setQuery("");
        setCurrentPage(1);
        getUserList(1);
    }, [month, year]);

    const onPageChange = (page) => setCurrentPage(page);

    const onClickTabAll = () => {
        setTab("all");
        setMonth(0);
        setYear(0);
    };

    const onClickTabMonth = () => {
        setTab("month");
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
    };

    const onClickTabYear = () => {
        setTab("year");
        setMonth(0);
        setYear(new Date().getFullYear());
    };

    const onSelectMonthPicker = (date) => {
        setMonth(date.getMonth() + 1);
        setYear(date.getFullYear());
    };

    const onSelectYearPicker = (date) => {
        setMonth(0);
        setYear(date.getFullYear());
    };

    const getUserList = async (page) => {
        try {
            setIsFetching(true);

            const response = await getUserRanking({
                params: {
                    page: page - 1,
                    size: 10,
                    s: query,
                    month: month,
                    year: year,
                },
            });
            setUserList(response.data.content);
            setTotalPages(response.data.totalPages);

            setIsFetching(false);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const renderMonthContent = (month, shortMonth) => {
        return <span>{shortMonth}</span>;
    };

    return (
        <>
            <PageHead title="Bảng xếp hạng người dùng" description="Bảng xếp hạng người dùng - learniverse & shariverse" url={window.location.href} origin="forum" />

            <img src={rankingImage} alt="Xếp hạng" width="20%" height="20%" className="m-auto" />

            <h1 className="text-4xl font-medium text-center my-5">Bảng xếp hạng người dùng</h1>

            <div className="flex">
                <div className="w-4/5 p-3">
                    <div className="bg-white mt-2 p-5 rounded-lg shadow-lg shadow-gray-300">
                        <div className="flex items-start justify-between mb-5">
                            <div className="space-y-5 mb-5">
                                <div className="flex space-x-1 text-gray-500 cursor-pointer">
                                    <div className={`w-fit px-3 py-2 ${tab === "all" ? active : inactive}`} onClick={onClickTabAll}>
                                        Từ trước đến nay
                                    </div>

                                    <div className={`w-fit px-3 py-2 ${tab === "month" ? active : inactive}`} onClick={onClickTabMonth}>
                                        Tháng
                                    </div>

                                    <div className={`w-fit px-3 py-2 ${tab === "year" ? active : inactive}`} onClick={onClickTabYear}>
                                        Năm
                                    </div>
                                </div>

                                <div className="ml-3">
                                    {tab === "month" && (
                                        <DatePicker
                                            selected={new Date(year, month === 0 ? 0 : month - 1)}
                                            renderMonthContent={renderMonthContent}
                                            showMonthYearPicker
                                            dateFormat="MM/yyyy"
                                            locale="vi"
                                            maxDate={new Date()}
                                            closeOnScroll={true}
                                            className="ml-3 rounded-lg focus:border focus:border-green-400 focus:ring-0"
                                            onChange={onSelectMonthPicker}
                                        />
                                    )}

                                    {tab === "year" && <DatePicker selected={new Date(year, 0)} showYearPicker dateFormat="yyyy" locale="vi" maxDate={new Date()} closeOnScroll={true} className="rounded-lg focus:border focus:border-green-400 focus:ring-0" onChange={onSelectYearPicker} />}
                                </div>
                            </div>

                            <div className="flex w-1/3 space-x-2 h-fit mt-2">
                                <div className="relative rounded-full ml-auto">
                                    <input
                                        type="text"
                                        id="list-search"
                                        className="text-sm text-black block w-full p-3 ps-5 border border-gray-200 bg-white focus:ring-0 focus:border-green-400 rounded-full"
                                        placeholder="Tìm kiếm"
                                        required
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                setCurrentPage(1);
                                                getUserList(1);
                                            }
                                        }}
                                    />

                                    <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-full">
                                        <svg className="w-4 h-4 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                </div>

                                <Tooltip content="Xoá tìm kiếm" style="light">
                                    <div
                                        className="text-green-400 rounded-full border h-fit p-3 cursor-pointer ml-2 hover:bg-green-400 active:border-2 hover:text-white active:border-2 active:border-green-100"
                                        onClick={() => {
                                            setQuery("");
                                        }}>
                                        <HiX className="w-4 h-4" />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>

                        {isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2" />}

                        {userList.length === 0 && !isFetching && <p className="text-center font-medium mb-3">Không tìm thấy người dùng nào!!!</p>}

                        {userList &&
                            userList.map((user, index) => (
                                <div key={index} className="flex mb-6">
                                    <div className="flex flex-col items-center justify-center w-2/12">
                                        <p className="text-gray-600 font-medium text-2xl">#{user.rank}</p>
                                        <p className="text-gray-500 text-xs">xếp hạng</p>
                                    </div>

                                    <div className="flex items-center w-4/12 space-x-3">
                                        <Avatar alt={user.lastName} img={user.image} rounded size="md" />

                                        <div>
                                            <p className="text-emerald-600 hover:text-emerald-500 cursor-pointer font-medium" onClick={() => navigate(`/forum/users/${user.userId}`)}>
                                                {user.lastName} {user.firstName}
                                            </p>
                                            <p className="text-gray-500 text-xs">tham gia khoảng {moment(user.createdAt).fromNow()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-4/12">
                                        <div className="flex space-x-2">
                                            <Tooltip content="Số lượt chấp nhận cho các bài đăng đã tạo" style="light">
                                                <div>
                                                    <BiSolidMessageCheck className="text-green-500 text-sm mr-1" />
                                                    <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalPostAcceptances}</p>
                                                </div>
                                            </Tooltip>

                                            <Tooltip content="Số lượt chấp nhận cho các phản hồi" style="light">
                                                <div>
                                                    <BiSolidMessageRoundedCheck className="text-emerald-500 text-sm mr-1" />
                                                    <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalReplyAcceptances}</p>
                                                </div>
                                            </Tooltip>

                                            <Tooltip content="Số lượt thích nhận được từ các bài đăng đã tạo" style="light">
                                                <div>
                                                    <BsFillChatHeartFill className="text-xs text-rose-500 mr-1" />
                                                    <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalPostLikes}</p>
                                                </div>
                                            </Tooltip>

                                            <Tooltip content="Số lượt thích nhận được từ các phản hồi" style="light">
                                                <div>
                                                    <BsFillChatLeftHeartFill className="text-xs text-red-500 mr-1" />
                                                    <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalReplyLikes}</p>
                                                </div>
                                            </Tooltip>
                                        </div>

                                        <p className="text-gray-500 text-xs">chỉ số</p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-2/12">
                                        <p className="text-gray-600 font-medium text-2xl">{user.totalScores}</p>

                                        <p className="text-gray-500 text-xs">danh tiếng</p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg mt-2 pb-2 w-fit shadow-lg shadow-gray-300 flex justify-end ml-auto items-center">
                            <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="" nextLabel="" showIcons className="text-sm" />
                        </div>
                    )}
                </div>

                <div className="w-1/5 h-fit py-3 pr-3">
                    <div className="h-fit flex flex-col space-y-4 bg-white mt-2 rounded-lg p-3 shadow-lg">
                        <BiErrorCircle className="text-amber-500 text-xl font-bold" />

                        <div className="text-xs text-justify">
                            <p className="font-semibold mb-2">Bảng xếp hạng người dùng là gì?</p>

                            <p>Bảng xếp hạng người dùng là một hệ thống sắp xếp và hiển thị thứ hạng của các người dùng trong diễn đàn dựa trên điểm danh tiếng của họ. Điểm danh tiếng được tính toán từ các hoạt động mà người dùng đã tham gia và đóng góp trên diễn đàn.</p>
                        </div>

                        <div className="text-xs text-justify">
                            <p className="font-semibold mb-2">Cách tính điểm danh tiếng?</p>

                            <p className="mb-2">Điểm danh tiếng được tính toán dựa trên 4 chỉ số: </p>

                            <ul className="list-disc pl-4 mb-2">
                                <li>
                                    Số lượt thích nhận được từ các bài đăng <span className="font-bold">(PL)</span>
                                </li>
                                <li>
                                    Số lượt thích nhận được từ các phản hồi <span className="font-bold">(RL)</span>
                                </li>
                                <li>
                                    Số lượt chấp nhận nhận được từ các bài đăng <span className="font-bold">(PA)</span>
                                </li>
                                <li>
                                    Số phản hồi được chấp nhận <span className="font-bold">(RA)</span>
                                </li>
                            </ul>

                            <p>
                                Điểm danh tiếng = <span className="font-bold">PL x 2 + RL x 2 + PA x 10 + RA x 10</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserRanking;
