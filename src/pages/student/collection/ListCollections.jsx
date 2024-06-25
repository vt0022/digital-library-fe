import { getCollections, getPublicCollections } from "@api/main/collectionAPI";
import collectionImage from "@assets/images/collection.webp";
import PageHead from "@components/shared/head/PageHead";
import InfiniteScroll from "@components/shared/infinite-scroll/InfiniteScroll";
import CollectionCard from "@components/student/card/CollectionCard";
import { Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./collection.css";

const ListCollections = () => {
    const navigate = useNavigate();

    const [collectionList, setCollectionList] = useState([]);
    const [collectionListCol1, setCollectionListCol1] = useState([]);
    const [collectionListCol2, setCollectionListCol2] = useState([]);
    const [collectionListCol3, setCollectionListCol3] = useState([]);
    const [collectionListCol4, setCollectionListCol4] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCollections, setTotalCollections] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [search, setSearch] = useState("");

    const collectionSectionRef = useRef(null);

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    //         // Kiểm tra xem đã lướt xuống cuối trang chưa
    //         if (scrollTop + clientHeight >= scrollHeight) {
    //             if (noOfCollections < totalCollections) setNoOfCollections(noOfCollections + 8);
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, [noOfCollections]);

    useEffect(() => {
        getCollectionList();
    }, [currentPage, search]);

    const getCollectionList = async () => {
        try {
            setIsFetching(true);

            let response = null;
            if (user && accessToken)
                response = await getCollections({
                    params: {
                        page: currentPage - 1,
                        size: 8,
                        s: search,
                    },
                });
            else
                response = await getPublicCollections({
                    params: {
                        page: currentPage - 1,
                        size: 8,
                        s: search,
                    },
                });

            setIsFetching(false);
            if (response.status === 200) {
                if (currentPage === 1) {
                    setCollectionList(response.data.content);
                } else {
                    setCollectionList([...collectionList, ...response.data.content]);
                }
                setTotalCollections(response.data.totalElements);
                if (currentPage === 1) {
                    splitCollectionList(response.data.content);
                } else {
                    splitCollectionList([...collectionList, ...response.data.content]);
                }
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const splitCollectionList = (collectionList) => {
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        const n = collectionList.length;
        for (let i = 0; i < n; i++) {
            if (i % 4 === 0) a.push(collectionList[i]);
            else if (i % 4 === 1) b.push(collectionList[i]);
            else if (i % 4 === 2) c.push(collectionList[i]);
            else d.push(collectionList[i]);
        }
        setCollectionListCol1(a);
        setCollectionListCol2(b);
        setCollectionListCol3(c);
        setCollectionListCol4(d);
    };

    return (
        <>
            <PageHead title="Bộ sưu tập" description="Bộ sưu tập - learniverse & shariverse" url={window.location.href} origin="lib" />

            <div className="px-10 pt-5 pb-10">
                <img src={collectionImage} alt="Ảnh" width="40%" height="40%" className="m-auto" />

                <h1 className="text-3xl text-center font-medium mb-5">Khám phá những bộ sưu tập hữu ích dành cho bạn</h1>

                <div className="relative rounded-full m-auto w-1/2 mb-10">
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
                        <svg className="w-5 h-5 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </div>

                <div>
                    <InfiniteScroll loader={<p className="text-center mt-5 font-medium">Đang tải...</p>} fetchMore={() => setCurrentPage((prev) => prev + 1)} hasMore={collectionList.length < totalCollections} endMessage={<p className="text-center mt-5 font-medium">Đã đến cuối trang</p>}>
                        <div className="grid grid-cols-4 gap-x-8" id="collection-section" ref={collectionSectionRef}>
                            <div className="flex flex-col space-y-12">
                                {collectionListCol1.map((collection, index) => (
                                    <CollectionCard collection={collection} key={index} />
                                ))}
                            </div>
                            <div className="flex flex-col space-y-12">
                                {collectionListCol2.map((collection, index) => (
                                    <CollectionCard collection={collection} key={index} />
                                ))}
                            </div>
                            <div className="flex flex-col space-y-12">
                                {collectionListCol3.map((collection, index) => (
                                    <CollectionCard collection={collection} key={index} />
                                ))}
                            </div>
                            <div className="flex flex-col space-y-12">
                                {collectionListCol4.map((collection, index) => (
                                    <CollectionCard collection={collection} key={index} />
                                ))}
                            </div>
                        </div>
                    </InfiniteScroll>
                </div>

                <div className="flex justify-center mt-5 mb-2">{isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2 text-green-400" />}</div>
            </div>
        </>
    );
};

export default ListCollections;
