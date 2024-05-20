import appealReasons from "@assets/json-data/appeal_reasons.json";
import reportReasons from "@assets/json-data/report_reasons.json";
import AppealModal from "@components/forum/modal/AppealModal";
import { checkPostAppeal, checkReplyAppeal } from "api/main/appealAPI";
import { Avatar, Modal } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import { TbFlag3Filled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "./notification.css";

const NotificationItem = (props) => {
    const { notification, read } = props;

    const navigate = useNavigate();

    const [appealInfo, setAppealInfo] = useState({ openAppealModal: false, target: null, reportId: null });
    const [triggerModal, setTriggerModal] = useState(0);
    const [appeal, setAppeal] = useState(null);
    const [openSentAppealModal, setOpenSentAppealModal] = useState(false);
    const [openEmptyModal, setOpenEmptyModal] = useState(false);

    const getMessage = () => {
        switch (notification && notification.type) {
            case "WARN_REPLY":
                return (
                    <>
                        {notification.message} về <span className="font-medium text-black">{notification.replyReport && findReportReasonByType(notification.replyReport.type)}</span>
                    </>
                );
            case "WARN_POST":
                return (
                    <>
                        {notification.message} về <span className="font-medium text-black">{notification.postReport && findReportReasonByType(notification.postReport.type)}</span>
                    </>
                );
            case "REWARD_BADGE":
                return (
                    <>
                        {notification.message} <span className="font-medium text-black">{notification.badge && notification.badge.badgeName}</span>
                    </>
                );
            default:
                return (
                    <>
                        <span className="font-semibold text-gray-900">
                            {notification && notification.sender && notification.sender.lastName} {notification && notification.sender && notification.sender.firstName}
                        </span>{" "}
                        {notification.message}
                    </>
                );
        }
    };

    const getTargetContent = () => {
        switch (notification && notification.type) {
            case "REPLY":
            case "LIKE_REPLY":
                return notification.reply && notification.reply.content.replace(/(<([^>]+)>)/gi, "");
            case "WARN_REPLY":
                return notification.replyReport && notification.replyReport.reply && notification.replyReport.reply.content.replace(/(<([^>]+)>)/gi, "");
            case "LIKE_POST":
                return notification.post && notification.post.title;
            case "WARN_POST":
                return notification.postReport && notification.postReport.post && notification.postReport.post.postName;
            case "RESTORE_POST":
            case "REMAIN_POST":
                return notification.postAppeal && notification.postAppeal.postReport && notification.postAppeal.postReport.post && notification.postAppeal.postReport.post.postName;
            case "RESTORE_REPLY":
            case "REMAIN_REPLY":
                return notification.replyAppeal && notification.replyAppeal.replyReport && notification.replyAppeal.replyReport.reply && notification.replyAppeal.replyReport.reply.content.replace(/(<([^>]+)>)/gi, "");
            case "REWARD_BADGE":
                return notification.reply && notification.reply.title;
            default:
                return "#";
        }
    };

    const handleClickNotification = () => {
        switch (notification && notification.type) {
            case "REWARD_BADGE":
                navigate(`/forum/users/${notification && notification.recipient && notification.recipient.userId}`);
                if(!notification.read) read()
                break;
            case "REPLY":
                navigate(`/forum/posts/${notification && notification.reply && notification.reply.post && notification.reply.post.postId}`);
                if (!notification.read) read();
                break;
            case "LIKE_REPLY":
                navigate(`/forum/posts/${notification && notification.reply && notification.reply.post && notification.reply.post.postId}`);
                if (!notification.read) read();
                break;
            case "LIKE_POST":
                navigate(`/forum/posts/${notification && notification.post && notification.post.postId}`);
                if (!notification.read) read();
                break;
            case "WARN_POST":
                handleClickWarnPost();
                if (!notification.read) read();
                break;
            case "WARN_REPLY":
                handleClickWarnReply();
                if (!notification.read) read();
                break;
            default:
                if(!notification.read) read();
        }
    };

    const getIcon = () => {
        switch (notification && notification.type) {
            case "REPLY":
                return (
                    <div className="absolute flex items-center justify-center w-5 h-5 ms-8 -mt-5 bg-green-400 border border-white rounded-full">
                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                        </svg>
                    </div>
                );
            case "LIKE_REPLY":
                return (
                    <div className="absolute flex items-center justify-center w-5 h-5 ms-8 -mt-5 bg-red-600 border border-white rounded-full">
                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                        </svg>
                    </div>
                );
            case "LIKE_POST":
                return (
                    <div className="absolute flex items-center justify-center w-5 h-5 ms-8 -mt-5 bg-red-600 border border-white rounded-full">
                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                        </svg>
                    </div>
                );
            case "REWARD_BADGE":
                return (
                    <div className="absolute flex items-center justify-center w-5 h-5 ms-8 -mt-5 bg-sky-600 border border-white rounded-full">
                        <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.39113 10.5439C6.39051 9.44976 6.7016 8.37924 7.28617 7.46394C7.86503 6.55596 8.69417 5.84514 9.6681 5.42194C10.9668 4.85935 12.4322 4.85935 13.7309 5.42194C14.7052 5.84498 15.5347 6.55581 16.1138 7.46394C17.3021 9.32579 17.309 11.731 16.1314 13.5999L18.525 17.9719L16.0037 17.4719L15.1973 19.9999L12.9753 15.9249C12.1382 16.1414 11.2618 16.1414 10.4247 15.9249L8.20267 19.9999L7.39635 17.4709L4.875 17.9719L7.26863 13.5999C6.69465 12.6895 6.38988 11.6281 6.39113 10.5439V10.5439Z"
                                stroke="#000000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M11.4504 8.32691C11.4973 8.22925 11.5943 8.16742 11.7005 8.16742C11.8066 8.16742 11.9036 8.22925 11.9506 8.32691L12.4683 9.37291C12.5069 9.45209 12.5788 9.50881 12.6633 9.52691L13.7475 9.74991C13.8468 9.77396 13.9266 9.84932 13.9583 9.94877C13.99 10.0482 13.9688 10.1574 13.9025 10.2369L13.1284 11.1369C13.0738 11.2009 13.0483 11.2856 13.0582 11.3699L13.2015 12.5879C13.216 12.6944 13.1719 12.8004 13.0868 12.8633C13.0018 12.9262 12.8898 12.9357 12.7959 12.8879L11.8209 12.3799C11.7419 12.3384 11.6483 12.3384 11.5693 12.3799L10.5943 12.8879C10.5004 12.9357 10.3884 12.9262 10.3034 12.8633C10.2183 12.8004 10.1742 12.6944 10.1887 12.5879L10.3321 11.3729C10.3419 11.2886 10.3164 11.2039 10.2619 11.1399L9.4877 10.2399C9.41982 10.159 9.39893 10.0473 9.43286 9.94637C9.46679 9.84548 9.55041 9.77067 9.65248 9.74991L10.7367 9.52591C10.8212 9.50781 10.893 9.45109 10.9317 9.37191L11.4504 8.32691Z"
                                stroke="#000000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M7.90164 13.1977C7.6795 12.8481 7.21601 12.7448 6.8664 12.9669C6.51679 13.189 6.41345 13.6525 6.63559 14.0021L7.90164 13.1977ZM7.95112 14.4679L8.49338 13.9498L8.49105 13.9474L7.95112 14.4679ZM10.1224 15.8399L10.3567 15.1274L10.3557 15.1271L10.1224 15.8399ZM10.2422 16.6561C10.6433 16.7596 11.0523 16.5184 11.1558 16.1173C11.2593 15.7162 11.018 15.3072 10.6169 15.2037L10.2422 16.6561ZM16.7644 14.0021C16.9865 13.6525 16.8832 13.189 16.5336 12.9669C16.184 12.7448 15.7205 12.8481 15.4983 13.1977L16.7644 14.0021ZM15.4489 14.4679L14.9089 13.9474L14.9066 13.9498L15.4489 14.4679ZM13.2775 15.8399L13.0443 15.1271L13.0433 15.1274L13.2775 15.8399ZM12.783 15.2037C12.382 15.3072 12.1407 15.7162 12.2442 16.1173C12.3477 16.5184 12.7567 16.7596 13.1578 16.6561L12.783 15.2037ZM6.63559 14.0021C6.86081 14.3566 7.12062 14.6871 7.41118 14.9885L8.49105 13.9474C8.27068 13.7188 8.07317 13.4676 7.90164 13.1977L6.63559 14.0021ZM7.40886 14.986C8.0972 15.7064 8.94842 16.2449 9.88921 16.5527L10.3557 15.1271C9.65246 14.897 9.01285 14.4935 8.49337 13.9498L7.40886 14.986ZM9.88822 16.5524C10.0051 16.5908 10.1231 16.6254 10.2422 16.6561L10.6169 15.2037C10.5294 15.1811 10.4426 15.1557 10.3567 15.1274L9.88822 16.5524ZM15.4983 13.1977C15.3268 13.4676 15.1293 13.7188 14.9089 13.9474L15.9888 14.9885C16.2794 14.6871 16.5392 14.3566 16.7644 14.0021L15.4983 13.1977ZM14.9066 13.9498C14.3871 14.4935 13.7475 14.897 13.0443 15.1271L13.5108 16.5527C14.4516 16.2449 15.3028 15.7064 15.9911 14.986L14.9066 13.9498ZM13.0433 15.1274C12.9574 15.1557 12.8706 15.1811 12.783 15.2037L13.1578 16.6561C13.2769 16.6254 13.3949 16.5908 13.5118 16.5524L13.0433 15.1274Z"
                                fill="#000000"
                            />
                        </svg>
                    </div>
                );
            case "RESTORE_POST":
            case "RESTORE_REPLY":
                return (
                    <div className="absolute flex items-center justify-center w-5 h-5 ms-8 -mt-5 bg-green-600 border border-white rounded-full">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.676,8.237-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,1,1,1.414-1.414l2.323,2.323,5.294-4.853a1,1,0,1,1,1.352,1.474Z" />
                        </svg>
                    </div>
                );

            default:
                return (
                    <div className="absolute flex items-center justify-center w-5 h-5 ms-8 -mt-5 bg-yellow-400 border border-white rounded-full">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 512 512">
                            <g>
                                <g>
                                    <path
                                        d="M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172
			L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259
			c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227
			c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554
			c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z
			 M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47
			C281.638,399.11,270.06,411.018,256.498,411.018z"
                                    />
                                </g>
                            </g>
                        </svg>
                    </div>
                );
        }
    };

    const formatTime = () => {
        const today = moment().startOf("day");
        if (notification && moment(notification.sentAt).isBefore(today)) return moment(notification.sentAt).calendar();
        else return moment(notification.sentAt).fromNow();
    };

    const findReportReasonByType = (name) => {
        const item = reportReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    const findAppealReasonByType = (name) => {
        const item = appealReasons.find((item) => item.name === name);
        return item ? item.value : "";
    };

    const checkAppeal = async (target, reportId) => {
        try {
            let response = null;
            if (target === "POST") response = await checkPostAppeal(reportId);
            else response = await checkReplyAppeal(reportId);

            setAppeal(response.data);

            return response.data;
        } catch (error) {
            console.error("Error checking appeal:", error);
            return null;
        }
    };

    const handleClickWarnPost = async () => {
        if (notification && notification.postReport) {
            const appeal = await checkAppeal("POST", notification && notification.postReport && notification.postReport.reportId);
            console.log(appeal);
            if (appeal === null) {
                setTriggerModal(triggerModal + 1);
                setAppealInfo({
                    openAppealModal: true,
                    target: "POST",
                    reportId: notification && notification.postReport && notification.postReport.reportId,
                });
            } else if (appeal) {
                setOpenSentAppealModal(true);
                setAppealInfo({ openAppealModal: false, target: "POST", reportId: null });
            }
        } else {
            setOpenEmptyModal(true);
        }
    };

    const handleClickWarnReply = () => {
        if (notification && notification.replyReport) {
            const appeal = checkAppeal("REPLY", notification && notification.replyReport && notification.replyReport.reportId);
            if (appeal === null) {
                setTriggerModal(triggerModal + 1);
                setAppealInfo({ openAppealModal: true, target: "REPLY", reportId: notification && notification.replyReport && notification.replyReport.reportId });
            } else if (appeal) {
                setOpenSentAppealModal(true);
                setAppealInfo({ openAppealModal: false, target: "REPLY", reportId: null });
            }
        } else {
            setOpenEmptyModal(true);
        }
    };

    return (
        <>
            <div className={`flex w-full px-4 py-3 hover:bg-gray-200 cursor-pointer ${notification && notification.read ? "bg-gray-100" : ""}`} onClick={handleClickNotification}>
                <div className="flex-shrink-0 noti-avatar">
                    <Avatar alt={notification && notification.sender && notification.sender.firstName} img={notification && notification.sender && notification.sender.image} rounded />

                    {getIcon()}
                </div>

                <div className="w-full ps-3">
                    <div className="text-gray-500 text-sm mb-1.5 text-justify">{getMessage()}</div>

                    <div className="text-gray-500 text-sm font-medium mb-1.5 truncate whitespace-normal line-clamp-2">{getTargetContent()}</div>

                    <div className="text-xs text-blue-600 dark:text-blue-500">{formatTime()}</div>
                </div>
            </div>

            {appealInfo.openAppealModal && <AppealModal target={appealInfo.target} reportId={appealInfo.reportId} openReportModal={appealInfo.openAppealModal} triggerModal={triggerModal} />}

            {openSentAppealModal && (
                <Modal show={openSentAppealModal} size="md" onClose={() => setOpenSentAppealModal(false)} className="z-40">
                    <Modal.Header>Thông tin khiếu nại của bạn</Modal.Header>
                    <Modal.Body>
                        <div className="mb-5 space-y-2">
                            <p className="text-xl font-medium text-black">Bạn đã khiếu nại trước đây</p>
                            <p className="text-sm font-normal text-gray-500">Dưới đây là thông tin khiếu nại của bạn.</p>
                        </div>

                        <div className="mb-5 text-sm space-y-3">
                            <div className="rounded-lg bg-gray-100 p-3">
                                <p className="font-medium">Lỗi vi phạm</p>
                                <span> {appeal && appeal.postReport && findReportReasonByType(appeal.postReport.type)}</span>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3">
                                <p className="font-medium">Lý do khiếu nại</p>
                                <span> {appeal && findAppealReasonByType(appeal.type)}</span>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3">
                                <p className="font-medium">Mô tả chi tiết</p>
                                <span> {appeal && appeal.reason === "" ? "Không có" : findAppealReasonByType(appeal.reason)}</span>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3">
                                <p className="font-medium">Thời điểm khiếu nại</p>
                                <span> {moment(appeal && appeal.appealedAt).calendar()}</span>
                            </div>
                        </div>

                        <div className="mb-5 space-y-2 text-sm">
                            <p>Chúng tôi sẽ xem xét lại quyết định gỡ {appealInfo.target === "POST" ? "bài đăng" : "bình luận"}.</p>
                            <p>Cảm ơn vì sự chờ đợi của bạn.</p>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {openEmptyModal && (
                <Modal show={openEmptyModal} size="md" onClose={() => setOpenEmptyModal(false)} className="z-40" popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <TbFlag3Filled className="mx-auto mb-4 h-14 w-14 text-red-600" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Thông tin vi phạm không tồn tại!</h3>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default NotificationItem;
