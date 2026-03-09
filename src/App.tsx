import React, { useEffect, useState } from "react";
import "./App.css";
import locationIcon from "./assets/icons/locationIcon.svg";
import Header from "./components/Header"; // 헤더 컴포넌트
import KakaoMap from "./components/KakaoMap"; // 카카오맵 컴포넌트
import ModalLayout from "./modals/ModalLayout"; // 모달 레이아웃 컴포넌트
import PlaceModal from "./modals/PlaceModal"; // 내 장소 모달 컴포넌트
import SearchModal from "./modals/SearchModal"; // 검색창 모달 컴포넌트
import SettingsModal from "./modals/SettingsModal"; // 설정 모달 컴포넌트

interface SavedPlace {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// 두 좌표 사이의 거리를 미터(m) 단위로 구하는 함수
const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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

  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => {
    // 앱 시작 시 로컬스토리지에서 기존 데이터 불러오기
    const saved = localStorage.getItem("my-places");
    return saved ? JSON.parse(saved) : [];
  });

  // 알림 반경 (기본 100m)
  const [alertRadius, setAlertRadius] = useState(100);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 사용자의 위치를 계속 추적
  useEffect(() => {
    if (!navigator.geolocation) return;

    // watchPosition은 위치가 바뀔 때마다 실행
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setCurrentLocation({ lat, lng });

        // 내 위치가 바뀔 때마다 저장된 장소들과 거리 비교
        savedPlaces.forEach((place) => {
          const distance = getDistance(lat, lng, place.lat, place.lng);

          if (distance <= alertRadius) {
            console.log(
              `${place.name}이(가) ${Math.round(distance)}m 거리에 있습니다!`,
            );
          }
        });
      },
      (error) => console.error("위치 추적 오류:", error),
      {
        enableHighAccuracy: true, // 높은 정확도 (GPS 사용)
        maximumAge: 0,
        timeout: 5000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId); // 컴포넌트 언마운트 시 감시 종료
  }, [savedPlaces, alertRadius]); // 저장된 장소가 바뀌거나 반경 설정이 바뀌면 재설정

  // 장소 추가 함수
  const handleSavePlace = (place: Omit<SavedPlace, "id">) => {
    const newPlace = { ...place, id: Date.now() }; // 고유 ID 부여
    setSavedPlaces((prev) => [...prev, newPlace]);
    alert("내 장소에 저장되었습니다!");
  };

  // 장소 삭제 함수
  const handleDeletePlace = (id: number) => {
    if (window.confirm("이 장소를 삭제할까요?")) {
      setSavedPlaces((prev) => prev.filter((place) => place.id !== id));
    }
  };

  // 데이터가 바뀔 때마다 로컬스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem("my-places", JSON.stringify(savedPlaces));
  }, [savedPlaces]);

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
        <KakaoMap
          selectedPlace={selectedPlace}
          moveToMine={moveToMine}
          onSave={handleSavePlace} // 함수 전달
          savedPlaces={savedPlaces} // 장소 목록 전달
        />
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
          <PlaceModal
            places={savedPlaces}
            onSelect={(place) => {
              setSelectedPlace({
                place_name: place.name,
                address_name: place.address,
                x: place.lng,
                y: place.lat,
              });
              closeModal();
            }}
            onDelete={handleDeletePlace}
          />
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
