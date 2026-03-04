import React, { useState } from "react";
import "./App.css";
import locationIcon from "./assets/icons/locationIcon.svg";
import Header from "./components/Header";
import KakaoMap from "./components/KakaoMap";

const App: React.FC = () => {
  // 현재 활성화된 모달 상태 관리(검색, 장소, 설정)
  const [activeModal, setActiveModal] = useState<
    "search" | "place" | "settings" | null
  >(null);
  return (
    <div className="App">
      {/* 헤더 */}
      <Header
        onOpenSearch={() => setActiveModal("search")}
        onOpenPlace={() => setActiveModal("place")}
        onOpenSettings={() => setActiveModal("settings")}
      />
      {/* 지도 */}
      <main style={{ flex: 1, position: "relative" }}>
        <KakaoMap />
        <button
          className="location-btn"
          onClick={() => setActiveModal("place")}
        >
          <img src={locationIcon} alt="내 위치" />
        </button>
      </main>
    </div>
  );
};
export default App;
