import { getBadgesOfUser } from "@api/main/badgeAPI";
import { getAllPostsOfUser, getPostLikes } from "@api/main/postAPI";
import { getAllRepliesOfUser, getReplyLikes } from "@api/main/replyAPI";
import { getAUser } from "@api/main/userAPI";
import usePrivateAxios from "api/usePrivateAxios";
import { initFlowbite } from "flowbite";
import { Avatar, Pagination, Popover } from "flowbite-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import "./user.css";

const Activity = () => {
    initFlowbite();

    const navigate = useNavigate();

    usePrivateAxios();

    const [postList, setPostList] = useState([]);
    const [replyList, setReplyList] = useState([]);
    const [postLikeList, setPostLikeList] = useState([]);
    const [replyLikeList, setReplyLikeList] = useState([]);
    const [badgeList, setBadgeList] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPostPage, setCurrentPostPage] = useState(1);
    const [totalPostPages, setTotalPostPages] = useState(0);
    const [totalReplies, setTotalReplies] = useState(0);
    const [currentReplyPage, setCurrentReplyPage] = useState(1);
    const [totalReplyPages, setTotalReplyPages] = useState(0);
    const [currentPostLikePage, setCurrentPostLikePage] = useState(1);
    const [totalPostLikePages, setTotalPostLikePages] = useState(0);
    const [totalPostLikes, setTotalPostLikes] = useState(0);
    const [currentReplyLikePage, setCurrentReplyLikePage] = useState(1);
    const [totalReplyLikePages, setTotalReplyLikePages] = useState(0);
    const [totalReplyLikes, setTotalReplyLikes] = useState(0);
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState("");

    const myTab = useRef(null);

    const userId = JSON.parse(sessionStorage.getItem("profile")).userId;

    useEffect(() => {
        getUserProfile();
        getBadgeList();
    }, []);

    useEffect(() => {
        getPostList();
    }, [currentPostPage]);

    useEffect(() => {
        getReplyList();
    }, [currentReplyPage]);

    useEffect(() => {
        getPostLikeList();
    }, [currentPostLikePage]);

    useEffect(() => {
        getReplyLikeList();
    }, [currentReplyLikePage]);

    const scrollToTop = () => {
        myTab.current.scrollIntoView({ behavior: "smooth" });
    };

    const handleMorePosts = (page) => {
        setCurrentPostPage(page);
    };

    const handleMoreReplies = (page) => {
        setCurrentReplyPage(page);
    };

    const handleMorePostLikes = (page) => {
        setCurrentPostLikePage(page);
    };

    const handleMoreReplyLikes = (page) => {
        setCurrentReplyLikePage(page);
    };

    const resetPagesForPost = () => {
        setCurrentReplyPage(1);
        setCurrentPostLikePage(1);
        setCurrentReplyLikePage(1);
    };

    const resetPagesForReply = () => {
        setCurrentPostPage(1);
        setCurrentPostLikePage(1);
        setCurrentReplyLikePage(1);
    };

    const resetPagesForPostLike = () => {
        setCurrentPostPage(1);
        setCurrentReplyPage(1);
        setCurrentReplyLikePage(1);
    };

    const resetPagesForReplyLike = () => {
        setCurrentPostPage(1);
        setCurrentReplyPage(1);
        setCurrentPostLikePage(1);
    };

    const getPostList = async () => {
        try {
            const response = await getAllPostsOfUser(userId, {
                params: {
                    page: currentPostPage - 1,
                    size: 10,
                },
            });

            if (response.status === 200) {
                setPostList(response.data.content);
                setTotalPosts(response.data.totalElements);
                setTotalPostPages(response.data.totalPages);
                scrollToTop();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getReplyList = async () => {
        try {
            const response = await getAllRepliesOfUser(userId, {
                params: {
                    page: currentReplyPage - 1,
                    size: 10,
                },
            });

            if (response.status === 200) {
                setReplyList(response.data.content);
                setTotalReplies(response.data.totalElements);
                setTotalReplyPages(response.data.totalPages);
                scrollToTop();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getPostLikeList = async () => {
        try {
            const response = await getPostLikes({
                params: {
                    page: currentPostLikePage - 1,
                    size: 10,
                },
            });

            if (response.status === 200) {
                setPostLikeList(response.data.content);
                setTotalPostLikes(response.data.totalElements);
                setTotalPostLikePages(response.data.totalPages);
                scrollToTop();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getReplyLikeList = async () => {
        try {
            const response = await getReplyLikes({
                params: {
                    page: currentReplyLikePage - 1,
                    size: 10,
                },
            });

            if (response.status === 200) {
                setReplyLikeList(response.data.content);
                setTotalReplyLikes(response.data.totalElements);
                setTotalReplyLikePages(response.data.totalPages);
                scrollToTop();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUserProfile = async () => {
        try {
            const response = await getAUser(userId);

            if (response.status === 200) {
                const user = response.data;
                setUser(user);
            } else {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getBadgeList = async () => {
        try {
            const response = await getBadgesOfUser(userId);
            if (response.status === 200) {
                setBadgeList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="m-5 min-h-screen h-max px-[10%] py-5 bg-white rounded-lg space-y-5">
            <div className="flex items-center justify-center space-x-5 rounded-lg py-5">
                <Avatar alt="User" img={user && user.image ? user.image : ""} size="xl" className="rounded-md shadow-md w-fit" />

                <div>
                    <p className="text-4xl font-medium mb-2">
                        {user && user.lastName} {user && user.firstName}
                    </p>
                    <p className="text-sm text-gray-500">Tham gia vào khoảng {moment(user && user.createdAt).fromNow()}</p>
                </div>
            </div>

            <div className="rounded-lg p-5">
                <div className="mb-2 border-b pb-2 border-gray-200">
                    <ul
                        className="flex flex-wrap -mb-px text-base font-medium text-center"
                        id="default-styled-tab"
                        data-tabs-toggle="#default-styled-tab-content"
                        data-tabs-active-classes="bg-green-400 text-white rounded-full hover:bg-green-500"
                        data-tabs-inactive-classes="text-gray-400 hover:bg-gray-100 hover:rounded-full"
                        role="tablist">
                        <li className="me-2" role="presentation">
                            <button className="inline-block px-6 py-2" id="post-styled-tab" data-tabs-target="#styled-post" type="button" role="tab" aria-controls="post" aria-selected="false" onClick={resetPagesForPost}>
                                Bài đăng
                            </button>
                        </li>

                        <li className="me-2" role="presentation">
                            <button className="inline-block px-6 py-2" id="reply-styled-tab" data-tabs-target="#styled-reply" type="button" role="tab" aria-controls="reply" aria-selected="false" onClick={resetPagesForReply}>
                                Phản hồi
                            </button>
                        </li>

                        <li className="me-2" role="presentation">
                            <button className="inline-block px-6 py-2" id="post-like-styled-tab" data-tabs-target="#styled-post-like" type="button" role="tab" aria-controls="post-like" aria-selected="false" onClick={resetPagesForPostLike}>
                                Lượt thích bài đăng
                            </button>
                        </li>

                        <li className="me-2" role="presentation">
                            <button className="inline-block px-6 py-2" id="reply-like-styled-tab" data-tabs-target="#styled-reply-like" type="button" role="tab" aria-controls="reply-like" aria-selected="false" onClick={resetPagesForReplyLike}>
                                Lượt thích phản hồi
                            </button>
                        </li>
                    </ul>
                </div>

                <div id="default-styled-tab-content" ref={myTab}>
                    <div className="hidden space-y-2" id="styled-post" role="tabpanel" aria-labelledby="post-tab">
                        <p className="text-2xl font-medium">{totalPosts} bài đăng</p>

                        {postList &&
                            postList.map((post, index) => (
                                <div className={`p-3 rounded-lg border space-y-2 ${(post.disabled || post.labelDisabled || post.subsectionDisabled || post.sectionDisabled) && "bg-red-100"}`} key={index}>
                                    <div className="flex text-sm items-center justify-between">
                                        <div className="flex space-x-3 items-center ">
                                            <p>{post.totalLikes} lượt thích</p>
                                            <p className="px-3 py-1 bg-green-500 rounded-md text-white">{post.totalReplies} phản hồi</p>
                                            <p className="text-gray-500">{post.totalViews} lượt xem</p>
                                        </div>

                                        {(post.disabled || post.labelDisabled || post.subsectionDisabled || post.sectionDisabled) && (
                                            <Popover
                                                content={
                                                    <div className="w-96 text-sm text-gray-500">
                                                        <div className="border-b border-gray-200 bg-gray-100 px-3 py-2">
                                                            <h3 className="font-semibold text-gray-900">Bài đăng này đã bị ẩn vì (những) lý do sau</h3>
                                                        </div>
                                                        <div className="px-3 py-2">
                                                            <ul class="list-disc pl-5">
                                                                {post.disabled && <li>Bài đăng đã bị gỡ</li>}
                                                                {post.labelDisabled && <li>Nhãn đã bị vô hiệu, bạn có thể chuyển sang nhãn khác</li>}
                                                                {post.subsectionDisabled && <li>Mục chính chứa chuyên mục đã bị vô hiệu</li>}
                                                                {post.subsectionDisabled && <li>Chuyên mục đã bị vô hiệu, bạn có thể chuyển sang chuyên mục khác</li>}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                }
                                                trigger="hover">
                                                <button>
                                                    <RiErrorWarningLine className="text-red-500 text-xl" />
                                                </button>
                                            </Popover>
                                        )}
                                    </div>

                                    <p className="font-medium text-lg text-sky-700 cursor-pointer" onClick={() => navigate(`/forum/posts/${post.postId}`)}>
                                        {post.title}
                                    </p>

                                    <div className="flex justify-between">
                                        <div className="flex space-x-5 text-xs">
                                            {post.subsection && <p className="px-3 py-1 rounded-md bg-teal-300 text-white">{post.subsection.subName}</p>}
                                            {post.label && (
                                                <p className="px-3 py-1 rounded-md text-white" style={{ backgroundColor: post.label.color }}>
                                                    #{post.label.labelName}
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 text-right">
                                            <span className="text-xs">đăng vào </span>
                                            {moment(post.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm" })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                        {totalPostPages === 0 && <p className="font-medium text-center">Không tìm thấy bài đăng nào!!!</p>}

                        {totalPostPages > 1 && <Pagination previousLabel="" nextLabel="" currentPage={currentReplyPage} totalPages={totalPostPages} onPageChange={handleMorePosts} showIcons />}
                    </div>

                    <div className="hidden space-y-2" id="styled-reply" role="tabpanel" aria-labelledby="reply-tab">
                        <p className="text-2xl font-medium">{totalReplies} phản hồi</p>

                        {replyList &&
                            replyList.map((reply, index) => (
                                <div className={`p-3 rounded-lg border space-y-1 ${(reply.disabled || reply.postDisabled) && "bg-red-100"}`} key={index}>
                                    <div className="flex text-sm space-x-3 items-center justify-between">
                                        <p className="px-3 py-1 bg-green-500 rounded-md text-white">{reply.totalLikes} lượt thích</p>

                                        {(reply.disabled || reply.postDisabled) && (
                                            <Popover
                                                content={
                                                    <div className="w-80 text-sm text-gray-500">
                                                        <div className="border-b border-gray-200 bg-gray-100 px-3 py-2">
                                                            <h3 className="font-semibold text-gray-900">Bình luận này đã bị ẩn vì (những) lý do sau</h3>
                                                        </div>
                                                        <div className="px-3 py-2">
                                                            <ul class="list-disc pl-5">
                                                                {reply.disabled && <li>Bình luận đã bị gỡ</li>}
                                                                {reply.postDisabled && <li>Bài đăng đã bị ẩn</li>}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                }
                                                trigger="hover">
                                                <button>
                                                    <RiErrorWarningLine className="text-red-500 text-xl" />
                                                </button>
                                            </Popover>
                                        )}
                                    </div>

                                    <p className="font-medium text-lg text-sky-700 cursor-pointer" onClick={() => navigate(`/forum/posts/${reply.post && reply.post.postId}`)}>
                                        {reply.post && reply.post.title}
                                    </p>

                                    <p className="text-sm truncate whitespace-normal line-clamp-2">{reply.content && reply.content.replace(/(<([^>]+)>)/gi, "")}</p>

                                    <p className="text-sm text-gray-600 text-right">
                                        <span className="text-xs">gửi vào </span>
                                        {moment(reply.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm" })}
                                    </p>
                                </div>
                            ))}

                        {totalReplyPages > 1 && (
                            <div className="flex justify-center">
                                <Pagination previousLabel="" nextLabel="" currentPage={currentReplyPage} totalPages={totalReplyPages} onPageChange={handleMoreReplies} showIcons />
                            </div>
                        )}

                        {totalReplies === 0 && <p className="font-medium text-center">Bạn chưa đăng phản hồi nào!!!</p>}
                    </div>

                    <div className="hidden space-y-2" id="styled-post-like" role="tabpanel" aria-labelledby="post-like-tab">
                        <p className="text-2xl font-medium">{totalPostLikes} lượt thích bài đăng</p>

                        {postLikeList &&
                            postLikeList.map((postLike, index) => (
                                <div className=" flex items-center p-3 rounded-lg border" key={index}>
                                    <p className="w-10/12 font-medium text-lg text-sky-700 cursor-pointer" onClick={() => navigate(`/forum/posts/${postLike.post && postLike.post.postId}`)}>
                                        {postLike.post && postLike.post.title}
                                    </p>

                                    <p className="w-2/12 text-sm text-gray-600 text-right">{moment(postLike.likedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm" })}</p>
                                </div>
                            ))}

                        {totalPostLikePages > 1 && (
                            <div className="flex justify-center">
                                <Pagination previousLabel="" nextLabel="" currentPage={currentPostLikePage} totalPages={totalPostLikePages} onPageChange={handleMorePostLikes} showIcons />
                            </div>
                        )}

                        {totalPostLikes === 0 && <p className="font-medium text-center">Bạn chưa thích bài đăng nào!!!</p>}
                    </div>

                    <div className="hidden space-y-2" id="styled-reply-like" role="tabpanel" aria-labelledby="reply-like-tab">
                        <p className="text-2xl font-medium">{totalReplyLikes} lượt thích phản hồi</p>

                        {replyLikeList &&
                            replyLikeList.map((replyLike, index) => (
                                <div className=" flex items-center p-3 rounded-lg border" key={index}>
                                    <div className="w-10/12">
                                        <p className="text-lg text-sky-700 cursor-pointer" onClick={() => navigate(`/forum/posts/${replyLike.reply && replyLike.reply.post && replyLike.reply.post.postId}`)}>
                                            {replyLike.reply && replyLike.reply.post && replyLike.reply.post.title}
                                        </p>

                                        <p className="text-sm truncate whitespace-normal line-clamp-2 mt-2">{replyLike.reply && replyLike.reply.content && replyLike.reply.content.replace(/(<([^>]+)>)/gi, "")}</p>
                                    </div>

                                    <p className="w-2/12 text-sm text-gray-600 text-right">{moment(replyLike.likedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm" })}</p>
                                </div>
                            ))}

                        {totalReplyLikePages > 1 && (
                            <div className="flex justify-center">
                                <Pagination previousLabel="" nextLabel="" currentPage={currentReplyLikePage} totalPages={totalReplyLikePages} onPageChange={handleMoreReplyLikes} showIcons />
                            </div>
                        )}

                        {totalReplyLikes === 0 && <p className="font-medium text-center">Bạn chưa thích phản hồi nào!!!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;
