import { deleteCollection } from "@api/main/collectionAPI";
import colors from "@assets/json-data/light_colors.json";
import CollectionModal from "@components/student/modal/CollectionModal";
import { Button, Modal, Tooltip } from "flowbite-react";
import { useState } from "react";
import { CgExtensionRemove } from "react-icons/cg";
import { HiHeart, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { IoHeart } from "react-icons/io5";
import { RiChatPrivateFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

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

const CollectionCard = (props) => {
    const { collection, isMine, refreshList, like, handleUnlike } = props;

    const navigate = useNavigate();

    const [openCollectionModal, setOpenCollectionModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [triggerModal, setTriggerModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getRandomColor = colors[Math.floor(Math.random() * colors.length)];

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
                toast.success(<p className="pr-2">Xoá bộ sưu tập thành công!</p>, toastOptions);

                refreshList();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    return (
        <div className="relative overflow-hidden w-full border rounded-lg h-fit rounded-lg shadow-lg space-y-2 collection-card bg-white cursor-pointer transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-150 z-0" style={{ "--hover-color": getRandomColor.hover }}>
            <div className="absolute w-3/5 aspect-square rounded-full -top-10 -left-10 z-0" style={{ backgroundColor: getRandomColor.hover }} onClick={() => navigate(`/collections/${collection.slug}`)} />

            <div className="absolute w-2/5 aspect-square rounded-lg rotate-45 -bottom-10 -right-10 z-0" style={{ backgroundColor: getRandomColor.bg }} onClick={() => navigate(`/collections/${collection.slug}`)} />

            {isMine && collection.private && (
                <div className="absolute top-1 right-1 rounded-full bg-white z-[2] p-1 bg-amber-50" title="Bộ sưu tập riêng tư">
                    <RiChatPrivateFill className="text-2xl text-amber-500" />
                </div>
            )}

            <div className="relative p-5 z-[1]" onClick={() => navigate(`/collections/${collection.slug}`)}>
                <div className="relative">
                    <div className="flex space-x-2 justify-center">
                        {collection.thumbnails[0] && (
                            <div className="w-1/3 mt-2">
                                <img className="object-cover rounded-lg border" src={collection.thumbnails[0]} alt="collection" />
                            </div>
                        )}

                        {collection.thumbnails[1] && (
                            <div className="w-1/3">
                                <img className="object-cover rounded-lg border" src={collection.thumbnails[1]} alt="collection" />
                            </div>
                        )}

                        {collection.thumbnails[2] && (
                            <div className="w-1/3 mt-2">
                                <img className="object-cover rounded-lg border" src={collection.thumbnails[2]} alt="collection" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex w-full items-center justify-center space-x-3 text-xl mt-3 mb-2">
                    <div className="flex items-center justify-center space-x-2">
                        <HiClipboardDocumentList className="text-emerald-500" />
                        <p className="font-medium text-gray-600">{collection.totalDocuments}</p>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                        <IoHeart className="text-rose-500" />
                        <p className="font-medium text-gray-600">{collection.totalLikes}</p>
                    </div>
                </div>

                <p className="font-medium text-center mb-3 cursor-pointer collection-name" onClick={() => navigate(`/collections/${collection.slug}`)} style={{ color: getRandomColor.active }}>
                    {collection.collectionName}
                </p>

                {isMine && (
                    <div className="flex items-center ml-auto">
                        <Tooltip content="Chỉnh sửa" style="light">
                            <HiOutlinePencilAlt
                                className="w-7 h-7 text-yellow-500 hover:text-yellow-300 active:text-yellow-200 mr-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit();
                                }}
                            />
                        </Tooltip>

                        <Tooltip content="Xoá" style="light">
                            <HiOutlineTrash
                                className="w-7 h-7 text-red-500 hover:text-red-300 active:text-red-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                            />
                        </Tooltip>
                    </div>
                )}

                {like && (
                    <Tooltip content="Bỏ thích" style="light">
                        <HiHeart
                            className="w-8 h-8 text-red-500 hover:text-red-300 active:text-red-200"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleUnlike(collection.collectionId, collection.collectionName);
                            }}
                        />
                    </Tooltip>
                )}
            </div>

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
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
        </div>
    );
};

export default CollectionCard;
