import { Pagination } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { getMyCollections } from "@api/main/collectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import CollectionCard from "@components/student/card/CollectionCard";
import CollectionModal from "@components/student/modal/CollectionModal";
import PageHead from "@components/shared/head/PageHead";

const MyCollections = () => {
    usePrivateAxios();

    const navigate = useNavigate();

    const [collectionList, setCollectionList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [openCollectionModal, setOpenCollectionModal] = useState(false);
    const [triggerModal, setTriggerModal] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getCollections(currentPage);
    }, [currentPage, search]);

    const handleAdd = () => {
        setOpenCollectionModal(true);
        setTriggerModal(triggerModal + 1);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getCollections = async (page) => {
        try {
            const response = await getMyCollections({
                params: {
                    page: page - 1,
                    size: 8,
                    s: search
                },
            });

            if (response.status === 200) {
                setCollectionList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const refreshList = () => {
        if (currentPage > 1) setCurrentPage(1);
        else getCollections(1);
    };

    return (
        <>
            <PageHead title="Bộ sưu tập của tôi - miniverse" description="Bộ sưu tập của tôi - miniverse" url={window.location.href} />

            <div className="flex-1 p-4 h-full">
                <div className="rounded-lg bg-white py-8 px-8 ">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-2xl font-medium text-green-400">Danh sách bộ sưu tập của bạn</p>

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

                        <div className="bg-white rounded-full cursor-pointer hover:bg-gray-100 p-2 transition ease-in-out transform active:scale-110" onClick={handleAdd}>
                            <RiAddFill className="h-10 w-10 text-gray-800" />
                        </div>
                    </div>

                    {collectionList.length === 0 && (
                        <p className="text-lg font-medium ">
                            Bạn chưa tạo bộ sưu tập nào! &nbsp;
                            <span className="text-green-400">Tạo ngay!</span>
                        </p>
                    )}

                    <div className="grid grid-cols-4 justify-items-center gap-x-10 gap-y-4" id="collection-section">
                        {collectionList.map((collection, index) => (
                            <CollectionCard collection={collection} isMine={true} refreshList={refreshList} key={index} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex overflow-x-auto sm:justify-center mt-4">
                            <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                        </div>
                    )}

                    <CollectionModal openCollectionModal={openCollectionModal} isCreatingNew={true} triggerModal={triggerModal} refreshList={refreshList} />
                </div>
            </div>
        </>
    );
};

export default MyCollections;
