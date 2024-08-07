import { getAccessibleCategories } from "@api/main/categoryAPI";
import { getADocument, updateDocument } from "@api/main/documentAPI";
import { getAccessibleFields } from "@api/main/fieldAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import Select from "@components/management/select/Select";
import PageHead from "@components/shared/head/PageHead";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiAnnotation, HiChevronLeft, HiChevronUp, HiOutlineCloudUpload } from "react-icons/hi";
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

const ManagerEditDocument = () => {
    usePrivateAxios();

    const { slug } = useParams();

    // const currentUser = useSelector((state) => state.LoginReducer.user);
    const currentUser = JSON.parse(sessionStorage.getItem("profile"));

    const [document, setDocument] = useState(null);

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [fieldId, setFieldId] = useState("");
    const [isInternal, setIsInternal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isNameValid, setIsNameValid] = useState(true);
    const [isIntroductionValid, setIsIntroductionValid] = useState(true);
    const [isCategoryValid, setIsCategoryValid] = useState(true);
    const [isFieldValid, setIsFieldValid] = useState(true);
    const [isFileValid, setIsFileValid] = useState(true);
    const [fileMessage, setFileMessage] = useState("");

    const getDocumentBySlug = async () => {
        try {
            const response = await getADocument(slug);

            if (response.status === 200) {
                setDocument(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getCategoryList = async () => {
        try {
            const response = await getAccessibleCategories({
                params: {
                    page: 0,
                    size: 100,
                },
            });
            if (response.status === 200) {
                setCategoryList(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getFieldList = async () => {
        try {
            const response = await getAccessibleFields({
                params: {
                    page: 0,
                    size: 100,
                },
            });
            if (response.status === 200) {
                setFieldList(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    useEffect(() => {
        getCategoryList();
        getFieldList();
        getDocumentBySlug();
    }, []);

    useEffect(() => {
        if (document) {
            setName(document.docName);
            setIntroduction(document.docIntroduction);
            document.category ? setCategoryId(document.category.categoryId) : setCategoryId("");
            document.field ? setFieldId(document.field.fieldId) : setFieldId("");
            setIsInternal(document.internal);
        }
    }, [document]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const validateName = () => {
        if (name === "" || name.trim() === "") {
            setIsNameValid(false);
        } else {
            setIsNameValid(true);
        }
    };

    const validateIntroduction = () => {
        if (introduction === "" || introduction.trim() === "") {
            setIsIntroductionValid(false);
        } else {
            setIsIntroductionValid(true);
        }
    };

    const validateCategory = () => {
        if (categoryId === "") {
            setIsCategoryValid(false);
        } else {
            setIsCategoryValid(true);
        }
    };

    const validateField = () => {
        if (fieldId === "") {
            setIsFieldValid(false);
        } else {
            setIsFieldValid(true);
        }
    };

    const validateFile = () => {
        if (selectedFile !== null && (selectedFile.size > 100 * 1024 * 1024 || selectedFile.size === 0)) {
            setFileMessage("Vui lòng chọn tệp hợp lệ và nhỏ hơn 100MB");
            return false;
        } else {
            return true;
        }
    };

    const validateInput = () => {
        validateName();
        validateIntroduction();
        validateCategory();
        validateField();
        setIsFileValid(validateFile());

        if (!isNameValid || !isIntroductionValid || !isCategoryValid || !isFieldValid || !validateFile()) {
            return false;
        } else {
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateInput()) {
            setIsLoading(true);

            try {
                const updatedDocument = {
                    docName: name,
                    docIntroduction: introduction,
                    internal: isInternal,
                    orgId: currentUser.organization.orgId,
                    categoryId: categoryId,
                    fieldId: fieldId,
                };

                const formData = new FormData();
                formData.append("document", JSON.stringify(updatedDocument));
                if (selectedFile) formData.append("file", selectedFile);

                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };

                const response = await updateDocument(document.slug, formData, config);

                setIsLoading(false);

                if (response.status === 200) {
                    toast.success(<p className="pr-2">Cập nhật tài liệu thành công!</p>, toastOptions);
                    navigate(-1);
                } else {
                    toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
                }
            } catch (error) {
                toast.error(<p className="pr-2">Đã xảy ra lỗi! Xin vui lòng thử lại!</p>, toastOptions);
            }
        }
    };

    return (
        <>
            <PageHead title={`Chỉnh sửa tài liệu - ${document && document.docName} - Quản lý - miniverse`} description={`${document && document.docIntroduction} - Quản lý - miniverse`} imageUrl={document && document.thumbnail} url={window.location.href} />

            <div className="grid place-items-center">
                <h1 className="mb-10 text-3xl font-bold dark:text-white ">Chỉnh sửa tài liệu</h1>

                <div className="row w-2/3">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <label htmlFor="website-admin" className="block mb-2 text-sm font-medium dark:text-white">
                                            Tên tài liệu
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                <HiAnnotation className="w-5 h-5 text-gray-800 dark:text-white" />
                                            </span>
                                            <input
                                                type="text"
                                                id="website-admin"
                                                className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Nhập tên tài liệu..."
                                                minLength={1}
                                                maxLength={255}
                                                required
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                }}
                                                value={name}
                                            />
                                        </div>
                                        {!isNameValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập tên</p>}
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="message" className="block mb-2 text-sm font-medium dark:text-white">
                                            Giới thiệu
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Nhập giới thiệu..."
                                            required
                                            onChange={(e) => {
                                                setIntroduction(e.target.value);
                                            }}
                                            value={introduction}></textarea>

                                        {!isIntroductionValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng nhập mô tả</p>}
                                    </div>

                                    <div className="mb-6">
                                        <Select
                                            selectName="Danh mục"
                                            options={categoryList}
                                            selectedValue={categoryId}
                                            onChangeHandler={(e) => {
                                                setCategoryId(e.target.value);
                                            }}
                                            name="categoryName"
                                            field="categoryId"
                                            required
                                        />
                                        {!isCategoryValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng chọn danh mục</p>}
                                    </div>

                                    <div className="mb-6">
                                        <Select
                                            selectName="Lĩnh vực"
                                            options={fieldList}
                                            selectedValue={fieldId}
                                            onChangeHandler={(e) => {
                                                setFieldId(e.target.value);
                                            }}
                                            name="fieldName"
                                            field="fieldId"
                                            required
                                        />
                                        {!isFieldValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* Vui lòng chọn lĩnh vực</p>}
                                    </div>

                                    <div className="mb-6 mt-6">
                                        <label className="block mb-2 text-sm font-medium dark:text-white">Chọn đối tượng xem tài liệu</label>
                                        <label className="block mb-2 text-xs font-normal italic dark:text-white">* Công khai dành cho tất cả mọi người, nội bộ chỉ dành cho trong trường</label>
                                        <div className="flex gap-x-6">
                                            <div className="flex">
                                                <input
                                                    type="radio"
                                                    name="hs-radio-group"
                                                    className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    id="hs-radio-group-1"
                                                    checked={!isInternal}
                                                    value="false"
                                                    onChange={() => setIsInternal(false)}
                                                />
                                                <label htmlFor="hs-radio-group-1" className="text-sm text-gray-500 ms-2 dark:text-gray-400">
                                                    Công khai
                                                </label>
                                            </div>

                                            <div className="flex">
                                                <input
                                                    type="radio"
                                                    name="hs-radio-group"
                                                    className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    id="hs-radio-group-2"
                                                    checked={isInternal}
                                                    value="true"
                                                    onChange={() => setIsInternal(true)}
                                                />
                                                <label htmlFor="hs-radio-group-2" className="text-sm text-gray-500 ms-2 dark:text-gray-400">
                                                    Nội bộ
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="dropzone-file" className="block mb-2 text-sm font-medium dark:text-white">
                                            Chọn tệp
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="dropzone-file"
                                                className="flex flex-col items-center justify-center w-2/3 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <HiOutlineCloudUpload className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400 font-bold" />
                                                    <p className="mb-2 text-medium text-green-500 dark:text-gray-400">
                                                        <span className="font-semibold">Nhấn để tải lên</span>
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedFile ? `Tệp đã chọn: ${selectedFile.name}` : "PDF (tối đa 100MB)"}</p>
                                                </div>
                                                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                                            </label>

                                            <div className="flex flex-col items-center justify-center w-1/3 h-64 ml-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                                                <img className="m-2 max-h-full w-auto" src={document && document.thumbnail} alt="Ảnh tài liệu" />
                                            </div>
                                        </div>
                                        {!isFileValid && <p className="block mt-2 text-sm font-medium text-red-600 italic">* {fileMessage}</p>}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button disabled={isLoading} color="failure" className="w-auto" onClick={() => navigate(-1)}>
                                            <HiChevronLeft className="mr-2 h-5 w-5" />
                                            Huỷ bỏ
                                        </Button>

                                        <Button type="submit" isProcessing={isLoading} color="success" className="w-auto">
                                            Lưu
                                            <HiChevronUp className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerEditDocument;
