import React, { useEffect, useRef } from "react";

const KakaoMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null); // 지도 객체 보관용
  const markerInstance = useRef<any>(null); // 단일 마커 핸들링용

  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;

      // SDK 로드 대기 (Polling)
      if (!kakao || !kakao.maps) {
        setTimeout(initMap, 100);
        return;
      }

      kakao.maps.load(() => {
        // 중복 초기화 방지
        if (!mapContainer.current || mapInstance.current) return;

        const options = {
          center: new kakao.maps.LatLng(37.245833, 127.056667), // 망포역
          level: 3,
        };

        const map = new kakao.maps.Map(mapContainer.current, options);
        mapInstance.current = map;

        // 장소 검색 서비스 객체 초기화
        const ps = new kakao.maps.services.Places();

        // 키워드 검색 및 마커 업데이트 로직
        const searchPlace = (keyword: string) => {
          ps.keywordSearch(keyword, (data: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(data[0].y, data[0].x);

              // 마커 싱글톤 유지 (기존 마커 제거 후 갱신)
              if (markerInstance.current) markerInstance.current.setMap(null);

              markerInstance.current = new kakao.maps.Marker({
                position: coords,
                map: map,
              });

              // 결과 위치로 부드러운 시점 이동
              map.panTo(coords);

              // Debug: 검색 결과 상호/주소 확인
              console.log(`[Search Success] ${data[0].place_name}`);
            } else {
              alert("검색 결과가 없습니다.");
            }
          });
        };

        // TODO: Header 검색창 UI 연결 시 제거 예정
        setTimeout(() => searchPlace("스타벅스 망포DT점"), 3000);
      });
    };

    initMap();
  }, []);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
};

export default KakaoMap;
