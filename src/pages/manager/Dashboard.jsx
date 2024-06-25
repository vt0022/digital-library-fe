import { getLatestDocumentsByOrganization } from "@api/main/documentAPI";
import { getGeneralStatisticsForManager, getYearlyStatisticsForManager } from "@api/main/statisticsAPI";
import { getLatestUsersByOrganization } from "@api/main/userAPI";
import usePrivateAxios from "@api/usePrivateAxios";
import StatusCard from "@components/management/status-card/StatusCard";
import Table from "@components/management/table/Table";
import PageHead from "components/shared/head/PageHead";
import { Button, Datepicker, Radio, Select, Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { GoDash } from "react-icons/go";
import { TbMoodEmpty } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const [totalDocuments, setTotalDocuments] = useState(0);
    const [totalPendingDocuments, setTotalPendingDocuments] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPendingReviews, setTotalPendingReviews] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [documentsByMonth, setDocumentsByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [usersByMonth, setUsersByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [documentsByCategory, setDocumentsByCategory] = useState([]);
    const [documentsByField, setDocumentsByField] = useState([]);

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
            link: "/admin/reviews",
        },
        {
            icon: "bx bx-time",
            count: totalPendingReviews,
            title: "Đánh giá đang chờ",
            link: "/admin/reviews",
        },
        {
            icon: "bx bx-user",
            count: totalUsers,
            title: "Người dùng",
            link: "/admin/users",
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

    useEffect(() => {
        getLatestUserList();
        getLatestDocumentList();
    }, []);

    useEffect(() => {
        getYearlyStatistics();
    }, [year]);

    useEffect(() => {
        getGeneralStatistics();
    }, [isGeneral, dateRange]);

    const getGeneralStatistics = async () => {
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
            const response = await getGeneralStatisticsForManager({
                params,
            });

            if (response.status === 200) {
                setTotalDocuments(response.data.totalDocuments);
                setTotalPendingDocuments(response.data.totalPendingDocuments);
                setTotalUsers(response.data.totalUsers);
                setTotalReviews(response.data.totalReviews);
                setTotalPendingReviews(response.data.totalPendingReviews);
                setDocumentsByCategory(response.data.documentsByCategory);
                setDocumentsByField(response.data.documentsByField);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getYearlyStatistics = async () => {
        try {
            const response = await getYearlyStatisticsForManager({
                params: { year: year },
            });

            if (response.status === 200) {
                setDocumentsByMonth(response.data.documentsByMonth);
                setUsersByMonth(response.data.usersByMonth);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getLatestUserList = async () => {
        try {
            const response = await getLatestUsersByOrganization();

            if (response.status === 200) {
                setLatestUsers(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    const getLatestDocumentList = async () => {
        try {
            const response = await getLatestDocumentsByOrganization();

            if (response.status === 200) {
                setLatestDocuments(response.data.content);
            }
        } catch (error) {
            navigate("/error-500");
        }
    };

    return (
        <>
            <PageHead title="Tổng quan - Quản lý" description="Tổng quan - learniverse & shariverse" url={window.location.href} origin="both" />

            <div className="space-y-5">
                <div className="row">
                    <h2 className="page-header px-[15px]">Tổng quan</h2>

                    <div className="flex items-center w-full px-[15px] mb-2">
                        <span className="whitespace-nowrap text-2xl font-medium">Sơ lược theo giai đoạn</span>
                        <span className="flex-grow border-t border-black"></span>
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

                                    <Button color="success" onClick={getGeneralStatistics}>
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full px-[15px] my-2">
                        <span className="whitespace-nowrap text-xl font-medium">Số lượng tổng quát</span>
                        <span className="flex-grow border-t border-black"></span>
                    </div>

                    <div className="flex w-full grid grid-cols-5 gap-y-5 mb-7">
                        {statusCardsForLibrary.map((item, index) => (
                            <div className="col-3 w-full" key={index}>
                                <StatusCard icon={item.icon} count={item.count} title={item.title} link={item.link} />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center w-full px-[15px] my-2">
                        <span className="whitespace-nowrap text-xl font-medium">Biểu đồ tổng quan</span>
                        <span className="flex-grow border-t border-black"></span>
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
                </div>

                <div className="row">
                    <div className="flex items-center w-full px-[15px] mb-2">
                        <span className="whitespace-nowrap text-2xl font-medium">Biểu đồ tổng quan theo từng năm</span>
                        <span className="flex-grow border-t border-black"></span>
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
                    </div>
                </div>

                <div className="row">
                    <div className="flex items-center w-full px-[15px] mb-2">
                        <span className="whitespace-nowrap text-2xl font-medium">Dữ liệu mới nhất trong tháng</span>
                        <span className="flex-grow border-t border-black"></span>
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
        </>
    );
};

export default Dashboard;
