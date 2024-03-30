import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Chart from "react-apexcharts";

import { useSelector } from "react-redux";

import StatusCard from "../../components/management/status-card/StatusCard";

import Table from "../../components/management/table/Table";

import { getLatestDocuments } from "../../api/main/documentAPI";
import { getGeneralStatistics } from "../../api/main/statisticsAPI";
import { getLatestUsers } from "../../api/main/userAPI";
import usePrivateAxios from "../../api/usePrivateAxios";

const lineOptions = {
    color: ["#6ab04c", "#2980b9"],
    chart: {
        background: "transparent",
    },
    stroke: {
        curve: "smooth",
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

// const orderStatus = {
//     shipping: "primary",
//     pending: "warning",
//     paid: "success",
//     refund: "danger",
// };

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
    const [totalUsers, setTotalUsers] = useState(0);
    const [latestUsers, setLatestUsers] = useState([]);
    const [latestDocuments, setLatestDocuments] = useState([]);
    const [documentsByMonth, setDocumentsByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [usersByMonth, setUsersByMonth] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [documentsByCategory, setDocumentsByCategory] = useState([]);
    const [documentsByField, setDocumentsByField] = useState([]);
    const [documentsByOrganization, setDocumentsByOrganization] = useState([]);

    const statusCards = [
        {
            icon: "bx bx-user",
            count: totalUsers,
            title: "Người dùng",
            link: "/admin/users",
        },
        {
            icon: "bx bx-bar-chart-alt-2",
            count: 0,
            title: "Lượt truy cập",
            link: "#",
        },
        {
            icon: "bx bx-file",
            count: totalDocuments,
            title: "Tài liệu",
            link: "/admin/documents",
        },
        {
            icon: "bx bx-time-five",
            count: totalPendingDocuments,
            title: "Đang chờ duyệt",
            link: "/admin/documents/pending",
        },
    ];

    const lineSeries = [
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
        getStatistics();
        getLatestUserList();
        getLatestDocumentList();
    }, []);

    const getStatistics = async () => {
        try {
            const response = await getGeneralStatistics();

            if (response.status === 200) {
                setTotalDocuments(response.data.totalDocuments);
                setTotalPendingDocuments(response.data.totalPendingDocuments);
                setTotalUsers(response.data.totalUsers);
                setDocumentsByMonth(response.data.documentsByMonth);
                setDocumentsByCategory(response.data.documentsByCategory);
                setDocumentsByField(response.data.documentsByField);
                setDocumentsByOrganization(response.data.documentsByOrganization);
                setUsersByMonth(response.data.usersByMonth);
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
        <div>
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="flex">
                    <div className="col-6">
                        <div className="row">
                            {statusCards.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard icon={item.icon} count={item.count} title={item.title} link={item.link} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="col-6">
                        <div className="card full-height">
                            {/* chart */}
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
                                series={lineSeries}
                                type="line"
                                height="100%"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="col-4 w-full">
                        <div className="card full-height w-full">
                            {/* chart */}
                            <Chart
                                options={
                                    themeReducer === "theme-mode-dark"
                                        ? {
                                              ...pieOptions,
                                              theme: { mode: "dark", palette: "palette5" },
                                              labels: Object.keys(documentsByCategory),
                                              title: {
                                                  ...pieOptions.title,
                                                  text: "Tài liệu theo danh mục",
                                              },
                                          }
                                        : {
                                              ...pieOptions,
                                              theme: { mode: "light", palette: "palette5" },
                                              labels: Object.keys(documentsByCategory),
                                              title: {
                                                  ...pieOptions.title,
                                                  text: "Tài liệu theo danh mục",
                                              },
                                          }
                                }
                                series={Object.values(documentsByCategory)}
                                type="donut"
                                height="300px"
                            />
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full">
                            {/* chart */}
                            <Chart
                                options={
                                    themeReducer === "theme-mode-dark"
                                        ? {
                                              ...pieOptions,
                                              theme: { mode: "dark", palette: "palette8" },
                                              labels: Object.keys(documentsByField),
                                              title: {
                                                  ...pieOptions.title,
                                                  text: "Tài liệu theo lĩnh vực",
                                              },
                                          }
                                        : {
                                              ...pieOptions,
                                              theme: { mode: "light", palette: "palette8" },
                                              labels: Object.keys(documentsByField),
                                              title: {
                                                  ...pieOptions.title,
                                                  text: "Tài liệu theo lĩnh vực",
                                              },
                                          }
                                }
                                series={Object.values(documentsByField)}
                                type="polarArea"
                                height="300px"
                            />
                        </div>
                    </div>

                    <div className="col-4 w-full">
                        <div className="card full-height w-full">
                            {/* chart */}
                            <Chart
                                options={
                                    themeReducer === "theme-mode-dark"
                                        ? {
                                              ...pieOptions,
                                              theme: { mode: "dark" },
                                              labels: Object.keys(documentsByOrganization),
                                              title: {
                                                  ...pieOptions.title,
                                                  text: "Tài liệu theo trường",
                                              },
                                          }
                                        : {
                                              ...pieOptions,
                                              theme: { mode: "light" },
                                              labels: Object.keys(documentsByOrganization),
                                              title: {
                                                  ...pieOptions.title,
                                                  text: "Tài liệu theo trường",
                                              },
                                          }
                                }
                                series={Object.values(documentsByOrganization)}
                                type="pie"
                                height="300px"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="col-4">
                        <div className="card">
                            <div className="card__header">
                                <h3>Người dùng mới nhất</h3>
                            </div>
                            <div className="card__body overflow-x-auto">
                                <Table headData={latestUserHead} renderHead={(item, index) => renderLatestUserHead(item, index)} bodyData={latestUsers} renderBody={(item, index) => renderLatestUserBody(item, index)} />
                            </div>
                            <div className="card__footer">
                                <Link to="/admin/users/latest" className="font-bold">
                                    Xem tất cả
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="card">
                            <div className="card__header">
                                <h3>Tài liệu mới nhất</h3>
                            </div>
                            <div className="card__body overflow-x-auto">
                                <Table headData={latestDocumentHead} renderHead={(item, index) => renderLatestDocumentHead(item, index)} bodyData={latestDocuments} renderBody={(item, index) => renderLatestDocumentBody(item, index)} />
                            </div>
                            <div className="card__footer">
                                <Link to="/admin/documents/latest" className="font-bold">
                                    Xem tất cả
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
