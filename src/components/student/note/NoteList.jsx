import { getAllNotesOfDocument, getNote } from "@api/main/documentAPI";
import usePrivateAxios from "api/usePrivateAxios";
import { Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaClipboardList, FaCommentDots } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Note from "./Note";
import "./note.css";

const NoteList = ({ page, slug, onPageChange }) => {
    const navigate = useNavigate();

    usePrivateAxios();

    const [isLoading, setIsLoading] = useState(false);
    const [fetchingStatus, setFetchingStatus] = useState(0);
    const [noteList, setNoteList] = useState([]);
    const [totalNotes, setTotalNotes] = useState(0);
    const [isNoteAvailable, setIsNoteAvailable] = useState(false);
    const [content, setContent] = useState({});

    const initValue = {
        time: 1719318054075,
        blocks: [
            {
                id: "56tydhyehe",
                data: {
                    text: "",
                },
                type: "paragraph",
            },
        ],
        version: "2.29.1",
    };

    useEffect(() => {
        onRetrieveList();
    }, [slug]);

    useEffect(() => {
        onRetrieveNote();
    }, [page]);

    const onRetrieveList = async () => {
        try {
            const response = await getAllNotesOfDocument(slug);

            if (response.status === 200) {
                setNoteList(response.data.content);
                setTotalNotes(response.data.totalElements);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const onClickNote = (page) => {
        onPageChange(page);
    };

    const onAddNote = () => {
        setIsNoteAvailable(true);
        setContent(initValue);
    };

    const onRetrieveNote = async () => {
        try {
            const response = await getNote(slug, {
                params: {
                    page: page,
                },
            });

            if (response.status === 200) {
                setIsNoteAvailable(true);
                setContent(JSON.parse(response.data.content));
            } else {
                setIsNoteAvailable(false);
            }
        } catch (error) {}
    };

    return (
        <div className="flex space-x-5 mb-5">
            {isNoteAvailable && (
                <div className="w-fit w-[440px]">
                    <Note slug={slug} page={page} content={content} onRefresh={onRetrieveList} onRemove={onRetrieveNote} />
                </div>
            )}

            <div className="bg-blue-200 rounded-lg shadow-lg p-5 h-fit max-h-[400px] flex-1" style={{ maxWidth: 50 + "%" }}>
                <div className="flex space-x-2 items-center mb-5 justify-between">
                    <div className="flex space-x-2 items-center">
                        <div className="bg-white p-2 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaClipboardList className="w-5 h-5" />
                        </div>

                        <div className="text-lg font-medium">Tổng ghi chú: {totalNotes}</div>
                    </div>

                    {!isNoteAvailable && (
                        <button onClick={onAddNote}>
                            <Tooltip content="Thêm ghi chú" position="top" style="light">
                                <MdAdd className="bg-white p-2 w-10 h-10 rounded-full hover:bg-gray-100" />
                            </Tooltip>
                        </button>
                    )}
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    {noteList.map((note, index) => (
                        <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-blue-500 cursor-pointer mb-3" key={index} onClick={() => onClickNote(note.page)}>
                            <div className="flex space-x-2 items-center">
                                <FaCommentDots className="w-6 h-6 p-1.5 bg-sky-500 text-white rounded-full" />

                                <p className="text-sm font-medium">Trang {note.page + 1}</p>
                            </div>

                            <p className="text-[11px] text-right text-gray-500 mr-auto mt-3">{moment(note.notedAt).format("DD/MM/yyyy HH:mm")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoteList;
