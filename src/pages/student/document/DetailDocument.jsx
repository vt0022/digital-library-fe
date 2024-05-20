import { Button, Toast } from "flowbite-react";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { HiHeart, HiOutlineBookmark, HiOutlineCalendar, HiOutlineCheck, HiOutlineCloudDownload, HiOutlineColorSwatch, HiOutlineEye, HiOutlineHeart, HiOutlineLibrary, HiOutlinePaperAirplane, HiOutlineReply, HiOutlineTag, HiX } from "react-icons/hi";
import { RiAddFill } from "react-icons/ri";
import { pdfjs } from "react-pdf";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getADocument, getADocumentForGuest, getRelatedDocuments, likeDocument, saveDocument } from "../../../api/main/documentAPI";
import usePrivateAxios from "../../../api/usePrivateAxios";
import DocumentCard from "../../../components/student/card/Card";
import CollectionListModal from "../../../components/student/modal/CollectionListModal";
import Review from "../../../components/student/review/Review";
import { default as ReviewList } from "../../../components/student/review/ReviewList";
import PageHead from "components/shared/head/PageHead";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();

const DetailDocument = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    usePrivateAxios();

    const collectionRef = useRef(null);

    const [doc, setDocument] = useState(null);
    const [documentList, setDocumentList] = useState([]);
    const [message, setMessage] = useState("Đã xảy ra lỗi! Vui lòng thử lại!");
    const [status, setStatus] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
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
        const accessToken = localStorage.getItem("accessToken");
        const user = JSON.parse(sessionStorage.getItem("profile"));
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
            // alert("aaaa")
            navigate("/error-500");
        }
    };

    const getRelatedDocumentList = async () => {
        try {
            const response = await getRelatedDocuments(slug);

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
                if (response.message === "Unlike document successfully") {
                    getDocumentBySlug();
                    setMessage("Đã xoá khỏi danh sách yêu thích!");
                } else {
                    getDocumentBySlug();
                    setMessage("Đã thêm vào danh sách yêu thích!");
                }
                getDocumentBySlug();
                setStatus(1);
                setTimeout(() => {
                    setStatus(0);
                }, 4000);
            } else {
                setStatus(-1);
                setMessage("Đã xảy ra lỗi! Vui lòng thử lại!");
                setTimeout(() => {
                    setStatus(0);
                }, 4000);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleSave = async () => {
        try {
            const response = await saveDocument(slug);

            if (response.status === 200) {
                if (response.message === "Unsave document successfully") {
                    getDocumentBySlug();
                    setMessage("Đã xoá khỏi danh sách đã lưu!");
                } else {
                    getDocumentBySlug();
                    setMessage("Đã thêm vào danh sách đã lưu!");
                }
                setStatus(1);
                setTimeout(() => {
                    setStatus(0);
                }, 4000);
            } else {
                setStatus(-1);
                setMessage("Đã xảy ra lỗi! Vui lòng thử lại!");
                setTimeout(() => {
                    setStatus(0);
                }, 4000);
            }
        } catch (error) {
            // navigate to 500
        }
    };

    const handleDownload = () => {
        if (doc && doc.downloadUrl) {
            window.location.href = doc.downloadUrl;
        } else {
            setStatus(-1);
            setMessage("Liên kết tải xuống đã bị hỏng! Xin lỗi vì sự bất tiện này!");
            setTimeout(() => {
                setStatus(0);
            }, 4000);
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
        setStatus(1);
        setMessage("Thêm vào bộ sưu tập thành công!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    const onAddToCollectionFailure = () => {
        setStatus(-1);
        setMessage("Có lỗi xảy ra! Vui lòng thử lại!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    const onAddReviewSuccess = () => {
        setStatus(1);
        setMessage("Đánh giá của bạn sẽ được duyệt trước khi hiển thị!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    const onAddReviewFailure = () => {
        setStatus(-1);
        setMessage("Có lỗi xảy ra! Vui lòng thử lại!");
        setTimeout(() => {
            setStatus(0);
        }, 4000);
    };

    return (
        <>
            {status === -1 && (
                <Toast className="top-1/4 right-5 w-100 fixed z-50">
                    <HiX className="h-5 w-5 bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}

            {status === 1 && (
                <Toast className="top-1/4 right-5 fixed w-100 z-50">
                    <HiOutlineCheck className="h-5 w-5 bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200" />
                    <div className="pl-4 text-sm font-normal">{message}</div>
                </Toast>
            )}

            <PageHead title={doc && doc.docName} description={doc && doc.docIntroduction} imageUrl={doc && doc.thumbnail} url={window.location.href} />

            <div className="flex-1 p-4 bg-gray-50">
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
                                <div className="flex items-center font-bold cursor-pointer " onClick={() => navigate("/users/" + doc.userUploaded.userId)}>
                                    <HiOutlinePaperAirplane className="w-5 h-5 mr-1 text-gray-500 dark:text-white" />
                                    <span className="block text-base font-normal text-cyan-500 hover:text-cyan-700">
                                        {doc && doc.userUploaded && doc.userUploaded.lastName} {doc && doc.userUploaded && doc.userUploaded.firstName}
                                    </span>
                                </div>

                                <div className="flex items-center font-bold">
                                    <HiOutlineCalendar className="w-5 h-5 mr-1 text-gray-500 dark:text-white" />
                                    <span className="block text-base font-normal text-red-500 dark:text-white">{doc && moment(doc.updatedAt).format("DD/MM/yyyy")}</span>
                                </div>

                                <div className="flex items-center font-bold">
                                    <HiOutlineEye className="w-5 h-5 mr-1 text-gray-500 dark:text-white" />
                                    <span className="block text-base font-normal text-red-500 dark:text-white">{doc && doc.totalView}</span>
                                </div>

                                <div className="flex items-center font-bold">
                                    <HiOutlineHeart className="w-5 h-5 mr-1 text-gray-500 dark:text-white" />
                                    <span className="block text-base font-normal text-red-500 dark:text-white">{doc && doc.totalFavorite}</span>
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
                        <iframe width="100%" height="700px" className="rounded-lg" title="Tài liệu PDF" src={doc && doc.viewUrl + "#toolbar=0"}></iframe>

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
                            <Button pill className="bg-white text-lg text-gray-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleLike}>
                                {doc && doc.liked ? <HiHeart className="mr-2 h-7 w-7 text-red-500" /> : <HiOutlineHeart className="mr-2 h-7 w-7 text-red-500" />}
                                {doc && doc.liked ? <span className="text-base">Đã thích</span> : <span className="text-base">Thích</span>}
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleSave}>
                                {doc && doc.saved ? <HiOutlineBookmark className="mr-2 h-7 w-7 fill-green-500 text-green-500" /> : <HiOutlineBookmark className="mr-2 h-7 w-7 text-green-500" />}
                                {doc && doc.saved ? <span className="text-base">Đã lưu</span> : <span className="text-base">Lưu</span>}
                            </Button>

                            <Button pill className="bg-white text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 focus:border focus:ring-0 focus:bg-white border border-solid shadow-lg" onClick={handleDownload}>
                                <HiOutlineCloudDownload className="mr-2 h-7 w-7 text-indigo-500" />
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
            </div>
        </>
    );
};

export default DetailDocument;
