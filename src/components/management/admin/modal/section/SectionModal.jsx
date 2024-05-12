import { createSection, getSection, updateSection } from "@api/main/sectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronUp } from "react-icons/hi";
import { Bounce, toast } from "react-toastify";

const SectionModal = (props) => {
    usePrivateAxios();

    const { sectionId, openSectionModal, isCreatingNew, triggerModal, refreshSectionList } = props;

    const [openModal, setOpenModal] = useState(openSectionModal);
    const [sectionName, setSectionName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSectionNameValid, setIsSectionNameValid] = useState(true);

    const toastOptions = {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
            if (!isCreatingNew) {
                getSectionBySectionId();
            }
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setSectionName("");
        setIsSectionNameValid(true);
    };

    const getSectionBySectionId = async () => {
        try {
            const response = await getSection(sectionId);

            if (response.status === 200) {
                const section = response.data;
                setSectionName(section.sectionName);
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validate = () => {
        const isSectionNameValid = sectionName.trim() !== "";

        setIsSectionNameValid(isSectionNameValid);

        return { isSectionNameValid };
    };

    const handleSave = () => {
        const { isSectionNameValid } = validate();

        if (isSectionNameValid) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const data = {
                sectionName: sectionName,
            };

            let response = null;
            if (isCreatingNew) response = await createSection(data);
            else response = await updateSection(sectionId, data);

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">{isCreatingNew ? "Tạo mục thành công!" : "Cập nhật mục thành công!"}</p>, toastOptions);

                setOpenModal(false);

                refreshSectionList();
                setSectionName("");
            } else {
                if (response.message === "Section already exists") toast.error(<p className="pr-2">Trường học đã tồn tại!</p>, toastOptions);
                else if (response.message === "Section not found") toast.error(<p className="pr-2">Trường học không tồn tại!</p>, toastOptions);
                else toast.error(<p className="pr-2">Đã xảy ra lỗi!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại</p>, toastOptions);
        }
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Thêm mục mới"}
                            {!isCreatingNew && "Cập nhật mục"}
                        </h3>

                        <div className="mb-5">
                            <div className="mb-2 block">
                                <Label htmlFor="sectionName" value="* Tên mục" />
                            </div>
                            
                            <TextInput id="sectionName" value={sectionName} onChange={(event) => setSectionName(event.target.value)} required />
                            {!isSectionNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên mục</p>}
                        </div>

                        <div className="flex justify-between gap-2">
                            <Button onClick={onCloseModal} disabled={isLoading} color="failure" className="w-auto">
                                <HiChevronLeft className="mr-2 h-5 w-5" />
                                Huỷ bỏ
                            </Button>

                            <Button isProcessing={isLoading} disabled={isLoading} color="success" className="w-auto" onClick={handleSave}>
                                Lưu
                                <HiChevronUp className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SectionModal;
