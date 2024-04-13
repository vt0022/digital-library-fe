import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/forum/post/Home";
import Page404 from "./../pages/404Page";
import DetailPost from "./../pages/forum/post/DetailPost";
import EditPost from "./../pages/forum/post/EditPost";
import ListPosts from "./../pages/forum/post/ListPosts";
import NewPost from "./../pages/forum/post/NewPost";
import Wall from "./../pages/forum/user/Wall";

const ForumRouters = () => {
    return (
        <Routes>
            <Route path="/home" element={<ListPosts />} />
            <Route path="/sections/:section" element={<ListPosts />} />
            <Route path="/labels/:label" element={<ListPosts />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/posts/:postId/edit" element={<EditPost />} />
            <Route path="/posts/:postId" element={<DetailPost />} />
            <Route path="/users/:userId" element={<Wall />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
};

export default ForumRouters;