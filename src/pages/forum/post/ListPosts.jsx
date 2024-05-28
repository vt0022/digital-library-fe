import { getActiveLabels } from "@api/main/labelAPI";
import { getAllPosts } from "@api/main/postAPI";
import PageHead from "@components/shared/head/PageHead";
import SelectFilter from "@components/student/select/SelectFilter";
import { Avatar, Button, Pagination, Spinner } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ListPosts = () => {
    const navigate = useNavigate();

    const [params, setParams] = useSearchParams();
    const query = params.get("query");
    const { section = "", label = "" } = useParams();

    const [postList, setPostList] = useState([]);
    const [labelList, setLabelList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [order, setOrder] = useState("newest");
    const [labelSelect, setLabelSelect] = useState(label);
    const [isFetching, setIsFetching] = useState(false);

    const orderList = [
        {
            order: "newest",
            name: "Mới nhất",
        },
        {
            order: "oldest",
            name: "Cũ nhất",
        },
        {
            order: "mostViewed",
            name: "Xem nhiều nhất",
        },
        {
            order: "leastViewed",
            name: "Ít được xem nhất",
        },
        {
            order: "mostLiked",
            name: "Được thích nhiều",
        },
        {
            order: "leastLiked",
            name: "Ít được thích",
        },
        {
            order: "mostReplied",
            name: "Phản hồi nhiều",
        },
        {
            order: "leastReplied",
            name: "Ít phản hồi",
        },
    ];

    useEffect(() => {
        getLabelList();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        getPostList(currentPage);
    }, [order, query, labelSelect, section]);

    useEffect(() => {
        setLabelSelect(label);
    }, [label]);

    useEffect(() => {
        setLabelSelect("");
    }, [section]);

    useEffect(() => {
        getPostList(currentPage);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage, query]);

    const onPageChange = (page) => setCurrentPage(page);

    const getLabelList = async () => {
        try {
            const response = await getActiveLabels();
            setLabelList(response.data);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getPostList = async (page) => {
        try {
            setIsFetching(true);

            const response = await getAllPosts({
                params: {
                    page: page - 1,
                    size: 10,
                    order: order,
                    s: query,
                    subsection: section,
                    label: labelSelect === "all" ? "" : labelSelect,
                },
            });
            setPostList(response.data.content);
            setTotalPages(response.data.totalPages);

            setIsFetching(false);
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title={"Danh sách bài đăng" + (section === "" ? "" : "của chuyên mục " + section)} description={"Danh sách bài đăng" + (section === "" ? "" : "của " + section)} url={window.location.href} origin="forum" />

            <div className="w-11/12 m-auto p-5">
                <div className="w-fit flex justify-end ml-auto items-center mb-2 ">
                    <Button className="bg-green-400 enabled:hover:bg-green-500 shadow-lg shadow-gray-300" onClick={() => navigate("/forum/posts/new")}>
                        <HiOutlinePencilAlt className="mr-2 h-5 w-5 " />
                        Tạo bài viết
                    </Button>
                </div>

                <div className="flex bg-white rounded-lg shadow-lg shadow-gray-300">
                    <div className="w-fit flex text-xs w-fit px-2">
                        <div className="flex justify-between items-center w-full space-x-5">
                            <SelectFilter
                                className="w-full"
                                options={orderList}
                                selectedValue={order}
                                onChangeHandler={(e) => {
                                    setOrder(e.target.value);
                                }}
                                name="name"
                                field="order"
                                defaultName="Sắp xếp mặc định"
                                defaultValue="newest"
                                required
                            />

                            <SelectFilter
                                className="w-full"
                                options={labelList}
                                selectedValue={labelSelect}
                                onChangeHandler={(e) => {
                                    setLabelSelect(e.target.value);
                                }}
                                name="labelName"
                                field="slug"
                                defaultName="Tất cả nhãn"
                                defaultValue=""
                                required
                            />
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="w-fit flex justify-end ml-auto items-center">
                            <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                        </div>
                    )}
                </div>

                <div className="bg-white mt-2 p-5 rounded-lg shadow-lg shadow-gray-300">
                    {isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2" />}

                    {postList.length === 0 && !isFetching && <p className="text-center font-medium mb-3">Không tìm thấy bài đăng nào!!!</p>}

                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr className="bg-gray-100 border-y border-gray-300">
                                    <th className="w-8/12 text-base pl-4 font-medium ">Bài đăng</th>
                                    <th className="w-2/12 text-base font-medium ">Thống kê</th>
                                    <th className="w-2/12 text-base font-medium ">Mới nhất</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postList &&
                                    postList.map((post, index) => (
                                        <tr className="border-y border-gray-300 hover:bg-inherit" key={index}>
                                            <td className="pl-4 h-full">
                                                <div className="flex space-x-3 items-center h-full">
                                                    <div>
                                                        <Avatar alt="User" img={post.userPosted.image} rounded size="md" />
                                                    </div>

                                                    <div>
                                                        <p className="text-lg truncate whitespace-normal line-clamp-2 font-medium text-green-600 hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/posts/${post.postId}`)}>
                                                            {post.label && (
                                                                <span
                                                                    className="text-white rounded-md text-xs p-1 font-medium"
                                                                    style={{ backgroundColor: post.label && post.label.color }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(`/forum/labels/${post.label.slug}`);
                                                                    }}>
                                                                    #{post.label && post.label.labelName}
                                                                </span>
                                                            )}{" "}
                                                            {post.title}
                                                        </p>

                                                        <p>
                                                            <span className="text-sky-600 hover:text-sky-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                                                                {post.userPosted.lastName} {post.userPosted.firstName}
                                                            </span>
                                                            <span className="text-gray-900"> ● </span>
                                                            <span className="text-gray-400 text-sm">{moment(post.createdAt).format("DD/MM/yyyy")}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm pr-10">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-gray-500">Phản hồi:</p>
                                                    <p className="text-gray-900 font-semibold text-lg">{post.totalReplies}</p>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <p className="text-gray-500">Lượt xem:</p>
                                                    <p className="text-gray-900 font-semibold text-lg">{post.totalViews}</p>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <p className="text-gray-500">Lượt thích: </p>
                                                    <p className="text-gray-900 font-semibold text-lg">{post.totalLikes}</p>
                                                </div>
                                            </td>
                                            <td>
                                                {post.latestReply && (
                                                    <>
                                                        <p className="text-green-600 hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.post.latestReply.user.userId}`)}>
                                                            {post.latestReply.user && post.latestReply.user.lastName} {post.latestReply.user && post.latestReply.user.firstName}
                                                        </p>
                                                        <p className="text-gray-400 text-sm">{moment(post.latestReply.createdAt).format("DD/MM/yyyy")}</p>
                                                    </>
                                                )}

                                                {!post.latestReply && (
                                                    <>
                                                        <p className="text-green-600 hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                                                            {post.userPosted.lastName} {post.userPosted.firstName}
                                                        </p>
                                                        <p className="text-gray-400 text-sm">{moment(post.createdAt).format("DD/MM/yyyy")}</p>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
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

export default ListPosts;
