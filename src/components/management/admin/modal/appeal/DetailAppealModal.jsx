import appealReasons from "@assets/json-data/appeal_reasons.json";
import reportReasons from "@assets/json-data/report_reasons.json";
import DOMPurify from "dompurify";
import { Button, Modal } from "flowbite-react";
import moment from "moment";
import { useRef } from "react";

const DetailAppealModal = (props) => {
    const { target, openViewModal, onCloseViewModal, content, restore, remain, notSolved, updateType } = props;

    const topModal = useRef(null);

    const closeModal = () => {
        onCloseViewModal();
    };

    const findReportReasonByType = (name) => {
        const item = reportReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    const findAppealReasonByType = (name) => {
        const item = appealReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    return (
        <Modal show={openViewModal} size="xl" onClose={closeModal} className="z-40">
            <Modal.Header>Nội dung khiếu nại</Modal.Header>
            <Modal.Body>
                <div ref={topModal} className="space-y-5">
                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Tài liệu</p>
                        <div
                            onClick={() =>
                                window.open(`/admin/posts/${target === "POST" ? content.postReport && content.postReport.post && content.postReport.post.postId : content.replyReport && content.replyReport.reply && content.replyReport.reply.post && content.replyReport.reply.post.postId}`, "_blank")
                            }
                            className="text-lg font-medium text-green-500 hover:text-green-600 cursor-pointer">
                            {target === "POST" ? content.postReport && content.postReport.post && content.postReport.post.title : content.replyReport && content.replyReport.reply && content.replyReport.reply.post && content.replyReport.reply.post.title}
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Nội dung {target === "POST" ? "tài liệu" : "phản hồi"} bị báo cáo</p>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(target === "POST" ? content.postReport && content.postReport.post && content.postReport.post.content : content.replyReport && content.replyReport.reply && content.replyReport.reply.post && content.replyReport.reply.content),
                            }}
                        />
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Lý do vi phạm</p>
                        <p className="font-medium">{findReportReasonByType(content.disableReason)}</p>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Lý do khiếu nại</p>
                        <p className="font-medium">{findAppealReasonByType(content.type)}</p>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Chi tiết</p>
                        <p className="font-medium">{content.reason}</p>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Ngày khiếu nại</p>
                        <p className="font-medium">{moment(content.appealedAt).calendar()}</p>
                    </div>

                    {notSolved && (
                        <div className="flex justify-between">
                            <Button
                                color="success"
                                onClick={() => {
                                    updateType("restore");
                                    restore();
                                }}>
                                Khôi phục {target === "POST" ? "bài đăng" : "phản hồi"}
                            </Button>

                            <Button
                                color="warning"
                                onClick={() => {
                                    updateType("remain");
                                    remain();
                                }}>
                                Giữ nguyên quyết định
                            </Button>
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DetailAppealModal;
