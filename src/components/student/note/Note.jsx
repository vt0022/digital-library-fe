import { deleteNote, saveNote } from "@api/main/documentAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import Checklist from "@editorjs/checklist";
import Code from "@editorjs/code";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Underline from "@editorjs/underline";
import { Button, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaFeatherPointed } from "react-icons/fa6";
import { IoMdTrash } from "react-icons/io";
import { PiWarningFill } from "react-icons/pi";
import "./note.css";

const Note = ({ page, slug, content, onRefresh, onRemove }) => {
    usePrivateAxios();

    const editor = useRef(null);
    const pageRef = useRef(page);

    const [isLoading, setIsLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const initData = {
        time: 1719246341883,
        blocks: [
            {
                id: "wqGx4FfRpe",
                data: {
                    text: "",
                },
                type: "paragraph",
            },
        ],
        version: "2.29.1",
    };

    useEffect(() => {
        if (!editor.current) {
            const tempEditor = new EditorJS({
                holder: "editorjs",
                inlineToolbar: true,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                    },
                    marker: {
                        class: Marker,
                        inlineToolbar: true,
                    },
                    underline: { class: Underline, shortcut: "Ctrl+U" },
                    list: List,
                    checklist: Checklist,
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                    },
                    code: {
                        class: Code,
                        inlineToolbar: true,
                    },
                },
                // data: content,
                autofocus: true,
                onReady: () => {
                    editor.current = tempEditor;
                    editor.current
                        .render(content)
                        .then(() => {
                            console.log("Nội dung đã được render");
                        })
                        .catch((error) => {
                            console.log("Render thất bại", error);
                        });
                },
                onChange: (api, event) => {
                    api.saver
                        .save()
                        .then((data) => {
                            onSave(data);
                        })
                        .catch((error) => {
                            console.log("Saving failed: ", error);
                        });
                },
            });
        }

        return () => {
            editor?.current?.destroy();
            editor.current = null;
        };
    }, [content]);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    // useEffect(() => {
    //     editor?.current?.isReady
    //         .then(() => {
    //             editor.current
    //                 .render(content)
    //                 .then(() => {
    //                     console.log("Nội dung đã được render");
    //                 })
    //                 .catch((error) => {
    //                     console.log("Render thất bại", error);
    //                 });
    //         })
    //         .catch((error) => {
    //             console.log("Editor.js failed to initialize", error);
    //         });
    // }, [content]);

    // useEffect(() => {
    //     const handleChange = (value) => {
    //         onSave(value);
    //     };
    //     editor.on("change", handleChange);
    //     return () => {
    //         editor.off("change", handleChange);
    //     };
    // }, [editor]);

    // const onRetrieve = async () => {
    //     try {
    //         const response = await getNote(slug, {
    //             params: {
    //                 page: page,
    //             },
    //         });

    //         if (response.status === 200) {
    //             // editor.setEditorValue(JSON.parse(response.data.content));
    //         }
    //     } catch (error) {}
    // };

    const onSave = async (value) => {
        try {
            setIsLoading(true);

            const response = await saveNote(slug, {
                page: pageRef.current,
                content: JSON.stringify(value),
            });

            setIsLoading(false);

            if (response.status === 200) {
                onRefresh();
            }
        } catch (error) {}
    };

    const onDelete = async () => {
        try {
            const response = await deleteNote(slug, {
                params: {
                    page: page,
                },
            });

            if (response.status === 200) {
                onRefresh();
                onRemove();
            }
        } catch (error) {}
    };

    return (
        <div className="bg-teal-200 rounded-b-3xl rounded-tl-3xl shadow-lg p-5 h-fit max-h-[400px] w-fit">
            <div className="flex space-x-2 items-center mb-5">
                <div className="bg-white p-2 w-10 h-10 rounded-full flex items-center justify-center">
                    <FaFeatherPointed className="w-5 h-5" />
                </div>

                <div className="text-lg font-medium">Ghi chú trang {page + 1}</div>
            </div>

            <div id="editorjs"></div>

            <div className="flex items-center justify-between">
                {isLoading && <AiOutlineLoading3Quarters className="w-5 h-5 text-green-500 animate-spin" />}

                <button className="ml-auto" onClick={() => setOpenDeleteModal(true)}>
                    <IoMdTrash className="w-10 h-10 text-red-600 rounded-full p-2 hover:bg-red-50" />
                </button>
            </div>

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <PiWarningFill className="mx-auto mb-8 h-14 w-14 text-red-600" />

                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có muốn xoá ghi chú ở trang {page + 1} không?</h3>

                        <div className="flex justify-center gap-5 mb-5">
                            <Button color="failure" onClick={onDelete}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Note;
