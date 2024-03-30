import { Button } from "flowbite-react";
import React, { useCallback, useMemo, useRef } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { uploadImageForReply } from "../../api/main/imageAPI";
import TopBar from "./TopBar";

const NewPost = () => {
    const navigate = useNavigate();

    const quill = useRef();

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
        <div className="bg-gray-200">
            <TopBar />

            <div className="w-4/6 m-auto min-h-screen h-max mt-5 p-5">
                <div className="items-center mb-5 w-full border-b border-black py-2">
                    <p className="text-3xl font-medium">Bài đăng mới</p>
                </div>
                <div className="bg-white mt-2 p-5 rounded-lg grid gap-y-6 m-auto ">
                    <div className="w-full">
                        <input type="text" placeholder="Chủ đề bài viết" className="border border-gray-300 rounded-md focus:ring-0 focus:border-green-500 focus:border w-full placeholder:text-2xl text-2xl" />
                    </div>

                    <div>
                        <div className="h-80">
                            <ReactQuill ref={(el) => (quill.current = el)} theme="snow" modules={modules} fotmats={formats} className="h-full" />
                        </div>

                        <div className="py-3 text-green-500 text-sm">
                            <Button className="ml-auto bg-green-400 enabled:hover:bg-green-500">
                                <HiOutlinePencilAlt className="mr-2 h-5 w-5 " />
                                Đăng bài viết
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPost;
