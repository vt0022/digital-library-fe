import DOMPurify from "dompurify";
import { Modal, Timeline } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { HiClock } from "react-icons/hi";

const ReplyHistoryModal = (props) => {
    const { triggerReplyModal, openReplyHistoryModal, replyHistory } = props;

    const [openModal, setOpenModal] = useState(openReplyHistoryModal);

    useEffect(() => {
        if (triggerReplyModal !== 0 && openModal === false) {
            setOpenModal(true);
        }
    }, [triggerReplyModal]);

    return (
        <>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Lịch sử chỉnh sửa</Modal.Header>
                <Modal.Body>
                    <Timeline>
                        {replyHistory &&
                            replyHistory.map((reply, index) => (
                                <Timeline.Item key={index}>
                                    <Timeline.Point icon={HiClock} />
                                    <Timeline.Content className="space-y-5">
                                        <Timeline.Time className=" text-black font-medium text-lg mb-3">{moment(reply.loggedAt).format("DD-MM-yyyy HH:mm")}</Timeline.Time>
                                        <Timeline.Body>
                                            <div className="text-black bg-gray-100 rounded-lg p-5 space-y-3">
                                                <p className="font-normal" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} />
                                            </div>
                                        </Timeline.Body>
                                    </Timeline.Content>
                                </Timeline.Item>
                            ))}
                    </Timeline>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ReplyHistoryModal;
