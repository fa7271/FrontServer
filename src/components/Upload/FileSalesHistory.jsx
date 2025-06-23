import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHistory } from "../../services/file";
import { uploadFile3 } from "../../services/pythonapi";
import FileHistoryModal from './FileHistoryModal';

export default function FileSalesHistory() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [history, setHistory] = useState({
        advertisingReport: [],
        netSalesReport: {},
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState("");
    const [modalFiles, setModalFiles] = useState([]);

    const formatDate = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;

    const getRange = (baseDate) => {
        const y = baseDate.getFullYear();
        const m = baseDate.getMonth();
        return {
            startDate: formatDate(new Date(y, m, 1)),
            endDate: formatDate(new Date(y, m + 2, 0)),
        };
    };

    const reloadHistory = useCallback(() => {
        const { startDate, endDate } = getRange(currentDate);
        getHistory({ startDate, endDate })
            .then((res) => {
                const data = res.data ?? res;
                setHistory({
                    advertisingReport: data.advertisingReport || [],
                    netSalesReport: data.netSalesReport || {},
                });
            })
            .catch(console.error);
    }, [currentDate]);

    useEffect(() => {
        reloadHistory();
    }, [reloadHistory]);

    const getCalendarDays = (year, month) => {
        const first = new Date(year, month, 1);
        const start = new Date(first);
        start.setDate(first.getDate() - first.getDay());
        return Array.from({ length: 42 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const getFlags = (date) => {
        const key = formatDate(date);
        return {
            isAdv: history.advertisingReport.includes(key),
            isNet: history.netSalesReport[key] != null,
        };
    };

    const getFilesForDate = (date) => {
        const key = formatDate(date);
        const out = [];
        const netDto = history.netSalesReport[key];
        if (netDto) out.push({ type: "순매출 보고서", ...netDto });
        return out;
    };

    const handleDropOnDate = async (e, date) => {
        e.preventDefault();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);
        if (target > today) {
            alert("미래 날짜에는 업로드할 수 없습니다.");
            return;
        }
        const dropped = Array.from(e.dataTransfer.files);
        if (dropped.length === 0) return;
        if (dropped.length > 1) {
            alert("한 번에 하나의 파일만 업로드할 수 있습니다.");
            return;
        }
        const nameList = dropped.map(f => f.name).join("\n");
        if (!window.confirm(`${formatDate(date)}에 업로드할까요?\n\n${nameList}`)) return;
        try {
            const file = dropped[0];
            const resp = await uploadFile3(file, formatDate(date), () => { });
            if (resp.status === 200) {
                alert("업로드 성공!");
                reloadHistory();
            } else throw new Error();
        } catch {
            alert("업로드에 실패했습니다.");
        }
    };

    const navigateMonth = (dir) =>
        setCurrentDate(d => {
            const nd = new Date(d);
            nd.setMonth(d.getMonth() + dir);
            return nd;
        });

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    const Calendar = ({ offset }) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + offset;
        const days = getCalendarDays(year, month);
        const title = new Date(year, month, 1);

        return (
            <div className="flex-1 min-w-0 max-w-full bg-white rounded-lg p-4">
                <div className="text-center font-semibold text-gray-800 mb-4">
                    {title.getFullYear()}년 {monthNames[title.getMonth()]}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(d => (
                        <div key={d} className="text-center text-sm text-gray-500 p-2">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                        const inMonth = day.getMonth() === title.getMonth();
                        const isToday = formatDate(day) === formatDate(new Date());
                        const flags = getFlags(day);
                        const clickable = flags.isNet;
                        return (
                            <div
                                key={idx}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => handleDropOnDate(e, day)}
                                onClick={() => {
                                    if (!clickable) return;
                                    setModalDate(formatDate(day));
                                    setModalFiles(getFilesForDate(day));
                                    setIsModalOpen(true);
                                }}
                                className={`
                                    relative group h-12 flex flex-col items-center justify-center text-sm rounded-md
                                    ${inMonth ? "text-gray-900" : "text-gray-300"}
                                    ${isToday ? "bg-blue-100 font-semibold" : "hover:bg-gray-50"}
                                    ${clickable ? "cursor-pointer hover:bg-gray-50" : ""}
                                `}
                            >
                                <span>{day.getDate()}</span>
                                <div className="flex gap-1 mt-2">
                                    {flags.isAdv && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                                    {flags.isNet && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* overflow-hidden 추가 */}
            <div className="file-card file-sales-history overflow-hidden">
                <div className="file-sales-header">
                    <div className="legend flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <span>광고 보고서</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span>순매출 보고서</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xl font-semibold -mt-1">
                        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-200 rounded-md">
                            <ChevronLeft size={20} />
                        </button>
                        {currentDate.getFullYear()}년
                        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-200 rounded-md">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                {/* 내부 스크롤이 필요하면 overflow-auto */}
                <div className="calendars flex overflow-x-auto">
                    <Calendar offset={0} />
                </div>
            </div>

            <FileHistoryModal
                isOpen={isModalOpen}
                date={modalDate}
                files={modalFiles}
                onClose={() => setIsModalOpen(false)}
                onDeleted={(deletedId) => {
                    // 1) 모달 닫기
                    setIsModalOpen(false);
                    // 2) 리스트에서 해당 항목 제거 (선택 사항)
                    setModalFiles(prev => prev.filter(f => f.id !== deletedId));
                    // 3) 전체 히스토리 리로드
                    reloadHistory();
                }}
            />
        </>
    );
}
