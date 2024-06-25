import { createCategory, getACategory, updateCategory } from "@api/main/categoryAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
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

const CategoryModal = (props) => {
    usePrivateAxios();

    const { categoryId, openCategoryModal, isCreatingNew, triggerModal, refreshCategoryList } = props;

    const [openModal, setOpenModal] = useState(openCategoryModal);
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCategoryNameValid, setIsCategoryNameValid] = useState(true);

    useEffect(() => {
        if (triggerModal !== 0) {
            if (!isCreatingNew) {
                getCategoryByCategoryId();
            }
            setOpenModal(true);
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
                    toast.success(<p className="pr-2">{isCreatingNew ? "Tạo danh mục thành công!" : "Cập nhật danh mục thành công!"}</p>, toastOptions);

                    setOpenModal(false);

                    refreshCategoryList();
                    
                    setCategoryName("");
                } else {
                    if (response.message === "Category already exists") {
                        toast.error(<p className="pr-2">Danh mục đã tồn tại!</p>, toastOptions);
                    } else if (response.message === "Category not found") {
                        toast.error(<p className="pr-2">Danh mục không tồn tại!</p>, toastOptions);
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

export default CategoryModal;
