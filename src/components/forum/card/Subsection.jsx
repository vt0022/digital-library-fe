import colors from "@assets/json-data/colors.json";
import { useEffect, useState } from "react";
import { BiSolidNews } from "react-icons/bi";
import { GoDiscussionOutdated } from "react-icons/go";
import { IoChatbubbles } from "react-icons/io5";
import { MdAssistant } from "react-icons/md";
import { TbPin, TbPinFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { AiFillNotification } from "react-icons/ai";
import { MdFeedback } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { FaSlideshare } from "react-icons/fa6";
import { SiWechat } from "react-icons/si";

const Subsection = (props) => {
    const { subsection, handlePinClick } = props;

    const navigate = useNavigate();

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        checkPinned();
    }, []);

    const checkPinned = () => {
        const pinnedSubsections = JSON.parse(localStorage.getItem("pinned_subsections")) || [];
        setIsPinned(pinnedSubsections.some((item) => JSON.stringify(item.subId) === JSON.stringify(subsection.subId)));
    };

    const renderIcon = (slug) => {
        switch (slug) {
            case "thong-bao":
                return <AiFillNotification className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            case "huong-dan-su-dung":
                return <MdAssistant className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            case "gop-y":
                return <MdFeedback className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            case "ho-tro":
                return <MdOutlineSupportAgent className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            case "huong-dan-su-dung":
                return <MdAssistant className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            case "review":
                return <MdRateReview className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            case "chia-se":
                return <FaSlideshare className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
            default:
                return <SiWechat className="text-7xl" style={{ color: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }} />;
        }
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="relative flex flex-col justify-center items-center rounded-xl shadow-lg p-5 w-full h-60 bg-white transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-150 cursor-pointer" onClick={() => navigate(`/forum/sections/${subsection.slug}`)}>
                    <div className="h-2/5">{renderIcon(subsection.slug)}</div>

                    <div className="h-2/5">
                        <p className="text-2xl font-medium text-zinc-600">{subsection.subName}</p>
                    </div>

                    <div className="flex w-full h-1/5 items-center justify-evenly text-2xl">
                        <div className="flex items-center justify-center space-x-2" title="Số bài đăng">
                            <BiSolidNews className="text-cyan-500" />
                            <p className="font-medium text-gray-600">{subsection.totalPosts}</p>
                        </div>

                        <div className="flex items-center justify-center space-x-2" title="Số phản hồi">
                            <IoChatbubbles className="text-rose-500" />
                            <p className="font-medium text-gray-600">{subsection.totalReplies}</p>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 p-5 flex justify-center items-start text-gray-700 text-xl cursor-pointer">
                        {isPinned ? (
                            <TbPinFilled
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePinClick();
                                    setIsPinned(false);
                                }}
                                title="Gỡ pin"
                            />
                        ) : (
                            <TbPin
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePinClick();
                                    setIsPinned(true);
                                }}
                                title="Pin"
                            />
                        )}
                    </div>
                </div>

                {/* <div className="p-2 pt-8 -mt-3 rounded-lg shadow-lg text-black bg-white w-11/12">
                    {subsection.latestPost && (
                        <>
                            <p className="text-green-500 hover:text-green-700 truncate whitespace-normal line-clamp-1 cursor-pointer" onClick={() => navigate(`/forum/posts/${subsection.latestPost.postId}`)}>
                                {subsection.latestPost.title}
                            </p>
                            <p className="flex text-sm">
                                <p className=" text-sky-500 hover:text-sky-700  cursor-pointer" onClick={() => navigate(`/forum/users/${subsection.latestPost.userPosted.userId}`)}>
                                    {subsection.latestPost.userPosted && subsection.latestPost.userPosted.lastName} {subsection.latestPost.userPosted && subsection.latestPost.userPosted.firstName}
                                </p>
                                <p className="text-black mx-2"> ● </p>
                                <p className="text-gray-500">{moment(subsection.latestPost.createdAt).format("DD-MM-yyyy HH:mm")}</p>
                            </p>
                        </>
                    )}
                </div> */}
            </div>
        </>
    );
};

export default Subsection;
