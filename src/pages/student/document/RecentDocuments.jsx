import { getRecentDocuments } from "@api/main/documentAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import PageHead from "@components/shared/head/PageHead";
import DocumentCard from "@components/student/card/Card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecentDocument = () => {
    usePrivateAxios();

    const navigate = useNavigate();

    const [documentList, setDocumentList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getRecentList();
    }, [currentPage, search]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const getRecentList = async () => {
        try {
            const response = await getRecentDocuments();

            if (response.status === 200) {
                setDocumentList(response.data);
                // setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title="Tài liệu gần đây - miniverse" description="Tài liệu gần đây - miniverse" url={window.location.href} />

            <div className="flex-1 p-4 h-full">
                <div className="rounded-lg bg-white py-8 px-8 ">
                    <div className="mb-5 flex items-center">
                        <p className="text-2xl font-medium text-green-400">Tiếp tục đọc</p>
                    </div>

                    {documentList.length === 0 && (
                        <p className="text-lg font-medium ">
                            Gần đây bạn chưa đọc tài liệu nào! &nbsp;
                            <span className="text-green-400 hover:text-green-500 cursor-pointer" onClick={() => navigate("/documents")}>
                                Khám phá ngay!
                            </span>
                        </p>
                    )}

                    <div className="grid grid-cols-4 gap-8">
                        {documentList.map((document) => (
                            <DocumentCard document={document} type="RECENT" />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecentDocument;
