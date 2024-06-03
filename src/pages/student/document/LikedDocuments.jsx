import { Pagination } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { getLikedDocuments, undoUnlikeDocument, unlikeDocument } from "../../../api/main/documentAPI";
import usePrivateAxios from "../../../api/usePrivateAxios";
import DocumentCard from "../../../components/student/card/Card";
import "./document.css";
import PageHead from "components/shared/head/PageHead";

const LikedDocument = () => {
    usePrivateAxios();

    const navigate = useNavigate();

    const [documentList, setDocumentList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    const previousLike = useRef(null);
    const myToast = useRef(null);

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

    useEffect(() => {
        getLikedList(currentPage);
    }, [currentPage, search]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const notifySuccess = (slug, docName) =>
        (myToast.current = toast.success(
            <div className="flex space-x-5 items-center">
                <div className="pl-4 text-sm font-normal">
                    <p>
                        Đã xoá <span className="font-semibold">{docName.substring(0, 25) + "..."}</span> khỏi danh sách yêu thích!
                    </p>
                </div>

                <button className="rounded-lg p-1.5 text-sm font-medium text-cyan-600 hover:bg-cyan-100" onClick={() => handleUndo(slug)}>
                    Hoàn tác
                </button>
            </div>,
            toastOptions,
        ));

    const notifyFailure = () =>
        toast.error(
            <div className="flex space-x-5 items-center">
                <p>Đã xảy ra lỗi, vui lòng thử lại!</p>
            </div>,
            toastOptions,
        );

    const dismissToast = () => toast.dismiss(myToast.current);

    const getLikedList = async (page) => {
        try {
            const response = await getLikedDocuments({
                params: {
                    page: page - 1,
                    size: 12,
                    s: search,
                },
            });

            if (response.status === 200) {
                setDocumentList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                notifyFailure();
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleUnlike = async (slug, docName) => {
        dismissToast();

        try {
            const response = await unlikeDocument(slug);

            if (response.status === 200) {
                previousLike.current = response.data;

                notifySuccess(slug, docName);

                if (currentPage === totalPages && documentList.length === 1 && totalPages > 1) setCurrentPage(currentPage - 1);
                else getLikedList(currentPage);
            } else {
                notifyFailure();
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleRelike = async (slug, previousLike) => {
        try {
            const response = await undoUnlikeDocument(slug, previousLike.current);

            if (response.status === 200) {
                if (currentPage === totalPages && documentList.length === 12 && totalPages) setCurrentPage(currentPage + 1);
                else getLikedList(currentPage);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleUndo = (slug) => {
        dismissToast();

        if (previousLike.current) {
            handleRelike(slug, previousLike);
        }
    };

    return (
        <>
            <PageHead title="Danh sách yêu thích" description="Danh sách yêu thích - learniverse & shariverse" url={window.location.href} origin="lib" />

            <div className="flex-1 p-4 bg-gray-50 h-full">
                <div className="rounded-lg bg-white py-8 px-8 ">
                    <div className="mb-5 flex items-center">
                        <p className="text-2xl font-medium text-green-400">Danh sách yêu thích</p>

                        <div className="relative rounded-full ml-auto w-1/4">
                            <input
                                type="text"
                                id="list-search"
                                className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-full"
                                placeholder="Tìm kiếm"
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                value={search}
                                required
                            />

                            <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-full">
                                <svg className="w-4 h-4 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {documentList.length === 0 && (
                        <p className="text-lg font-medium ">
                            Bạn chưa thích tài liệu nào! &nbsp;
                            <span className="text-green-400 hover:text-green-500 cursor-pointer" onClick={() => navigate("/documents")}>
                                Khám phá ngay!
                            </span>
                        </p>
                    )}

                    <div className="grid grid-cols-4 gap-8">
                        {documentList.map((document, index) => (
                            <DocumentCard docName={document.docName} slug={document.slug} thumbnail={document.thumbnail} totalView={document.totalView} totalFavorite={document.totalFavorite} type="LIKE" action={() => handleUnlike(document.slug, document.docName)} key={index} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex overflow-x-auto sm:justify-center mt-4">
                            <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LikedDocument;
