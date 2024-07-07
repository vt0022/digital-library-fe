import { getAccessibleCategories } from "@api/main/categoryAPI";
import { searchDocumentsForGuest, searchDocumentsForStudent } from "@api/main/documentAPI";
import { getAccessibleFields } from "@api/main/fieldAPI";
import { getAccessibleOrganizations } from "@api/main/organizationAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import sortOptions from "@assets/json-data/sortOptions.json";
import FullCard from "@components/student/card/FullCard";
import SelectFilter from "@components/student/select/SelectFilter";
import PageHead from "@components/shared/head/PageHead";
import { Pagination, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce } from "react-toastify";

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

const ListDocument = () => {
    const navigate = useNavigate();

    const { organizationSlug, categorySlug, fieldSlug, searchQuery } = useParams();

    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(sessionStorage.getItem("profile"));

    usePrivateAxios();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [order, setOrder] = useState("updatedAt");
    const [category, setCategory] = useState(categorySlug ? categorySlug : "all");
    const [field, setField] = useState(fieldSlug ? fieldSlug : "all");
    const [organization, setOrganization] = useState(organizationSlug ? organizationSlug : "all");

    const [documentList, setDocumentList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [organizationList, setOrganizationList] = useState([]);

    const [isFetching, setIsFetching] = useState(false);
    const [search, setSearch] = useState(searchQuery ? searchQuery : "");

    useEffect(() => {
        getCategoryList();
        getFieldList();
        getOrganizationList();
    }, []);

    useEffect(() => {
        getDocumentList(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        getDocumentList(currentPage);
    }, [order, search, category, field, organization]);

    const onPageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const getCategoryList = async () => {
        try {
            setIsFetching(true);
            const response = await getAccessibleCategories();
            setIsFetching(false);
            if (response.status === 200) {
                setCategoryList(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getFieldList = async () => {
        try {
            setIsFetching(true);
            const response = await getAccessibleFields();
            setIsFetching(false);
            if (response.status === 200) {
                setFieldList(response.data);
            } 
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getOrganizationList = async () => {
        try {
            setIsFetching(true);
            const response = await getAccessibleOrganizations({
                params: {
                    page: 0,
                    size: 100,
                },
            });
            setIsFetching(false);
            if (response.status === 200) {
                setOrganizationList(response.data);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getDocumentList = async (page) => {
        try {
            setIsFetching(true);

            let response = null;

            if (user && accessToken) {
                response = await searchDocumentsForStudent({
                    params: {
                        page: page - 1,
                        size: 10,
                        order: order,
                        sortOrder: "desc",
                        category: category,
                        field: field,
                        organization: organization,
                        s: search,
                    },
                });
            } else {
                response = await searchDocumentsForGuest({
                    params: {
                        page: page - 1,
                        size: 10,
                        order: order,
                        sortOrder: "desc",
                        category: category,
                        field: field,
                        organization: organization,
                        s: search,
                    },
                });
            }

            setIsFetching(false);
            if (response.status === 200) {
                setDocumentList(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalRecords(response.data.totalElements);
            } 
        } catch (error) {
            navigate("/error-500");
        }
    };

    const handleSearchInput = (e) => {
        setSearch(e.target.value);
    };

    const handleClearSearch = () => {
        setSearch("");
    };

    const handleClearFilter = () => {
        setCategory("all");
        setField("all");
        setOrganization("all");
    };

    return (
        <>
            <PageHead title="Tài liệu - miniverse" description="Tài liệu - miniverse" url={window.location.href} />

            <div className="flex-1 p-4 h-full">
                <div className="rounded-lg bg-white py-5 px-10 w-full">
                    <div className="flex items-end justify-between gap-5">
                        <SelectFilter
                            selectName="Danh mục"
                            options={categoryList}
                            selectedValue={category}
                            onChangeHandler={(e) => {
                                setCategory(e.target.value);
                            }}
                            name="categoryName"
                            field="slug"
                            required
                            className="w-1/4"
                        />

                        <SelectFilter
                            selectName="Lĩnh vực"
                            options={fieldList}
                            selectedValue={field}
                            onChangeHandler={(e) => {
                                setField(e.target.value);
                            }}
                            name="fieldName"
                            field="slug"
                            required
                            className="w-1/4"
                        />

                        <SelectFilter
                            selectName="Trường học"
                            options={organizationList}
                            selectedValue={organization}
                            onChangeHandler={(e) => {
                                setOrganization(e.target.value);
                            }}
                            name="orgName"
                            field="slug"
                            required
                            className="max-w-2/4"
                        />

                        <Tooltip content="Xoá bộ lọc" style="light">
                            <div className="text-green-400 rounded-full border h-fit p-3 mb-2 cursor-pointer hover:bg-green-400 active:border-2 hover:text-white active:border-2 active:border-green-100" onClick={handleClearFilter}>
                                <HiX className=" w-4 h-4" />
                            </div>
                        </Tooltip>
                    </div>
                </div>

                <div className="rounded-lg bg-white py-4 px-8 mt-5 ">
                    <div className="flex mb-2 items-center">
                        <div className="w-1/3">
                            <div className="relative rounded-full">
                                <input type="text" id="list-search" className="text-sm text-black block w-full p-3 ps-5 border border-gray-300 bg-white focus:ring-0 focus:border-green-400 rounded-full" placeholder="Tìm kiếm" onChange={handleSearchInput} value={search} required />

                                <div className="absolute inset-y-0 end-0 flex items-center pe-5 cursor-pointer rounded-full">
                                    <svg className="w-4 h-4 text-green-400 hover:text-green-200 focus:text-green-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <Tooltip content="Xoá tìm kiếm" style="light">
                            <div className="text-green-400 rounded-full border h-full p-3 cursor-pointer ml-2 hover:bg-green-400 active:border-2 hover:text-white active:border-2 active:border-green-100" onClick={handleClearSearch}>
                                <HiX className=" w-4 h-4" />
                            </div>
                        </Tooltip>

                        <div className="flex ml-auto w-fit items-center">
                            <label htmlFor="hs-select-label" className="block text-sm font-medium mr-2 dark:text-white">
                                Sắp xếp theo:
                            </label>
                            <SelectFilter
                                options={sortOptions}
                                selectedValue={order}
                                onChangeHandler={(e) => {
                                    setOrder(e.target.value);
                                }}
                                name="name"
                                field="order"
                                defaultName="Mặc định"
                                defaultValue="updatedAt"
                                required
                            />
                        </div>
                    </div>

                    <p className="mb-4">
                        Kết quả <span className="text-cyan-600 font-semibold">{documentList.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> đến <span className="text-cyan-600 font-semibold">{documentList.length > 0 ? documentList.length + (currentPage - 1) * 10 : 0}</span> trong khoảng{" "}
                        <span className="text-cyan-600 font-semibold">{totalRecords}</span>
                    </p>

                    <div className="flex flex-col gap-y-5">
                        {documentList.map((document, index) => (
                            <FullCard
                                key={index}
                                docName={document.docName}
                                docIntroduction={document.docIntroduction}
                                thumbnail={document.thumbnail}
                                totalView={document.totalView}
                                totalFavorite={document.totalFavorite}
                                isContributed={document.contributed}
                                averageRating={document.averageRating}
                                updatedAt={document.updatedAt}
                                slug={document.slug}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center mt-5 mb-2">{isFetching && <Spinner color="success" className="flex items-center w-full mb-2 mt-2 text-green-400" />}</div>

                    {documentList.length !== 0 && (
                        <div className="flex overflow-x-auto sm:justify-center">
                            <Pagination previousLabel="" nextLabel="" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ListDocument;
