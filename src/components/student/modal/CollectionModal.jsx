import { Button, Label, Modal, TextInput, Toast, ToggleSwitch } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronUp, HiOutlineCheck, HiX } from "react-icons/hi";

import usePrivateAxios from "../../../api/usePrivateAxios";

import { addNewCollection, editCollection} from "../../../api/main/collectionAPI";

const CollectionModal = (props) => {
    usePrivateAxios();

    const { collection, openCollectionModal, isCreatingNew, triggerModal, refreshList } = props;

    const [openModal, setOpenModal] = useState(openCollectionModal);
    const [collectionName, setCollectionName] = useState(isCreatingNew ? "" : collection.collectionName);
    const [isPrivate, setIsPrivate] = useState(isCreatingNew ? false : collection.private);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [mainMessage, setMainMessage] = useState("Đã xảy ra lỗi!");
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
                if (isCreatingNew) response = await addNewCollection(data)
                else response = await editCollection(collection.collectionId, data);

                setIsLoading(false);

                if (response.status === 200) {
                    setStatus(1);
                    setMainMessage(isCreatingNew ? "Tạo bộ sưu tập thành công!" : "Chỉnh sửa bộ sưu tập thành công!");
                    setOpenModal(false);

                    refreshList();

                    setTimeout(() => {
                        setStatus(0);
                    }, 4000);
                } else {
                    setStatus(-1);

                    if (response.message === "Collection not found") setMainMessage("Bộ sưu tập không tồn tại!");
                    else setMainMessage("Đã xảy ra lỗi!");

                    setTimeout(() => {
                        setStatus(0);
                    }, 4000);
                }
            } catch (error) {
                setStatus(-1);
                setMainMessage("Đã xảy ra lỗi!");
                setTimeout(() => {
                    setStatus(0);
                }, 2000);
            }
        }
    };

    return (
        <>
            {status === -1 && (
                <Toast className="top-1/4 right-5 w-100 fixed z-50">
                    <HiX className="h-5 w-5 bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" />
                    <div className="pl-4 text-sm font-normal">{mainMessage}</div>
                </Toast>
            )}

            {status === 1 && (
                <Toast className="top-1/4 right-5 fixed w-100 z-50">
                    <HiOutlineCheck className="h-5 w-5 bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200" />
                    <div className="pl-4 text-sm font-normal">{mainMessage}</div>
                </Toast>
            )}

            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Tạo bộ sưu tập mới"}
                            {!isCreatingNew && "Chỉnh sửa bộ sưu tập"}
                        </h3>

                        <form onSubmit={handleSubmit} >
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
