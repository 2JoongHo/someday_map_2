import React, { useEffect, useRef } from "react";
import "./KakaoMap.css";

interface KakaoMapProps {
  selectedPlace: any;
  moveToMine: number;
  onSave: (place: any) => void;
  savedPlaces: any[];
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  selectedPlace,
  moveToMine,
  onSave,
  savedPlaces,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  // 마커 인스턴스 분리 관리
  const searchMarker = useRef<any>(null); // 검색 결과 마커
  const myLocationMarker = useRef<any>(null); // 내 위치 마커
  const infoWindowInstance = useRef<any>(null); // 정보창

  // 저장된 장소의 마커 담아둘 배열
  const permanentMarkers = useRef<any[]>([]);

  // 내 위치 이동 완료 여부 플래그
  const isInitialPosSet = useRef(false);

  // 마커, 인포윈도우를 표시
  const displayMarker = (
    position: any,
    placeName: string, // 초기 제목
    addressName: string,
  ) => {
    const { kakao } = window as any;

    // 기존 마커 및 인포윈도우 제거
    if (searchMarker.current) searchMarker.current.setMap(null);
    if (infoWindowInstance.current) infoWindowInstance.current.close();

    // 새로운 마커 생성
    searchMarker.current = new kakao.maps.Marker({
      position: position,
      map: mapInstance.current,
    });

    // 인포윈도우 내용 구성 (입력창 + 저장 버튼 포함)
    const content = `
        <div class="infowindow-container">
          <div class="infowindow-input-wrapper">
            <input type="text" id="custom-place-name" 
                  class="infowindow-input"
                  value="${placeName}" 
                  placeholder="장소 이름을 입력하세요" />
          </div>
          <div class="infowindow-address">${addressName}</div>
          <button id="save-location-btn" class="infowindow-save-btn">
            이 이름으로 저장하기
          </button>
        </div>
    `;

    infoWindowInstance.current = new kakao.maps.InfoWindow({
      content: content,
      removable: true, // 닫기 버튼(X) 활성화
    });

    // 마커 위에 인포윈도우 열기
    infoWindowInstance.current.open(mapInstance.current, searchMarker.current);

    // 인포윈도우 내부의 DOM 조작 (이벤트 바인딩)
    // 인포윈도우가 DOM에 실제로 그려지는 시간을 벌기 위해 setTimeout 사용
    setTimeout(() => {
      const saveBtn = document.getElementById("save-location-btn");
      const nameInput = document.getElementById(
        "custom-place-name",
      ) as HTMLInputElement;

      if (saveBtn && nameInput) {
        saveBtn.onclick = () => {
          onSave({
            name: nameInput.value,
            address: addressName,
            lat: position.getLat(),
            lng: position.getLng(),
          });
          if (infoWindowInstance.current) infoWindowInstance.current.close();
        };
      }
    }, 100);
  };

  // 지정된 장소는 지도에 마커표기
  useEffect(() => {
    const { kakao } = window as any;
    if (!mapInstance.current || !kakao) return;

    // 기존 그려진 마커를 삭제
    permanentMarkers.current.forEach((marker) => marker.setMap(null));
    permanentMarkers.current = []; // 배열 바꾸기

    savedPlaces.forEach((place) => {
      // 마커 생성
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(place.lat, place.lng),
        map: mapInstance.current,
        title: place.name,
      });

      // 마커 클릭시 정보창 보여주기
      kakao.maps.event.addListener(marker, "click", () => {
        // 기존 정보창이 있다면 닫기
        if (infoWindowInstance.current) infoWindowInstance.current.close();

        // 저장 된 이름, 주소 정보창
        const content = `
          <div class="infowindow-container">
            <div class="infowindow-item-name">${place.name}</div>
            <div class="infowindow-address">${place.address}</div>
          </div>
        `;

        infoWindowInstance.current = new kakao.maps.InfoWindow({
          content: content,
          removable: true,
        });

        infoWindowInstance.current.open(mapInstance.current, marker);
      });

      // 추후 삭제 가능하게 Ref 배열에 보관
      permanentMarkers.current.push(marker);
    });
  }, [savedPlaces]); // 저장 목록이 바뀔 때마다 실행

  // 내 위치 가져오기
  const fetchMyLocation = () => {
    const { kakao } = window as any;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentPos = new kakao.maps.LatLng(lat, lng);
          // 내 위치 마커 생성/갱신
          if (!myLocationMarker.current) {
            myLocationMarker.current = new kakao.maps.Marker({
              position: currentPos,
              map: mapInstance.current,
            });
          } else {
            myLocationMarker.current.setPosition(currentPos);
          }
          // 버튼 클릭이나 초기 설정 안될 경우에만 이동
          mapInstance.current.setCenter(currentPos);
          // 내 위치로 이동 시 레벨 3으로 확대
          mapInstance.current.setLevel(3);
          // 앱 실행 후 최초 1회만 내 위치로 중심 이동
          // 사용자가 그 사이 이미 장소를 선택했다면 이동하지 않음
          if (infoWindowInstance.current) infoWindowInstance.current.close();
          isInitialPosSet.current = true;
        },
        (error) => console.error("위치 획득 실패:", error),
      );
    }
  };

  // 지도 최초 초기화
  useEffect(() => {
    const { kakao } = window as any;
    if (!mapContainer.current || !kakao) return;

    kakao.maps.load(() => {
      // 중복 생성 방지
      if (mapInstance.current) return;
      // 초기 지도 설정
      const options = {
        center: new kakao.maps.LatLng(37.245833, 127.056667), // 망포역
        level: 3,
      };
      // 지도 생성
      const map = new kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      const geocoder = new kakao.maps.services.Geocoder();

      // 지도 클릭 시 주소 변환 및 입력창 띄우기
      kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;

        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              const addressName = result[0].road_address
                ? result[0].road_address.address_name
                : result[0].address.address_name;

              // 기본 제목을 '선택한 위치'로 설정하여 표시
              displayMarker(latlng, "선택한 위치", addressName);
            }
          },
        );
      });
      // 지도 생성 직후 내 위치 조회 시작
      fetchMyLocation();
    });
  }, []);

  // 내 위치 버튼 신호 감지
  useEffect(() => {
    if (moveToMine > 0) fetchMyLocation();
  }, [moveToMine]);

  // 검색 결과 반영
  useEffect(() => {
    const { kakao } = window as any;
    // 선택된 장소가 없거나 지도가 아직 안 만들어졌으면 중단
    if (!mapInstance.current || !selectedPlace || !kakao) return;

    const coords = new kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);

    // 검색된 실제 장소명을 입력창의 기본값으로 전달
    displayMarker(coords, selectedPlace.place_name, selectedPlace.address_name);
    // 레벨 3으로 확대
    mapInstance.current.setLevel(3);
    // 해당 좌표로 이동
    mapInstance.current.setCenter(coords);

    // 사용자가 장소를 눌러 이동했으므로, 이후 GPS 응답에 의한 자동 이동은 차단
    isInitialPosSet.current = true;
  }, [selectedPlace]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
};

export default KakaoMap;
