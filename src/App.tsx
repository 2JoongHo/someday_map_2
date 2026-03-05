import React, { useState } from "react";
import "./App.css";
import locationIcon from "./assets/icons/locationIcon.svg";
import Header from "./components/Header";
import KakaoMap from "./components/KakaoMap";
import ModalLayout from "./modals/ModalLayout";
import SearchModal from "./modals/SearchModal";
import PlaceModal from "./modals/PlaceModal";
import SettingsModal from "./modals/SettingsModal";

const App: React.FC = () => {
  // 현재 활성화된 모달 상태 관리(검색, 장소, 설정)
  const [activeModal, setActiveModal] = useState<
    "search" | "place" | "settings" | null
  >(null);

  // 모달을 닫는 공통 함수
  const closeModal = () => setActiveModal(null);

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
        <KakaoMap keyword="" />
        <button
          className="location-btn"
          onClick={() => setActiveModal("place")}
        >
          <img src={locationIcon} alt="내 위치" />
        </button>
      </main>

      {/* 모달 */}
      {/* 장소 검색 모달 */}
      {activeModal === "search" && (
        <ModalLayout title="장소 검색" onClose={closeModal}>
          <SearchModal />
        </ModalLayout>
      )}

      {/* 내 장소 리스트 모달 */}
      {activeModal === "place" && (
        <ModalLayout title="내 장소" onClose={closeModal}>
          <PlaceModal />
        </ModalLayout>
      )}

      {/* 설정 모달 */}
      {activeModal === "settings" && (
        <ModalLayout title="설정" onClose={closeModal}>
          <SettingsModal />
        </ModalLayout>
      )}
    </div>
  );
};
export default App;
