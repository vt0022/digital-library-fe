import { createSubsection, getAllSections, getSubsection, updateSubsection } from "@api/main/sectionAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import Select from "@components/management/select/Select";
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronUp } from "react-icons/hi";
import { Bounce, toast } from "react-toastify";

const acceptanceType = [
    {
        name: "Cho phép đối với bài đăng",
        value: "0",
    },
    {
        name: "Cho phép đối với phản hồi",
        value: "1",
    },
];

const SubsectionModal = (props) => {
    usePrivateAxios();

    const { subsectionId, openSubsectionModal, isCreatingNew, triggerModal, refreshSubsectionList } = props;

    const [openModal, setOpenModal] = useState(openSubsectionModal);
    const [subsectionName, setSubsectionName] = useState("");
    const [totalPosts, setTotalPosts] = useState(0);
    const [editable, setEditable] = useState(true);
    const [acceptable, setAcceptable] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [sectionList, setSectionList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubsectionNameValid, setIsSubsectionNameValid] = useState(true);
    const [isSectionValid, setIsSectionValid] = useState(true);

    const toastOptions = {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    useEffect(() => {
        if (triggerModal !== 0) {
            getSectionList();
            setOpenModal(true);
            if (!isCreatingNew) {
                getSubsectionBySubsectionId();
            }
        }
    }, [triggerModal]);

    const onCloseModal = () => {
        setOpenModal(false);
        setSubsectionName("");
        setSectionId("");
        setEditable(true);
        setAcceptable("");
        setIsSectionValid(true);
        setIsSubsectionNameValid(true);
    };

    const getSectionList = async () => {
        try {
            const response = await getAllSections();

            if (response.status === 200) {
                setSectionList(response.data.content);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSubsectionBySubsectionId = async () => {
        try {
            const response = await getSubsection(subsectionId);

            if (response.status === 200) {
                const subsection = response.data;
                setSubsectionName(subsection.subName);
                setSectionId(subsection.section && subsection.section.sectionId);
                setEditable(subsection.editable);
                setTotalPosts(subsection.totalPosts);
                if (subsection.postAcceptable) setAcceptable("0");
                else if (subsection.replyAcceptable) setAcceptable("1");
                else setAcceptable("");
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validate = () => {
        const isSubsectionNameValid = subsectionName.trim() !== "";
        const isSectionValid = sectionId.trim() !== "";

        setIsSubsectionNameValid(isSubsectionNameValid);
        setIsSectionValid(isSectionValid);

        return { isSubsectionNameValid, isSectionValid };
    };

    const handleSave = () => {
        const { isSubsectionNameValid, isSectionValid } = validate();

        if (isSubsectionNameValid && isSectionValid) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const data = {
                subName: subsectionName,
                editable: editable,
                postAcceptable: acceptable === "0",
                replyAcceptable: acceptable === "1",
                sectionId: sectionId,
            };

            let response = null;
            if (isCreatingNew) response = await createSubsection(data);
            else response = await updateSubsection(subsectionId, data);

            setIsLoading(false);

            if (response.status === 200) {
                toast.success(<p className="pr-2">{isCreatingNew ? "Tạo chuyên mục thành công!" : "Cập nhật chuyên mục thành công!"}</p>, toastOptions);

                setOpenModal(false);

                refreshSubsectionList();
                setSubsectionName("");
                setEditable(true);
            } else {
                if (response.message === "Subsection already exists") {
                    toast.error(<p className="pr-2">Chuyên mục đã tồn tại!</p>, toastOptions);
                } else if (response.message === "Subsection not found") {
                    toast.error(<p className="pr-2">Chuyên mục không tồn tại!</p>, toastOptions);
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
                }
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(<p className="pr-2">Đã xảy ra lỗi. Vui lòng thử lại!</p>, toastOptions);
        }
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup className="z-40">
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white">
                            {isCreatingNew && "Thêm chuyên mục mới"}
                            {!isCreatingNew && "Cập nhật chuyên mục"}
                        </h3>

                        <div className="mb-5">
                            <div className="mb-2 block">
                                <Label htmlFor="subsectionName" value="* Tên chuyên mục" />
                            </div>

                            <TextInput id="subsectionName" value={subsectionName} onChange={(event) => setSubsectionName(event.target.value)} maxLength="50" required />
                            {!isSubsectionNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên chuyên mục</p>}
                        </div>

                        <div className="mb-5">
                            <div className="mb-2 block">
                                <Label htmlFor="editable" value="* Cho phép thành viên đăng bài" />
                            </div>

                            <ToggleSwitch checked={editable} onChange={setEditable} />
                        </div>

                        <div className="mb-10">
                            {(isCreatingNew || totalPosts === 0) ? (
                                <>
                                    <Select
                                        selectName="* Cho phép sử dụng tính năng đánh dấu hữu ích"
                                        options={acceptanceType}
                                        defaultName="Không cho phép"
                                        selectedValue={acceptable}
                                        onChangeHandler={(e) => {
                                            setAcceptable(e.target.value);
                                        }}
                                        name="name"
                                        field="value"
                                    />
                                    <p className="text-xs text-red-500 text-justify">- Tính năng này cho phép người dùng đánh dấu một bài đăng hoặc phản hồi là hữu ích nếu nó giúp họ giải quyết vấn đề</p>
                                    <p className="text-xs text-red-500 text-justify">- Lưu ý: không thể chỉnh sửa lại tính năng này nếu đã đăng bài trong chuyên mục</p>
                                </>
                            ) : (
                                <>
                                    <label htmlFor="hs-select-label" className="block text-sm text-gray-700 font-medium mb-2 dark:text-white">
                                        * Cho phép sử dụng tính năng đánh dấu hữu ích
                                    </label>
                                    <select className="py-3 px-4 pe-9 block w-full bg-gray-100 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-transparent dark:text-gray-400 dark:focus:ring-gray-600 disabled mb-2">
                                        {acceptable === "" && <option>Không cho phép</option>}
                                        {acceptable === "0" && <option>Cho phép bài đăng</option>}
                                        {acceptable === "1" && <option>Cho phép phản hồi</option>}
                                    </select>
                                    <p className="text-xs text-red-500 text-justify">Không thể chỉnh sửa lại tính năng này</p>
                                </>
                            )}
                        </div>

                        <div className="mb-10">
                            <Select
                                selectName="* Mục chính"
                                options={sectionList}
                                selectedValue={sectionId}
                                onChangeHandler={(e) => {
                                    setSectionId(e.target.value);
                                }}
                                name="sectionName"
                                field="sectionId"
                            />
                            {!isSectionValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng chọn mục chính</p>}
                        </div>

                        <div className="flex justify-between gap-2">
                            <Button onClick={onCloseModal} disabled={isLoading} color="failure" className="w-auto">
                                <HiChevronLeft className="mr-2 h-5 w-5" />
                                Huỷ bỏ
                            </Button>

                            <Button isProcessing={isLoading} disabled={isLoading} color="success" className="w-auto" onClick={handleSave}>
                                Lưu
                                <HiChevronUp className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SubsectionModal;
