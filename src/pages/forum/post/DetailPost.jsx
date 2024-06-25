import { uploadImageForReply } from "@api/main/imageAPI";
import { acceptPost, deleteAPost, getAPost, getAPostForGuest, getHistoryOfPost, getRelatedPostsForAPost, likePost, undoAcceptPost } from "@api/main/postAPI";
import { acceptReply, addAReply, deleteAReply, editAReply, getHistoryOfReply, getRepliesForGuest, getViewableRepliesOfPost, likeReply, undoAcceptReply } from "@api/main/replyAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import "@assets/css/standard.css";
import Error404 from "@components/forum/error/404Error";
import PostHistoryModal from "@components/forum/modal/PostHistoryModal";
import ReplyHistoryModal from "@components/forum/modal/ReplyHistoryModal";
import ReportModal from "@components/forum/modal/ReportModal";
import PageHead from "@components/shared/head/PageHead";
import Spinner from "@components/shared/spinner/Spinner";
import DOMPurify from "dompurify";
import { Avatar, Breadcrumb, Button, Tooltip as FlowbiteTooltip, Modal, Pagination } from "flowbite-react";
import moment from "moment";
import numeral from "numeral";
import * as Emoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import "quill/dist/quill.snow.css";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { FaHashtag, FaStar } from "react-icons/fa";
import { HiHome, HiOutlineX, HiPencil, HiTrash } from "react-icons/hi";
import { IoChatbubble, IoChatbubblesOutline, IoEyeOff, IoEyeSharp, IoHeartCircle } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { MdReport } from "react-icons/md";
import { PiChatCircleTextFill, PiCheckFatFill, PiPaperPlaneTiltFill } from "react-icons/pi";
import { RiChatHistoryFill, RiTimeFill } from "react-icons/ri";
import { TiStarFullOutline } from "react-icons/ti";
import ReactQuill, { Quill } from "react-quill";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import "./post.css";

Quill.register("modules/emoji", Emoji);

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

