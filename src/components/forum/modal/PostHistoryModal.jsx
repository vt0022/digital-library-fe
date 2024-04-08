import DOMPurify from "dompurify";
import { Avatar, Modal, Timeline } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiClock } from "react-icons/hi";
import moment from "moment";

const PostHistoryModal = (props) => {
    const { triggerPostModal, openPostHistoryModal, postHistory } = props;

    const [openModal, setOpenModal] = useState(openPostHistoryModal);

    useEffect(() => {
        if (triggerPostModal !== 0) 
            setOpenModal(true);
    }, [triggerPostModal]);

    return (
        <>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Lịch sử chỉnh sửa</Modal.Header>
                <Modal.Body>
                    <Timeline>
                        {postHistory &&
                            postHistory.map((post, index) => (
                                <Timeline.Item key={index}>
                                    <Timeline.Point icon={HiClock} />
                                    <Timeline.Content className="space-y-5">
                                        <Timeline.Time className=" text-black font-medium text-lg mb-3">{moment(post.loggedAt).format("DD-MM-yyyy HH:mm")}</Timeline.Time>
                                        <Timeline.Body>
                                            <div className="text-black bg-gray-100 rounded-lg p-5 space-y-3">
                                                {/* <Avatar alt="User" img="" rounded className="justify-start">
                                                    <div className="font-medium">Nguyễn Văn Thuận</div>
                                                </Avatar> */}

                                                <p className="text-xl font-medium">{post.title}</p>

                                                <p className="font-normal" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
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

export default PostHistoryModal;
