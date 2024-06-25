import { createField, getAField, updateField } from "@api/main/fieldAPI";
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

const FieldModal = (props) => {
    usePrivateAxios();

    const { fieldId, openFieldModal, isCreatingNew, triggerModal, refreshFieldList } = props;

    const [openModal, setOpenModal] = useState(openFieldModal);
    const [fieldName, setFieldName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFieldNameValid, setIsFieldNameValid] = useState(true);

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
            if (!isCreatingNew) {
                getFieldByFieldId();
            }
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setFieldName("");
    };

    const getFieldByFieldId = async () => {
        try {
            const response = await getAField(fieldId);

            if (response.status === 200) {
                const field = response.data;
                setFieldName(field.fieldName);
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validateFieldName = () => {
        if (fieldName === "" || fieldName.trim() === "") setIsFieldNameValid(false);
        else setIsFieldNameValid(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateFieldName();

        if (isFieldNameValid) {
            setIsLoading(true);

            try {
                const data = {
                    fieldName: fieldName,
                };

                let response = null;
                if (isCreatingNew) response = await createField(data);
                else response = await updateField(fieldId, data);

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">{isCreatingNew ? "Tạo lĩnh vực thành công!" : "Cập nhật lĩnh vực thành công!"}</p>, toastOptions);

                    setOpenModal(false);

                    refreshFieldList();
                    setFieldName("");
                } else {
                    if (response.message === "Field already exists") {
                        toast.error(<p className="pr-2">Lĩnh vực đã tồn tại!</p>, toastOptions);
                    } else if (response.message === "Field not found") {
                        toast.error(<p className="pr-2">Lĩnh vực không tồn tại!</p>, toastOptions);
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
                            {isCreatingNew && "Thêm lĩnh vực mới"}
                            {!isCreatingNew && "Cập nhật lĩnh vực"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <div className="mb-2 block">
                                    <Label htmlFor="fieldName" value="Tên lĩnh vực" />
                                </div>
                                <TextInput id="fieldName" placeholder="Công nghệ thông tin" value={fieldName} onChange={(event) => setFieldName(event.target.value)} required />
                                {!isFieldNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên lĩnh vực</p>}
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

export default FieldModal;
