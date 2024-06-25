import { deleteADocument, getUploadedDocumentsByUser } from "@api/main/documentAPI";
import { deleteAPost, getAllPostsOfUser } from "@api/main/postAPI";
import { getAUser } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import profileImage from "@assets/images/default_profile.jpg";
import ActionButton from "@components/management/action-button/ActionButton";
import Table from "@components/management/table/Table";
import PageHead from "@components/shared/head/PageHead";
import { Badge, Button, Modal, Pagination, Spinner } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiAtSymbol, HiCake, HiCheck, HiChevronLeft, HiCloudUpload, HiDocumentRemove, HiOutlineDotsHorizontal, HiUser, HiUserAdd, HiX } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const toastOptions = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

const DetailUser = () => {
    const roleList = {
        ROLE_ADMIN: "ADMIN",
        ROLE_STUDENT: "SINH VIÊN",
        ROLE_MANAGER: "QUẢN LÝ",
    };

    const tableHead = ["", "Tên", "Trạng thái", "Lượt xem", ""];

    const tablePostHead = ["", "Tiêu đề", "Chuyên mục", "Nhãn", "Phản hồi", "Lượt thích", ""];

    const renderHead = (item, index) => (
        <th key={index} className="text-center">
            {item}
        </th>
    );

    const renderPostHead = (item, index) => (
        <th className="text-center" key={index}>
            {item}
        </th>
    );

    const renderPostBody = (item, index) => (
        <tr key={index} className="cursor-pointer" onClick={() => navigate(`/admin/posts/${item.postId}`)}>
            <td className="w-1/12 text-center font-bold">{(currentPostPage - 1) * 5 + index + 1}</td>
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
                            navigate(`/admin/posts/${item.postId}/edit`);
                        }}
                        icon="bx bx-pencil"
                        color="amber"
                        content="Chỉnh sửa bài đăng"
                    />
                    <ActionButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(item.postId);
                        }}
                        icon="bx bx-trash"
                        color="red"
                        content="Xoá bài đăng"
                    />
                </div>
            </td>
        </tr>
    );

    const renderBody = (item, index) => (
        <tr key={index} className="cursor-pointer">
            <td className="text-center font-bold" onClick={() => handleDetail(item.slug)}>
                {(currentPage - 1) * 5 + index + 1}
            </td>
            <td className="max-w-xs text-justify" onClick={() => handleDetail(item.slug)}>
                {item.docName}
            </td>
            <td className="max-w-xl text-center" onClick={() => handleDetail(item.slug)}>
                <div className="m-auto w-fit">
                    {item.verifiedStatus === -1 && (
                        <Badge color="failure" icon={HiX}>
                            Từ chối
                        </Badge>
                    )}
                    {item.verifiedStatus === 0 && (
                        <Badge color="warning" icon={HiOutlineDotsHorizontal}>
                            Đợi duyệt
                        </Badge>
                    )}
                    {item.verifiedStatus === 1 && <Badge icon={HiCheck}>Đã duyệt</Badge>}
                </div>
            </td>
            <td className="max-w-xl text-center" onClick={() => handleDetail(item.slug)}>
                {item.totalView}
            </td>
            <td className="text-center">
                <div className="flex space-x-0">
                    <ActionButton onClick={() => handleDetail(item.slug)} icon="bx bx-show-alt" color="green" content="Xem chi tiết tài liệu" />
                    <ActionButton onClick={() => handleEdit(item.slug)} icon="bx bx-pencil" color="amber" content="Chỉnh sửa tài liệu" />
                    <ActionButton onClick={() => handleDelete(item.id)} icon="bx bx-trash" color="red" content="Xoá tài liệu" />
                </div>
            </td>
        </tr>
    );

    usePrivateAxios();

    const navigate = useNavigate();

    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPostPage, setCurrentPostPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [documentList, setDocumentList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [totalPostPages, setTotalPostPages] = useState(0);
    const [docId, setDocId] = useState("");
    const [postId, setPostId] = useState("");

    const [isFetching, setIsFetching] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openDeletePostModal, setOpenDeletePostModal] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    useEffect(() => {
        getUserByUserId();
    }, []);

    useEffect(() => {
        getUploadedDocumentList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        getPostList(currentPostPage);
    }, [currentPostPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const onPostPageChange = (page) => {
        setCurrentPostPage(page);
    };

    const getUserByUserId = async () => {
        try {
            const response = await getAUser(userId);

            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getUploadedDocumentList = async (page) => {
        try {
            setIsFetching(true);
            const response = await getUploadedDocumentsByUser(userId, {
                params: {
                    page: page - 1,
                    size: 5,
                },
            });
            setIsFetching(false);
            if (response.status === 200) {
                setDocumentList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getPostList = async (page) => {
        try {
            const response = await getAllPostsOfUser(userId, {
                params: {
                    page: page - 1,
                    size: 5,
                },
            });

            if (response.status === 200) {
                setPostList(response.data.content);
                setTotalPostPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const deleteDocument = async (docId) => {
        try {
            setIsLoadingDelete(true);

            const response = await deleteADocument(docId);

            setIsLoadingDelete(false);

            setOpenModal(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá tài liệu thành công!</p>, toastOptions);

                getUploadedDocumentList(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const deleteThisPost = async (postId) => {
        try {
            setIsLoadingDelete(true);

            const response = await deleteAPost(postId);

            setIsLoadingDelete(false);

            setOpenDeletePostModal(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Xoá bài đăng thành công!</p>, toastOptions);

                getPostList(1);
                setCurrentPage(1);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleDetail = (slug) => {
        navigate(`/admin/documents/${slug}`);
    };

    const handleEdit = (slug) => {
        navigate(`/admin/documents/${slug}/edit`);
    };

    const handleDelete = (docId) => {
        setOpenModal(true);
        setDocId(docId);
    };

    const handleDeletePost = (postId) => {
        setOpenDeletePostModal(true);
        setPostId(postId);
    };

    return (
        <div>
            <PageHead title={`Người dùng ${user && user.lastName} ${user && user.firstName} - Admin`} description={`Người dùng ${user && user.lastName} ${user && user.firstName} - learniverse & shariverse`} url={window.location.href} origin="both" />

            <div className="row">
                <div className="flex flex-wrap gap-2 mb-3">
                    <Button onClick={() => navigate(-1)}>
                        <HiChevronLeft className="mr-2 h-5 w-5" />
                        Quay lại
                    </Button>
                </div>

                <div className="col-12 flex">
                    <div className="card w-1/3 mr-5 h-min">
                        <div className="card__body">
                            <div className="flex flex-col items-center pb-5">
                                <img alt="ProfileBonnie image" src={user && user.image ? user.image : profileImage} className="mb-3 rounded-full shadow-lg w-24 h-24" />
                                <h5 className="mb-2 text-2xl font-medium dark:text-white text-center">
                                    {user && user.lastName} {user && user.firstName}
                                </h5>

                                <div className="flex gap-x-1">
                                    <Button color="success" pill>
                                        {user && user.role && roleList[user.role.roleName]}
                                    </Button>
                                    <Button color={user && !user.disabled ? "success" : "failure"} pill>
                                        {user && !user.disabled ? "Đang hoạt động" : "Bị chặn"}
                                    </Button>
                                </div>
                                <div className="mt-5">
                                    <div className="flex text-center font-bold">
                                        <span className="block text-base uppercase font-medium dark:text-white">{user && user.organization && user.organization.orgName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiUser className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium text-sky-500 dark:text-white">
                                            {user && user.gender === 0 && "Nam"}
                                            {user && user.gender === 1 && "Nữ"}
                                            {user && user.gender === 2 && "Khác"}
                                        </span>
                                    </div>
                                    <div className="block mb-2 text-base font-medium text-sky-500 dark:text-white"></div>
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiCake className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium text-sky-500 dark:text-white">{user && moment(user.dateOfBirth).format("DD/MM/yyyy")}</span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiAtSymbol className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium text-sky-500 dark:text-white">{user && user.email}</span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiUserAdd className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium dark:text-white">Ngày tạo tài khoản</span>
                                    </div>
                                    <div className="block mb-2 text-base font-medium text-sky-500 dark:text-white">{user && moment(user.createdAt).format("DD/MM/yyyy HH:mm")}</div>
                                </div>

                                <div>
                                    <div className="flex items-center mb-2 font-bold">
                                        <HiUserAdd className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                        <span className="block text-base font-medium dark:text-white">Ngày cập nhật</span>
                                    </div>
                                    <div className="block text-base font-medium text-sky-500 dark:text-white">{user && moment(user.updatedAt).format("DD/MM/yyyy HH:mm")}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card w-2/3 overscroll-x-auto h-fit">
                        <div className="card__body">
                            <div className="mb-5">
                                <div className="flex items-center mb-2 font-bold">
                                    <HiCloudUpload className="w-8 h-8 mr-3 text-gray-800 dark:text-white" />
                                    <span className="block text-2xl font-bold uppercase dark:text-white">Đã tải lên</span>
                                </div>
                            </div>

                            {documentList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Người dùng chưa tải lên tài liệu nào!</p>}

                            {documentList.length > 0 && <Table totalPages="10" headData={tableHead} renderHead={(item, index) => renderHead(item, index)} bodyData={documentList} renderBody={(item, index) => renderBody(item, index)} />}

                            {isFetching && <Spinner className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                            <div className="flex overflow-x-auto sm:justify-center">
                                <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                            </div>
                        </div>
                    </div>

                    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup className="z-49">
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá tài liệu này không?</h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="failure" isProcessing={isLoadingDelete} onClick={() => deleteDocument(docId)}>
                                        {"Chắc chắn"}
                                    </Button>
                                    <Button color="gray" disabled={isLoadingDelete} onClick={() => setOpenModal(false)}>
                                        Huỷ bỏ
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>

                <div className="col-12 flex">
                    <div className="card w-full">
                        <div className="card__body">
                            {postList.length === 0 && !isFetching && <p className="mt-2 mb-4 font-medium text-center">Không có kết quả!</p>}

                            {postList.length > 0 && <Table totalPages="10" headData={tablePostHead} renderHead={(item, index) => renderPostHead(item, index)} bodyData={postList} renderBody={(item, index) => renderPostBody(item, index)} />}

                            {isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2" style={{ color: "var(--main-color)" }} />}

                            {totalPostPages > 1 && (
                                <div className="flex overflow-x-auto sm:justify-center">
                                    <Pagination previousLabel="" nextLabel="" currentPage={currentPostPage} totalPages={totalPostPages} onPageChange={onPostPageChange} showIcons />
                                </div>
                            )}
                        </div>
                    </div>

                    <Modal show={openDeletePostModal} size="md" onClose={() => setOpenDeletePostModal(false)} popup className="z-40">
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiDocumentRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá bài đăng này không?</h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="failure" isProcessing={isLoadingDelete} disabled={isLoadingDelete} onClick={() => deleteThisPost(postId)}>
                                        Chắc chắn
                                    </Button>
                                    <Button color="gray" disabled={isLoadingDelete} onClick={() => setOpenDeletePostModal(false)}>
                                        Huỷ bỏ
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default DetailUser;
