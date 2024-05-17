import { reportPost, reportReply } from "@api/main/reportAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import reportReasons from "@assets/json-data/report_reasons.json";
import { Button, Label, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const ReportModal = (props) => {
    usePrivateAxios();

    const { target, targetId, openReportModal, triggerModal } = props;

    const [openModal, setOpenModal] = useState(openReportModal);
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
            let data = null;
            let response = null;
            if (target === "POST") {
                data = {
                    postId: targetId,
                    type: type,
                    reason: reason,
                };
                response = await reportPost(data);
            } else {
                data = {
                    replyId: targetId,
                    type: type,
                    reason: reason,
                };
                response = await reportReply(data);
            }
            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">{target === "POST" ? "Báo cáo bài đăng thành công!" : "Báo cáo phản hồi thành công!"}</p>, toastOptions);

                onCloseModal();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại</p>, toastOptions);
        }
    };

    return (
        <>
            <Modal show={openModal} size="xl" onClose={onCloseModal} className="z-40">
                <Modal.Header>Báo cáo {target === "POST" ? "bài đăng" : "phản hồi"}</Modal.Header>
                <Modal.Body>
                    <div className="mb-5 space-y-2">
                        <p className="text-xl font-medium text-black ">Hãy chọn vấn đề</p>
                        <p className="text-sm font-normal text-gray-500">Nếu bạn nhận thấy nội dung này có vấn đề, hãy báo cáo ngay với chúng tôi.</p>
                    </div>

                    <div className="space-x-4 space-y-4 text-lg font-medium flex flex-wrap items-end justify-center mb-5">
                        {reportReasons.map((reason, index) => (
                            <div key={index} className={`rounded-3xl px-4 py-2 h-fit cursor-pointer shadow-md ${type === reason.name ? "bg-red-600 text-white shadow-red-300" : "bg-gray-100 text-black hover:bg-gray-200"}`} onClick={() => setType(reason.name)}>
                                {reason.value}
                            </div>
                        ))}
                    </div>

                    {type === "KHAC" && (
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="reason" value="Lý do khác mà bạn muốn báo cáo" />
                            </div>
                            <Textarea id="reason" rows={2} maxLength={1000} value={reason} className="focus:border-green-500 focus:ring-green-500" onChange={(e) => setReason(e.target.value)} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button color="success" isProcessing={isLoading} disabled={isLoading || type === ""} onClick={handleReport}>
                        Gửi báo cáo
                    </Button>
                    <Button color="failure" disabled={isLoading} onClick={onCloseModal}>
                        Huỷ bỏ
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReportModal;
