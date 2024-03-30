import DOMPurify from "dompurify";
import { Avatar, Button, Pagination } from "flowbite-react";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { HiOutlineThumbUp, HiOutlineX, HiReply, HiThumbUp } from "react-icons/hi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImageForReply } from "../../api/main/imageAPI";
import { getAPost, getAPostForGuest } from "../../api/main/postAPI";
import { likePost } from "../../api/main/postLikeAPI";
import { addReply, getReply, getReplyForGuest } from "../../api/main/replyAPI";
import { likeReply } from "../../api/main/replyLikeAPI";
import usePrivateAxios from "../../api/usePrivateAxios";
import TopBar from "./TopBar";
import "./post.css";

const DetailPost = () => {
    const { postId } = useParams();

    const navigate = useNavigate();

    const quill = useRef();

    usePrivateAxios();

    const [post, setPost] = useState();
    const [replyList, setReplyList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reply, setReply] = useState();
    const [parentReplyId, setParentReplyId] = useState(null);

    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(sessionStorage.getItem("profile"));

    useEffect(() => {
        getPostDetail(postId);
    }, [postId]);

    useEffect(() => {
        getPostReply(postId, currentPage);
    }, [postId, currentPage]);

    const onPageChange = (page) => setCurrentPage(page);

    const getPostDetail = async (postId) => {
        try {
            let response = null;

            if (user && accessToken) response = await getAPost(postId);
            else response = await getAPostForGuest(postId);

            if (response.status === 200) {
                setPost(response.data);
            } 
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getPostReply = async (postId, page) => {
        try {
            let response = null;

            if (user && accessToken)
                response = await getReply(postId, {
                    params: {
                        page: page - 1,
                        size: 10,
                    },
                });
            else
                response = await getReplyForGuest(postId, {
                    params: {
                        page: page - 1,
                        size: 10,
                    },
                });

            if (response.status === 200) {
                setReplyList(response.data.content);
                setTotalPages(response.data.totalPages);
            } 
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handlePostLike = async (postId) => {
        try {
            const response = await likePost(postId);
            if (response.status === 200) getPostDetail(postId);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleReplyLike = async (replyId) => {
        try {
            const response = await likeReply(replyId);
            if (response.status === 200) getPostReply(postId, currentPage);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const imageHandler = useCallback(() => {
        // Create an input element of type 'file'
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];

            const formData = new FormData();
            formData.append("image", file);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await uploadImageForReply(formData, config);

            const imageUrl = response.message;

            const quillEditor = quill.current.getEditor();

            if (quill) {
                // Get the current selection range and insert the image at that index
                const range = quillEditor.getSelection(true);
                quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
            }
        };
    }, []);

    const handleAddReply = async () => {
        try {
            const data = {
                content: reply,
                parentReplyId: parentReplyId,
            };
            const response = await addReply(postId, data);

            if (response.status === 200) { getPostReply(postId, currentPage);
                quill.current.getEditor().setText("");
            }
            else navigate("/error-404");
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleReplySection = (parentReply) => {
        const element = document.getElementById("replySection");
        element.scrollIntoView({ behavior: "smooth" });

        const parentReplySection = document.getElementById("parent-reply-section");
        if (parentReply) {
            const htmlContent = (
                <div className="bg-gray-200 border-l-4 border-green-800">
                    <div className="text-red-600 font-medium bg-gray-300 p-3 flex justify-between">
                        <p>
                            {parentReply.user.lastName} {parentReply.user.firstName}
                        </p>
                        <HiOutlineX className="h-5 w-5 cursor-pointer hover:text-orange-500" onClick={() => handleReplySection(null)} />
                    </div>
                    <div className="px-3">
                        <div className="py-3" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parentReply.content) }} />
                    </div>
                </div>
            );

            render(htmlContent, parentReplySection);

            setParentReplyId(parentReply.replyId);
        } else {
            render(null, parentReplySection);
            setParentReplyId(null);
        }
    };

    const handleParentReplySection = (parentReplyId) => {
        const element = document.getElementById(parentReplyId);
        element.scrollIntoView({ behavior: "smooth" });
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ script: "sub" }, { script: "super" }],
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
                    ["link", "image"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [imageHandler],
    );

    const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "color", "clean"];

    return (
        <div className="bg-gray-200">
            <TopBar />

            <div className="w-5/6 m-auto min-h-screen h-max mt-5 p-5 main-section">
                <div className="items-center mb-5 w-full border-b border-black py-2">
                    <p className="text-3xl font-medium">{post && post.title}</p>
                </div>
                {totalPages > 1 && (
                    <div className="bg-white rounded-lg w-fit flex justify-end ml-auto items-center">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                    </div>
                )}
                <div className="bg-white mt-2 p-5 rounded-lg grid gap-y-6">
                    <div className="w-full grid grid-cols-5 border border-gray-200 rounded-lg">
                        <div className="bg-gray-100  p-5">
                            <Avatar alt="User" img={post && post.userPosted && post.userPosted.image ? post.userPosted.image : ""} rounded bordered size="lg" className="mb-4 mt-2" />

                            <div className="text-center text-sm">{post && post.userPosted && post.userPosted.email}</div>

                            <div className="text-center font-semibold">
                                {post && post.userPosted && post.userPosted.lastName} {post && post.userPosted && post.userPosted.firstName}
                            </div>
                        </div>

                        <div className="col-span-4 bg-green-100  p-5">
                            <div className="flex justify-between py-3 border-b border-gray-200 text-gray-500 text-xs">
                                {post && post.updatedAt && (
                                    <p>
                                        {moment(post.updatedAt).format("DD/MM/yyyy HH:mm")} <span className="text-gray-400 italic ml-5">Đã chỉnh sửa</span>
                                    </p>
                                )}

                                {post && !post.updatedAt && <p>{moment(post.createdAt).format("DD/MM/yyyy HH:mm")}</p>}

                                <p>#1</p>
                            </div>

                            <div className="py-3">{post && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />}</div>

                            <div className="flex justify-between py-3 text-green-500 text-sm">
                                <div className="flex space-x-2 items-end">
                                    {post && post.liked && (
                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125  duration-150 bg-transparent" onClick={() => handlePostLike(postId)}>
                                            <HiThumbUp className="text-2xl hover:text-green-300 active:text-green-200 cursor-pointer" />
                                        </button>
                                    )}

                                    {post && !post.liked && (
                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125  duration-150 bg-transparent" onClick={() => handlePostLike(postId)}>
                                            <HiOutlineThumbUp className="text-2xl hover:fill-green-500 active:fill-green-600 active:text-green-600 cursor-pointer" />
                                        </button>
                                    )}

                                    <p>{post && post.totalLikes} lượt thích</p>
                                </div>

                                <div className="flex space-x-2 items-end cursor-pointer hover:text-orange-500 hover:underline" onClick={() => handleReplySection(null)}>
                                    <HiReply className="text-2xl" />
                                    <p>Phản hồi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-11/12 m-auto grid gap-y-6">
                        {replyList &&
                            replyList.map((reply, index) => (
                                <div className="w-full grid grid-cols-5 border border-gray-200 rounded-lg" key={index} id={reply.replyId}>
                                    <div className="bg-gray-100 p-5">
                                        <Avatar alt="User" img={reply.user && reply.user.image ? reply.user.image : ""} rounded bordered size="lg" className="mb-4 mt-2" />

                                        <div className="text-center text-sm">{reply.user && reply.user.email}</div>

                                        <div className="text-center font-semibold">
                                            {reply.user && reply.user.lastName} {reply.user && reply.user.firstName}
                                        </div>
                                    </div>

                                    <div className="col-span-4 p-5">
                                        <div className="flex justify-between py-3 border-b border-gray-200 text-gray-500 text-xs">
                                            {!reply.updatedAt && <p>{moment(reply.createdAt).format("DD/MM/yyyy HH:mm")}</p>}
                                            {reply.updatedAt && <p>{moment(reply.updatedAt).format("DD/MM/yyyy HH:mm")}</p>}
                                            <p>#{(currentPage - 1) * 10 + index + 2}</p>
                                        </div>

                                        {reply.parentReply && (
                                            <div className="bg-gray-200 border-l-4 border-green-800 cursor-pointer" onClick={() => handleParentReplySection(reply.parentReply.replyId)}>
                                                <div className="text-red-600 font-medium bg-gray-300 p-3">
                                                    <p>
                                                        {reply.parentReply.user && reply.parentReply.user.lastName} {reply.parentReply.user && reply.parentReply.user.firstName}
                                                    </p>
                                                </div>

                                                <div className="px-3">
                                                    <div className="py-3" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.parentReply.content) }} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="py-3">
                                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} />
                                        </div>

                                        <div className="flex justify-between py-3 text-green-500 text-sm">
                                            <div className="flex space-x-2 items-end">
                                                {reply.liked && (
                                                    <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125  duration-150 bg-transparent" onClick={() => handleReplyLike(reply.replyId)}>
                                                        <HiThumbUp className="text-2xl hover:text-green-300 active:text-green-200 cursor-pointer" />
                                                    </button>
                                                )}

                                                {!reply.liked && (
                                                    <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125  duration-150 bg-transparent" onClick={() => handleReplyLike(reply.replyId)}>
                                                        <HiOutlineThumbUp className="text-2xl hover:fill-green-500 active:fill-green-600 active:text-green-600 cursor-pointer" />
                                                    </button>
                                                )}
                                                <p>{reply.totalLikes} lượt thích</p>
                                            </div>

                                            <div className="flex space-x-2 items-end cursor-pointer hover:text-orange-500 hover:underline" onClick={() => handleReplySection(reply)}>
                                                <HiReply className="text-2xl" />
                                                <p>Phản hồi</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        <div className="w-full grid grid-cols-5 border border-gray-200 rounded-lg">
                            <div className="bg-gray-100 p-5">
                                <Avatar alt="User" img={user && user.image ? user.image : ""} rounded bordered size="lg" className="mb-4 mt-2" />

                                {user && (
                                    <>
                                        <div className="text-center text-sm">vanthuan2724</div>

                                        <div className="text-center font-semibold">Nguyễn Văn Thuận</div>
                                    </>
                                )}

                                {!user && <div className="text-center font-semibold text-red-500">Khách</div>}
                            </div>

                            <div className="col-span-4 p-5" id="replySection">
                                <div id="parent-reply-section"></div>

                                <div className="h-52">
                                    <ReactQuill ref={(el) => (quill.current = el)} theme="snow" modules={modules} fotmats={formats} value={reply} onChange={(e) => setReply(e)} className="h-full"/>
                                </div>

                                <div className="py-3 text-green-500 text-sm mt-2">
                                    <Button
                                        className="ml-auto bg-green-400 enabled:hover:bg-green-500"
                                        onClick={() => {
                                            handleAddReply();
                                        }}>
                                        <HiReply className="mr-2 h-5 w-5 " />
                                        Đăng phản hồi
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="bg-white rounded-lg w-fit flex justify-end ml-auto items-cente mt-2">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailPost;
