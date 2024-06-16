import { getADocument, getADocumentForGuest, getRelatedDocuments, getRelatedDocumentsForGuest, likeDocument, saveDocument, unlikeDocument, unsaveDocument } from "@api/main/documentAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import DocumentCard from "@components/student/card/Card";
import CollectionListModal from "@components/student/modal/CollectionListModal";
import Review from "@components/student/review/Review";
import { default as ReviewList } from "@components/student/review/ReviewList";
import { verifyRecaptcha } from "@api/main/recaptchaAPI";
import PageHead from "@components/shared/head/PageHead";
import { Button, Modal } from "flowbite-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaUserCheck } from "react-icons/fa";
import { HiHeart, HiOutlineBookmark, HiOutlineCalendar, HiOutlineCloudDownload, HiOutlineColorSwatch, HiOutlineEye, HiOutlineHeart, HiOutlineLibrary, HiOutlinePaperAirplane, HiOutlineReply, HiOutlineTag } from "react-icons/hi";
import { RiAddFill, RiRobot2Fill } from "react-icons/ri";
import { pdfjs } from "react-pdf";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { FaSquareShareNodes } from "react-icons/fa6";
import { BiSolidCalendarCheck } from "react-icons/bi";
import { IoEye } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { RiDownloadCloud2Line } from "react-icons/ri";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();

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
    const location = useLocation();

    usePrivateAxios();

    const recaptchaRef = useRef(null);
    const collectionRef = useRef(null);

    const [doc, setDocument] = useState(null);
    const [documentList, setDocumentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isopenDownloadModal, setIsOpenDownloadModal] = useState(false);
    const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [data, setData] = useState([]);
    const [pdfString, setPdfString] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        getDocumentBySlug();
        getRelatedDocumentList();

        // gapi.load("client:auth2", start);
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

    // const onDocumentLoadSuccess = ({ numPages }) => {
    //     setNumPages(numPages);
    // };

    // const fileId = "1Vh2__JQ5yK6IaC5sKAiYVCzyUhS9aTop";
    // const start = () => {
    //     gapi.client.init({
    //         apiKey: "AIzaSyDQVD4jD6Wb23DmT0iwx2gezRVTObpNtKU",
    //         clientId: "355480575905-okvgom422abg0ecf8u9mfi4p35sp867n",
    //         scope: "https://www.googleapis.com/auth/drive",
    //     });

    //     gapi.client.load("drive", "v3").then(() => {
    //         try {
    //             gapi.client.drive.files
    //                 .get({ fileId, alt: "media" })
    //                 .then((response) => {
    //                     const fileContent = response.body;
    //                     setData(fileContent);
    //                     setPdfString(fileContent);
    //                     console.log(fileContent, "aaaaaaaa");
    //                 })
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     });
    // };

    const getDocumentBySlug = async () => {
        try {
            let response = null;

            if (user && accessToken) response = await getADocument(slug);
            else response = await getADocumentForGuest(slug);

            if (response.status === 200) {
                setDocument(response.data);
                //downloadPDF(response.data.downloadUrl);
            } else {
                navigate("/error-404");
            }
        } catch (error) {
            navigate("/error-500");
        }
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
                            <div className="w-4/5 flex gap-8 items-center">
                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-sky-50 cursor-pointer" onClick={() => navigate("/users/" + doc.userUploaded.userId)}>
                                    <FaSquareShareNodes className="text-xl text-sky-500" />

                                    <p className="block text-base font-medium text-sky-500 hover:text-sky-400">
                                        {doc && doc.userUploaded && doc.userUploaded.lastName} {doc && doc.userUploaded && doc.userUploaded.firstName}
                                    </p>
                                </div>

                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-orange-50">
                                    <BiSolidCalendarCheck className="text-xl text-orange-500" />

                                    <p className="block text-base font-medium text-orange-500">{doc && moment(doc.updatedAt).format("DD/MM/yyyy")}</p>
                                </div>

                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-emerald-50">
                                    <IoEye className="text-xl text-emerald-500" />

                                    <p className="block text-base font-medium text-emerald-500">{doc && doc.totalView}</p>
                                </div>

                                <div className="w-fit px-3 py-2 rounded-lg flex space-x-1 items-center bg-red-50">
                                    <IoHeart className="text-xl text-red-500" />

                                    <p className="block text-base font-medium text-red-500">{doc && doc.totalFavorite}</p>
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

                <div className="flex gap-5 w-full mt-5 mb-5 h-full">
                    <div className="bg-white rounded-lg shadow-md w-3/4 h-[700px] relative">
                        <div className="w-full h-[700px] relative">
                            <iframe width="100%" height="700px" className="rounded-lg" title="Tài liệu PDF" src={doc && doc.viewUrl + "#page=10"} frameborder="0" seamless=""></iframe>

                            <div className="w-[80px] h-[80px] absolute opacity-0 right-0 top-0"></div>
                        </div>

                        {isOpenModal && (
                            <div ref={collectionRef}>
                                <CollectionListModal docId={doc.docId} onClose={() => setIsOpenModal(false)} onSuccess={onAddToCollectionSuccess} onFailure={onAddToCollectionFailure} />
                            </div>
                        )}
                    </div>

                    {/* <div>
                        <Document file={a} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={10} />
                        </Document>
                        {pdfString && (
                            <Document error={""} file={`data:application/pdf;base64,${pdfString}`} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={2} />
                            </Document>
                        )}
                    </div> */}

                    <div className="w-1/4 fixed right-4 sticky">
                        <div className="flex flex-col gap-y-5 p-3 w-auto">
                            <Button pill className="bg-white text-lg text-gray-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={doc && doc.liked ? handleUnlike : handleLike}>
                                {doc && doc.liked ? <HiHeart className="mr-2 h-7 w-7 text-red-500" /> : <HiOutlineHeart className="mr-2 h-7 w-7 text-red-500" />}
                                {doc && doc.liked ? <span className="text-base">Đã thích</span> : <span className="text-base">Thích</span>}
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={doc && doc.saved ? handleUnsave : handleSave}>
                                {doc && doc.saved ? <HiOutlineBookmark className="mr-2 h-7 w-7 fill-green-500 text-green-500" /> : <HiOutlineBookmark className="mr-2 h-7 w-7 text-green-500" />}
                                {doc && doc.saved ? <span className="text-base">Đã lưu</span> : <span className="text-base">Lưu</span>}
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={() => setIsOpenDownloadModal(true)}>
                                <RiDownloadCloud2Line className="mr-2 h-7 w-7 text-indigo-500" />
                                <span className="text-base">Tải về</span>
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleShare}>
                                <HiOutlineReply className="mr-2 h-7 w-7 text-sky-500" />
                                <span className="text-base">Chia sẻ</span>
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleAddToCollection}>
                                <RiAddFill className="mr-2 h-7 w-7 text-amber-500" />
                                <span className="text-base">Thêm vào bộ sưu tập</span>
                            </Button>

                            {doc && !doc.reviewed && <Review docId={doc && doc.docId} action={getDocumentBySlug} onSuccess={onAddReviewSuccess} onFailure={onAddReviewFailure} />}
                        </div>
                    </div>
                </div>

                <ReviewList slug={slug} totalReviews={doc && doc.totalReviews} averageRating={doc && doc.averageRating.toFixed(1)} />

                {documentList.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-lg font-medium">Có thể bạn quan tâm</p>
                        <div className="grid grid-cols-5 gap-3">
                            {documentList.map((document, index) => (
                                <DocumentCard docName={document.docName} slug={document.slug} thumbnail={document.thumbnail} totalView={document.totalView} totalFavorite={document.totalFavorite} key={index} />
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
