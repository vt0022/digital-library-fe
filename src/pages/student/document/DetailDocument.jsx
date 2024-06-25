import { getADocument, getADocumentForGuest, getRelatedDocuments, getRelatedDocumentsForGuest, likeDocument, saveCurrentPage, saveDocument, unlikeDocument, unsaveDocument } from "@api/main/documentAPI";
import { verifyRecaptcha } from "@api/main/recaptchaAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import PageHead from "@components/shared/head/PageHead";
import DocumentCard from "@components/student/card/Card";
import CollectionListModal from "@components/student/modal/CollectionListModal";
import NoteList from "@components/student/note/NoteList";
import Review from "@components/student/review/Review";
import { default as ReviewList } from "@components/student/review/ReviewList";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { Button, Modal, Tooltip } from "flowbite-react";
import { gapi } from "gapi-script";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { BiSolidCalendarCheck } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";
import { FaSquareShareNodes } from "react-icons/fa6";
import { HiHeart, HiOutlineBookmark, HiOutlineColorSwatch, HiOutlineHeart, HiOutlineLibrary, HiOutlineReply, HiOutlineTag } from "react-icons/hi";
import { IoEye, IoHeart } from "react-icons/io5";
import { PiQuestionBold } from "react-icons/pi";
import { RiAddFill, RiDownloadCloud2Line, RiRobot2Fill, RiSlideshow4Line, RiSlideshowLine } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { Bounce, toast } from "react-toastify";
import "./document.css";

const SITE_KEY = process.env.REACT_APP_SITE_KEY;

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

