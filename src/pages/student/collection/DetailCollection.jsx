import { getDetailCollection, getDetailCollectionForGuest, likeCollection, removeDocumentFromCollection, unlikeCollection } from "@api/main/collectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import PageHead from "@components/shared/head/PageHead";
import DocumentCard from "@components/student/card/Card";
import { Avatar, Button, Modal, Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { CgExtensionRemove } from "react-icons/cg";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
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
    const [search, setSearch] = useState("");

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        getCollection();
    }, [collectionSlug, search]);

    const getCollection = async () => {
        try {
            let response = null;
            if (user && accessToken)
                response = await getDetailCollection(collectionSlug, {
                    params: {
                        s: search,
                    },
                });
            else
                response = await getDetailCollectionForGuest(collectionSlug, {
                    params: {
                        s: search,
                    },
                });

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

    const handleLike = async () => {
        try {
            const response = await likeCollection(collection && collection.collectionId);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã thêm vào danh sách yêu thích!</p>, toastOptions);

                setCollection((prevCollection) => ({
                    ...prevCollection,
                    liked: true,
                    totalLikes: prevCollection.totalLikes + 1,
                }));
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await unlikeCollection(collection && collection.collectionId);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã xoá khỏi danh sách yêu thích!</p>, toastOptions);

                setCollection((prevCollection) => ({
                    ...prevCollection,
                    liked: false,
                    totalLikes: prevCollection.totalLikes - 1,
                }));
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
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
                    <span className="font-semibold">
                        {collection && collection.user && collection.user.lastName} {collection && collection.user && collection.user.firstName}
                    </span>
                </p>

                <div className="flex space-x-2 items-center my-4">
                    {collection && collection.liked ? (
                        <Tooltip content="Bạn đã thích bộ sưu tập này. Nhấn để bỏ thích" style="light" placement="bottom">
                            <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={handleUnlike}>
                                <IoHeart className="text-red-500 hover:text-red-300 text-3xl active:text-red-200 cursor-pointer" />
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip content="Bộ sưu tập này thú vị và hữu ích? Thích nó" style="light" placement="bottom">
                            <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-125 duration-150 bg-transparent" onClick={handleLike}>
                                <IoHeartOutline className="text-red-500 hover:text-red-300 text-3xl active:text-red-200 cursor-pointer" />
                            </button>
                        </Tooltip>
                    )}

                    <p className="text-xl font-medium">{collection && collection.totalLikes}</p>
                </div>

                <div className="relative rounded-full m-auto w-1/2">
                    <input
                        type="text"
                        id="list-search"
                        className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-full"
                        placeholder="Tìm kiếm"
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        value={search}
                        required
                    />

                    <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-full">
                        <svg className="w-5 h-5 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-4 justify-items-center gap-8 mt-10">
                    {collection &&
                        collection.documents.map((document, index) => (
                            <DocumentCard
                                key={index}
                                document={document}
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
