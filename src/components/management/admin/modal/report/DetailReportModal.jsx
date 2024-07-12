import reportReasons from "@assets/json-data/report_reasons.json";
import DOMPurify from "dompurify";
import { Button, Modal } from "flowbite-react";
import moment from "moment";
import { useRef } from "react";

const DetailReportModal = (props) => {
    const { target, openViewModal, onCloseViewModal, content, relatedContent, handleView, action, notSolved } = props;

    const topModal = useRef(null);

    const closeModal = () => {
        onCloseViewModal();
    };

    const findReasonByType = (name) => {
        const item = reportReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    return (
        <Modal show={openViewModal} size="xl" onClose={closeModal} className="z-40">
            <Modal.Header>Nội dung bị báo cáo</Modal.Header>
            <Modal.Body>
                <div ref={topModal} className="space-y-5">
                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Tài liệu</p>
                        <div onClick={() => window.open(`/admin/posts/${target === "POST" ? content.post && content.post.postId : content.reply && content.reply.post && content.reply.post.postId}`, "_blank")} className="text-lg font-medium text-green-500 hover:text-green-600 cursor-pointer">
                            {target === "POST" ? content.post && content.post.title : content.reply && content.reply.post && content.reply.post.title}
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Nội dung {target === "POST" ? "tài liệu" : "phản hồi"} bị báo cáo</p>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(target === "POST" ? content.post && content.post.content : content.reply && content.reply.content) }} />
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Người báo cáo</p>
                        <p className="font-medium">
                            {content.user && content.user.lastName} {content.user && content.user.firstName}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Ngày báo cáo</p>
                        <p className="font-medium">{moment(content.reportedAt).calendar()}</p>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2">
                        <p className="text-sm font-medium text-gray-600">Lý do</p>
                        <p className="font-medium">{content.type === "KHAC" ? content.reason : findReasonByType(content.type)}</p>
                    </div>
                    {relatedContent.length > 0 && (
                        <>
                            <hr />

                            <div className="space-y-5">
                                <p>{target === "POST" ? "Bài đăng" : "Bình luận"} này cũng bị báo cáo vì:</p>

                                {relatedContent.map((report, index) => (
                                    <div
                                        className="rounded-lg bg-gray-100 p-3 flex flex-col space-y-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out"
                                        key={index}
                                        onClick={() => {
                                            if (topModal.current) topModal.current.scrollIntoView({ behavior: "smooth" });
                                            handleView(report);
                                        }}>
                                        <p className="text-sm font-medium text-gray-600 normal-case">{moment(report.reportedAt).calendar()}</p>
                                        <p className="font-medium">Lý do: {report.type === "KHÁC" ? report.reason : findReasonByType(report.type)}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {notSolved && (
                        <Button color="warning" onClick={action}>
                            Gỡ {target === "POST" ? "bài đăng" : "phản hồi"}
                        </Button>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DetailReportModal;
