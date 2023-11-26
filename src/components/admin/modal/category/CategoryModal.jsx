import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiExclamation, HiOutlineCloudUpload } from "react-icons/hi";

import usePrivateAxios from "../../../../api/usePrivateAxios";

import { createCategory, getACategory, updateCategory } from "../../../../api/admin/categoryAPI";

const CategoryModal = (props) => {
    usePrivateAxios();

    const { categoryId, openCategoryModal, isCreatingNew, triggerModal, refreshCategoryList } = props;

    const [openModal, setOpenModal] = useState(openCategoryModal);
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [mainMessage, setMainMessage] = useState("Đã xảy ra lỗi!");
    const [isCategoryNameValid, setIsCategoryNameValid] = useState(true);

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
            if (!isCreatingNew) {
                getCategoryByCategoryId();
            }
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setCategoryName("");
    };

    const getCategoryByCategoryId = async () => {
        try {
            const response = await getACategory(categoryId);

            if (response.status === 200) {
                const category = response.data;
                setCategoryName(category.categoryName);
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validateCategoryName = () => {
        if (categoryName === "" || categoryName.trim() === "") setIsCategoryNameValid(false);
        else setIsCategoryNameValid(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateCategoryName();

        if (isCategoryNameValid) {
            setIsLoading(true);

            try {
                const data = {
                    categoryName: categoryName,
                };

                let response = null;
                if (isCreatingNew) response = await createCategory(data);
                else response = await updateCategory(categoryId, data);

                setIsLoading(false);

                if (response.status === 200) {
                    setStatus(1);
                    setMainMessage(isCreatingNew ? "Tạo danh mục thành công!" : "Cập nhật danh mục thành công!");
                    setOpenModal(false);

                    refreshCategoryList();
                    setCategoryName("");
                    
                    setTimeout(() => {
                        setStatus(0);
                    }, 4000);
                } else {
                    setStatus(-1);

                    if (response.message === "Category already exists") setMainMessage("Danh mục đã tồn tại!");
                    else if (response.message === "Category not found") setMainMessage("Danh mục không tồn tại!");
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
                    <HiExclamation className="h-5 w-5 text-amber-400 dark:text-amber-300" />
                    <div className="pl-4 text-sm font-normal">{mainMessage}</div>
                </Toast>
            )}

            {status === 1 && (
                <Toast className="top-1/4 right-5 fixed w-100 z-50">
                    <HiOutlineCloudUpload className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <div className="pl-4 text-sm font-normal">{mainMessage}</div>
                </Toast>
            )}

            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Thêm danh mục mới"}
                            {!isCreatingNew && "Cập nhật danh mục"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <div className="mb-2 block">
                                    <Label htmlFor="categoryName" value="Tên danh mục" />
                                </div>
                                <TextInput id="categoryName" placeholder="Giáo trình" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required />
                                {!isCategoryNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên danh mục</p>}
                            </div>

                            <div className="flex justify-between mt-5">
                                <Button type="submit" isProcessing={isLoading} color="success" className="w-28">
                                    Lưu
                                </Button>

                                <Button onClick={() => onCloseModal()} disabled={isLoading} color="failure" className="w-28">
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CategoryModal;
