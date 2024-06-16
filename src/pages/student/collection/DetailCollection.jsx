import { getDetailCollection, getDetailCollectionForGuest, removeDocumentFromCollection } from "@api/main/collectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import PageHead from "@components/shared/head/PageHead";
import DocumentCard from "@components/student/card/Card";
import { Avatar, Button, Modal, Toast } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { CgExtensionRemove } from "react-icons/cg";
import { HiOutlineCheck, HiX } from "react-icons/hi";
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

const DetailCollection = () => {
    const { collectionSlug } = useParams();

    const navigate = useNavigate();

    usePrivateAxios();

    const [collection, setCollection] = useState(null);
    const [docId, setDocId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        getCollection();
    }, [collectionSlug]);

    const getCollection = async () => {
        try {
            let response = null;
            if (user && accessToken) response = await getDetailCollection(collectionSlug);
            else response = await getDetailCollectionForGuest(collectionSlug);

            if (response.status === 200) {
                setCollection(response.data);
            } else if (response.status === 404) {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const removeFromCollection = async (collectionId, docId) => {
        try {
            setIsLoading(true);

            const response = await removeDocumentFromCollection(collectionId, docId);

            if (response.status === 200) {
                getCollection();
                
                toast.error(<p className="pr-2">Xoá khỏi bộ sưu tập thành công!</p>, toastOptions);
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Vui lòng thử lại!</p>, toastOptions);
            }

            setIsLoading(false);
            setOpenModal(false);
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title={"Bộ sưu tập " + (collection && collection.collectionName)} description={"Bộ sưu tập " + (collection && collection.collectionName) + " - learniverse & shariverse"} url={window.location.href} origin="lib" />

            <div className="p-10 flex flex-col items-center">
                <h1 className="text-5xl font-medium text-center">{collection && collection.collectionName}</h1>

                <div className="flex space-x-3 mt-5">
                    <p>
                        <span className="font-semibold">{collection && collection.totalDocuments}</span> tài liệu
                    </p>
                    <p className="text-gray-500">Cập nhật ngày {collection && collection.updatedAt ? moment(collection.updatedAt).format("DD-MM-yyyy") : moment(collection && collection.createdAt).format("DD-MM-yyyy")}</p>
                </div>

                <Avatar alt="123" img={collection && collection.user && collection.user.image ? collection.user.image : ""} rounded className="mt-7" size="xl" />

                <p className="mt-3">
                    Bộ sưu tập của{" "}
                    <span className="font-medium">
                        {collection && collection.user && collection.user.lastName} {collection && collection.user && collection.user.firstName}
                    </span>
                </p>

                <div className="grid grid-cols-4 justify-items-center gap-8 mt-10">
                    {collection &&
                        collection.documents.map((document, index) => (
                            <DocumentCard
                                key={index}
                                docName={document.docName}
                                slug={document.slug}
                                thumbnail={document.thumbnail}
                                totalView={document.totalView}
                                totalFavorite={document.totalFavorite}
                                type={collection.mine ? "COLLECTION" : ""}
                                action={() => {
                                    setOpenModal(true);
                                    setDocId(document.docId);
                                }}
                            />
                        ))}
                </div>

                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup className="z-40">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <CgExtensionRemove className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xoá tài liệu khỏi bộ sưu tập này?</h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" isProcessing={isLoading} disabled={isLoading} onClick={() => removeFromCollection(collection.collectionId, docId)}>
                                    Chắc chắn
                                </Button>
                                <Button color="gray" isProcessing={isLoading} disabled={isLoading} onClick={() => setOpenModal(false)}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default DetailCollection;
