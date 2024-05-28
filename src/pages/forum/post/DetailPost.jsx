import { uploadImageForReply } from "@api/main/imageAPI";
import { deleteAPost, getAPost, getAPostForGuest, getHistoryOfPost, likePost } from "@api/main/postAPI";
import { addAReply, deleteAReply, editAReply, getHistoryOfReply, getRepliesForGuest, getViewableRepliesOfPost, likeReply } from "@api/main/replyAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import "@assets/css/standard.css";
import Error404 from "@components/forum/error/404Error";
import PostHistoryModal from "@components/forum/modal/PostHistoryModal";
import ReplyHistoryModal from "@components/forum/modal/ReplyHistoryModal";
import ReportModal from "@components/forum/modal/ReportModal";
import PageHead from "@components/shared/head/PageHead";
import DOMPurify from "dompurify";
import { Avatar, Breadcrumb, Button, Modal, Pagination, Tooltip } from "flowbite-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { HiFlag, HiHome, HiOutlineThumbUp, HiOutlineUser, HiOutlineX, HiPencil, HiReply, HiThumbUp, HiTrash } from "react-icons/hi";
import { IoEyeOff } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { RiChatHistoryFill, RiChatHistoryLine } from "react-icons/ri";
import { WiTime4 } from "react-icons/wi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import "./post.css";

