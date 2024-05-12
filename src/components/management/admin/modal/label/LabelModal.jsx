import { createLabel, getLabel, updateLabel } from "@api/main/labelAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { HiChevronLeft, HiChevronUp } from "react-icons/hi";
import { Bounce, toast } from "react-toastify";

const LabelModal = (props) => {
    usePrivateAxios();

    const { labelId, openLabelModal, isCreatingNew, triggerModal, refreshLabelList } = props;

    const [openModal, setOpenModal] = useState(openLabelModal);
    const [labelName, setLabelName] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [isLoading, setIsLoading] = useState(false);
    const [isLabelNameValid, setIsLabelNameValid] = useState(true);
    const [isShowColorPicker, setIsShowColorPicker] = useState(false);

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
                getLabelByLabelId();
            }
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setLabelName("");
        setColor("#ffffff");
        setIsLabelNameValid(true);
    };

    const getLabelByLabelId = async () => {
        try {
            const response = await getLabel(labelId);

            if (response.status === 200) {
                const label = response.data;
                setLabelName(label.labelName);
                setColor(label.color);
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validate = () => {
        const isLabelNameValid = labelName.trim() !== "";

        setIsLabelNameValid(isLabelNameValid);

        return { isLabelNameValid };
    };

    const handleSave = () => {
        const { isLabelNameValid } = validate();

        if (isLabelNameValid) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const data = {
                labelName: labelName,
                color: color
            };

            let response = null;
            if (isCreatingNew) response = await createLabel(data);
            else response = await updateLabel(labelId, data);

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">{isCreatingNew ? "Tạo nhãn thành công!" : "Cập nhật nhãn thành công!"}</p>, toastOptions);

                setOpenModal(false);

                refreshLabelList();
                setLabelName("");
            } else {
                if (response.message === "Label already exists") toast.error(<p className="pr-2">Trường học đã tồn tại!</p>, toastOptions);
                else if (response.message === "Label not found") toast.error(<p className="pr-2">Trường học không tồn tại!</p>, toastOptions);
                else toast.error(<p className="pr-2">Đã xảy ra lỗi!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại</p>, toastOptions);
        }
    };

      const handleClick = () => {
          setIsShowColorPicker(!isShowColorPicker);
      };

      const handleClose = () => {
          setIsShowColorPicker(false);
      };

      const handleChange = (color) => {
          setColor(color.hex);
      };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Thêm nhãn mới"}
                            {!isCreatingNew && "Cập nhật nhãn"}
                        </h3>

                        <div className="mb-5">
                            <div className="mb-2 block">
                                <Label htmlFor="labelName" value="* Tên nhãn" />
                            </div>

                            <TextInput id="labelName" value={labelName} onChange={(event) => setLabelName(event.target.value)} required />
                            {!isLabelNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên nhãn</p>}
                        </div>

                        <div className="mb-5">
                            <div className="mb-2 block">
                                <Label htmlFor="labelName" value="Màu sắc" />
                            </div>

                            <div>
                                <div className="flex space-x-5 items-center p-2 bg-white rounded-lg border inline-block cursor-pointer" onClick={handleClick}>
                                    <div className="w-9 h-5 rounded" style={{backgroundColor: color}}/>
                                    <div className="font-semibold">{color}</div>
                                </div>

                                {isShowColorPicker ? (
                                    <div className="absolute z-50">
                                        <div className="fixed inset-0" onClick={handleClose} />
                                        <SketchPicker color={color} onChange={handleChange} />
                                    </div>
                                ) : null}
                            </div>
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

export default LabelModal;
