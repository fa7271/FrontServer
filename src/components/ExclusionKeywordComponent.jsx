import React, { useEffect } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import { ArrowDownUp } from 'lucide-react';

const ExclusionKeywordComponent = ({
    keywords,
    selectedKeywords,
    setSelectedKeywords,
    isAllSelected,
    setIsAllSelected,
    sortConfig,
    setSortConfig,
    loading,
    error,
}) => {
    useEffect(() => {
        // 키워드 가져오는 로직은 이제 부모에서 처리하므로 삭제
    }, []); // 더 이상 필요 없음

    const filteredKeywords = keywords
        .filter((item) => item.exclusionKeyword.includes("")) // 검색 필드 연결 필요
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const order = sortConfig.direction === "asc" ? 1 : -1;
            return a > b ? order : a < b ? -order : 0;
        });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleCheckboxChange = (keyword) => {
        setSelectedKeywords((prev) =>
            prev.includes(keyword)
                ? prev.filter((item) => item !== keyword)
                : [...prev, keyword]
        );
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedKeywords([]);
        } else {
            setSelectedKeywords(filteredKeywords.map((item) => item.exclusionKeyword));
        }
        setIsAllSelected(!isAllSelected);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="keyword-component">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("keyKeyword")}>
                            제외 키워드
                            <ArrowDownUp />
                        </th>
                        <th onClick={() => handleSort("keyImpressions")}>
                            등록 날짜
                            <ArrowDownUp />
                        </th>
                        <th>
                            <input
                                type="checkbox"
                                checked={isAllSelected && selectedKeywords.length === filteredKeywords.length}
                                onChange={handleSelectAll}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKeywords.map((keyword, index) => (
                        <tr key={index}>
                            <td>{keyword.exclusionKeyword}</td>
                            <td>{keyword.addTime}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.includes(keyword.exclusionKeyword)}
                                    onChange={() => handleCheckboxChange(keyword.exclusionKeyword)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExclusionKeywordComponent;
