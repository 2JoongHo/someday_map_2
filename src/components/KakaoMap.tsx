import React, { useEffect, useRef } from "react";

// Props 규격을 키워드 방식에서 선택된 장소 객체 방식으로 변경
interface KakaoMapProps {
  selectedPlace: any;
  moveToMine: number;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ selectedPlace, moveToMine }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  // 마커 인스턴스 분리 관리
  const searchMarker = useRef<any>(null); // 검색 결과 마커
  const myLocationMarker = useRef<any>(null); // 내 위치 마커

  // 내 위치 이동 완료 여부 플래그
  const isInitialPosSet = useRef(false);
  // 인포윈도우 인스턴스 관리 Ref
  const infoWindowInstance = useRef<any>(null);

  // 지도 최초 초기화
  useEffect(() => {
    const { kakao } = window as any;
    if (!mapContainer.current || !kakao) return;

    kakao.maps.load(() => {
      if (mapInstance.current) return;

      const options = {
        center: new kakao.maps.LatLng(37.245833, 127.056667), // 망포역
        level: 3,
      };
      mapInstance.current = new kakao.maps.Map(mapContainer.current, options);

      // 지도 생성 직후 내 위치 조회 시작
      fetchMyLocation();
    });
  }, []);

  // moveToMine 신호 감지
  useEffect(() => {
    if (moveToMine > 0) {
      fetchMyLocation();
    }
  }, [moveToMine]);

  // 내 위치 가져오기 및 마커 표시
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

          // 앱 실행 후 최초 1회만 내 위치로 중심 이동
          // 사용자가 그 사이 이미 장소를 선택했다면 이동하지 않음
          if (infoWindowInstance.current) infoWindowInstance.current.close();

          isInitialPosSet.current = true;
        },
        (error) => console.error("위치 획득 실패:", error)
      );
    }
  };

  // 선택된 장소로 지도 이동 및 마커 표시
  useEffect(() => {
    const { kakao } = window as any;
    // 선택된 장소가 없거나 지도가 아직 안 만들어졌으면 중단
    if (!mapInstance.current || !selectedPlace || !kakao) return;

    const coords = new kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);

    // 기존 열려있던 인포윈도우가 있다면 닫기
    if (infoWindowInstance.current) {
      infoWindowInstance.current.close();
    }

    // 검색 마커 업데이트
    if (searchMarker.current) searchMarker.current.setMap(null);
    searchMarker.current = new kakao.maps.Marker({
      position: coords,
      map: mapInstance.current,
    });

    // 인포윈도우 생성(장소이름, 주소)
    const content = `
        <div style="padding:10px; min-width:150px; border-radius:8px;">
        <div style="font-weight:bold; margin-bottom:5px; color:#333;">${selectedPlace.place_name}</div> 
        <div style="font-size:12px; color:#666;">${selectedPlace.address_name}</div>
        </div>
    `;

    infoWindowInstance.current = new kakao.maps.InfoWindow({
      content: content,
    });

    // 마커 위에 인포윈도우 열기
    infoWindowInstance.current.open(mapInstance.current, searchMarker.current);

    // 해당 좌표로 부드럽게 이동
    mapInstance.current.panTo(coords);

    // 사용자가 장소를 눌러 이동했으므로, 이후 GPS 응답에 의한 자동 이동은 차단
    isInitialPosSet.current = true;
  }, [selectedPlace]); // selectedPlace가 변경될 때마다 실행

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
};

export default KakaoMap;
