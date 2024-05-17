import { Spinner } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, getPublicCollections } from "../../../api/main/collectionAPI";
import CollectionCard from "../../../components/student/card/CollectionCard";
import "./collection.css";

const ListCollections = () => {
    const navigate = useNavigate();

    const [collectionList, setCollectionList] = useState([]);
    const [collectionListCol1, setCollectionListCol1] = useState([]);
    const [collectionListCol2, setCollectionListCol2] = useState([]);
    const [collectionListCol3, setCollectionListCol3] = useState([]);
    const [collectionListCol4, setCollectionListCol4] = useState([]);
    const [totalCollections, setTotalCollections] = useState(8);
    const [noOfCollections, setNoOfCollections] = useState(8);
    const [isFetching, setIsFetching] = useState(false);

    const collectionSectionRef = useRef(null);

    const user = JSON.parse(sessionStorage.getItem("profile"));
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

            // Kiểm tra xem đã lướt xuống cuối trang chưa
            if (scrollTop + clientHeight >= scrollHeight) {
                setNoOfCollections(noOfCollections + 8);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [noOfCollections]);

    useEffect(() => {
        if (noOfCollections - 8 <= totalCollections) getCollectionList();
    }, [noOfCollections]);

    const getCollectionList = async () => {
        try {
            setIsFetching(true);

            let response = null;
            if (user && accessToken)
                response = await getCollections({
                    params: {
                        page: 0,
                        size: noOfCollections,
                    },
                });
            else
                response = await getPublicCollections({
                    params: {
                        page: 0,
                        size: noOfCollections,
                    },
                });

            setIsFetching(false);
            if (response.status === 200) {
                setCollectionList(response.data.content);
                setTotalCollections(response.data.totalElements);
                splitCollectionList(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    // const handleScroll = () => {
    //     const element = collectionSectionRef.current;
    //     if (element) {
    //         const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight;
    //         if (isAtBottom) {
    //             if (noOfCollections < totalCollections) setNoOfCollections(noOfCollections + 12);
    //         }
    //     }
    // };

    // const handleScroll = () => {
    //             console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight);
    //     if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    //     if (noOfCollections < totalCollections) setNoOfCollections(noOfCollections + 12);
    // };

    // const handleScroll = () => {
    //     if (window.innerHeight + Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) > document.documentElement.offsetHeight - 100) {
    //         if (noOfCollections < totalCollections) setNoOfCollections(noOfCollections + 8);
    //     } else {
    //         return;
    //     }
    // };

    // function handleOnScroll(e) {
    //     const { scrollTop, scrollHeight, offsetHeight } = e.target;

    //     console.log(scrollTop, scrollHeight, offsetHeight);
    //     const hasScrollReachedBottom = offsetHeight + scrollTop > scrollHeight - 40;

    //     if (hasScrollReachedBottom) {
    //         if (noOfCollections < totalCollections) setNoOfCollections(noOfCollections + 12);
    //     }
    // }

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
        <div className="p-10">
            <h1 className="text-3xl text-center font-medium mb-10">Khám phá những bộ sưu tập hữu ích dành cho bạn</h1>

            <div className="flex justify-evenly space-x-10" id="collection-section" ref={collectionSectionRef}>
                <div className="flex flex-col flex-1 space-y-4">
                    {collectionListCol1.map((collection, index) => (
                        <CollectionCard collection={collection} key={index} />
                    ))}
                </div>
                <div className="flex flex-col flex-1 space-y-4">
                    {collectionListCol2.map((collection, index) => (
                        <CollectionCard collection={collection} key={index} />
                    ))}
                </div>
                <div className="flex flex-col flex-1 space-y-4">
                    {collectionListCol3.map((collection, index) => (
                        <CollectionCard collection={collection} key={index} />
                    ))}
                </div>
                <div className="flex flex-col flex-1 space-y-4">
                    {collectionListCol4.map((collection, index) => (
                        <CollectionCard collection={collection} key={index} />
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-5 mb-2">{isFetching &&  <Spinner color="success" className="flex items-center w-full mb-2 mt-2 text-green-400" />}</div>
        </div>
    );
};

export default ListCollections;
