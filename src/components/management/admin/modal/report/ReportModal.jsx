import { handlePostReport, handleReplyReport } from "@api/main/reportAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import reportReasons from "@assets/json-data/report_reasons.json";
import { Button, Label, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const ReportModal = (props) => {
    usePrivateAxios();

    const { target, reportId, action, openReportModal, triggerReportModal, refresh } = props;

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
        if (triggerReportModal !== 0) {
            setOpenModal(true);
        }
    }, [triggerReportModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setType("");
        setReason("");
    };

    const handleReport = async () => {
        setIsLoading(true);
        try {
            let params = {
                action: action,
                type: type
            };
            let response = null;
            if (target === "POST") response = await handlePostReport(reportId, {params});
            else response = await handleReplyReport(reportId, {params});

            setIsLoading(false);

            if (response.status === 200) {
                // markReportAsRead(reportId);
                onCloseModal();

                toast.success(
                    <p className="pr-2">
                        {action === "disable" ? "Gỡ" : "Xoá"} {target === "POST" ? "bài đăng" : "phản hồi"} thành công!
                    </p>,
                    toastOptions,
                );

                refresh();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {}
    };

    return (
        <>
            <Modal dismissible show={openModal} size="xl" onClose={onCloseModal} className="z-40">
                <Modal.Header>
                    {action === "disable" ? "Gỡ" : "Xoá"} {target === "POST" ? "bài đăng" : "phản hồi"}
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-5 space-y-2">
                        <p className="text-xl font-medium text-black ">Hãy chọn vấn đề</p>
                        <p className="text-sm font-normal text-gray-500">
                            Chọn lý do mà {target === "POST" ? "bài đăng" : "phản hồi"} bị {action === "disable" ? "gỡ" : "xoá"}.
                        </p>
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
                                <Label htmlFor="reason" value={`Lý do khác mà bạn muốn ${target === "POST" ? "bài đăng" : "phản hồi"} bị ${action === "disable" ? "gỡ" : "xoá"}`} />
                            </div>
                            <Textarea id="reason" rows={2} maxLength={1000} value={reason} className="focus:border-green-500 focus:ring-green-500" onChange={(e) => setReason(e.target.value)} />
                        </div>
                    )}

                    <p className="text-sm font-normal text-gray-700">* Khi gỡ {target === "POST" ? "bài đăng" : "phản hồi"} này thì những báo cáo liên quan sẽ được xử lý tương tự theo</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="success" isProcessing={isLoading} disabled={isLoading || type === ""} onClick={handleReport}>
                        {action === "disable" ? "Gỡ" : "Xoá"}
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
