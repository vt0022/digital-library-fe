import { appealPost, appealReply } from "@api/main/appealAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import appealReasons from "@assets/json-data/appeal_reasons.json";
import { Button, Label, Modal, Textarea, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const AppealModal = (props) => {
    usePrivateAxios();

    const { target, reportId, openAppealModal, triggerModal } = props;

    const [openModal, setOpenModal] = useState(openAppealModal);
    const [type, setType] = useState("");
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        window.addEventListener("error", (e) => {
            if (e.message.startsWith("ResizeObserver loop")) {
                const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div");
                const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay");
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute("style", "display: none");
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute("style", "display: none");
                }
            }
        });
    }, []);

    useEffect(() => {
        if (triggerModal !== 0) {
            setOpenModal(true);
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setType("");
        setReason("");
    };

    const handleReport = async () => {
        setIsLoading(true);

        try {
            let data = {
                reportId: reportId,
                type: type,
                reason: reason,
            };
            let response = null;

            if (target === "POST") {
                response = await appealPost(data);
            } else {
                response = await appealReply(data);
            }

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">{target === "POST" ? "Khiếu nại xử lý bài đăng thành công!" : "Khiếu nại xử lý phản hồi thành công!"}</p>, toastOptions);

                onCloseModal();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại!</p>, toastOptions);
            console.log(error);
        }
    };

    return (
        <>
            <Modal show={openModal} size="xl" onClose={onCloseModal} className="z-40">
                <Modal.Header>Khiếu nại {target === "POST" ? "bài đăng" : "phản hồi"}</Modal.Header>
                <Modal.Body>
                    <div className="mb-5 space-y-2">
                        <p className="text-xl font-medium text-black ">Hãy chọn lý do</p>
                        <p className="text-sm font-normal text-gray-500">Nếu bạn nhận thấy việc xử lý vi phạm là không hợp lý, hãy khiếu nại ngay với chúng tôi.</p>
                    </div>

                    <div className="space-x-4 space-y-4 text-lg font-medium flex flex-wrap items-end justify-center mb-5">
                        {appealReasons.map((reason, index) => (
                            <Tooltip style="light" content={reason.detail}>
                                <div key={index} className={`rounded-3xl px-4 py-2 h-fit cursor-pointer shadow-md ${type === reason.name ? "bg-red-600 text-white shadow-red-300" : "bg-gray-100 text-black hover:bg-gray-200"}`} onClick={() => setType(reason.name)}>
                                    {reason.value}
                                </div>
                            </Tooltip>
                        ))}
                    </div>

                    <div className="w-full">
                        <div className="mb-2 block">
                            <Label htmlFor="reason" value="Bạn có thể mô tả chi tiết lý do tại sao việc xử lý là chưa chính xác" />
                        </div>
                        <Textarea id="reason" rows={2} maxLength={1000} value={reason} className="focus:border-green-500 focus:ring-green-500" onChange={(e) => setReason(e.target.value)} />
                    </div>

                    <div className="mt-5">
                        <p className="text-sm font-normal text-gray-500">Khiếu nại sẽ được xử lý trong từ khoảng 1-5 ngày. Cảm ơn bạn đã chờ đợi.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="success" isProcessing={isLoading} disabled={isLoading || type === ""} onClick={handleReport}>
                        Gửi khiếu nại
                    </Button>
                    <Button color="failure" disabled={isLoading} onClick={onCloseModal}>
                        Huỷ bỏ
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AppealModal;
