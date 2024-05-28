import { getLatestDocuments } from "@api/main/documentAPI";
import { getGeneralStatistics, getYearlyStatistics } from "@api/main/statisticsAPI";
import { getLatestUsers } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import StatusCard from "@components/management/status-card/StatusCard";
import Table from "@components/management/table/Table";
import { Button, Datepicker, Radio, Select, Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { GoDash } from "react-icons/go";
import { TbMoodEmpty } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const lineOptions = {
    chart: {
        background: "transparent",
    },
    stroke: {
        curve: "monotoneCubic",
        width: 3,
    },
    xaxis: {
        categories: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    },
    legend: {
        position: "top",
    },
    grid: {
        show: false,
    },
};

const pieOptions = {
    chart: {
        background: "transparent",
    },
    dataLabels: {
        enabled: true,
    },
    legend: {
        show: false,
    },
    title: {
        align: "center",
        style: {
            fontWeight: "bold",
            fontSize: "16px",
        },
    },
};

const latestUserHead = ["Họ", "Tên", "Trường"];

const renderLatestUserHead = (item, index) => (
    <th key={index} className="capitalize text-base text-center">
        {item}
    </th>
);

const renderLatestUserBody = (item, index) => (
    <tr key={index} className="text-sm">
        <td className="text-center">{item.lastName}</td>
        <td className="text-center">{item.firstName}</td>
        <td className="text-justify">{item?.organization?.orgName}</td>
    </tr>
);

const latestDocumentHead = ["Tên", "Giới thiệu"];

const renderLatestDocumentHead = (item, index) => (
    <th key={index} className="text-base text-center">
        {item}
    </th>
);

const renderLatestDocumentBody = (item, index) => (
    <tr key={index} className="text-sm text-justify">
        <td className="max-w-xs">
            <p className="truncate whitespace-normal leading-6 line-clamp-2">{item.docName}</p>
        </td>
        <td className="max-w-xl">
            <p className="truncate whitespace-normal leading-6 line-clamp-2">{item.docIntroduction}</p>
        </td>
    </tr>
);

const Dashboard = () => {
    const themeReducer = useSelector((state) => state.ThemeReducer.mode);

    usePrivateAxios();

    const [totalDocuments, setTotalDocuments] = useState(0);
    const [totalPendingDocuments, setTotalPendingDocuments] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPendingReviews, setTotalPendingReviews] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalFields, setTotalFields] = useState(0);
    const [totalOrganizations, setTotalOrganizations] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalReplies, setTotalReplies] = useState(0);
    const [totalSections, setTotalSections] = useState(0);
    const [totalSubsections, setTotalSubsections] = useState(0);
    const [totalLabels, setTotalLabels] = useState(0);
    const [totalPostReports, setTotalPostReports] = useState(0);
    const [totalPostAppeals, setTotalPostAppeals] = useState(0);
    const [totalReplyReports, setTotalReplyReports] = useState(0);
    const [totalReplyAppeals, setTotalReplyAppeals] = useState(0);
    const [documentsByMonth, setDocumentsByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [usersByMonth, setUsersByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [postsByMonth, setPostsByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [repliesByMonth, setRepliesByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [documentsByCategory, setDocumentsByCategory] = useState([]);
    const [documentsByField, setDocumentsByField] = useState([]);
    const [documentsByOrganization, setDocumentsByOrganization] = useState([]);
    const [usersByOrganization, setUsersByOrganization] = useState([]);
    const [postsBySubsection, setPostsBySubsection] = useState([]);
    const [postsByLabel, setPostsByLabel] = useState([]);
    const [repliesBySubsection, setRepliesBySubsection] = useState([]);
    const [repliesByLabel, setRepliesByLabel] = useState([]);
    const [postReportsByReason, setPostReportsByReason] = useState([]);
    const [replyReportsByReason, setReplyReportsByReason] = useState([]);
    const [postAppealsByReason, setPostAppealsByReason] = useState([]);
    const [replyAppealsByReason, setReplyAppealsByReason] = useState([]);

    const [latestUsers, setLatestUsers] = useState([]);
    const [latestDocuments, setLatestDocuments] = useState([]);

    const [year, setYear] = useState(new Date().getFullYear()); // [2021, 2022, 2023, ...
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dateRange, setDateRange] = useState("all"); // ["all", "1month", "3months", "6months", "1year"]
    const [isGeneral, setIsGeneral] = useState(true);

    const statusCardsForLibrary = [
        {
            icon: "bx bx-file",
            count: totalDocuments,
            title: "Tài liệu",
            link: "/admin/documents",
        },
        {
            icon: "bx bx-time-five",
            count: totalPendingDocuments,
            title: "Tài liệu đang chờ",
            link: "/admin/documents/pending",
        },
        {
            icon: "bx bxs-star-half",
            count: totalReviews,
            title: "Đánh giá",
            link: "",
        },
        {
            icon: "bx bx-time",
            count: totalPendingReviews,
            title: "Đánh giá đang chờ",
            link: "",
        },
        {
            icon: "bx bx-user",
            count: totalUsers,
            title: "Người dùng",
            link: "/admin/users",
        },
        {
            icon: "bx bx-category-alt",
            count: totalCategories,
            title: "Danh mục",
            link: "/admin/categories",
        },
        {
            icon: "bx bx-cube",
            count: totalFields,
            title: "Lĩnh vực",
            link: "/admin/fields",
        },
        {
            icon: "bx bx-buildings",
            count: totalOrganizations,
            title: "Trường",
            link: "/admin/organizations",
        },
    ];

    const statusCardsForForum = [
        {
            icon: "bx bx-message-square-dots",
            count: totalPosts,
            title: "Bài đăng",
            link: "/admin/posts",
        },
        {
            icon: "bx bx-reply",
            count: totalReplies,
            title: "Phản hồi",
            link: "",
        },
        {
            icon: "bx bx-detail",
            count: totalSections,
            title: "Mục",
            link: "/admin/sections",
        },
        {
            icon: "bx bx-detail",
            count: totalSubsections,
            title: "Chuyên mục",
            link: "/admin/subsections",
        },
        {
            icon: "bx bx-purchase-tag",
            count: totalLabels,
            title: "Nhãn",
            link: "/admin/labels",
        },
        {
            icon: "bx bx-error",
            count: totalPostReports,
            title: "Báo cáo bài đăng",
            link: "/admin/reports",
        },
        {
            icon: "bx bx-error",
            count: totalReplyReports,
            title: "Báo cáo phản hồi",
            link: "/admin/reports",
        },
        {
            icon: "bx bx-hourglass",
            count: totalPostAppeals,
            title: "Khiếu nại bài đăng",
            link: "/admin/appeals",
        },
        {
            icon: "bx bx-hourglass",
            count: totalReplyAppeals,
            title: "Khiếu nại phản hồi",
            link: "/admin/appeals",
        },
    ];

    const userDocumentLineSeries = [
        {
            name: "Tài liệu",
            data: Object.values(documentsByMonth),
        },
        {
            name: "Người dùng",
            data: Object.values(usersByMonth),
        },
    ];

    const postReplyLineSeries = [
        {
            name: "Bài đăng",
            data: Object.values(postsByMonth),
        },
        {
            name: "Phản hồi",
            data: Object.values(repliesByMonth),
        },
    ];

    useEffect(() => {
        getLatestUserList();
        getLatestDocumentList();
    }, []);

    useEffect(() => {
        getYearlyStatisticsForAdmin();
    }, [year]);

    useEffect(() => {
        getGeneralStatisticsForAdmin();
    }, [isGeneral, dateRange]);

    const getGeneralStatisticsForAdmin = async () => {
        try {
            let params = null;
            if (isGeneral) {
                params = {
                    isGeneral: isGeneral,
                    dateRange: dateRange,
                };
            } else {
                params = {
                    isGeneral: isGeneral,
                    startDate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
                    endDate: moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
                };
            }
            const response = await getGeneralStatistics({
                params,
            });

            if (response.status === 200) {
                setTotalDocuments(response.data.totalDocuments);
                setTotalPendingDocuments(response.data.totalPendingDocuments);
                setTotalUsers(response.data.totalUsers);
                setTotalCategories(response.data.totalCategories);
                setTotalFields(response.data.totalFields);
                setTotalOrganizations(response.data.totalOrganizations);
                setTotalReviews(response.data.totalReviews);
                setTotalPendingReviews(response.data.totalPendingReviews);
                setTotalPosts(response.data.totalPosts);
                setTotalReplies(response.data.totalReplies);
                setTotalSections(response.data.totalSections);
                setTotalSubsections(response.data.totalSubsections);
                setTotalLabels(response.data.totalLabels);
                setTotalPostReports(response.data.totalPostReports);
                setTotalPostAppeals(response.data.totalPostAppeals);
                setTotalReplyReports(response.data.totalReplyReports);
                setTotalReplyAppeals(response.data.totalReplyAppeals);
                setDocumentsByCategory(response.data.documentsByCategory);
                setDocumentsByField(response.data.documentsByField);
                setDocumentsByOrganization(response.data.documentsByOrganization);
                setUsersByOrganization(response.data.usersByOrganization);
                setPostsBySubsection(response.data.postsBySubsection);
                setPostsByLabel(response.data.postsByLabel);
                setRepliesBySubsection(response.data.repliesBySubsection);
                setRepliesByLabel(response.data.repliesByLabel);
                setPostReportsByReason(response.data.postReportsByReason);
                setReplyReportsByReason(response.data.replyReportsByReason);
                setPostAppealsByReason(response.data.postAppealsByReason);
                setReplyAppealsByReason(response.data.replyAppealsByReason);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getYearlyStatisticsForAdmin = async () => {
        try {
            const response = await getYearlyStatistics({
                params: { year: year },
            });

            if (response.status === 200) {
                setDocumentsByMonth(response.data.documentsByMonth);
                setUsersByMonth(response.data.usersByMonth);
                setPostsByMonth(response.data.postsByMonth);
                setRepliesByMonth(response.data.repliesByMonth);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLatestUserList = async () => {
        try {
            const response = await getLatestUsers();

            if (response.status === 200) {
                setLatestUsers(response.data.content);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLatestDocumentList = async () => {
        try {
            const response = await getLatestDocuments();

            if (response.status === 200) {
                setLatestDocuments(response.data.content);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="space-y-5">
            <div className="row">
                <h2 className="page-header px-[15px]">Tổng quan</h2>

                <div class="flex items-center w-full px-[15px] mb-2">
                    <span class="whitespace-nowrap text-2xl font-medium">Sơ lược theo giai đoạn</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="col-12">
                    <div className="card flex items-center space-x-10 justify-between">
                        <div className="card__body w-1/3 w-fit flex space-x-5 items-center">
                            <Radio id="date-range" name="isGeneral" value={true} onClick={() => setIsGeneral(true)} defaultChecked />

                            <Select id="countries" required className={`${!isGeneral ? "pointer-events-none opacity-50" : ""}`} onChange={(e) => setDateRange(e.target.value)}>
                                <option value="all">Từ trước đến nay</option>
                                <option value="current">Tháng này</option>
                                <option value="1month">1 tháng trước</option>
                                <option value="3months">3 tháng trước</option>
                                <option value="6months">6 tháng trước</option>
                                <option value="1year">1 năm trước</option>
                            </Select>
                        </div>

                        <div className="card__body w-2/3 !mt-0 flex space-x-5 items-center">
                            <Radio id="date-range" name="isGeneral" value={false} onClick={() => setIsGeneral(false)} />

                            <div className={`flex space-x-5 items-center cursor-default ${isGeneral ? "pointer-events-none opacity-50" : ""}`}>
                                <Datepicker
                                    language="vi-VN"
                                    labelTodayButton="Hôm nay"
                                    labelClearButton="Xoá"
                                    id="dateOfBirth"
                                    value={moment(new Date(startDate)).format("DD/MM/YYYY")}
                                    datepicker-format="dd/MM/yyyy"
                                    maxDate={new Date()}
                                    onSelectedDateChanged={(date) => {
                                        setStartDate(date);
                                    }}
                                    required
                                    className="w-fit"
                                />

                                <GoDash />

                                <Datepicker
                                    language="vi-VN"
                                    labelTodayButton="Hôm nay"
                                    labelClearButton="Xoá"
                                    id="dateOfBirth"
                                    value={moment(new Date(endDate)).format("DD/MM/YYYY")}
                                    datepicker-format="dd/MM/yyyy"
                                    minDate={new Date(startDate)}
                                    onSelectedDateChanged={(date) => {
                                        setEndDate(date);
                                    }}
                                    required
                                />

                                <Button color="success" onClick={getGeneralStatisticsForAdmin}>
                                    Áp dụng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center w-full px-[15px] my-2">
                    <span class="whitespace-nowrap text-xl font-medium">Số lượng tổng quát</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div class="flex items-center w-full px-[15px] my-2">
                    <span class="whitespace-nowrap text-base font-medium">Thư viện</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="flex w-full grid grid-cols-5 gap-y-5 mb-7">
                    {statusCardsForLibrary.map((item, index) => (
                        <div className="col-3 w-full" key={index}>
                            <StatusCard icon={item.icon} count={item.count} title={item.title} link={item.link} />
                        </div>
                    ))}
                </div>

                <div class="flex items-center w-full px-[15px] my-2">
                    <span class="whitespace-nowrap text-base font-medium">Diễn đàn</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="flex w-full grid grid-cols-5 gap-y-5 mb-7">
                    {statusCardsForForum.map((item, index) => (
                        <div className="col-3 w-full" key={index}>
                            <StatusCard icon={item.icon} count={item.count} title={item.title} link={item.link} />
                        </div>
                    ))}
                </div>

                <div class="flex items-center w-full px-[15px] my-2">
                    <span class="whitespace-nowrap text-xl font-medium">Biểu đồ tổng quan</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div class="flex items-center w-full px-[15px] my-2">
                    <span class="whitespace-nowrap text-base font-medium">Thư viện</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="flex w-full">
                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(documentsByCategory).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Tài liệu theo danh mục
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(documentsByCategory).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette5" },
                                        labels: Object.keys(documentsByCategory),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Tài liệu theo danh mục",
                                        },
                                    }}
                                    series={Object.values(documentsByCategory)}
                                    type="donut"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(documentsByField).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Tài liệu theo lĩnh vực
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(documentsByField).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette8" },
                                        labels: Object.keys(documentsByField),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Tài liệu theo lĩnh vực",
                                        },
                                    }}
                                    series={Object.values(documentsByField)}
                                    type="polarArea"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(usersByOrganization).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Người dùng theo trường
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(usersByOrganization).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette5" },
                                        labels: Object.keys(usersByOrganization),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Người dùng theo trường",
                                        },
                                    }}
                                    series={Object.values(usersByOrganization)}
                                    type="donut"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(documentsByOrganization).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Tài liệu theo trường
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(documentsByOrganization).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light" },
                                        labels: Object.keys(documentsByOrganization),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Tài liệu theo trường",
                                        },
                                    }}
                                    series={Object.values(documentsByOrganization)}
                                    type="pie"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div class="flex items-center w-full px-[15px] my-2">
                    <span class="whitespace-nowrap text-base font-medium">Diễn đàn</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="flex w-full">
                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(postsBySubsection).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Bài đăng theo phân mục
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(postsBySubsection).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette8" },
                                        labels: Object.keys(postsBySubsection),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Bài đăng theo phân mục",
                                        },
                                    }}
                                    series={Object.values(postsBySubsection)}
                                    type="polarArea"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(postsByLabel).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Bài đăng theo nhãn
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(postsByLabel).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light" },
                                        labels: Object.keys(postsByLabel),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Bài đăng theo nhãn",
                                        },
                                    }}
                                    series={Object.values(postsByLabel)}
                                    type="pie"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(repliesBySubsection).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Phản hồi theo phân mục
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(repliesBySubsection).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette8" },
                                        labels: Object.keys(repliesBySubsection),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Phản hồi theo phân mục",
                                        },
                                    }}
                                    series={Object.values(repliesBySubsection)}
                                    type="polarArea"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(repliesByLabel).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Phản hồi theo nhãn
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(repliesByLabel).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light" },
                                        labels: Object.keys(repliesByLabel),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Phản hồi theo nhãn",
                                        },
                                    }}
                                    series={Object.values(repliesByLabel)}
                                    type="pie"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(postReportsByReason).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Báo cáo bài đăng theo lý do
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(postReportsByReason).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette8" },
                                        labels: Object.keys(postReportsByReason),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Báo cáo bài đăng theo lý do",
                                        },
                                    }}
                                    series={Object.values(postReportsByReason)}
                                    type="polarArea"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full flex flex-col">
                            {Object.keys(replyReportsByReason).length === 0 && (
                                <>
                                    <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                        Báo cáo phản hồi theo lý do
                                    </p>
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                    </Tooltip>
                                </>
                            )}

                            {Object.keys(replyReportsByReason).length > 0 && (
                                <Chart
                                    options={{
                                        ...pieOptions,
                                        theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light" },
                                        labels: Object.keys(repliesByLabel),
                                        title: {
                                            ...pieOptions.title,
                                            text: "Báo cáo phản hồi theo lý do",
                                        },
                                    }}
                                    series={Object.values(replyReportsByReason)}
                                    type="pie"
                                    height="300px"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full">
                <div className="col-4 w-full">
                    <div className="card full-height w-full flex flex-col">
                        {Object.keys(postAppealsByReason).length === 0 && (
                            <>
                                <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                    Khiếu nại xử lý bài đăng theo lý do
                                </p>
                                <Tooltip content="Không có dữ liệu" style="light">
                                    <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                                </Tooltip>
                            </>
                        )}

                        {Object.keys(postAppealsByReason).length > 0 && (
                            <Chart
                                options={{
                                    ...pieOptions,
                                    theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light", palette: "palette8" },
                                    labels: Object.keys(postAppealsByReason),
                                    title: {
                                        ...pieOptions.title,
                                        text: "Khiếu nại xử lý bài đăng theo lý do",
                                    },
                                }}
                                series={Object.values(postAppealsByReason)}
                                type="polarArea"
                                height="300px"
                            />
                        )}
                    </div>
                </div>

                <div className="col-4 w-full">
                    <div className="card full-height w-full flex flex-col">
                        {Object.keys(replyAppealsByReason).length === 0 && (
                            <>
                                <p className="font-bold text-[16px] text-gray-700 text-center" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                                    Khiếu nại xử lý phản hồi theo lý do
                                </p>
                                <div className="h-full flex items-center justify-center">
                                    <Tooltip content="Không có dữ liệu" style="light">
                                        <TbMoodEmpty className="w-20 h-20 mx-auto text-amber-500 flex-1" />
                                    </Tooltip>
                                </div>
                            </>
                        )}

                        {Object.keys(replyAppealsByReason).length > 0 && (
                            <Chart
                                options={{
                                    ...pieOptions,
                                    theme: { mode: themeReducer === "theme-mode-dark" ? "dark" : "light" },
                                    labels: Object.keys(replyAppealsByReason),
                                    title: {
                                        ...pieOptions.title,
                                        text: "Khiếu nại xử lý phản hồi theo lý do",
                                    },
                                }}
                                series={Object.values(replyAppealsByReason)}
                                type="pie"
                                height="300px"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="row">
                <div class="flex items-center w-full px-[15px] mb-2">
                    <span class="whitespace-nowrap text-2xl font-medium">Biểu đồ tổng quan theo từng năm</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="col-12">
                    <div className="card flex items-center space-x-10 justify-between">
                        <div className="card__body min-w-1/4 w-fit flex space-x-5 items-center">
                            <Select id="years" required onChange={(e) => setYear(e.target.value)}>
                                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                                <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>
                                <option value={new Date().getFullYear() - 4}>{new Date().getFullYear() - 4}</option>
                                <option value={new Date().getFullYear() - 5}>{new Date().getFullYear() - 5}</option>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex w-full h-96">
                    <div className="col-6 w-full h-full">
                        <div className="card full-height">
                            <Chart
                                options={
                                    themeReducer === "theme-mode-dark"
                                        ? {
                                              ...lineOptions,
                                              colors: ["#f2c00a", "#e8271a"],
                                              theme: { mode: "dark" },
                                          }
                                        : {
                                              ...lineOptions,
                                              colors: ["#f2c00a", "#e8271a"],
                                              theme: { mode: "light" },
                                          }
                                }
                                series={userDocumentLineSeries}
                                type="line"
                                height="100%"
                            />
                        </div>
                    </div>

                    <div className="col-6 w-full">
                        <div className="card full-height">
                            <Chart
                                options={
                                    themeReducer === "theme-mode-dark"
                                        ? {
                                              ...lineOptions,
                                              theme: { mode: "dark" },
                                          }
                                        : {
                                              ...lineOptions,
                                              theme: { mode: "light" },
                                          }
                                }
                                series={postReplyLineSeries}
                                type="line"
                                height="100%"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div class="flex items-center w-full px-[15px] mb-2">
                    <span class="whitespace-nowrap text-2xl font-medium">Dữ liệu mới nhất trong tháng</span>
                    <span class="flex-grow border-t border-black"></span>
                </div>

                <div className="flex w-full">
                    <div className="col-5">
                        <div className="card">
                            <div className="card__header text-center">
                                <h3>Người dùng mới tháng này</h3>
                            </div>
                            {latestUsers.length > 0 && (
                                <>
                                    <div className="card__body overflow-x-auto">
                                        <Table headData={latestUserHead} renderHead={(item, index) => renderLatestUserHead(item, index)} bodyData={latestUsers} renderBody={(item, index) => renderLatestUserBody(item, index)} />
                                    </div>
                                    <div className="card__footer">
                                        <Link to="/admin/users/latest" className="font-bold">
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </>
                            )}

                            {latestUsers.length === 0 && <p className="text-center font-medium mt-5">Không có người dùng nào!</p>}
                        </div>
                    </div>

                    <div className="col-7">
                        <div className="card">
                            <div className="card__header text-center">
                                <h3>Tài liệu mới tháng này</h3>
                            </div>
                            {latestDocuments.length > 0 && (
                                <>
                                    <div className="card__body overflow-x-auto">
                                        <Table headData={latestDocumentHead} renderHead={(item, index) => renderLatestDocumentHead(item, index)} bodyData={latestDocuments} renderBody={(item, index) => renderLatestDocumentBody(item, index)} />
                                    </div>
                                    <div className="card__footer">
                                        <Link to="/admin/documents/latest" className="font-bold">
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </>
                            )}

                            {latestDocuments.length === 0 && <p className="text-center font-medium mt-5">Không có tài liệu nào!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