const DetailDocument = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    usePrivateAxios();

    const recaptchaRef = useRef(null);
    const collectionRef = useRef(null);

    const [doc, setDocument] = useState(null);
    const [documentList, setDocumentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isopenDownloadModal, setIsOpenDownloadModal] = useState(false);
    const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [mode, setMode] = useState("advanced"); // lite, advanced
    const [pdfData, setPdfData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const active = "h-10 w-10 p-2 rounded-full bg-emerald-500 shadow-lg text-white hover:bg-emerald-300";
    const inactive = "h-10 w-10 p-2 rounded-full bg-white shadow-lg text-emerald-300 hover:text-emerald-500";

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    const transform = (slot) => ({
        ...slot,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
    });

    const renderToolbar = (Toolbar) => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });

    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    useEffect(() => {
        getDocumentBySlug();
        getRelatedDocumentList();
    }, [slug]);

    useEffect(() => {
        const handleCloseModal = (event) => {
            if (collectionRef.current && !collectionRef.current.contains(event.target)) {
                setIsOpenModal(false);
            }
        };

        document.addEventListener("mousedown", handleCloseModal);

        return () => {
            document.removeEventListener("mousedown", handleCloseModal);
        };
    }, []);

    useEffect(() => {
        if (doc) {
            gapi.load("client:auth2", downloadPDF);
        }
    }, [doc]);

    const handlePageChange = (e) => {
        setCurrentPage(e.currentPage);
        if (user && accessToken) {
            saveCurrentPageOfDocument(e.currentPage);
        }
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const downloadPDF = () => {
        setIsFetching(true);

        gapi.client.init({
            apiKey: "AIzaSyDQVD4jD6Wb23DmT0iwx2gezRVTObpNtKU",
            clientId: "355480575905-okvgom422abg0ecf8u9mfi4p35sp867n",
            scope: "https://www.googleapis.com/auth/drive",
        });

        gapi.client.load("drive", "v3").then(() => {
            gapi.client.drive.files
                .get({ fileId: doc && doc.fileId, alt: "media" })
                .then((response) => {
                    setIsFetching(false);

                    if (response.status === 200) {
                        const data = response.body;
                        const length = data.length;
                        const arr = new Uint8Array(length);
                        for (let i = 0; i < length; i++) {
                            arr[i] = data.charCodeAt(i);
                        }

                        const blob = new Blob([arr], { type: "application/pdf" });
                        const url = URL.createObjectURL(blob);
                        setPdfData(url);
                    }
                })
                .catch((error) => {
                    setIsFetching(false);
                });
        });
    };

    const getDocumentBySlug = async () => {
        try {
            let response = null;

            if (user && accessToken) response = await getADocument(slug);
            else response = await getADocumentForGuest(slug);

            if (response.status === 200) {
                setDocument(response.data);
                setCurrentPage(response.data.currentPage);
            } else {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const saveCurrentPageOfDocument = async (page) => {
        try {
            await saveCurrentPage(slug, {
                params: {
                    page: page,
                },
            });
        } catch (error) {}
    };

    const getRelatedDocumentList = async () => {
        try {
            let response = null;

            if (user && accessToken) response = await getRelatedDocuments(slug);
            else response = await getRelatedDocumentsForGuest(slug);

            if (response.status === 200) {
                setDocumentList(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleLike = async () => {
        try {
            const response = await likeDocument(slug);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã thêm vào danh sách yêu thích!</p>, toastOptions);

                getDocumentBySlug();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await unlikeDocument(slug);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã xoá khỏi danh sách yêu thích!</p>, toastOptions);
                getDocumentBySlug();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleSave = async () => {
        try {
            const response = await saveDocument(slug);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã thêm vào danh sách đã lưu!</p>, toastOptions);
                getDocumentBySlug();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleUnsave = async () => {
        try {
            const response = await unsaveDocument(slug);

            if (response.status === 200) {
                toast.success(<p className="pr-2">Đã xoá khỏi danh sách yêu thích!</p>, toastOptions);
                getDocumentBySlug();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    const handleVerifyRecaptcha = async () => {
        try {
            setIsLoading(true);

            const response = await verifyRecaptcha({
                params: {
                    recaptchaResponse: recaptchaRef.current?.getValue(),
                },
            });

            setIsLoading(false);

            if (response.status === 200) {
                setIsOpenDownloadModal(false);
                handleDownload();
            } else {
                toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                recaptchaRef.current.reset();
            }
        } catch (error) {
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
            recaptchaRef.current.reset();
        }
    };

    const handleDownload = () => {
        if (doc && doc.downloadUrl) {
            window.location.href = doc.downloadUrl;
            toast.success(<p className="pr-2">Đang tải tài liệu xuống!</p>, toastOptions);
        } else {
            toast.error(<p className="pr-2">Liên kết tải xuống đã bị hỏng! Xin lỗi vì sự bất tiện này!</p>, toastOptions);
        }
    };

    const handleShare = () => {
        const shareLink = window.location.href;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const popupWidth = Math.round(screenWidth * 0.5);
        const popupHeight = Math.round(screenHeight * 0.6);

        const left = Math.round((screenWidth - popupWidth) / 2);
        const top = Math.round((screenHeight - popupHeight) / 2);

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`, "popup", `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`);
    };

    const handleAddToCollection = () => {
        setIsOpenModal(true);
    };

    const onAddToCollectionSuccess = () => {
        toast.success(<p className="pr-2">Thêm vào bộ sưu tập thành công!</p>, toastOptions);
    };

    const onAddToCollectionFailure = () => {
        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
    };

    const onAddReviewSuccess = () => {
        toast.success(<p className="pr-2">Đánh giá của bạn sẽ được duyệt trước khi hiển thị!</p>, toastOptions);
    };

    const onAddReviewFailure = () => {
        toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
    };

    const checkRecaptchaValid = (value) => {
        if (value) {
            setIsRecaptchaValid(true);
        } else {
            setIsRecaptchaValid(false);
        }
    };

    return (
        <>
            <PageHead title={doc && doc.docName} description={doc && doc.docIntroduction} imageUrl={doc && doc.thumbnail} url={window.location.href} origin="lib" />

            <div className="flex-1 p-4">
                <div className="flex gap-5 w-full">
                    <div className="bg-white rounded-lg shadow-md p-5 w-3/4">
                        <div>
                            <h2 className="mt-2 mb-6 text-2xl font-bold text-green-400 dark:text-gray-400 md:text-2xl text-justify">{doc && doc.docName}</h2>
                        </div>

                        <div>
                            <p className="mb-4 mt-4 text-gray-700 dark:text-gray-400 text-sm text-justify">{doc && doc.docIntroduction}</p>
                        </div>

                        <div className="flex">
                            <div className="w-4/5 flex gap-2 items-center justify-evenly">
                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-sky-50 cursor-pointer" onClick={() => navigate("/users/" + doc.userUploaded.userId)}>
                                    <FaSquareShareNodes className="text-xl text-sky-500" />

                                    <p className="block text-sm font-medium text-sky-500 hover:text-sky-400">
                                        {doc && doc.userUploaded && doc.userUploaded.lastName} {doc && doc.userUploaded && doc.userUploaded.firstName}
                                    </p>
                                </div>

                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-orange-50">
                                    <BiSolidCalendarCheck className="text-xl text-orange-500" />

                                    <p className="block text-sm font-medium text-orange-500">{doc && moment(doc.updatedAt).format("DD/MM/yyyy")}</p>
                                </div>

                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-emerald-50">
                                    <IoEye className="text-xl text-emerald-500" />

                                    <p className="block text-sm font-medium text-emerald-500">{doc && doc.totalView}</p>
                                </div>

                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-red-50">
                                    <IoHeart className="text-xl text-red-500" />

                                    <p className="block text-sm font-medium text-red-500">{doc && doc.totalFavorite}</p>
                                </div>
                            </div>

                            <div className="w-1/5 grid place-items-center">
                                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400" style={{ fontSize: "3.75rem" }}>
                                    {doc && doc.averageRating ? doc.averageRating.toFixed(1) : 0}
                                </h1>
                                <p className="mt-2">({doc && doc.totalReviews} đánh giá)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-5 w-1/4 h-fit">
                        <div className="mb-5">
                            <div className="flex items-center mb-2 font-bold">
                                <HiOutlineLibrary className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                <span className="block text-base font-medium dark:text-white">Trường</span>
                            </div>
                            <div className="block mb-2 text-base font-medium text-green-400 dark:text-white hover:text-green-600 cursor-pointer" onClick={() => navigate("/institutions/" + doc.organization.slug)}>
                                {doc && doc.organization && doc.organization.orgName}
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-center mb-2 font-bold">
                                <HiOutlineTag className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                <span className="block text-base font-medium dark:text-white">Danh mục</span>
                            </div>
                            <div className="block text-base font-medium text-green-400 dark:text-white hover:text-green-600 cursor-pointer" onClick={() => navigate("/categories/" + doc.category.slug)}>
                                {doc && doc.category && doc.category.categoryName}
                            </div>
                        </div>

                        <div className="">
                            <div className="flex items-center mb-2 font-bold">
                                <HiOutlineColorSwatch className="w-5 h-5 mr-3 text-gray-800 dark:text-white" />
                                <span className="block text-base font-medium dark:text-white">Lĩnh vực</span>
                            </div>
                            <div className="block text-base font-medium text-green-400 dark:text-white hover:text-green-600 cursor-pointer" onClick={() => navigate("/fields/" + doc.field.slug)}>
                                {doc && doc.field && doc.field.fieldName}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-5 w-full mt-5 mb-2 h-fit">
                    <div className="h-fit w-3/4 flex justify-between items-center">
                        <div className="flex space-x-2 items-center">
                            <p>
                                Bạn đang xem ở chế độ <span className="text-emerald-500 font-medium">{mode === "advanced" ? "xem chi tiết" : "đơn giản"}</span>
                            </p>

                            <PiQuestionBold className="w-5 h-5 text-amber-400" />
                        </div>

                        <div className="flex space-x-2 items-center">
                            <Tooltip content="Chế độ xem chi tiết" position="top" style="light">
                                <button onClick={() => setMode("advanced")}>
                                    <RiSlideshowLine className={mode === "advanced" ? active : inactive} />
                                </button>
                            </Tooltip>

                            <Tooltip content="Chế độ xem đơn giản" position="top" style="light">
                                <button onClick={() => setMode("lite")}>
                                    <RiSlideshow4Line className={mode === "lite" ? active : inactive} />
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="w-1/4"></div>
                </div>

                <div className="flex space-x-5 w-full mt-5 mb-5 h-full">
                    <div className="w-3/4 h-[90vh]">
                        {mode === "lite" ? (
                            <div className="w-full h-full relative bg-white rounded-lg shadow-md">
                                <iframe width="100%" height="100%" className="rounded-lg" title="Tài liệu PDF" src={doc && doc.viewUrl} />

                                <div className="w-[80px] h-[80px] absolute opacity-0 right-0 top-0" />
                            </div>
                        ) : (
                            <div className="h-full bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
                                {isFetching ? (
                                    <>
                                        <PuffLoader color="#36d7b7" />
                                        <p className="font-medium text-green-500 mt-3">Đang tải tài liệu...</p>
                                    </>
                                ) : (
                                    <>
                                        {pdfData ? (
                                            <Viewer fileUrl={pdfData} initialPage={currentPage} plugins={[defaultLayoutPluginInstance]} onPageChange={handlePageChange} />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center max-w-2/3 h-fit rounded-lg p-2 text-white bg-red-500 font-medium">
                                                <p>Đã xảy ra lỗi khi tải tài liệu 😭</p>
                                                <p> Bạn vui lòng chuyển sang chế độ xem đơn giản</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-1/4 fixed right-4 sticky">
                        <div className="flex flex-col space-y-5 w-fit m-auto">
                            <Button pill className="bg-white text-lg text-gray-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={doc && doc.liked ? handleUnlike : handleLike}>
                                {doc && doc.liked ? <HiHeart className="mr-2 h-7 w-7 text-red-500" /> : <HiOutlineHeart className="mr-2 h-7 w-7 text-red-500" />}
                                {doc && doc.liked ? <span className="text-sm">Đã thích</span> : <span className="text-sm">Thích</span>}
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={doc && doc.saved ? handleUnsave : handleSave}>
                                {doc && doc.saved ? <HiOutlineBookmark className="mr-2 h-7 w-7 fill-green-500 text-green-500" /> : <HiOutlineBookmark className="mr-2 h-7 w-7 text-green-500" />}
                                {doc && doc.saved ? <span className="text-sm">Đã lưu</span> : <span className="text-sm">Lưu</span>}
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={() => setIsOpenDownloadModal(true)}>
                                <RiDownloadCloud2Line className="mr-2 h-7 w-7 text-indigo-500" />
                                <span className="text-sm">Tải về</span>
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleShare}>
                                <HiOutlineReply className="mr-2 h-7 w-7 text-sky-500" />
                                <span className="text-sm">Chia sẻ</span>
                            </Button>

                            <div>
                                <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleAddToCollection}>
                                    <RiAddFill className="mr-2 h-7 w-7 text-amber-500" />
                                    <span className="text-sm">Thêm vào bộ sưu tập</span>
                                </Button>

                                {isOpenModal && (
                                    <div ref={collectionRef} className="relative">
                                        <CollectionListModal docId={doc.docId} onClose={() => setIsOpenModal(false)} onSuccess={onAddToCollectionSuccess} onFailure={onAddToCollectionFailure} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {user && accessToken && (
                    <div className="w-3/4 pr-3">
                        <NoteList slug={slug} page={currentPage} onPageChange={onPageChange} />
                    </div>
                )}

                <div className="flex gap-5 w-full">
                    <div className="w-3/4">
                        <ReviewList slug={slug} totalReviews={doc && doc.totalReviews} averageRating={doc && doc.averageRating.toFixed(1)} />
                    </div>

                    <div className="w-1/4">{doc && !doc.reviewed && <Review docId={doc && doc.docId} action={getDocumentBySlug} onSuccess={onAddReviewSuccess} onFailure={onAddReviewFailure} />}</div>
                </div>

                {documentList.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-lg font-medium">Có thể bạn quan tâm</p>
                        <div className="grid grid-cols-5 gap-3">
                            {documentList.map((document, index) => (
                                <DocumentCard document={document} key={index} />
                            ))}
                        </div>
                    </div>
                )}

                <Modal show={isopenDownloadModal} size="md" onClose={() => setIsOpenDownloadModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center space-y-6 pb-3">
                            <div className="flex justify-center space-x-5">
                                <RiRobot2Fill className="h-14 w-14 text-red-500" />
                                <FaUserCheck className="h-14 w-14 text-emerald-500" />
                            </div>

                            <h3 className="mb-5 text-lg font-normal text-gray-700">Vui lòng xác nhận trước khi tải tài liệu này</h3>

                            <div className="flex justify-center">
                                <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} onChange={checkRecaptchaValid} />
                            </div>

                            <div className="flex justify-around gap-4">
                                <Button color="success" onClick={handleVerifyRecaptcha} isProcessing={isLoading} disabled={isLoading || !isRecaptchaValid}>
                                    Tải xuống
                                </Button>
                                <Button color="failure" onClick={() => setIsOpenDownloadModal(false)} disabled={isLoading}>
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

export default DetailDocument;
