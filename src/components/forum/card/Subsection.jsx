import moment from "moment";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import colors from "../../../assets/json-data/colors.json";

const Subsection = (props) => {
    const { subsection } = props;

    const navigate = useNavigate();

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div className="ml-10 flex space-x-2 text-white">
            <div
                className="w-[40%] flex items-center px-4 left-rounded shadow-lg shadow-gray-300 space-x-2 cursor-pointer subsection"
                style={{ backgroundColor: randomColor.bg, "--hover-color": randomColor.hover, "--active-color": randomColor.active }}
                onClick={() => navigate(`/forum/sections/${subsection.slug}`)}>
                <HiChatBubbleLeftRight size={40} />
                <p className="text-xl font-medium">{subsection.subName}</p>
            </div>

            <div className="w-[10%] p-2 flex flex-col justify-center text-center all-rounded shadow-lg text-black">
                <p className="text-gray-500 text-sm">Bài đăng</p>
                <p className="font-semibold text-xl">{subsection.totalPosts}</p>
            </div>

            <div className="w-[10%] p-2 flex flex-col justify-center text-center all-rounded shadow-lg text-black">
                <p className="text-gray-500 text-sm">Phản hồi</p>
                <p className="font-semibold text-xl">{subsection.totalReplies}</p>
            </div>

            <div className="w-[40%] p-2 right-rounded shadow-lg text-black">
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
            </div>
        </div>
    );
};

export default Subsection;
