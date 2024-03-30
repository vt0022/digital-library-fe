import React, { useState } from "react";
import "react-tabs/style/react-tabs.css";
import TopBar from "./TopBar";
import "./post.css";
import "./profile.css";

const Profile = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div className="bg-gray-200">
            <TopBar />

            <div className="w-5/6 m-auto min-h-screen h-max mt-5 p-5">
                <div className="bg-white mt-2 p-5 rounded-lg flex">
                    <div className="w-1/4 rounded-lg py-5 bg-gray-100">
                        <div className="bg-green-400 w-40 h-40 m-auto"></div>

                        <div className="text-center text-sm mt-5">vanthuan2724</div>

                        <div className="text-center font-semibold">Nguyễn Văn Thuận</div>

                        <div className="text-center text-xs mt-5">Tham gia: 10/10/2022</div>

                        <div className="text-center text-xs">Lần cuối: 19/03/2022</div>
                    </div>

                    <div className="w-3/4 rounded-lg pl-5">
                        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                            <ul
                                className="flex flex-wrap -mb-px text-base font-medium text-center"
                                id="default-styled-tab"
                                data-tabs-toggle="#default-styled-tab-content"
                                data-tabs-active-classes="text-green-400 hover:text-green-500 border-purple-600"
                                data-tabs-inactive-classes="text-gray-400 hover:text-gray-600 border-gray-100 hover:border-gray-300"
                                role="tablist">
                                <li className="me-2" role="presentation">
                                    <button className="inline-block p-4 border-b-2 rounded-t-lg" id="post-styled-tab" data-tabs-target="#styled-post" type="button" role="tab" aria-controls="post" aria-selected="false">
                                        Bài đăng
                                    </button>
                                </li>

                                <li className="me-2" role="presentation">
                                    <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="reply-styled-tab" data-tabs-target="#styled-reply" type="button" role="tab" aria-controls="reply" aria-selected="false">
                                        Phản hồi
                                    </button>
                                </li>

                                <li className="me-2" role="presentation">
                                    <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="about-styled-tab" data-tabs-target="#styled-about" type="button" role="tab" aria-controls="about" aria-selected="false">
                                        Thông tin
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div id="default-styled-tab-content">
                            <div className="hidden p-4 border-b border-gray-300 space-y-2" id="styled-post" role="tabpanel" aria-labelledby="post-tab">
                                <p className="font-medium text-sky-600">Tài liệu ôn tập CTDL và GT</p>
                                <p className="text-sm">
                                    Dạ em chào mấy anh chị, <br />
                                    Em K24, cho em xin đề thi cuối kì môn Cấu trúc dữ liệu và giải thuật được không ạ. <br />
                                    Em cảm ơn nhiềuuuuu.
                                </p>
                                <p className="text-sm text-gray-400">10/01/2024</p>
                            </div>

                            <div className="hidden p-4 border-b border-gray-300 space-y-2" id="styled-reply" role="tabpanel" aria-labelledby="reply-tab">
                                <p className="font-medium text-sky-600">
                                    Nguyễn Văn Thuận <span className="font-normal text-black">đã phản hồi tại </span>Tài liệu nghiên cứu khoa học
                                </p>
                                <p className="text-sm">
                                    <span className="font-bold">"</span>Bạn có thể tìm cuốn.....<span className="font-bold">"</span>
                                </p>
                                <p className="text-sm text-gray-400">10/12/2023</p>
                            </div>

                            <div className="hidden p-4 border-b border-gray-300 space-y-2" id="styled-about" role="tabpanel" aria-labelledby="about-tab">
                                <p>
                                    Tổng bài viết: <span className="font-semibold">2</span>
                                </p>
                                <p>
                                    Tổng phản hồi: <span className="font-semibold">50</span>
                                </p>
                                <p>
                                    Tổng lượt thích: <span className="font-semibold">20</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
