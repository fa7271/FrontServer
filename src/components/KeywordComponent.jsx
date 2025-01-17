import React from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import "../styles/Table.css";
import SortableHeader from '../components/SortableHeader';

const KeywordComponent = ({ selectedKeywords, setSelectedKeywords, keywords, loading, error }) => {
    const filteredKeywords = keywords; // 필터링 로직은 필요에 따라 추가

    const handleSort = (key) => {
        // 정렬 로직
    };

    const handleCheckboxChange = (item) => {
        const keywordData = {
            keyword: item.keyKeyword,
            bid: item.keyCpc // keyBid를 keyCpc로 설정
        };

        setSelectedKeywords((prev) => {
            if (prev.some((kw) => kw.keyword === keywordData.keyword)) {
                return prev.filter((kw) => kw.keyword !== keywordData.keyword);
            } else {
                return [...prev, keywordData];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedKeywords.length === filteredKeywords.length) {
            // 전체 선택 해제
            setSelectedKeywords([]);
        } else {
            // 전체 선택
            const allKeywords = filteredKeywords.map(item => ({
                keyword: item.keyKeyword,
                bid: item.keyCpc
            }));
            setSelectedKeywords(allKeywords);
        }
    };

    if (loading) return <div>Loading...</div>; // 로딩 상태 표시
    if (error) return <div>{error}</div>; // 에러 상태 표시

    return (
        <div className="keyword-component">
            <table>
                <thead>
                    <tr>
                        <SortableHeader label="키워드" sortKey="keyKeyword" onSort={handleSort} />
                        <SortableHeader label="노출" sortKey="keyImpressions" onSort={handleSort} />
                        <SortableHeader label="클릭" sortKey="keyClicks" onSort={handleSort} />
                        <SortableHeader label="클릭률" sortKey="keyClickRate" onSort={handleSort} />
                        <SortableHeader label="주문" sortKey="keyTotalSales" onSort={handleSort} />
                        <SortableHeader label="전환율" sortKey="keyCvr" onSort={handleSort} />
                        <SortableHeader label="CPC" sortKey="keyCpc" onSort={handleSort} />
                        <SortableHeader label="광고비" sortKey="keyAdcost" onSort={handleSort} />
                        <SortableHeader label="광고매출" sortKey="keyAdsales" onSort={handleSort} />
                        <SortableHeader label="ROAS" sortKey="keyRoas" onSort={handleSort} />
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedKeywords.length === filteredKeywords.length}
                                onChange={handleSelectAll} // 전체 선택/해제 로직
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKeywords.map((item, index) => (
                        <tr key={index}>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>
                                {item.keyKeyword}
                                {item.keyBidFlag && <span className="badge">Bid</span>} {/* 뱃지 추가 */}
                            </td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyImpressions}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyClicks}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyClickRate}%</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyTotalSales}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyCvr}%</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyCpc}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyAdcost}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyAdsales}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyRoas}%</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.some(kw => kw.keyword === item.keyKeyword)} // keyword로 체크 여부 확인
                                    onChange={() => handleCheckboxChange(item)} // item을 인자로 전달
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KeywordComponent;
