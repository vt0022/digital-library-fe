import { Button, Pagination } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../../api/main/postAPI";
import SelectFilter from "../../components/student/select/SelectFilter";
import TopBar from "./TopBar";

const ListPosts = () => {
    const navigate = useNavigate();

    const [postList, setPostList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getPostList(currentPage);
    }, [currentPage]);

    const onPageChange = (page) => setCurrentPage(page);

    const getPostList = async (page) => {
        try {
            const response = await getAllPosts({
                params: {
                    page: page - 1,
                    size: 10,
                    order: "newest",
                },
            });
            setPostList(response.data.content);
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen">
            <TopBar />

            <div className="w-5/6 m-auto mt-5 p-5">
                <div className="w-fit flex justify-end ml-auto items-center mb-2 ">
                    <Button className="bg-green-400 enabled:hover:bg-green-500">
                        <HiOutlinePencilAlt className="mr-2 h-5 w-5 " />
                        Tạo bài viết
                    </Button>
                </div>

                <div className="flex bg-white rounded-lg">
                    <div className="w-fit flex text-xs w-fit px-2">
                        <div className="flex justify-between items-center w-full">
                            <SelectFilter className="w-full" />
                        </div>
                    </div>

                    <div className="w-fit flex justify-end ml-auto items-center">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={1000} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                    </div>
                </div>

                <div className="bg-white mt-2 p-5 rounded-lg">
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr className="bg-gray-100 border-y border-gray-300">
                                    <th className="w-3/5 text-base pl-8 font-medium ">Bài đăng</th>
                                    <th className="w-1/5 text-base font-medium ">Thống kê</th>
                                    <th className="w-1/5 text-base font-medium ">Mới nhất</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postList &&
                                    postList.map((post, index) => (
                                        <tr className="border-y border-gray-300 hover:bg-green-200" key={index}>
                                            <td className="pl-8">
                                                <p className="whitespace-nowrap font-medium text-green-600">{post.title}</p>
                                                <p>
                                                    <span className="text-green-600">{post.userPosted.firstName}</span> ● <span>{post.createdAt}</span>
                                                </p>
                                            </td>
                                            <td className="text-sm">
                                                <p>{post.totalReplies} phản hồi</p>
                                                <p>{post.totalViews} lượt xem</p>
                                                <p>{post.totalLikes} lượt thích</p>
                                            </td>
                                            <td>
                                                <p className="text-green-600">tuantu3008</p>
                                                <p>12/02/2024</p>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex bg-white rounded-lg mt-2">
                    <div className="w-fit flex justify-end ml-auto items-center">
                        <Pagination layout="pagination" currentPage={currentPage} totalPages={1000} onPageChange={onPageChange} previousLabel="Trước" nextLabel="Tiếp" showIcons className="text-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListPosts;
