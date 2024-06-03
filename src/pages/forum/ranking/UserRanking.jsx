import PageHead from "@components/shared/head/PageHead";
import { getUserRanking } from "api/main/userAPI";
import { Avatar, Pagination, Spinner, Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiSolidMessageCheck, BiSolidMessageRoundedCheck } from "react-icons/bi";
import { BsFillChatHeartFill, BsFillChatLeftHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const UserRanking = () => {
    const navigate = useNavigate();

    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        getUserList(currentPage);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    const onPageChange = (page) => setCurrentPage(page);

    const getUserList = async (page) => {
        try {
            setIsFetching(true);

            const response = await getUserRanking({
                params: {
                    page: page - 1,
                    size: 10,
                    s: query,
                },
            });
            setUserList(response.data.content);
            setTotalPages(response.data.totalPages);

            setIsFetching(false);
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title="Bảng xếp hạng người dùng" description="Bảng xếp hạng người dùng - learniverse & shariverse" url={window.location.href} origin="forum" />

            <h1 className="text-4xl font-medium text-center my-8">Bảng xếp hạng người dùng</h1>

            <div className="w-4/5 m-auto p-5">
                <div className="bg-white mt-2 p-5 rounded-lg shadow-lg shadow-gray-300">
                    <div className="relative rounded-full w-1/3 ml-auto mb-5">
                        <input
                            type="text"
                            id="list-search"
                            className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-full"
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
                                    <div className="flex">
                                        <Tooltip content="Số lượt chấp nhận cho các bài đăng đã tạo" style="light">
                                            <BiSolidMessageCheck className="text-green-500 text-sm mr-1" />
                                            <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalPostAcceptances}</p>
                                        </Tooltip>

                                        <Tooltip content="Số lượt chấp nhận cho các phản hồi" style="light">
                                            <BiSolidMessageRoundedCheck className="text-emerald-500 text-sm mr-1" />
                                            <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalReplyAcceptances}</p>
                                        </Tooltip>

                                        <Tooltip content="Số lượt thích nhận được từ các bài đăng đã tạo" style="light">
                                            <BsFillChatHeartFill className="text-xs text-rose-500 mr-1" />
                                            <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalPostLikes}</p>
                                        </Tooltip>

                                        <Tooltip content="Số lượt thích nhận được từ các phản hồi" style="light">
                                            <BsFillChatLeftHeartFill className="text-xs text-red-500 mr-1" />
                                            <p className="text-gray-600 font-medium text-2xl mr-2">{user.totalReplyLikes}</p>
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
                    <div className="bg-white rounded-lg mt-2 w-fit shadow-lg shadow-gray-300 flex justify-end ml-auto items-center">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                    </div>
                )}
            </div>
        </>
    );
};

export default UserRanking;
