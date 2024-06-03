import { uploadImageForReply } from "@api/main/imageAPI";
import { getAllLabels } from "@api/main/labelAPI";
import { addAPost, getRelatedPosts } from "@api/main/postAPI";
import { getAllSubsections } from "@api/main/sectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import Select from "@components/management/select/Select";
import PageHead from "@components/shared/head/PageHead";
import Spinner from "@components/shared/spinner/Spinner";
import { Button } from "flowbite-react";
import moment from "moment";
import * as Emoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import ReactQuill, { Quill } from "react-quill";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

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

const NewPost = () => {
    const navigate = useNavigate();

    usePrivateAxios();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postList, setPostList] = useState([]);
    const [labelList, setLabelList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [label, setLabel] = useState("");
    const [subsection, setSubsection] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [isSubsectionValid, setIsSubsectionValid] = useState(true);
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [isContentValid, setIsContentValid] = useState(true);

    const quill = useRef();

    useEffect(() => {
        getLabelList();
        getSectionList();
    }, []);

    useEffect(() => {
        getPostList();
    }, [title]);

    const getPostList = async () => {
        try {
            const response = await getRelatedPosts({
                params: {
                    query: title,
                },
            });
            if (response.status === 200) setPostList(response.data.content);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getLabelList = async () => {
        try {
            const response = await getAllLabels();
            setLabelList(response.data.content);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getSectionList = async () => {
        try {
            const response = await getAllSubsections();
            setSectionList(response.data.content);
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleAddPost = async () => {
        setIsLoading(true);

        const isValid = validateInput();

        if (isValid) {
            try {
                const response = await addAPost({
                    title: title,
                    content: content,
                    labelId: label === "" ? null : label,
                    subsectionId: subsection === "" ? null : subsection,
                });

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">Tạo bài đăng thành công!</p>, toastOptions);
                    navigate("/admin/posts");
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi, vui lòng thử lại!</p>, toastOptions);
                }
            } catch (error) {
                navigate("/error-500");
            }
        } else {
            setIsLoading(false);
        }
    };

    const validateInput = () => {
        if (title.trim() === "") setIsTitleValid(false);
        if (content.trim() === "") setIsContentValid(false);
        if (subsection === "") setIsSubsectionValid(false);

        if (title.trim() === "" || content.trim() === "" || subsection === "") return false;
        else return true;
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

                const quillEditor = quill.current.getEditor();

                if (quill) {
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
                matchVisual: true,
            },
            "emoji-toolbar": true,
            "emoji-textarea": true,
            "emoji-shortname": true,
        }),
        [imageHandler],
    );

    const formats = ["font", "header", "bold", "italic", "underline", "strike", "blockquote", "code-block", "list", "1", "2", "indent", "direction", "size", "link", "image", "video", "formula", "color", "background", "script", "align", "emoji", "clean"];

    return (
        <>
            <PageHead title="Tạo bài đăng mới - Admin" description="Tạo bài đăng mới - learniverse & shariverse" url={window.location.href} origin="forum" />

            <div className="w-5/6 m-auto min-h-screen h-max mt-5 p-5">
                <div className="items-center mb-5 w-full border-b border-black py-2">
                    <p className="text-3xl font-medium">Bài đăng mới</p>
                </div>
                <div className="bg-white mt-2 p-5 rounded-lg grid gap-y-6 m-auto shadow-lg shadow-gray-300">
                    <div>
                        <div className="flex space-x-10">
                            <div>
                                <p className="font-medium">* Chuyên mục</p>
                                <Select
                                    options={sectionList}
                                    selectedValue={subsection}
                                    onChangeHandler={(e) => {
                                        setSubsection(e.target.value);
                                    }}
                                    name="subName"
                                    field="subId"
                                    defaultName="Chọn chuyên mục"
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-medium">Nhãn</p>
                                <Select
                                    options={labelList}
                                    selectedValue={label}
                                    onChangeHandler={(e) => {
                                        setLabel(e.target.value);
                                    }}
                                    name="labelName"
                                    field="labelId"
                                    defaultName="không nhãn"
                                />
                            </div>
                        </div>

                        {!isSubsectionValid && <p className="text-sm text-red-500">Vui lòng chọn chuyên mục</p>}
                    </div>

                    <div className="w-full">
                        <p className="font-medium">* Tiêu đề</p>
                        <p className="text-sm text-gray-500 mb-2">Hãy cố gắng đặt tiêu đề một cách ngắn gọn, rõ ràng và đầy đủ ý nghĩa</p>
                        <input
                            type="text"
                            placeholder="Tiêu đề bài đăng"
                            className="border border-gray-400 rounded-md 
            focus:ring-0 focus:border-green-500 focus:border-2 w-full placeholder:text-2xl text-2xl"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {!isTitleValid && <p className="text-sm text-red-500 mt-2">Vui lòng nhập tiêu đề</p>}
                    </div>

                    {postList.length > 0 && (
                        <div className="w-full h-fit border border-gray-400 rounded-md pb-3">
                            <div className="p-3 bg-gray-50 text-gray-600 border-b-2 border-gray-200 rounded-t-lg">Có thể bạn cần</div>

                            <div className="max-h-60 overflow-auto">
                                {postList.map((post, index) => (
                                    <div className="flex flex-wrap p-3 border-b border-gray-200 space-x-5" key={index}>
                                        {post.totalReplies === 0 && (
                                            <div className="w-20 h-full p-2 rounded-md border border-green-500 text-center text-sm">
                                                <p>
                                                    {post.totalReplies}
                                                    <br />
                                                    phản hồi
                                                </p>
                                            </div>
                                        )}

                                        {post.totalReplies > 0 && (
                                            <div className="w-20 h-full p-2 rounded-md text-white bg-green-500 text-center text-sm">
                                                <p>
                                                    {post.totalReplies}
                                                    <br />
                                                    phản hồi
                                                </p>
                                            </div>
                                        )}

                                        <div className="grow w-32 space-y-1">
                                            <p className="text-green-500 font-medium hover:text-green-600 cursor-pointer" onClick={() => window.open(`/forum/posts/${post.postId}`, "_blank")}>
                                                {post.title}
                                            </p>
                                            <p className="text-sm truncate whitespace-normal line-clamp-3" onClick={() => window.open(`/forum/posts/${post.postId}`, "_blank")}>
                                                {post.content.replace(/(<([^>]+)>)/gi, "")}
                                            </p>
                                            <div className="w-full flex justify-end">
                                                <p className="text-xs text-gray-400">Đăng vào {moment(post.createdAt).format("DD-MM-yyyy HH:mm")} bởi</p>
                                                &nbsp;
                                                <p
                                                    className="text-xs text-green-500 hover:text-green-600 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/forum/users/${post.userPosted.userId}`);
                                                    }}>
                                                    {post.userPosted && post.userPosted.lastName} {post.userPosted && post.userPosted.firstName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="font-medium">* Nội dung</p>
                        <p className="text-sm text-gray-500 mb-2">Nêu ra đầy đủ nội dung để người đọc hiểu rõ bài đăng của bạn</p>

                        <div className="h-80">
                            <ReactQuill ref={(el) => (quill.current = el)} theme="snow" modules={modules} formats={formats} className="h-full border-gray-400" value={content} onChange={(e) => setContent(e)} />
                        </div>

                        {!isContentValid && <p className="text-sm text-red-500">Vui lòng nhập nội dung</p>}

                        <div className="py-3 text-green-500 text-sm">
                            <Button className="ml-auto bg-green-400 enabled:hover:bg-green-500" onClick={handleAddPost} isProcessing={isLoading} disabled={isLoading}>
                                <HiOutlinePencilAlt className="mr-2 h-5 w-5 " />
                                Đăng bài viết
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Spinner loading={isLoadingImage} />
        </>
    );
};

export default NewPost;
