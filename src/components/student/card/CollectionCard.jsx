import { Button, Modal, Toast, Tooltip } from "flowbite-react";
import React, { useState } from "react";
import { CgExtensionRemove } from "react-icons/cg";
import { HiOutlineCheck, HiX } from "react-icons/hi";
import { RiDeleteBinFill, RiEditCircleLine } from "react-icons/ri";
import { deleteCollection } from "../../../api/main/collectionAPI";
import CollectionModal from "../modal/CollectionModal";
import { GiPadlock } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import colors from "../../../assets/JsonData/colors.json";
import heights from "../../../assets/JsonData/heights.json";

const CollectionCard = (props) => {
    const { collection, isMine, refreshList } = props;

    const navigate = useNavigate();

    const [openCollectionModal, setOpenCollectionModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [triggerModal, setTriggerModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("");

    const getRandomColor = colors[Math.floor(Math.random() * colors.length)];

    const getRandomHeight = heights[Math.floor(Math.random() * heights.length)];

    const handleEdit = () => {
        setOpenCollectionModal(true);
        setTriggerModal(triggerModal + 1);
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
    };

    const deleteACollection = async () => {
        setIsLoading(true);
        try {
            const response = await deleteCollection(collection.collectionId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                setStatus(1);
                setMessage("Xoá bộ sưu tập thành công!");

                setTimeout(() => {
                    setStatus(0);
                }, 4000);

                refreshList();
            } else {
                setStatus(-1);
                setMessage("Đã xảy ra lỗi! Xin vui lòng thử lại!");

                setTimeout(() => {
                    setStatus(0);
                }, 4000);
            }
        } catch (error) {
            setStatus(-1);
            setMessage("Đã xảy ra lỗi! Xin vui lòng thử lại!");

            setTimeout(() => {
                setStatus(0);
            }, 4000);
        }
    };

    return (
        <div className="w-full rounded-lg h-fit">
            <div className="relative">
                <div className="flex h-72 rounded-lg shadow-lg border gap-x-[2px] hover:shadow-xl cursor-pointer collection-card" onClick={() => navigate(`/collections/${collection.slug}`)} style={{ "--hover-color": getRandomColor.hover }}>
                    {collection.thumbnails[0] && <img className="w-2/3 object-cover rounded-l-lg" src={collection.thumbnails[0]} alt="collection" />}
                    <div className="w-1/3 max-h-full flex flex-col space-y-[2px]">
                        {collection.thumbnails[1] && <img className="h-[142px] w-full object-cover rounded-tr-lg" src={collection.thumbnails[1]} alt="collection" />}
                        {collection.thumbnails[2] && <img className="h-[142px] w-full object-cover rounded-br-lg" src={collection.thumbnails[2]} alt="collection" />}
                    </div>
                </div>

                {isMine && collection.private && (
                    <div className="absolute top-3 left-3 p-2 rounded-full bg-white">
                        <GiPadlock className="text-2xl" />
                    </div>
                )}
            </div>

            <p className="font-medium text-base mt-3 mb-3 cursor-pointer collection-name" onClick={() => navigate(`/collections/${collection.slug}`)} style={{"--hover-color": getRandomColor.hover, "--active-color": getRandomColor.active }}>
                {collection.collectionName}
            </p>
            {/* 
            <div className="flex items-center mt-3">
                <Avatar alt="collect" img="" rounded size="sm" />
                <p className="text-sm">Lê Anh Tuấn</p>
            </div> */}
            {isMine && (
                <div className="flex items-center ml-auto">
                    <Tooltip content="Chỉnh sửa" style="light">
                        <RiEditCircleLine
                            className="w-7 h-7 text-yellow-500 hover:text-yellow-300 active:text-yellow-200 mr-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
                            }}
                        />
                    </Tooltip>

                    <Tooltip content="Xoá" style="light">
                        <RiDeleteBinFill
                            className="w-7 h-7 text-red-500 hover:text-red-300 active:text-red-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                        />
                    </Tooltip>
                </div>
            )}

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <CgExtensionRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá bộ sưu tập này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} onClick={() => deleteACollection()}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <CollectionModal openCollectionModal={openCollectionModal} collection={collection} isCreatingNew={false} triggerModal={triggerModal} refreshList={refreshList} />

            {status === -1 && (
                <Toast className="top-1/4 right-5 w-fit fixed z-50">
                    <HiX className="h-5 w-5 bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}

            {status === 1 && (
                <Toast className="top-1/4 right-5 fixed w-auto z-50">
                    <HiOutlineCheck className="h-5 w-5 bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}
        </div>
    );
};

export default CollectionCard;