const DetailPost = () => {
    const { postId } = useParams();

    const navigate = useNavigate();

    const mainQuill = useRef();
    const editQuill = useRef();

    usePrivateAxios();

    const [post, setPost] = useState(null);
    const [replyList, setReplyList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [postHistory, setPostHistory] = useState([]);
    const [replyHistory, setReplyHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reply, setReply] = useState("");
    const [parentReplyId, setParentReplyId] = useState(null);
    const [replyId, setReplyId] = useState(null);
    const [targetId, setTargetId] = useState(postId);
    const [target, setTarget] = useState("POST");
    const [openPostModal, setOpenPostModal] = useState(false);
    const [openReplyModal, setOpenReplyModal] = useState(false);
    const [openPostHistoryModal, setOpenPostHistoryModal] = useState(false);
    const [openReplyHistoryModal, setOpenReplyHistoryModal] = useState(false);
    const [openReportModal, setOpenReportModal] = useState(false);
    const [triggerPostModal, setTriggerPostModal] = useState(0);
    const [triggerReplyModal, setTriggerReplyModal] = useState(0);
    const [triggerReportModal, setTriggerReportModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [notFound, setNotFound] = useState(false);

    let editedReply = "";

    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(sessionStorage.getItem("profile"));

    const isLoggedIn = accessToken && user;

    useEffect(() => {
        window.addEventListener("error", (e) => {
            if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
                const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div");
                const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay");
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute("style", "display: none");
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute("style", "display: none");
                }
            }
        });
    }, []);

    useEffect(() => {
        getPostDetail();
        setCurrentPage(1);
        getPostReply();
        getRelatedPost();
    }, [postId]);

    useEffect(() => {
        getPostReply();
    }, [currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
        const element = document.getElementById("post-section");
        element.scrollIntoView({ behavior: "smooth" });
    };

    const getPostDetail = async () => {
        try {
            let response = null;

            if (user && accessToken) response = await getAPost(postId);
            else response = await getAPostForGuest(postId);

            if (response.status === 200) {
                if (response.data === null) setNotFound(true);
                else {
                    setPost(response.data);
                    setNotFound(false);
                }
            } else {
                setNotFound(true);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getPostReply = async () => {
        try {
            let response = null;

            if (user && accessToken)
                response = await getViewableRepliesOfPost(postId, {
                    params: {
                        page: currentPage - 1,
                        size: 10,
                    },
                });
            else
                response = await getRepliesForGuest(postId, {
                    params: {
                        page: currentPage - 1,
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

    const getRelatedPost = async () => {
        try {
            const response = await getRelatedPostsForAPost(postId);

            if (response.status === 200) {
                setPostList(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getPostHistory = async () => {
        try {
            const response = await getHistoryOfPost(postId);

            if (response.status === 200) {
                setPostHistory(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getReplyHistory = async (replyId) => {
        try {
            const response = await getHistoryOfReply(replyId);

            if (response.status === 200) {
                setReplyHistory(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handlePostLike = async () => {
        if (post && post.my) {
            toast.error(<p className="pr-2">Bạn không thể thích/bỏ thích bài đăng của mình!</p>, toastOptions);
        } else {
            try {
                const response = await likePost(postId);
                if (response.status === 200) {
                    getPostDetail();
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handleReplyLike = async (reply) => {
        if (reply && reply.my) {
            toast.error(<p className="pr-2">Bạn không thể thích/bỏ thích phản hồi của mình!</p>, toastOptions);
        } else {
            try {
                const response = await likeReply(reply && reply.replyId);
                if (response.status === 200) {
                    getPostReply();
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handlePostAccept = async () => {
        if (post && post.my) {
            toast.error(<p className="pr-2">Bạn không thể đánh dấu bài đăng của mình là hữu ích!</p>, toastOptions);
        } else {
            try {
                const response = await acceptPost(postId);
                if (response.status === 200) {
                    toast.success(<p className="pr-2">Đã đánh dấu bài đăng là hữu ích!</p>, toastOptions);
                    getPostDetail();
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handlePostUndoAccept = async () => {
        if (post && post.my) {
            toast.error(<p className="pr-2">Bạn không thể bỏ đánh dấu bài đăng của mình!</p>, toastOptions);
        } else {
            try {
                const response = await undoAcceptPost(postId);
                if (response.status === 200) {
                    toast.success(<p className="pr-2">Đã xoá đánh dấu bài đăng!</p>, toastOptions);
                    getPostDetail();
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handleReplyAccept = async (reply) => {
        if (post && !post.my) {
            toast.error(<p className="pr-2">Chỉ có chủ bài đăng mới có thể xoá đánh dấu phản hồi này!</p>, toastOptions);
        } else if (reply && reply.my) {
            toast.error(<p className="pr-2">Bạn không thể đánh dấu phản hồi của mình!</p>, toastOptions);
        } else {
            try {
                const response = await acceptReply(reply && reply.replyId);
                if (response.status === 200) {
                    toast.success(<p className="pr-2">Đã đánh dấu phản hồi là hữu ích!</p>, toastOptions);
                    getPostReply();
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handleReplyUndoAccept = async (reply) => {
        if (post && !post.my) {
            toast.error(<p className="pr-2">Chỉ có chủ bài đăng mới có thể xoá đánh dấu phản hồi này!</p>, toastOptions);
        } else if (reply && reply.my) {
            toast.error(<p className="pr-2">Bạn không thể bỏ đánh dấu phản hồi của mình!</p>, toastOptions);
        } else {
            try {
                const response = await undoAcceptReply(reply && reply.replyId);
                if (response.status === 200) {
                    toast.success(<p className="pr-2">Đã xoá đánh dấu phản hồi!</p>, toastOptions);
                    getPostReply();
                }
            } catch (error) {
                navigate("/error-500");
            }
        }
    };

    const handleAddReply = async () => {
        try {
            setIsLoading(true);

            const data = {
                content: reply,
                parentReplyId: parentReplyId,
            };
            const response = await addAReply(postId, data);

            setIsLoading(false);

            if (response.status === 200) {
                getPostReply();
                mainQuill.current.getEditor().setText("");
                setParentReplyId(null);
                const parentReplySection = document.getElementById("parent-reply-section");
                render(null, parentReplySection);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleEditReply = async (replyId) => {
        try {
            setIsLoading(true);

            const data = {
                content: editedReply,
            };
            const response = await editAReply(replyId, data);

            setIsLoading(false);

            if (response.status === 200) {
                getPostReply();
                editQuill.current.getEditor().setText("");

                const editReplySection = document.getElementById("edit-" + replyId);
                const htmlContent = <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(response.data.content) }} id={`edit-${response.data.replyId}`} />;

                render(htmlContent, editReplySection);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleDeletePost = async () => {
        setIsLoading(true);
        try {
            const response = await deleteAPost(postId);
            if (response.status === 200) navigate("/forum");
            else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi khi xoá bài đăng!</p>, toastOptions);
            }
            setIsLoading(false);
            setOpenPostModal(false);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleDeleteReply = async () => {
        setIsLoading(true);
        try {
            const response = await deleteAReply(replyId);
            if (response.status === 200) getPostReply();
            else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi khi xoá phản hồi!</p>, toastOptions);
            }
            setIsLoading(false);
            setOpenReplyModal(false);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleReportPost = () => {
        setTarget("POST");
        setTargetId(postId);
        setOpenReportModal(true);
        setTriggerReportModal(triggerReportModal + 1);
    };

    const handleReportReply = (replyId) => {
        setTarget("REPLY");
        setTargetId(replyId);
        setOpenReportModal(true);
        setTriggerReportModal(triggerReportModal + 1);
    };

    const handleReplySection = (parentReply) => {
        const element = document.getElementById("reply-section");
        element.scrollIntoView({ behavior: "smooth" });

        const parentReplySection = document.getElementById("parent-reply-section");
        if (parentReply) {
            const htmlContent = (
                <div className="bg-green-100 border-2 border-dashed rounded-t-[50px] rounded-br-[50px] p-5 cursor-pointer mb-3" onClick={() => handleParentReplySection(parentReply && parentReply.replyId)}>
                    <div className="flex justify-between text-red-600 font-medium">
                        <div className="flex items-center space-x-4 ">
                            <Avatar alt="User" img={parentReply && parentReply.user && parentReply.user.image} rounded bordered color="info" size="md" />

                            <p className="text-emerald-600">
                                {parentReply && parentReply.user && parentReply.user.lastName} {parentReply && parentReply.user && parentReply.user.firstName}
                            </p>
                        </div>

                        <HiOutlineX className="h-5 w-5 cursor-pointer hover:text-orange-500" onClick={() => handleReplySection(null)} />
                    </div>

                    <div className="ml-5 !border-l-2 border-gray-300">
                        <div className="p-3 content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parentReply && parentReply.content) }} />
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

    const handleEditReplySection = (reply) => {
        editedReply = reply.content;

        const editReplySection = document.getElementById("edit-" + reply.replyId);

        const oldHtmlContent = <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} id={`edit-${reply.replyId}`} />;

        const newHtmlContent = (
            <>
                <div className="h-60">
                    <ReactQuill
                        ref={(el) => (editQuill.current = el)}
                        theme="snow"
                        modules={modulesForEdit}
                        formats={formats}
                        value={reply.content}
                        onChange={(e) => {
                            editedReply = e;
                        }}
                        className="h-full"
                    />
                </div>

                <div className="pt-3 text-green-500 text-sm mt-2 flex justity-end space-x-3">
                    <Button
                        className="ml-auto bg-green-400 enabled:hover:bg-green-500"
                        onClick={() => {
                            handleEditReply(reply.replyId);
                        }}
                        isProcessing={isLoading}
                        disabled={isLoading}>
                        <PiPaperPlaneTiltFill className="mr-2 h-5 w-5" />
                        Cập nhật phản hồi
                    </Button>

                    <Button
                        className="ml-auto bg-red-400 enabled:hover:bg-red-500"
                        onClick={() => {
                            render(oldHtmlContent, editReplySection);
                            editQuill.current.getEditor().setText("");
                        }}
                        disabled={isLoading}>
                        <HiOutlineX className="mr-2 h-5 w-5 " />
                        Huỷ bỏ
                    </Button>
                </div>
            </>
        );

        render(newHtmlContent, editReplySection);
    };

    const imageHandler = useCallback(() => {
        // Create an input element of type 'file'
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            setIsLoadingImage(true);

            const file = input.files[0];

            const formData = new FormData();
            formData.append("image", file);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await uploadImageForReply(formData, config);

            setIsLoadingImage(false);

            if (response.status === 200) {
                const imageUrl = response.message;

                const quillEditor = mainQuill.current.getEditor();

                if (mainQuill) {
                    // Get the current selection range and insert the image at that index
                    const range = quillEditor.getSelection(true);
                    quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
                }
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi khi tải ảnh lên!</p>, toastOptions);
            }
        };
    }, []);

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ font: [] }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ header: 1 }, { header: 2 }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                    [{ script: "sub" }, { script: "super" }],
                    ["blockquote", "code-block"],
                    ["link", "image", "video", "formula"],
                    ["emoji"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
            clipboard: {
                matchVisual: false,
            },
            "emoji-toolbar": true,
            "emoji-textarea": true,
            "emoji-shortname": true,
        }),
        [imageHandler],
    );

    const imageHandlerForEdit = useCallback(() => {
        // Create an input element of type 'file'
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            setIsLoadingImage(true);

            const file = input.files[0];

            const formData = new FormData();
            formData.append("image", file);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await uploadImageForReply(formData, config);

            setIsLoadingImage(false);

            if (response.status === 200) {
                const imageUrl = response.message;

                const quillEditor = editQuill.current.getEditor();

                if (editQuill) {
                    // Get the current selection range and insert the image at that index
                    const range = quillEditor.getSelection(true);
                    quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
                }
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi khi tải ảnh lên!</p>, toastOptions);
            }
        };
    }, []);

    const modulesForEdit = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ font: [] }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ header: 1 }, { header: 2 }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                    [{ script: "sub" }, { script: "super" }],
                    ["blockquote", "code-block"],
                    ["link", "image", "video", "formula"],
                    ["emoji"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandlerForEdit,
                },
            },
            clipboard: {
                matchVisual: false,
            },
            "emoji-toolbar": true,
            "emoji-textarea": true,
            "emoji-shortname": true,
        }),
        [imageHandlerForEdit],
    );

    const formats = ["font", "header", "bold", "italic", "underline", "strike", "blockquote", "code-block", "list", "1", "2", "indent", "direction", "size", "link", "image", "video", "formula", "color", "background", "script", "align", "emoji", "clean"];

    if (notFound) return <Error404 name="post" />;

    return (
        <>
            <PageHead title={post && post.title} description={`${post && post.content.replace(/(<([^>]+)>)/gi, "")} - learniverse & shariverse`} url={window.location.href} origin="forum" />

            <div className="w-[95%] m-auto min-h-screen h-max p-5 main-section">
                <Breadcrumb aria-label="Post breadcrumb" className="breadcrumb cursor-pointer">
                    <Breadcrumb.Item onClick={() => navigate("/forum")} icon={HiHome}>
                        Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(`/forum/sections/${post && post.subsection && post.subsection.slug}`)}>{post && post.subsection && post.subsection.subName}</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {post && post.title.substring(0, 60)}
                        {post && post.title.length > 60 ? "..." : ""}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className="relative bg-white mt-5 p-5 rounded-lg shadow-lg shadow-gray-300 z-10">
                    {post && (post.disabled || post.labelDisabled || post.subsectionDisabled || post.sectionDisabled) && (
                        <div className="flex w-full border rounded-lg bg-red-100 p-3 font-bold text-sm text-black items-center space-x-3">
                            <IoEyeOff className="text-xl mb-1" />
                            <p>Bài đăng này đã bị ẩn. Xem chi tiết trong hoạt động người dùng.</p>
                        </div>
                    )}

                    <div className="w-full rounded-lg" id="post-section">
                        <div className="flex space-x-4 p-5 mb-5">
                            <div className="bg-gradient-to-r from-teal-300 to-green-500 h-fit aspect-square p-1 rounded-xl">
                                <IoChatbubblesOutline className="text-white text-4xl" />
                            </div>

                            <div>
                                <p className="text-4xl font-medium mb-5">{post && post.title}</p>

                                <div className="flex space-x-4">
                                    <div className="w-fit px-2 py-1 rounded-lg flex space-x-1 items-center bg-teal-50">
                                        <RiTimeFill className="text-xl text-teal-600" />

                                        <p className="font-medium text-gray-500">{moment(post && post.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>
                                    </div>

                                    <div className="w-fit px-2 py-1 rounded-lg flex space-x-1 items-center bg-rose-50">
                                        <PiChatCircleTextFill className="text-xl text-rose-600" />

                                        <p className="font-medium text-gray-500">{post && post.totalReplies}</p>
                                    </div>

                                    <div className="w-fit px-2 py-1 rounded-lg flex space-x-1 items-center bg-emerald-50">
                                        <IoEyeSharp className="text-xl text-emerald-600" />

                                        <p className="font-medium text-gray-500">{post && post.totalViews}</p>
                                    </div>

                                    {post && post.label && (
                                        <div className="w-fit px-2 py-1 rounded-lg flex space-x-1 items-center bg-sky-50">
                                            <FaHashtag className="text-xl" style={{ color: post && post.label && post.label.color }} />

                                            <p className="font-medium text-gray-500">{post && post.label && post.label.labelName}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-1/5">
                                <Avatar alt="User" img={post && post.userPosted && post.userPosted.image} rounded size="md" bordered color="success" className="mb-4 main-avatar" />

                                <div className="text-center font-semibold hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                                    {post && post.userPosted && post.userPosted.lastName} {post && post.userPosted && post.userPosted.firstName}
                                </div>

                                {post && post.userPosted && post.userPosted.badge && (
                                    <div className="flex justify-center mt-2">
                                        <FlowbiteTooltip content={post.userPosted.badge.badgeName} style="light" placement="bottom">
                                            <Avatar alt="Badge" img={post.userPosted.badge.image} rounded />
                                        </FlowbiteTooltip>
                                    </div>
                                )}

                                {post && post.subsection && post.subsection.postAcceptable && (
                                    <div
                                        className={`flex flex-col items-center justify-center text-green-500 mt-10 space-y-3 border-4 border-gray-200 border-dashed m-4 p-4 rounded-lg hover:shadow-lg hover:shadow-yellow-100 ${
                                            post && !post.my && post.accepted ? "border-yellow-100 shadow-lg shadow-yellow-100" : ""
                                        }`}>
                                        {post && (post.disabled || post.labelDisabled || post.subsectionDisabled || post.sectionDisabled) ? (
                                            <button className="bg-transparent">
                                                <FaStar className="text-[3.75rem] text-gray-400 border-2 border-gray-400 rounded-full p-1" />
                                            </button>
                                        ) : (
                                            <>
                                                {post.accepted ? (
                                                    <Tooltip overlay={<p>Bạn đã đánh dấu bài đăng này là hữu ích. Nhấn để bỏ đánh dấu</p>} placement="bottom">
                                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handlePostUndoAccept(postId)}>
                                                            <FaStar className="text-[3.75rem] text-amber-300 hover:text-amber-200 active:text-amber-100 cursor-pointer border-2 border-amber-300 hover:border-amber-200 active:border-amber-100 rounded-full p-1" />
                                                        </button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip overlay={<p>Đánh dấu bài đăng này nếu nó giúp ích cho bạn</p>} placement="bottom">
                                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handlePostAccept(postId)}>
                                                            <FaStar className="text-[3.75rem] text-gray-400 hover:text-amber-200 active:text-amber-100 cursor-pointer border-2 border-gray-400 hover:border-amber-200 active:border-amber-100 rounded-full p-1" />
                                                        </button>
                                                    </Tooltip>
                                                )}
                                            </>
                                        )}

                                        {post && post.totalAcceptances > 0 && (
                                            <FlowbiteTooltip content="Tổng số lượt chấp nhận" style="light" placement="bottom">
                                                <p className="text-2xl font-medium text-red-500 text-center">{post.totalAcceptances}</p>
                                            </FlowbiteTooltip>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`w-4/5 ${post && post.disabled ? "bg-red-100" : ""}`}>
                                <div className="w-full p-5 border-2 border-dashed rounded-r-[50px]">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-gray-500 text-sm">
                                        <p>{moment(post && post.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>
                                        {/* {post && post.updatedAt ? <p>{moment(post.updatedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p> :  */}
                                        <div className="space-x-3 flex items-center">
                                            {post && post.updatedAt && (
                                                <FlowbiteTooltip content="Xem lịch sử chỉnh sửa" style="light">
                                                    <button
                                                        onClick={() => {
                                                            getPostHistory();
                                                            setTriggerPostModal(triggerPostModal + 1);
                                                            setOpenPostHistoryModal(true);
                                                        }}>
                                                        <RiChatHistoryFill className="text-base hover:text-teal-500 active:text-teal-400 cursor-pointer" />
                                                    </button>
                                                </FlowbiteTooltip>
                                            )}

                                            <PostHistoryModal triggerPostModal={triggerPostModal} openPostHistoryModal={openPostHistoryModal} postHistory={postHistory} />

                                            {post && post.my && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                                <>
                                                    <FlowbiteTooltip content="Chỉnh sửa bài đăng" style="light">
                                                        <button className="bg-transparent" onClick={() => navigate(`/forum/posts/${post.postId}/edit`)}>
                                                            <HiPencil className="text-base hover:text-yellow-500 active:text-yellow-400 cursor-pointer" />
                                                        </button>
                                                    </FlowbiteTooltip>

                                                    <FlowbiteTooltip content="Xoá bài đăng" style="light">
                                                        <button className="bg-transparent" onClick={() => setOpenPostModal(true)}>
                                                            <HiTrash className="text-base hover:text-red-500 active:text-red-400 cursor-pointer" />
                                                        </button>
                                                    </FlowbiteTooltip>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="py-3">{post && <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />}</div>
                                </div>

                                <div className="flex justify-between py-3 text-green-500 text-sm">
                                    <div className="flex items-center space-x-2">
                                        {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && post.subsection && !post.subsection.postAcceptable ? (
                                            <>
                                                {isLoggedIn && post && post.liked ? (
                                                    <Tooltip overlay={<p></p>} placement="bottom">
                                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handlePostLike(postId)} title="Bạn đã thích bài đăng này. Nhấn để bỏ thích">
                                                            <IoHeartCircle className="text-red-500 hover:text-red-300 text-4xl active:text-red-200 cursor-pointer" />
                                                        </button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip overlay={<p>Thích bài đăng</p>} placement="bottom">
                                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handlePostLike(postId)}>
                                                            <IoHeartCircle className="text-red-500 hover:text-red-300 text-4xl active:text-red-200 cursor-pointer" />
                                                        </button>
                                                    </Tooltip>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {post && post.subsection && !post.subsection.postAcceptable && (
                                                    <button className="bg-transparent">
                                                        <IoHeartCircle className="text-red-500 text-4xl" />
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {post && post.totalLikes > 0 && post.subsection && !post.subsection.postAcceptable && <p className="text-lg font-medium">{post.totalLikes}</p>}
                                    </div>

                                    <div className="flex space-x-8">
                                        {post && !post.disabled && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                            <div className="flex space-x-2 items-center cursor-pointer hover:text-green-400" onClick={() => handleReplySection(null)}>
                                                <IoChatbubble className="text-2xl transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150" />
                                                <p className="font-medium">Phản hồi</p>
                                            </div>
                                        )}

                                        {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && !post.my && isLoggedIn && (
                                            <div className="flex space-x-2 items-center cursor-pointer text-orange-500 hover:text-orange-400" onClick={handleReportPost}>
                                                <MdReport className="text-2xl transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150" />
                                                <p className="font-medium">Báo cáo</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {post && post.bestReply && (
                    <div className="w-full flex justify-center -mt-10 z-0">
                        <div
                            className="w-11/12 flex pt-20 pb-5 px-5 shadow-xl shadow-amber-100 hover:shadow-amber-200 bg-white rounded-lg cursor-pointer"
                            onClick={() => {
                                const element = document.getElementById(post && post.bestReply && post.bestReply.replyId);
                                element.scrollIntoView({ behavior: "smooth" });
                            }}>
                            <div className="w-1/5">
                                <Avatar alt="User" img={post && post.bestReply && post.bestReply.user && post.bestReply.user.image} rounded size="md" bordered color="success" className="mb-4 main-avatar" />

                                <div className="text-center font-semibold hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post && post.bestReply && post.bestReply.user && post.bestReply.user.userId}`)}>
                                    {post && post.bestReply && post.bestReply.user && post.bestReply.user.lastName} {post && post.bestReply && post.bestReply.user && post.bestReply.user.firstName}
                                </div>

                                {post && post.bestReply && post.bestReply.user && post.bestReply.user.badge && (
                                    <div className="flex justify-center mt-2">
                                        <FlowbiteTooltip content={post && post.bestReply && post.bestReply.user && post.bestReply.user.badge.badgeName} style="light" placement="bottom">
                                            <Avatar alt="Badge" img={post && post.bestReply && post.bestReply.user && post.bestReply.user.badge.image} rounded />
                                        </FlowbiteTooltip>
                                    </div>
                                )}

                                <div className="flex justify-center text-green-500 mt-5">
                                    <FlowbiteTooltip content="Tác giả bài đăng đã đánh dấu phản hồi này là hữu ích" style="light" placement="bottom">
                                        <button>
                                            <PiCheckFatFill className="text-5xl" />
                                        </button>
                                    </FlowbiteTooltip>
                                </div>
                            </div>

                            <div className={`w-4/5 ${post && post.bestReply && post.bestReply.disabled && "bg-red-100"}`}>
                                <div className={`border-2 border-dashed rounded-b-[50px] rounded-tr-[50px] p-5 ${post && post.bestReply && post.bestReply.disabled && "bg-red-100"}`}>
                                    <div className="flex justify-between pb-2 border-b border-gray-200 text-gray-500 text-sm">
                                        {post && post.bestReply && post.bestReply.updatedAt ? (
                                            <p>{moment(post && post.bestReply && post.bestReply.updatedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>
                                        ) : (
                                            <p>{moment(post && post.bestReply && post.bestReply.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>
                                        )}
                                    </div>

                                    <div className="py-3">
                                        <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post && post.bestReply && post.bestReply.content) }} />
                                    </div>
                                </div>

                                <div className="flex justify-between text-green-500 text-sm mt-3">
                                    <div className="flex items-center space-x-2">
                                        <button className="bg-transparent">
                                            <IoHeartCircle className="text-red-500 text-4xl" />
                                        </button>

                                        {post && post.bestReply && post.bestReply.totalLikes > 0 && <p className="text-lg font-medium">{post && post.bestReply && post.bestReply.totalLikes}</p>}
                                    </div>

                                    <div className="w-fit px-2 py-1 rounded-lg flex space-x-1 items-center bg-amber-100 text-amber-500 shadow-lg">
                                        <TiStarFullOutline className="text-2xl" />

                                        <p className="font-medium">Phản hồi nổi bật</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12" />

                {totalPages > 1 && (
                    <div className="bg-white rounded-lg w-fit flex justify-end ml-auto items-center shadow-lg shadow-gray-300 pb-2 mb-2">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="" nextLabel="" showIcons className="text-sm" />
                    </div>
                )}

                <div className="rounded-lg grid gap-y-6 space-y-3">
                    {replyList &&
                        replyList.map(
                            (reply, index) =>
                                !reply.disabled && (
                                    <div key={index} className="w-full flex space-x-2" id={reply.replyId}>
                                        <div className="w-[5%] h-full">
                                            <p className="flex items-center justify-center bg-white shadow-lg rounded-full h-fit aspect-square font-medium text-xl">#{(currentPage - 1) * 10 + index + 1}</p>

                                            <div className="flex flex-col justify-center items-center w-full h-full">
                                                <div className="w-2 h-2 rounded-full border-2 border-white" />
                                                <div className="flex-grow border" />
                                                <div className="w-2 h-2 rounded-full border-2 border-white" />
                                            </div>
                                        </div>

                                        <div className="w-[95%] flex p-5 shadow-lg shadow-gray-300 bg-white rounded-lg" key={index}>
                                            <div className="w-1/5">
                                                <Avatar alt="User" img={reply.user && reply.user.image} rounded size="md" bordered color="success" className="mb-4 main-avatar" />

                                                <div className="text-center font-semibold hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${reply.user && reply.user.userId}`)}>
                                                    {reply.user && reply.user.lastName} {reply.user && reply.user.firstName}
                                                </div>

                                                {reply.user && reply.user.badge && (
                                                    <div className="flex justify-center mt-2">
                                                        <FlowbiteTooltip content={reply.user.badge.badgeName} style="light" placement="bottom">
                                                            <Avatar alt="Badge" img={reply.user.badge.image} rounded />
                                                        </FlowbiteTooltip>
                                                    </div>
                                                )}

                                                <div className="flex justify-center text-green-500 mt-5">
                                                    {post && post.subsection && post.subsection.replyAcceptable && (
                                                        <>
                                                            {post && (post.disabled || post.labelDisabled || post.subsectionDisabled || post.sectionDisabled) ? (
                                                                <>
                                                                    {reply && reply.accepted ? (
                                                                        <FlowbiteTooltip content="Tác giả bài đăng đã đánh dấu phản hồi này là hữu ích" style="light" placement="bottom">
                                                                            <button>
                                                                                <PiCheckFatFill className="text-5xl" />
                                                                            </button>
                                                                        </FlowbiteTooltip>
                                                                    ) : (
                                                                        <button className="bg-transparent">
                                                                            <PiCheckFatFill className="text-5xl text-gray-400" />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {post && post.my ? (
                                                                        <>
                                                                            {reply && reply.accepted ? (
                                                                                <Tooltip overlay={<p>Bạn đã đánh dấu phản hồi này là hữu ích. Nhấn để bỏ đánh dấu</p>} placement="bottom">
                                                                                    <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handleReplyUndoAccept(reply)}>
                                                                                        <PiCheckFatFill className="text-5xl text-emerald-500 hover:text-emerald-300 active:text-emerald-200 cursor-pointer border-2 border-emerald-500 hover:border-emerald-200 active:border-emerald-100 rounded-full p-1" />
                                                                                    </button>
                                                                                </Tooltip>
                                                                            ) : (
                                                                                <Tooltip overlay={<p>Đánh dấu phản hồi này nếu nó giải quyết vấn đề của bạn hoặc hữu ích nhất</p>} placement="bottom">
                                                                                    <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handleReplyAccept(reply)}>
                                                                                        <PiCheckFatFill className="text-5xl text-gray-400 hover:text-emerald-300 active:text-emerald-200 cursor-pointer border-2 border-gray-400 hover:border-emerald-200 active:border-emerald-100 rounded-full p-1" />
                                                                                    </button>
                                                                                </Tooltip>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {reply && reply.accepted && (
                                                                                <FlowbiteTooltip content="Tác giả bài đăng đã đánh dấu phản hồi này là hữu ích" style="light" placement="bottom">
                                                                                    <button>
                                                                                        <PiCheckFatFill className="text-5xl" />
                                                                                    </button>
                                                                                </FlowbiteTooltip>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={`w-4/5 ${reply.disabled && "bg-red-100"}`}>
                                                {reply.parentReply && reply.parentReply.disabled && (
                                                    <div className="bg-red-100 border-2 border-dashed rounded-t-[50px] rounded-br-[50px] p-5 cursor-pointer mb-3">
                                                        <p className="text-red-500 font-semibold italic text-sm">Phản hồi đã bị gỡ</p>
                                                    </div>
                                                )}

                                                {reply.parentReply && !reply.parentReply.disabled && (
                                                    <div className="bg-green-100 border-2 border-dashed rounded-t-[50px] rounded-br-[50px] p-5 cursor-pointer mb-3" onClick={() => handleParentReplySection(reply.parentReply.replyId)}>
                                                        <div className="flex items-center space-x-4 text-red-600 font-medium">
                                                            <Avatar alt="User" img={reply.parentReply && reply.parentReply.user && reply.parentReply.user.image} rounded bordered color="info" size="md" />

                                                            <p className="text-emerald-600">
                                                                {reply.parentReply && reply.parentReply.user && reply.parentReply.user.lastName} {reply.parentReply && reply.parentReply.user && reply.parentReply.user.firstName}
                                                            </p>
                                                        </div>

                                                        <div className="ml-5 !border-l-2 border-gray-300">
                                                            <div className="p-3 content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.parentReply && reply.parentReply.content) }} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={`border-2 border-dashed rounded-b-[50px] rounded-tr-[50px] p-5 ${reply.disabled && "bg-red-100"}`}>
                                                    <div className="flex justify-between pb-2 border-b border-gray-200 text-gray-500 text-sm">
                                                        {reply && reply.updatedAt ? <p>{moment(reply.updatedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p> : <p>{moment(reply && reply.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>}

                                                        <div className="space-x-3 flex items-center">
                                                            {reply.updatedAt && (
                                                                <FlowbiteTooltip content="Xem lịch sử chỉnh sửa" style="light" placement="bottom">
                                                                    <button
                                                                        onClick={() => {
                                                                            getReplyHistory(reply.replyId);
                                                                            setReplyId(reply.replyId);
                                                                            setTriggerReplyModal(triggerReplyModal + 1);
                                                                            setOpenReplyHistoryModal(true);
                                                                        }}>
                                                                        <RiChatHistoryFill className="text-base hover:text-teal-500 active:text-teal-400 cursor-pointer" />
                                                                    </button>
                                                                </FlowbiteTooltip>
                                                            )}

                                                            {reply && reply.my && !reply.disabled && !reply.postDisabled && (
                                                                <>
                                                                    <FlowbiteTooltip content="Chỉnh sửa phản hồi" style="light" placement="bottom">
                                                                        <button className="bg-transparent" onClick={() => handleEditReplySection(reply)}>
                                                                            <HiPencil className="text-lg hover:text-orange-500 active:text-orange-400 cursor-pointer" />
                                                                        </button>
                                                                    </FlowbiteTooltip>

                                                                    <FlowbiteTooltip content="Xoá phản hồi" style="light" placement="bottom">
                                                                        <button
                                                                            className="bg-transparent"
                                                                            onClick={() => {
                                                                                setOpenReplyModal(true);
                                                                                setReplyId(reply.replyId);
                                                                            }}>
                                                                            <HiTrash className="text-lg hover:text-red-500 active:text-red-400 cursor-pointer" />
                                                                        </button>
                                                                    </FlowbiteTooltip>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="py-3">
                                                        <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} id={`edit-${reply.replyId}`} />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between text-green-500 text-sm mt-3">
                                                    <div className="flex items-center space-x-2">
                                                        {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled ? (
                                                            <>
                                                                {reply.liked ? (
                                                                    <Tooltip overlay={<p>Bạn đã thích phản hồi này. Nhấn để bỏ thích</p>} placement="bottom">
                                                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handleReplyLike(reply)}>
                                                                            <IoHeartCircle className="text-red-500 hover:text-red-300 text-4xl active:text-red-200 cursor-pointer" />
                                                                        </button>
                                                                    </Tooltip>
                                                                ) : (
                                                                    <Tooltip overlay={<p>Thích phản hồi</p>} placement="bottom">
                                                                        <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handleReplyLike(reply)}>
                                                                            <IoHeartCircle className="text-4xl text-gray-400 hover:text-red-400 active:text-red-500 cursor-pointer" />
                                                                        </button>
                                                                    </Tooltip>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="bg-transparent">
                                                                    <IoHeartCircle className="text-red-500 text-4xl" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {post && post.totalLikes > 0 && <p className="text-lg font-medium">{post.totalLikes}</p>}
                                                    </div>

                                                    <div className="flex space-x-8">
                                                        {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                                            <div className="flex space-x-2 items-center cursor-pointer hover:text-green-400" onClick={() => handleReplySection(reply)}>
                                                                <IoChatbubble className="text-2xl transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150" />
                                                                <p className="font-medium">Phản hồi</p>
                                                            </div>
                                                        )}

                                                        {reply && !reply.disabled && !reply.postDisabled && !reply.my && isLoggedIn && (
                                                            <div className="flex space-x-2 items-center cursor-pointer text-orange-500 hover:text-orange-400" onClick={() => handleReportReply(reply.replyId)}>
                                                                <MdReport className="text-2xl transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150" />
                                                                <p className="font-medium">Báo cáo</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ),
                        )}

                    <ReplyHistoryModal triggerReplyModal={triggerReplyModal} openReplyHistoryModal={openReplyHistoryModal} replyHistory={replyHistory} />

                    {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                        <div className="w-full grid grid-cols-4 bg-white shadow-lg rounded-lg">
                            <div className="p-5">
                                <Avatar alt="User" img={user && user.image} rounded bordered size="lg" className="mb-4 mt-2 main-avatar" color="success" />

                                {user ? (
                                    <>
                                        <div className="text-center font-semibold">
                                            {user && user.lastName} {user && user.firstName}
                                        </div>

                                        {user && user.badge && (
                                            <div className="flex justify-center mt-2">
                                                <FlowbiteTooltip content={user.badge.badgeName} placement="bottom">
                                                    <Avatar alt="Badge" img={user.badge.image} rounded />
                                                </FlowbiteTooltip>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center font-semibold text-red-500">Khách</div>
                                )}
                            </div>

                            <div className="col-span-3 p-5" id="reply-section">
                                <div id="parent-reply-section"></div>

                                <div className="h-60">
                                    <ReactQuill ref={(el) => (mainQuill.current = el)} theme="snow" modules={modules} formats={formats} value={reply} onChange={(e) => setReply(e)} className="h-full" />
                                </div>

                                <div className="pt-3 text-green-500 text-sm mt-2">
                                    <Button
                                        className="ml-auto bg-green-400 enabled:hover:bg-green-500"
                                        onClick={() => {
                                            handleAddReply();
                                        }}
                                        isProcessing={isLoading}
                                        disabled={isLoading}>
                                        <PiPaperPlaneTiltFill className="mr-2 h-5 w-5 " />
                                        Đăng phản hồi
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="bg-white rounded-lg w-fit flex justify-end ml-auto items-cente mt-2 shadow-lg shadow-gray-300 pb-2">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="" nextLabel="" showIcons className="text-sm" />
                    </div>
                )}

                {postList.length > 0 && (
                    <div className="w-full bg-white mt-5 p-5 rounded-lg space-y-3 shadow-lg shadow-gray-300">
                        <h2 className="text-2xl font-medium">Có thể bạn quan tâm</h2>

                        <div className="flex space-x-4">
                            <div className="w-1/2 w-full space-y-5">
                                {postList.slice(0, 5).map((post, index) => (
                                    <div key={index} className="flex space-x-2 items-center" title={post.title}>
                                        <div className="flex rounded bg-green-500 text-white p-2 items-center space-x-2 font-medium min-w-16 w-16">
                                            <LuEye />
                                            <p className="text-sm">{numeral(post.totalViews).format("0.a")}</p>
                                        </div>

                                        <div className="flex rounded bg-green-500 text-white p-2 items-center space-x-2 font-medium min-w-14 w-14">
                                            <PiChatCircleTextFill />
                                            <p className="text-sm">{post.totalReplies < 9 ? post.totalReplies : "9+"}</p>
                                        </div>

                                        <Link className="text-sm hover:!text-green-600 cursor-pointer hover:!no-underline !not-italic related-post truncate whitespace-normal line-clamp-1" to={`/forum/posts/${post.postId}`}>
                                            {post.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="w-1/2 w-full space-y-5">
                                {postList.slice(-5).map((post, index) => (
                                    <div key={index} className="flex space-x-2 items-center" title={post.title}>
                                        <div className="flex rounded bg-green-500 text-white p-2 items-center space-x-2 font-medium min-w-16 w-16">
                                            <LuEye />
                                            <p className="text-sm">{numeral(post.totalViews).format("0.a")}</p>
                                        </div>

                                        <div className="flex rounded bg-green-500 text-white p-2 items-center space-x-2 font-medium min-w-14 w-14">
                                            <PiChatCircleTextFill />
                                            <p className="text-sm">{post.totalReplies < 9 ? post.totalReplies : "9+"}</p>
                                        </div>

                                        <Link className="text-sm hover:!text-green-600 cursor-pointer hover:!no-underline !not-italic related-post truncate whitespace-normal line-clamp-1" to={`/forum/posts/${post.postId}`}>
                                            {post.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ReportModal target={target} targetId={targetId} openReportModal={openReportModal} triggerModal={triggerReportModal} />

            <Modal show={openPostModal} size="md" onClose={() => setOpenPostModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiTrash className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá bài viết này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={handleDeletePost}>
                                {"Chắc chắn"}
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenPostModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={openReplyModal} size="md" onClose={() => setOpenReplyModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiTrash className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá phản hồi này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={handleDeleteReply}>
                                {"Chắc chắn"}
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenReplyModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Spinner loading={isLoadingImage} />
        </>
    );
};

export default DetailPost;
