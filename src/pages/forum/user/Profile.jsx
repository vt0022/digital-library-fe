import DOMPurify from "dompurify";
import { Avatar, Button } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { HiChevronDoubleDown } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import { getPostsOfUser } from "../../../api/main/postAPI";
import { getRepliesOfUser } from "../../../api/main/replyAPI";
import { getAUser } from "../../../api/main/userAPI";
import TopBar from "../TopBar";
import "./profile.css";

const Profile = () => {
    const { userId } = useParams();

    const navigate = useNavigate();

    const [postList, setPostList] = useState([]);
    const [replyList, setReplyList] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [noOfPosts, setNoOfPosts] = useState(5);
    const [totalReplies, setTotalReplies] = useState(0);
    const [noOfReplies, setNoOfReplies] = useState(5);
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        getPostList();
        getReplyList();
    }, [noOfPosts, noOfReplies]);

    const handleMorePosts = () => {
        if (noOfPosts + 5 <= totalPosts) setNoOfPosts(noOfPosts + 5);
        else setNoOfPosts(totalPosts);
    };

    const handleMoreReplies = () => {
        if (noOfReplies + 5 <= totalReplies) setNoOfReplies(noOfReplies + 5);
        else setNoOfReplies(totalReplies);
    };

    const getPostList = async () => {
        try {
            const response = await getPostsOfUser(userId, {
                params: {
                    page: 0,
                    size: noOfPosts,
                },
            });
            if (response.status === 200) {
                setPostList(response.data.content);
                setTotalPosts(response.data.totalElements);
                if (response.data.totalElements < noOfPosts) setNoOfPosts(response.data.totalElements);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getReplyList = async () => {
        try {
            const response = await getRepliesOfUser(userId, {
                params: {
                    page: 0,
                    size: noOfReplies,
                },
            });
            if (response.status === 200) {
                setReplyList(response.data.content);
                setTotalReplies(response.data.totalElements);
                if (response.data.totalElements < noOfReplies) setNoOfReplies(response.data.totalElements);
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

    return (
        <div className="bg-gray-200">
            <TopBar />

            <div className="w-5/6 m-auto min-h-screen h-max mt-5 p-5">
                <div className="bg-white mt-2 p-5 rounded-lg flex">
                    <div className="w-1/4 rounded-lg py-5 bg-gray-100">
                        <Avatar alt="User" img={user && user.image ? user.image : ""} rounded bordered size="xl" className="mb-4 mt-2" />

                        <div className="text-center text-sm mt-5">{user && user.email}</div>

                        <div className="text-center font-semibold">
                            {user && user.lastName} {user && user.firstName}
                            {moment("2024-04-02").isSame(moment().subtract(1, "days"), "day") && <span className="text-xs text-red-500"> (Chưa xác thực)</span>}
                        </div>

                        <div className="text-center text-xs mt-5">Tham gia: {user && moment(user.createdAt).format("DD-MM-yyyy")}</div>

                        <div className="text-center text-xs">Lần cuối: 19/03/2022</div>
                    </div>

                    <div className="w-3/4 rounded-lg pl-5">
                        <div className="mb-2 border-b border-gray-200 dark:border-gray-700">
                            <ul
                                className="flex flex-wrap -mb-px text-base font-medium text-center"
                                id="default-styled-tab"
                                data-tabs-toggle="#default-styled-tab-content"
                                data-tabs-active-classes="text-green-400 hover:text-green-500 border-purple-600"
                                data-tabs-inactive-classes="text-gray-400 hover:text-gray-600 border-gray-100 hover:border-gray-300"
                                role="tablist">
                                <li className="me-2" role="presentation">
                                    <button className="inline-block p-4 border-b-2 rounded-t-lg" id="post-styled-tab" data-tabs-target="#styled-post" type="button" role="tab" aria-controls="post" aria-selected="false">
                                        Bài đăng
                                    </button>
                                </li>

                                <li className="me-2" role="presentation">
                                    <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="reply-styled-tab" data-tabs-target="#styled-reply" type="button" role="tab" aria-controls="reply" aria-selected="false">
                                        Phản hồi
                                    </button>
                                </li>

                                <li className="me-2" role="presentation">
                                    <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="about-styled-tab" data-tabs-target="#styled-about" type="button" role="tab" aria-controls="about" aria-selected="false">
                                        Thông tin
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div id="default-styled-tab-content">
                            <div className="hidden space-y-2" id="styled-post" role="tabpanel" aria-labelledby="post-tab">
                                {postList &&
                                    postList.map((post, index) => (
                                        <div className="px-4 py-2 border-b border-gray-300 space-y-1" key={index}>
                                            <p className="font-medium text-lg text-sky-700 cursor-pointer" onClick={() => navigate(`/forum/posts/${post.postId}`)}>
                                                {post.title}
                                            </p>
                                            <p className="text-sm truncate whitespace-normal line-clamp-2">{post.content && post.content.replace(/(<([^>]+)>)/gi, "")}</p>
                                            <p className="text-sm text-gray-400">{moment(post.createdAt).format("DD-MM-yyyy")}</p>
                                        </div>
                                    ))}

                                {totalPosts !== noOfPosts && (
                                    <Button className="ml-auto bg-green-400 enabled:hover:bg-green-500" onClick={handleMorePosts}>
                                        <HiChevronDoubleDown className="mr-2 h-5 w-5 " />
                                        Xem thêm
                                    </Button>
                                )}
                            </div>

                            <div className="hidden space-y-2" id="styled-reply" role="tabpanel" aria-labelledby="reply-tab">
                                {replyList &&
                                    replyList.map((reply, index) => (
                                        <div className="px-4 py-2 border-b border-gray-300 space-y-1" key={index}>
                                            <p className="font-medium text-sky-700">
                                                {reply.user && reply.user.lastName} {reply.user && reply.user.firstName} <span className="font-normal text-black">đã phản hồi tại </span>
                                                <span className="font-medium text-sky-700 cursor-pointer" onClick={() => navigate(`/forum/posts/${reply.post.postId}`)}>
                                                    {reply.post.title}
                                                </span>
                                            </p>
                                            <p className="text-sm truncate whitespace-normal line-clamp-2">{reply.content && reply.content.replace(/(<([^>]+)>)/gi, "")}</p>
                                            <p className="text-sm text-gray-400">{moment(reply.createdAt).format("DD-MM-yyyy")}</p>
                                        </div>
                                    ))}
                                {totalReplies !== noOfReplies && (
                                    <Button className="ml-auto bg-green-400 enabled:hover:bg-green-500" onClick={handleMoreReplies}>
                                        <HiChevronDoubleDown className="mr-2 h-5 w-5 " />
                                        Xem thêm
                                    </Button>
                                )}
                            </div>

                            <div className="hidden p-4 border-b border-gray-300 space-y-2" id="styled-about" role="tabpanel" aria-labelledby="about-tab">
                                <p>
                                    Tổng bài viết: <span className="font-semibold">2</span>
                                </p>
                                <p>
                                    Tổng phản hồi: <span className="font-semibold">50</span>
                                </p>
                                <p>
                                    Tổng lượt thích: <span className="font-semibold">20</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
