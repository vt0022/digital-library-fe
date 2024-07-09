import { Button, Modal, Progress, Tooltip } from "flowbite-react";
import { useState } from "react";
import { CgExtensionRemove } from "react-icons/cg";
import { HiBookmark, HiEye, HiHeart, HiOutlineLightBulb, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { IoHeart } from "react-icons/io5";

import "./card.css";

const DocumentCard = (props) => {
    const { document, type, action } = props;

    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/documents/${document && document.slug}/edit`);
    };

    const handleViewReason = () => {
        setOpenModal(true);
    };

    const calcProgress = () => {
        if (document) {
            const progress = Math.round(((document.currentPage + 1) / document.totalPages) * 100);
            return progress > 100 ? 100 : progress;
        } else {
            return 0;
        }
    };

    return (
        <>
            {/* <Tooltip content={docName} style="light" className="w-full"> */}
            <Link
                to={`/documents/${document && document.slug}`}
                className="rounded-lg w-full border-gray-200 border shadow-lg bg-white cursor-pointer hover:bg-green-100 focus:bg-green-50 active:bg-green-50 focus:border-green-200 active:border-green-200 focus:border-2 active:border-2"
                title={document && document.docName}>
                <div className="rounded-lg m-3">
                    <img src={document && document.thumbnail} className="h-[12rem] w-full object-cover rounded-lg m-auto" alt={document && document.docName} />
                </div>

                <div className="px-3 pb-3">
                    <div className="mb-1">
                        <p className="text-md text-justify font-medium truncate whitespace-normal line-clamp-3 text-green-400 dark:text-white">{document && document.docName}</p>
                    </div>

                    <div className="flex gap-2 pb-1.5 ">
                        <div className="flex items-center font-bold">
                            <IoHeart className="w-5 h-5 mr-1 text-red-500" />
                            <span className="block text-base font-medium text-red-500">{document && document.totalFavorite}</span>
                        </div>

                        <div className="flex items-center font-bold">
                            <HiEye className="w-5 h-5 mr-1 text-sky-500" />
                            <span className="block text-base font-medium text-sky-500">{document && document.totalView}</span>
                        </div>

                        <div className="flex items-center ml-auto">
                            {type === "LIKE" && (
                                <Tooltip content="Bỏ thích" style="light">
                                    <HiHeart
                                        className="w-8 h-8 text-red-500 hover:text-red-300 active:text-red-200"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            action();
                                        }}
                                    />
                                </Tooltip>
                            )}

                            {type === "SAVE" && (
                                <Tooltip content="Bỏ lưu" style="light">
                                    <HiBookmark
                                        className="w-8 h-8 text-green-500 hover:text-green-300 active:text-green-200"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            action();
                                        }}
                                    />
                                </Tooltip>
                            )}

                            {type === "RUD" && (
                                <>
                                    <Tooltip content="Chỉnh sửa" style="light">
                                        <HiOutlinePencilAlt
                                            className="w-7 h-7 text-yellow-500 hover:text-yellow-300 active:text-yellow-200 mr-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEdit();
                                            }}
                                        />
                                    </Tooltip>

                                    <Tooltip content="Xoá" style="light">
                                        <HiOutlineTrash
                                            className="w-7 h-7 text-red-500 hover:text-red-300 active:text-red-200"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                action();
                                            }}
                                        />
                                    </Tooltip>
                                </>
                            )}

                            {type === "VRUD" && (
                                <>
                                    <Tooltip content="Chỉnh sửa" style="light">
                                        <HiOutlinePencilAlt
                                            className="w-7 h-7 text-yellow-500 hover:text-yellow-300 active:text-yellow-200 mr-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEdit();
                                            }}
                                        />
                                    </Tooltip>

                                    <Tooltip content="Xoá" style="light">
                                        <HiOutlineTrash
                                            className="w-7 h-7 text-red-500 hover:text-red-300 active:text-red-200"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                action();
                                            }}
                                        />
                                    </Tooltip>

                                    <Tooltip content="Xem lý do" style="light">
                                        <HiOutlineLightBulb
                                            className="w-7 h-7 text-orange-500 hover:text-orange-300 active:text-orange-200 ml-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleViewReason();
                                            }}
                                        />
                                    </Tooltip>
                                </>
                            )}

                            {type === "COLLECTION" && (
                                <Tooltip content="Xoá khỏi bộ sưu tập" style="light">
                                    <CgExtensionRemove
                                        className="w-8 h-8 text-red-500 hover:text-red-300 active:text-red-200"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            action();
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {type === "RECENT" && (
                        <div className="w-full flex space-x-2 items-center">
                            <div className="flex-1">
                                <Progress progress={calcProgress()} size="sm" color="pink" />
                            </div>

                            <p className="shrink-0 font-medium text-sm text-pink-700">{calcProgress()}%</p>
                        </div>
                    )}
                </div>
            </Link>
            <p className="title">{document && document.docName}</p>

            <Modal show={openModal} size="sm" onClose={() => setOpenModal(false)}>
                <Modal.Header className="text-red-500">Lý do từ chối</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{document && document.note}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpenModal(false)} color="failure" className="rounded-full">
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DocumentCard;
