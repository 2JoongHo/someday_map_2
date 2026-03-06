// 검색 모달 컴포넌트

import React, { useState } from "react";

interface SearchModalProps {
  onSelectPlace: (place: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onSelectPlace }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { kakao } = window as any;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        setResults(data); // 검색 결과 리스트 저장
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="장소 검색"
        />
        <button type="submit">검색</button>
      </form>

      <ul style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
        {results.map((place, idx) => (
          <li
            key={idx}
            onClick={() => onSelectPlace(place)}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{place.place_name}</strong>
            <p style={{ fontSize: "12px", color: "#666" }}>
              {place.address_name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchModal;
