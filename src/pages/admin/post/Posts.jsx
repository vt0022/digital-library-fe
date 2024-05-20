import { getAllLabels } from "@api/main/labelAPI";
import { deleteAPost, getAllPostsForAdmin } from "@api/main/postAPI";
import { getAllSubsections } from "@api/main/sectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import ActionButton from "@components/management/action-button/ActionButton";
import SelectFilter from "@components/management/select/SelectFilter";
import Table from "@components/management/table/Table";
import { Button, Modal, Pagination, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiDocumentRemove } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Posts = () => {
    const tableHead = ["", "Tiêu đề", "Chuyên mục", "Nhãn", "Phản hồi", "Lượt thích", ""];

    const renderHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer" onClick={() => navigate(`/admin/posts/${item.postId}`)}>
            <td className="w-1/12 text-center font-bold">{(currentPage - 1) * 2 + index + 1}</td>
            <td className="w-4/12 text-justify">{item.title}</td>
            <td className="w-2/12 text-center">{item.subsection && item.subsection.subName}</td>
            <td className="w-2/12 text-center">
                <span className="px-3 py-1 rounded-2xl text-white text-xs" style={{ backgroundColor: item.label && item.label.color }}>
                    {item.label && item.label.labelName}
                </span>
            </td>
            <td className="w-1/12 text-center">{item.totalReplies}</td>
            <td className="w-1/12 text-center">{item.totalLikes}</td>
            <td className="w-1/12 text-center">
                <div className="flex space-x-0">
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/posts/${item.postId}`);
                        }}
                        icon="bx bx-show-alt"
                        color="green"
                        content="Xem bài đăng"
                    />
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.postId);
                        }}
                        icon="bx bx-pencil"
                        color="amber"
                        content="Chỉnh sửa bài đăng"
                    />
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.postId);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá bài đăng"
                    />
                </div>
            </td>
        </tr>
    );

    const toastOptions = {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    const orderList = [
        {
            order: "newest",
            name: "Mới nhất",
        },
        {
            order: "oldest",
            name: "Cũ nhất",
        },
        {
            order: "mostViewed",
            name: "Xem nhiều nhất",
        },
        {
            order: "leastViewed",
            name: "Ít được xem nhất",
        },
        {
            order: "mostLiked",
            name: "Được thích nhiều",
        },
        {
            order: "leastLiked",
            name: "Ít được thích",
        },
        {
            order: "mostReplied",
            name: "Phản hồi nhiều",
        },
        {
            order: "leastReplied",
            name: "Ít phản hồi",
        },
    ];

    const navigate = useNavigate();

    usePrivateAxios();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [postList, setPostList] = useState([]);
    const [postId, setPostId] = useState("");
    const [subsectionList, setSubsectionList] = useState([]);
    const [labelList, setLabelList] = useState([]);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [search, setSearch] = useState("");
    const [subsection, setSubsection] = useState("");
    const [label, setLabel] = useState("");
    const [order, setOrder] = useState("newest");

    useEffect(() => {
        getSubsectionList();
        getLabelList();
    }, []);

    useEffect(() => {
        getPostList(currentPage);
    }, [currentPage, search, subsection, label, order]);

    const handleAdd = () => {};

    const handleEdit = (postId) => {
        setPostId(postId);
    };

    const handleDelete = (postId) => {
        setOpenDeleteModal(true);
        setPostId(postId);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getPostList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getAllPostsForAdmin({
                params: {
                    page: page - 1,
                    size: 10,
                    subsection: subsection === "all" ? "" : subsection,
                    label: label === "all" ? "" : label,
                    s: search,
                    order: order,
                },
            });

            setIsFetching(false);
            if (response.status === 200) {
                setPostList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getSubsectionList = async () => {
        try {
            const response = await getAllSubsections({
                params: {
                    size: 100,
                },
            });

            if (response.status === 200) {
                setSubsectionList(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getLabelList = async () => {
        try {
            const response = await getAllLabels({
                params: {
                    size: 100,
                },
            });

            if (response.status === 200) {
                setLabelList(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteThisPost = async (postId) => {
        setIsLoading(true);
        try {
            const response = await deleteAPost(postId);
            setIsLoading(false);
            setOpenDeleteModal(false);
            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá bài đăng thành công!</p>, toastOptions);
                getPostList(1);
                setCurrentPage(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    return (
        <div className="m-auto">
            <div className="row">
                <div className="px-[15px]">
                    <h2 className="page-header">Bài đăng</h2>
                    <Button color="gray" className="mt-7 justify-self-end bg-white py-1.5" style={{ boxShadow: "var(--box-shadow)", borderRadius: "var(--border-radius)" }} onClick={handleAdd}>
                        <i className="bx bxs-calendar-plus mr-3 text-xl hover:text-white" style={{ color: "var(--main-color)" }}></i>
                        Thêm bài đăng
                    </Button>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card__body flex items-end justify-between">
                            <div className="flex space-x-5">
                                <SelectFilter
                                    selectName="Chuyên bài đăng"
                                    options={subsectionList}
                                    selectedValue={subsection}
                                    onChangeHandler={(e) => {
                                        setCurrentPage(1);
                                        setSubsection(e.target.value);
                                    }}
                                    name="subName"
                                    field="slug"
                                    required
                                />

                                <SelectFilter
                                    selectName="Nhãn"
                                    options={labelList}
                                    selectedValue={label}
                                    onChangeHandler={(e) => {
                                        setCurrentPage(1);
                                        setLabel(e.target.value);
                                    }}
                                    name="labelName"
                                    field="slug"
                                    required
                                />

                                <SelectFilter
                                    selectName="Sắp xếp"
                                    options={orderList}
                                    selectedValue={order}
                                    onChangeHandler={(e) => {
                                        setOrder(e.target.value);
                                    }}
                                    name="name"
                                    field="order"
                                    defaultName="Sắp xếp mặc định"
                                    defaultValue="newest"
                                    required
                                />
                            </div>

                            <div className="relative rounded-lg mb-2 w-1/3">
                                <input
                                    type="text"
                                    id="list-search"
                                    className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-lg"
                                    placeholder="Tìm kiếm"
                                    onChange={(e) => {
                                        setCurrentPage(1);
                                        setSearch(e.target.value);
                                    }}
                                    value={search}
                                    required
                                />

                                <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-lg">
                                    <svg className="w-4 h-4 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__body">
                            {postList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Không có kết quả!</p>}

                            {postList.length > 0 && <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={postList} renderBody={(item, index) => renderBody(item, index)} />}

                            {isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                            {totalPages > 1 && (
                                <div className="flex overflow-x-auto sm:justify-center">
                                    <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá bài đăng này không?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={() => deleteThisPost(postId)}>
                                Chắc chắn
                            </Button>
                            <Button color="gray" disabled={isLoading} onClick={() => setOpenDeleteModal(false)}>
                                Huỷ bỏ
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Posts;
