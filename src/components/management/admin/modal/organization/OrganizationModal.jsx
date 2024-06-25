import { createOrganization, getAnOrganization, updateOrganization } from "@api/main/organizationAPI";
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

const OrganizationModal = (props) => {
    usePrivateAxios();

    const { organizationId, openOrganizationModal, isCreatingNew, triggerModal, refreshOrganizationList } = props;

    const [openModal, setOpenModal] = useState(openOrganizationModal);
    const [organizationName, setOrganizationName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOrganizationNameValid, setIsOrganizationNameValid] = useState(true);

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
            if (!isCreatingNew) {
                getOrganizationByOrganizationId();
            }
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setOrganizationName("");
    };

    const getOrganizationByOrganizationId = async () => {
        try {
            const response = await getAnOrganization(organizationId);

            if (response.status === 200) {
                const organization = response.data;
                setOrganizationName(organization.orgName);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validateOrganizationName = () => {
        if (organizationName === "" || organizationName.trim() === "") setIsOrganizationNameValid(false);
        else setIsOrganizationNameValid(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateOrganizationName();

        if (isOrganizationNameValid) {
            setIsLoading(true);

            try {
                const data = {
                    orgName: organizationName,
                };

                let response = null;
                if (isCreatingNew) response = await createOrganization(data);
                else response = await updateOrganization(organizationId, data);

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">{isCreatingNew ? "Tạo trường học thành công!" : "Cập nhật trường học thành công!"}</p>, toastOptions);

                    setOpenModal(false);

                    refreshOrganizationList();

                    setOrganizationName("");
                } else {
                    if (response.message === "Organization already exists") {
                        toast.error(<p className="pr-2">Trường học đã tồn tại!</p>, toastOptions);
                    } else if (response.message === "Organization not found") {
                        toast.error(<p className="pr-2">Trường học không tồn tại!</p>, toastOptions);
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
                            {isCreatingNew && "Thêm trường học mới"}
                            {!isCreatingNew && "Cập nhật trường học"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <div className="mb-2 block">
                                    <Label htmlFor="organizationName" value="Tên trường học" />
                                </div>
                                <TextInput id="organizationName" placeholder="Trường Đại học Sư phạm Kỹ thuật TP. HCM" value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} required />
                                {!isOrganizationNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên trường học</p>}
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

export default OrganizationModal;
