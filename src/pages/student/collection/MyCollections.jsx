import { Pagination } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { getMyCollections } from "../../../api/main/collectionAPI";
import usePrivateAxios from "../../../api/usePrivateAxios";
import CollectionCard from "../../../components/student/card/CollectionCard";
import CollectionModal from "../../../components/student/modal/CollectionModal";

const MyCollections = () => {
    usePrivateAxios();

    const navigate = useNavigate();

    const [collectionList, setCollectionList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [openCollectionModal, setOpenCollectionModal] = useState(false);
    const [triggerModal, setTriggerModal] = useState(0);

    useEffect(() => {
        getCollections(currentPage);
    }, [currentPage]);

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
            <div className="flex-1 p-4 bg-gray-50 h-full">
                <div className="rounded-lg bg-white py-8 px-8 ">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-2xl font-medium text-green-400">Danh sách bộ sưu tập của bạn</p>

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
