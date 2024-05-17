import { uploadImageForReply } from "@api/main/imageAPI";
import { getAllLabels } from "@api/main/labelAPI";
import { editAPost, getAPost, getRelatedPosts } from "@api/main/postAPI";
import { getAllSubsections } from "@api/main/sectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import SelectFilter from "@components/forum/select/SelectFilter";
import { Button } from "flowbite-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiOutlinePencilAlt, HiX } from "react-icons/hi";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const EditPost = () => {
    const { postId } = useParams();

    const navigate = useNavigate();

    usePrivateAxios();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postList, setPostList] = useState([]);
    const [labelList, setLabelList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [label, setLabel] = useState(null);
    const [subsection, setSubsection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubsectionValid, setIsSubsectionValid] = useState(true);
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [isContentValid, setIsContentValid] = useState(true);

    const quill = useRef();

    const toastOptions = {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    useEffect(() => {
        getLabelList();
        getSectionList();
    }, []);

    useEffect(() => {
        getPostList();
    }, [title]);

    useEffect(() => {
        getPostDetail(postId);
    }, [postId]);

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

    const getPostDetail = async (postId) => {
        try {
            const response = await getAPost(postId);

            if (response.status === 200) {
                setTitle(response.data.title);
                setContent(response.data.content);
                setLabel(response.data.label && response.data.label.labelId);
                setSubsection(response.data.subsection && response.data.subsection.subId);
            } else if (response.status === 404) {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleEditPost = async (e) => {
        setIsLoading(true);

        const isValid = validateInput();

        if (isValid) {
            try {
                setIsLoading(true);

                const response = await editAPost(postId, {
                    title: title,
                    content: content,
                    labelId: label,
                    subsectionId: subsection,
                });

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">Chỉnh sửa bài đăng thành công!</p>, toastOptions);
                    navigate(-1);
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
        if (subsection === null || subsection === "") setIsSubsectionValid(false);

        if (title.trim() === "" || content.trim() === "" || subsection === null || subsection === "") return false;
        else return true;
    };

    const imageHandler = useCallback(() => {
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
        <>
            <div className="w-5/6 m-auto min-h-screen h-max mt-5 p-5">
                <div className="items-center mb-5 w-full border-b border-black py-2">
                    <p className="text-3xl font-medium">Chỉnh sửa bài đăng</p>
                </div>
                <div className="bg-white mt-2 p-5 rounded-lg grid gap-y-6 m-auto shadow-lg shadow-gray-300">
                    <div>
                        <div className="flex space-x-10">
                            <div>
                                <p className="font-medium">Phân mục</p>
                                <SelectFilter
                                    className="w-full"
                                    options={sectionList}
                                    selectedValue={subsection}
                                    onChangeHandler={(e) => {
                                        setSubsection(e.target.value);
                                    }}
                                    name="subName"
                                    field="subId"
                                    defaultName={null}
                                    defaultValue={null}
                                    placeholder="(Chọn phân mục)"
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-medium">Nhãn</p>
                                <SelectFilter
                                    className="w-full"
                                    options={labelList}
                                    selectedValue={label}
                                    onChangeHandler={(e) => {
                                        setLabel(e.target.value);
                                    }}
                                    name="labelName"
                                    field="labelId"
                                    defaultName={null}
                                    defaultValue={null}
                                    placeholder="(Chọn nhãn)"
                                />
                            </div>
                        </div>

                        {!isSubsectionValid && <p className="text-sm text-red-500">Vui lòng chọn phân mục</p>}
                    </div>

                    <div className="w-full">
                        <p className="font-medium">Tiêu đề</p>
                        <p className="text-sm text-gray-500 mb-2">Hãy cố gắng đặt tiêu đề một cách ngắn gọn, rõ ràng và đầy đủ ý nghĩa</p>
                        <input type="text" placeholder="Tiêu đề bài đăng" className="border border-gray-300 rounded-md focus:ring-0 focus:border-green-500 focus:border w-full placeholder:text-2xl text-2xl" value={title} onChange={(e) => setTitle(e.target.value)} />

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
                        <p className="font-medium">Nội dung</p>
                        <p className="text-sm text-gray-500 mb-2">Nêu ra đầy đủ nội dung để người đọc hiểu rõ bài đăng của bạn</p>

                        <div className="h-80">
                            <ReactQuill ref={(el) => (quill.current = el)} theme="snow" modules={modules} fotmats={formats} className="h-full" value={content} onChange={(e) => setContent(e)} />
                        </div>

                        {!isContentValid && <p className="text-sm text-red-500">Vui lòng nhập nội dung</p>}

                        <div className="py-3 text-green-500 text-sm flex justify-end gap-x-5">
                            <Button className="bg-green-400 enabled:hover:bg-green-500" onClick={handleEditPost} isProcessing={isLoading} disabled={isLoading}>
                                <HiOutlinePencilAlt className="mr-2 h-5 w-5 " />
                                Lưu thay đổi
                            </Button>

                            <Button className="bg-red-400 enabled:hover:bg-red-500" onClick={() => navigate(-1)} disabled={isLoading}>
                                <HiX className="mr-2 h-5 w-5 " />
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditPost;
