import { addDocumentToCollection, getMyCollections } from "@api/main/collectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import { useEffect, useState } from "react";
import { GiPadlock } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { RiChatPrivateFill } from "react-icons/ri";

const CollectionListModal = (props) => {
    const navigate = useNavigate();

    usePrivateAxios();

    const { docId, onClose, onSuccess, onFailure } = props;

    const [collectionList, setCollectionList] = useState([]);

    useEffect(() => {
        getCollections();
    }, []);

    const getCollections = async () => {
        try {
            const response = await getMyCollections({
                params: {
                    page: 0,
                    size: 100,
                },
            });

            if (response.status === 200) {
                setCollectionList(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const addToCollection = async (collectionId) => {
        try {
            const response = await addDocumentToCollection(collectionId, docId);

            if (response.status === 200) onSuccess();
            else onFailure();

            onClose();
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <div className="max-h-[30rem] min-h-[10rem] h-fit bg-white w-[22rem] z-30 absolute rounded-lg drop-shadow-2xl p-2 top-1/4 right-0 border ring ring-offset-1 ring-1 ring-white">
            <p className="text-center font-medium text-lg mt-3 mb-5">Lưu vào bộ sưu tập</p>

            <div className="overflow-y-auto max-h-[24rem] h-fit">
                {collectionList.map((collection, index) => (
                    <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-200 rounded-lg relative group" key={index} onClick={() => addToCollection(collection.collectionId)}>
                        {collection.thumbnails && collection.thumbnails.length > 0 && <img alt="collection image" src={collection.thumbnails[0]} className="w-12 h-12 min-w-12 min-h-12 rounded-lg object-cover" />}

                        {(!collection.thumbnails || collection.thumbnails.length === 0) && <div className="w-12 h-12 min-w-12 min-h-12 bg-gray-300 rounded-lg" />}

                        <p className="font-medium text-base">{collection.collectionName}</p>

                        {collection.private && <RiChatPrivateFill className="w-6 h-6 text-amber-500" />}

                        <div className="hidden group-hover:block absolute right-0 bg-red-600 rounded-full w-fit py-2 px-4 text-white text-sm group-hover:bg-reg-600 group-hover:bg-reg-700">Lưu</div>
                    </div>
                ))}

                {collectionList.length === 0 && (
                    <div className="flex w-fit m-auto text-sm mt-5 mb-3">
                        <p className="text-gray-600 text-center">Bạn chưa có bộ sưu tập nào.</p>
                        {" "}
                        <Link to="/me/my-created-collections" className="text-green-500 hover:!text-green-400">Tạo ngay!</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionListModal;