const DetailPost = () => {
    const { postId } = useParams();

    const navigate = useNavigate();

    const mainQuill = useRef();
    const editQuill = useRef();

    usePrivateAxios();

    const [post, setPost] = useState(null);
    const [replyList, setReplyList] = useState([]);
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
    const [notFound, setNotFound] = useState(false);

    let editedReply = "";

    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(sessionStorage.getItem("profile"));

    const isLoggedIn = accessToken && user;

    useEffect(() => {
        getPostDetail();
        setCurrentPage(1);
        getPostReply();
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
        try {
            const response = await likePost(postId);
            if (response.status === 200) getPostDetail();
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleReplyLike = async (replyId) => {
        try {
            const response = await likeReply(replyId);
            if (response.status === 200) getPostReply();
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleAddReply = async () => {
        try {
            const data = {
                content: reply,
                parentReplyId: parentReplyId,
            };
            const response = await addAReply(postId, data);

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
            const data = {
                content: editedReply,
            };
            const response = await editAReply(replyId, data);

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
                setIsLoading(false);
                setOpenPostModal(false);
            }
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
                setIsLoading(false);
                setOpenPostModal(false);
            }
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
                <div className="bg-gray-200 border-l-4 border-green-800">
                    <div className="text-red-600 font-medium bg-gray-300 p-3 flex justify-between">
                        <p>
                            {parentReply.user && parentReply.user.lastName} {parentReply.user && parentReply.user.firstName}
                        </p>
                        <HiOutlineX className="h-5 w-5 cursor-pointer hover:text-orange-500" onClick={() => handleReplySection(null)} />
                    </div>
                    <div className="px-3">
                        <div className="py-3 content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parentReply.content) }} />
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
                <div className="h-52">
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
                        }}>
                        <HiReply className="mr-2 h-5 w-5 " />
                        Cập nhật phản hồi
                    </Button>

                    <Button
                        className="ml-auto bg-red-400 enabled:hover:bg-red-500"
                        onClick={() => {
                            render(oldHtmlContent, editReplySection);
                            editQuill.current.getEditor().setText("");
                        }}>
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

            const quillEditor = mainQuill.current.getEditor();

            if (mainQuill) {
                // Get the current selection range and insert the image at that index
                const range = quillEditor.getSelection(true);
                quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
            }
        };
    }, []);

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

    const imageHandlerForEdit = useCallback(() => {
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

            const quillEditor = editQuill.current.getEditor();

            if (editQuill) {
                // Get the current selection range and insert the image at that index
                const range = quillEditor.getSelection(true);
                quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
            }
        };
    }, []);

    const modulesForEdit = useMemo(
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
                    image: imageHandlerForEdit,
                },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [imageHandlerForEdit],
    );

    const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "color", "clean"];

    if (notFound) return <Error404 name="post" />;

    return (
        <>
            <PageHead title={post && post.title} description={post && post.content.replace(/(<([^>]+)>)/gi, "")} url={window.location.href} origin="forum" />

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

                <div className="items-center mb-5 mt-5 w-full border-b border-black py-2">
                    <p className="text-3xl font-normal">{post && post.title}</p>

                    <div className="flex text-gray-500 font-medium mt-2 justify-between">
                        <div className="flex space-x-5">
                            <div className="flex space-x-2 items-end">
                                <div className="flex items-end text-xl mb-1">
                                    <HiOutlineUser />
                                </div>

                                <p className="hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                                    {post && post.userPosted && post.userPosted.lastName} {post && post.userPosted && post.userPosted.firstName}
                                </p>
                            </div>

                            <div className="flex space-x-2 items-end">
                                <div className="flex items-end text-xl mb-1">
                                    <WiTime4 />
                                </div>

                                <div>{post && post.updatedAt ? <p>{moment(post.updatedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p> : <p>{moment(post && post.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>}</div>
                            </div>

                            <div className="flex space-x-2 items-end">
                                <div className="flex items-end text-xl mb-1">
                                    <LuEye />
                                </div>

                                <p>{post && post.totalViews}</p>
                            </div>
                        </div>

                        <div className="items-end">
                            {post && post.updatedAt && (
                                <Tooltip content="Xem lịch sử chỉnh sửa" style="light">
                                    <button
                                        onClick={() => {
                                            getPostHistory();
                                            setTriggerPostModal(triggerPostModal + 1);
                                            setOpenPostHistoryModal(true);
                                        }}>
                                        <RiChatHistoryLine className="text-xl mb-1 hover:text-teal-500 active:text-teal-400 cursor-pointer" />
                                    </button>
                                </Tooltip>
                            )}

                            <PostHistoryModal triggerPostModal={triggerPostModal} openPostHistoryModal={openPostHistoryModal} postHistory={postHistory} />
                        </div>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="bg-white rounded-lg w-fit flex justify-end ml-auto items-center shadow-lg shadow-gray-300">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                    </div>
                )}
                <div className="bg-white mt-2 p-5 rounded-lg grid gap-y-6 shadow-lg shadow-gray-300">
                    {post && (post.disabled || post.labelDisabled || post.subsectionDisabled || post.sectionDisabled) && (
                        <div className="flex w-full border rounded-lg bg-red-100 p-3 font-bold text-sm text-black items-center space-x-3">
                            <IoEyeOff className="text-xl mb-1" />
                            <p>Bài đăng này đã bị ẩn. Xem chi tiết trong hoạt động người dùng.</p>
                        </div>
                    )}
                    <div className="w-full grid grid-cols-4 border border-gray-200 rounded-lg" id="post-section">
                        <div className="bg-gray-100 p-5">
                            <Avatar alt="User" img={post && post.userPosted && post.userPosted.image} rounded bordered size="lg" className="mb-4 mt-2" />

                            <div className="text-center text-sm hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                                {post && post.userPosted && post.userPosted.email.split("@")[0]}
                            </div>

                            <div className="text-center font-semibold hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                                {post && post.userPosted && post.userPosted.lastName} {post && post.userPosted && post.userPosted.firstName}
                            </div>

                            {post && post.userPosted && post.userPosted.badge && (
                                <div className="flex justify-center mb-2">
                                    <Tooltip content={post.userPosted.badge.badgeName}>
                                        <Avatar alt="Badge" img={post.userPosted.badge.image} rounded />
                                    </Tooltip>
                                </div>
                            )}
                        </div>

                        <div className={`col-span-3 p-5 ${post && post.disabled ? "bg-red-100" : "bg-green-100"}`}>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-gray-500 text-sm">
                                {post && post.updatedAt ? <p>{moment(post.updatedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p> : <p>{moment(post && post.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>}

                                <div className="space-x-3 flex items-center">
                                    {post && post.updatedAt && (
                                        <Tooltip content="Xem lịch sử chỉnh sửa" style="light">
                                            <button
                                                onClick={() => {
                                                    getPostHistory();
                                                    setTriggerPostModal(triggerPostModal + 1);
                                                    setOpenPostHistoryModal(true);
                                                }}>
                                                <RiChatHistoryFill className="text-base hover:text-teal-500 active:text-teal-400 cursor-pointer" />
                                            </button>
                                        </Tooltip>
                                    )}

                                    {post && post.my && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                        <>
                                            <Tooltip content="Chỉnh sửa bài đăng" style="light">
                                                <button className="bg-transparent" onClick={() => navigate(`/forum/posts/${post.postId}/edit`)}>
                                                    <HiPencil className="text-base hover:text-yellow-500 active:text-yellow-400 cursor-pointer" />
                                                </button>
                                            </Tooltip>

                                            <Tooltip content="Xoá bài đăng" style="light">
                                                <button className="bg-transparent" onClick={() => setOpenPostModal(true)}>
                                                    <HiTrash className="text-base hover:text-red-500 active:text-red-400 cursor-pointer" />
                                                </button>
                                            </Tooltip>
                                        </>
                                    )}

                                    {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && !post.my && isLoggedIn && (
                                        <Tooltip content="Báo cáo bài đăng" style="light">
                                            <button className="bg-transparent" onClick={handleReportPost}>
                                                <HiFlag className="text-base hover:text-amber-500 active:text-amber-400 cursor-pointer" />
                                            </button>
                                        </Tooltip>
                                    )}

                                    <p className="mb-1">#1</p>
                                </div>
                            </div>

                            <div className="py-3">{post && <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />}</div>

                            <div className="flex justify-between py-3 text-green-500 text-sm">
                                <div className="flex space-x-2 items-end">
                                    {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                        <>
                                            {post && post.liked && (
                                                <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handlePostLike(postId)}>
                                                    <HiThumbUp className="text-2xl hover:text-green-300 active:text-green-200 cursor-pointer" />
                                                </button>
                                            )}
                                            {post && !post.liked && (
                                                <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={() => handlePostLike(postId)}>
                                                    <HiOutlineThumbUp className="text-2xl hover:fill-green-500 active:fill-green-600 active:text-green-600 cursor-pointer" />
                                                </button>
                                            )}
                                        </>
                                    )}

                                    <p>{post && post.totalLikes} lượt thích</p>
                                </div>

                                {post && !post.disabled && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                    <div className="flex space-x-2 items-end cursor-pointer hover:text-orange-500 hover:underline" onClick={() => handleReplySection(null)}>
                                        <HiReply className="text-2xl" />
                                        <p>Phản hồi</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-11/12 m-auto grid gap-y-6">
                        {replyList &&
                            replyList.map(
                                (reply, index) =>
                                    !reply.disabled && (
                                        <div className="w-full grid grid-cols-4 border border-gray-200 rounded-lg" key={index} id={reply.replyId}>
                                            <div className="bg-gray-100 p-5">
                                                <Avatar alt="User" img={reply.user && reply.user.image} rounded bordered size="lg" className="mb-4 mt-2" />

                                                <div className="text-center text-sm hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${reply.user && reply.user.userId}`)}>
                                                    {reply.user && reply.user.email.split("@")[0]}
                                                </div>

                                                <div className="text-center font-semibold hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/users/${reply.user && reply.user.userId}`)}>
                                                    {reply.user && reply.user.lastName} {reply.user && reply.user.firstName}
                                                </div>

                                                {reply.user && reply.user.badge && (
                                                    <div className="flex justify-center mt-2">
                                                        <Tooltip content={reply.user.badge.badgeName}>
                                                            <Avatar alt="Badge" img={reply.user.badge.image} rounded />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`col-span-3 p-5 ${reply.disabled && "bg-red-100"}`}>
                                                <div className="flex justify-between pb-2 border-b border-gray-200 text-gray-500 text-sm">
                                                    {reply && reply.updatedAt ? <p>{moment(reply.updatedAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p> : <p>{moment(reply && reply.createdAt).calendar({ sameElse: "DD/MM/YYYY HH:mm:ss" })}</p>}

                                                    <div className="space-x-3 flex items-center">
                                                        {reply.updatedAt && (
                                                            <Tooltip content="Xem lịch sử chỉnh sửa" style="light">
                                                                <button
                                                                    onClick={() => {
                                                                        getReplyHistory(reply.replyId);
                                                                        setReplyId(reply.replyId);
                                                                        setTriggerReplyModal(triggerReplyModal + 1);
                                                                        setOpenReplyHistoryModal(true);
                                                                    }}>
                                                                    <RiChatHistoryFill className="text-base hover:text-teal-500 active:text-teal-400 cursor-pointer" />
                                                                </button>
                                                            </Tooltip>
                                                        )}

                                                        {reply && reply.my && !reply.disabled && !reply.postDisabled && (
                                                            <>
                                                                <Tooltip content="Chỉnh sửa phản hồi" style="light">
                                                                    <button className="bg-transparent" onClick={() => handleEditReplySection(reply)}>
                                                                        <HiPencil className="text-lg hover:text-orange-500 active:text-orange-400 cursor-pointer" />
                                                                    </button>
                                                                </Tooltip>

                                                                <Tooltip content="Xoá phản hồi" style="light">
                                                                    <button
                                                                        className="bg-transparent"
                                                                        onClick={() => {
                                                                            setOpenReplyModal(true);
                                                                            setReplyId(reply.replyId);
                                                                        }}>
                                                                        <HiTrash className="text-lg hover:text-red-500 active:text-red-400 cursor-pointer" />
                                                                    </button>
                                                                </Tooltip>
                                                            </>
                                                        )}

                                                        {reply && !reply.disabled && !reply.postDisabled && !reply.my && isLoggedIn && (
                                                            <Tooltip content="Báo cáo phản hồi" style="light">
                                                                <button className="bg-transparent" onClick={() => handleReportReply(reply.replyId)}>
                                                                    <HiFlag className="text-base hover:text-amber-500 active:text-amber-400 cursor-pointer" />
                                                                </button>
                                                            </Tooltip>
                                                        )}

                                                        <p className="mb-1">#{(currentPage - 1) * 10 + index + 2}</p>
                                                    </div>
                                                </div>

                                                {reply.parentReply && reply.parentReply.disabled && (
                                                    <div className="bg-gray-200 border-l-4 border-green-800 mt-3 p-3">
                                                        <p className="text-red-500 font-semibold italic text-sm">Phản hồi đã bị gỡ</p>
                                                    </div>
                                                )}

                                                {reply.parentReply && !reply.parentReply.disabled && (
                                                    <div className="bg-gray-200 border-l-4 border-green-800 cursor-pointer mt-3" onClick={() => handleParentReplySection(reply.parentReply.replyId)}>
                                                        <div className="text-red-600 font-medium bg-gray-300 p-3">
                                                            <p>
                                                                {reply.parentReply && reply.parentReply.user && reply.parentReply.user.lastName} {reply.parentReply && reply.parentReply.user && reply.parentReply.user.firstName}
                                                            </p>
                                                        </div>

                                                        <div className="px-3">
                                                            <div className="py-3 content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.parentReply && reply.parentReply.content) }} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="py-3">
                                                    <div className="content-format" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} id={`edit-${reply.replyId}`} />
                                                </div>

                                                <div className="flex justify-between text-green-500 text-sm">
                                                    <div className="flex space-x-2 items-end">
                                                        {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                                            <>
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
                                                            </>
                                                        )}
                                                        <p>{reply.totalLikes} lượt thích</p>
                                                    </div>

                                                    {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                                                        <div className="flex space-x-2 items-end cursor-pointer hover:text-orange-500 hover:underline" onClick={() => handleReplySection(reply)}>
                                                            <HiReply className="text-2xl" />
                                                            <p>Phản hồi</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                            )}

                        <ReplyHistoryModal triggerReplyModal={triggerReplyModal} openReplyHistoryModal={openReplyHistoryModal} replyHistory={replyHistory} />

                        {post && !post.disabled && !post.labelDisabled && !post.subsectionDisabled && !post.sectionDisabled && (
                            <div className="w-full grid grid-cols-4 border border-gray-200 rounded-lg">
                                <div className="bg-gray-100 p-5">
                                    <Avatar alt="User" img={user && user.image} rounded bordered size="lg" className="mb-4 mt-2" />

                                    {user ? (
                                        <>
                                            <div className="text-center text-sm">{user && user.email.split("@")[0]}</div>

                                            <div className="text-center font-semibold">
                                                {user && user.lastName} {user && user.firstName}
                                            </div>

                                            {user && user.badge && (
                                                <div className="flex justify-center mt-2">
                                                    <Tooltip content={user.badge.badgeName}>
                                                        <Avatar alt="Badge" img={user.badge.image} rounded />
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center font-semibold text-red-500">Khách</div>
                                    )}
                                </div>

                                <div className="col-span-3 p-5" id="reply-section">
                                    <div id="parent-reply-section"></div>

                                    <div className="h-52">
                                        <ReactQuill ref={(el) => (mainQuill.current = el)} theme="snow" modules={modules} formats={formats} value={reply} onChange={(e) => setReply(e)} className="h-full" />
                                    </div>

                                    <div className="pt-3 text-green-500 text-sm mt-2">
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
                        )}
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="bg-white rounded-lg w-fit flex justify-end ml-auto items-cente mt-2 shadow-lg shadow-gray-300">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
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
                            <Button color="failure" isProcessing={isLoading} onClick={handleDeletePost}>
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
                            <Button color="failure" isProcessing={isLoading} onClick={handleDeleteReply}>
                                {"Chắc chắn"}
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenReplyModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DetailPost;
