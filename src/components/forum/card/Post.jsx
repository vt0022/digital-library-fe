import { Avatar } from "flowbite-react";
import moment from "moment";
import { IoChatbubbles, IoEye, IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
    const navigate = useNavigate();
    return (
        <div className="relative flex space-x-3 rounded-lg shadow-lg p-5 bg-white">
            {post.label && (
                <span
                    className="absolute h-8 bg-white border right-5 -top-4 text-white rounded-lg text-xs px-3 py-2 font-medium"
                    style={{ color: post.label && post.label.color, borderColor: post.label && post.label.color }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/forum/labels/${post.label.slug}`);
                    }}>
                    #{post.label && post.label.labelName}
                </span>
            )}

            <div className="shrink-0">
                <Avatar alt="User" img={post.userPosted.image} rounded size="md" color="success" />
            </div>

            <div className="flex flex-col space-y-1 flex-grow">
                <p className="text-lg text-justify font-medium text-zinc-600 hover:text-green-400 cursor-pointer" onClick={() => navigate(`/forum/posts/${post.postId}`)}>
                    {post.title}
                </p>

                <p className="font-medium text-sky-500 hover:text-sky-400 cursor-pointer text-sm" onClick={() => navigate(`/forum/users/${post.userPosted.userId}`)}>
                    {post.userPosted.lastName} {post.userPosted.firstName}
                </p>

                <p className="text-slate-400 text-sm">{moment(post.createdAt).calendar()}</p>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <IoEye className="text-emerald-500 text-xl" />
                    <p className="text-gray-600 font-medium">{post.totalViews}</p>
                </div>

                <div className="flex items-center space-x-1">
                    <IoChatbubbles className="text-amber-500 text-xl" />
                    <p className="text-gray-600 font-medium">{post.totalReplies}</p>
                </div>

                <div className="flex items-center space-x-1">
                    <IoHeart className="text-red-500 text-xl" />
                    <p className="text-gray-600 font-medium">{post.totalLikes}</p>
                </div>
            </div>
        </div>
    );
};

export default Post;