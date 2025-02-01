import React, { useEffect, useState } from "react";
import { getDailyMarginSummary } from "../../services/margin";
import usePaginationAndSorting from "../../hooks/usePaginationAndSorting";
import "../../styles/SalesReport.css";
import Pagination from "../Date/Pagination";
import { formatNumber } from "../../utils/formatUtils";
import DateControls from "../Date/DateControls";

const MarginReport = () => {
    const [date, setDate] = useState(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday; // 기본값: 어제 날짜
    });

    const [data, setData] = useState([]);
    const { paginatedData, changeSort, changePage, totalPages, page, sortConfig } =
        usePaginationAndSorting({ data, itemsPerPage: 7 });

    // API 데이터 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDailyMarginSummary({ date: date.toISOString().split("T")[0] });
                setData(response.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [date]);

    const handlePrevDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        setDate(newDate);
    };

    // 날짜를 하루 후로 이동
    const handleNextDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        setDate(newDate);
    };

    return (
        <div className="sales-report">
            {/* 제목과 날짜 선택기를 한 줄로 배치 */}
            <div className="report-header">
                <h3 className="report-title">매출 보고서</h3>
                <DateControls
                    date={date}
                    onPrevDay={handlePrevDay}
                    onNextDay={handleNextDay}
                    onDateChange={(date) => setDate(date)}
                />
            </div>

            {/* 데이터가 없을 경우 안내 메시지 표시 */}
            {data.length === 0 ? (
                <div className="empty-message">
                    광고 보고서를 업로드 해주세요
                </div>
            ) : (
                <>
                    {/* 매출 테이블 */}
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th onClick={() => changeSort("campaignName")}>
                                    캠페인 이름 {sortConfig?.key === "campaignName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                </th>
                                <th onClick={() => changeSort("yesterdaySales")}>
                                    광고 마진 {sortConfig?.key === "yesterdaySales" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                </th>
                                <th onClick={() => changeSort("todaySales")}>
                                    순 이익 {sortConfig?.key === "todaySales" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.marProductName}</td>
                                    <td>{formatNumber(item.marAdMargin)}</td>
                                    <td>{formatNumber(Math.round(item.marNetProfit))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={changePage}
                    />
                </>
            )}
        </div>
    );
};

export default MarginReport;
