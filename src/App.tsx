import React, { useState } from "react";
import "./App.css";
import locationIcon from "./assets/icons/locationIcon.svg";
import Header from "./components/Header"; // 헤더 컴포넌트
import KakaoMap from "./components/KakaoMap"; // 카카오맵 컴포넌트
import ModalLayout from "./modals/ModalLayout"; // 모달 레이아웃 컴포넌트
import PlaceModal from "./modals/PlaceModal"; // 내 장소 모달 컴포넌트
import SearchModal from "./modals/SearchModal"; // 검색창 모달 컴포넌트
import SettingsModal from "./modals/SettingsModal"; // 설정 모달 컴포넌트

const App: React.FC = () => {
  // 현재 활성화된 모달 상태 관리(검색, 장소, 설정)
  const [activeModal, setActiveModal] = useState<
    "search" | "place" | "settings" | null
  >(null);

  // 모달을 닫는 공통 함수
  const closeModal = () => setActiveModal(null);

  // 장소를 지도로 넘겨주는 상태
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  // 내 위치로 이동신호 보내는 상태
  const [moveToMine, setMoveToMine] = useState<number>(0);

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
        {/* 지도는 키워드를 계속 보게함 */}
        <KakaoMap selectedPlace={selectedPlace} moveToMine={moveToMine} />
        <button
          className="location-btn"
          onClick={() => setMoveToMine((prev) => prev + 1)}
        >
          <img src={locationIcon} alt="내 위치" />
        </button>
      </main>

      {/* 모달 */}
      {/* 장소 검색 모달 */}
      {activeModal === "search" && (
        <ModalLayout title="장소 검색" onClose={closeModal}>
          <SearchModal
            onSelectPlace={(place) => {
              setSelectedPlace(place);
              closeModal();
            }}
          />
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
