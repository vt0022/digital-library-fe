import { Button, Toast } from "flowbite-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineCheck, HiOutlinePencilAlt, HiX } from "react-icons/hi";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImageForReply } from "../../../api/main/imageAPI";
import { editAPost, getAPost } from "../../../api/main/postAPI";
import usePrivateAxios from "../../../api/usePrivateAxios";

const EditPost = () => {
    const { postId } = useParams();

    const navigate = useNavigate();

    usePrivateAxios();

    const [post, setPost] = useState();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0);

    const quill = useRef();

    useEffect(() => {
        getPostDetail(postId);
    }, [postId]);

    const getPostDetail = async (postId) => {
        try {
            const response = await getAPost(postId);

            if (response.status === 200) {
                if (!response.data.my) {
                    navigate("/error-404");
                } else {
                    setTitle(response.data.title);
                    setContent(response.data.content);
                }
            } else if (response.status === 404) {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleEditPost = async () => {
        try {
                    setIsLoading(true);

            const response = await editAPost(postId, {
                title: title,
                content: content,
            });

            if (response.status === 200) {
                setStatus(1);
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                setStatus(-1);
                console.log(response.message);
            }

            setIsLoading(false);
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
            <div className="flex items-center">
                {status === -1 && (
                    <Toast className="left-1/2 w-100 fixed z-50 shadow-md shadow-gray-300 bg-amber-50">
                        <HiX className="h-5 w-5 text-amber-400" />
                        <div className="pl-4 text-sm font-normal">Đã xảy ra lỗi! Xin vui lòng thử lại!</div>
                    </Toast>
                )}

                {status === 1 && (
                    <Toast className="left-1/2 fixed w-100 z-50 shadow-md shadow-gray-300 bg-green-50">
                        <HiOutlineCheck className="h-5 w-5 text-green-600" />
                        <div className="pl-4 text-sm">Tải lên thành công!</div>
                    </Toast>
                )}
            </div>

            <div className="w-4/6 m-auto min-h-screen h-max mt-5 p-5">
                <div className="items-center mb-5 w-full border-b border-black py-2">
                    <p className="text-3xl font-medium">Chỉnh sửa bài đăng</p>
                </div>
                <div className="bg-white mt-2 p-5 rounded-lg grid gap-y-6 m-auto ">
                    <div className="w-full">
                        <input type="text" placeholder="Chủ đề bài viết" className="border border-gray-300 rounded-md focus:ring-0 focus:border-green-500 focus:border w-full placeholder:text-2xl text-2xl" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <div className="h-80">
                            <ReactQuill ref={(el) => (quill.current = el)} theme="snow" modules={modules} fotmats={formats} className="h-full" value={content} onChange={(e) => setContent(e)} />
                        </div>

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
