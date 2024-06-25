import { addNewCollection, editCollection } from "@api/main/collectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronUp } from "react-icons/hi";
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

const CollectionModal = (props) => {
    usePrivateAxios();

    const { collection, openCollectionModal, isCreatingNew, triggerModal, refreshList } = props;

    const [openModal, setOpenModal] = useState(openCollectionModal);
    const [collectionName, setCollectionName] = useState(isCreatingNew ? "" : collection.collectionName);
    const [isPrivate, setIsPrivate] = useState(isCreatingNew ? false : collection.private);
    const [isLoading, setIsLoading] = useState(false);
    const [isCollectionNameValid, setIsCollectionNameValid] = useState(true);

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
    };

    const validateCollectionName = () => {
        if (collectionName === "" || collectionName.trim() === "") setIsCollectionNameValid(false);
        else setIsCollectionNameValid(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateCollectionName();

        if (isCollectionNameValid) {
            setIsLoading(true);

            try {
                const data = {
                    collectionName: collectionName,
                    private: isPrivate,
                };

                let response = null;
                if (isCreatingNew) response = await addNewCollection(data);
                else response = await editCollection(collection.collectionId, data);

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">{isCreatingNew ? "Tạo bộ sưu tập thành công!" : "Chỉnh sửa bộ sưu tập thành công!"}</p>, toastOptions);

                    setOpenModal(false);

                    refreshList();
                } else {
                    if (response.message === "Collection not found") {
                        toast.error(<p className="pr-2">Bộ sưu tập không tồn tại!</p>, toastOptions);
                    } else {
                        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                    }
                }
            } catch (error) {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        }
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Tạo bộ sưu tập mới"}
                            {!isCreatingNew && "Chỉnh sửa bộ sưu tập"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="collectionName" value="Tên bộ sưu tập" />
                                </div>
                                <TextInput id="collectionName" value={collectionName} onChange={(event) => setCollectionName(event.target.value)} required />
                                {!isCollectionNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên bộ sưu tập</p>}
                            </div>
                            <div className="mb-6">
                                <ToggleSwitch checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} label="Giữ bí mật bộ sưu tập này" />
                            </div>
                            <div className="flex justify-between mt-5 gap-2">
                                <Button onClick={() => onCloseModal()} disabled={isLoading} color="failure" className="w-auto">
                                    <HiChevronLeft className="mr-2 h-5 w-5" />
                                    Huỷ bỏ
                                </Button>

                                <Button type="submit" isProcessing={isLoading} color="success" className="w-auto">
                                    Lưu
                                    <HiChevronUp className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CollectionModal;
