import Page404 from "@pages/forum/error/404Page";
import Home from "@pages/forum/main/Home";
import DetailPost from "@pages/forum/post/DetailPost";
import EditPost from "@pages/forum/post/EditPost";
import ListPosts from "@pages/forum/post/ListPosts";
import NewPost from "@pages/forum/post/NewPost";
import Wall from "@pages/forum/user/Wall";
import UserRanking from "pages/forum/ranking/UserRanking";
import Activity from "pages/forum/user/Activity";
import { Route, Routes } from "react-router-dom";

const ForumRouters = ({ onPinSection }) => {
    return (
        <Routes>
            <Route path="/sections/:section" element={<ListPosts />} />
            <Route path="/labels/:label" element={<ListPosts />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/posts/:postId/edit" element={<EditPost />} />
            <Route path="/posts/:postId" element={<DetailPost />} />
            <Route path="/posts" element={<ListPosts />} />
            <Route path="/users/ranking" element={<UserRanking />} />
            <Route path="/users/my-activity" element={<Activity />} />
            <Route path="/users/:userId" element={<Wall />} />
            <Route path="/error" element={<Page404 />} />
            <Route path="/home" element={<Home onPinSection={onPinSection} />} />
            <Route path="/" exact element={<Home onPinSection={onPinSection} />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
};

export default ForumRouters;
