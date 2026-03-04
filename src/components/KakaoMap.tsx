// 카카오 맵 불러오기

import React, { useEffect, useRef } from "react";

const KakaoMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    const { kakao } = window as any;

    // 카카오 객체 확인 (없으면 로드될 때까지 0.1초마다 재시도)
    const initMap = () => {
      if (kakao && kakao.maps) {
        kakao.maps.load(() => {
          if (!mapContainer.current || mapInstance.current) return;

          const options = {
            center: new kakao.maps.LatLng(37.245833, 127.056667), // 망포역
            level: 3,
          };

          try {
            // 지도 생성
            const map = new kakao.maps.Map(mapContainer.current, options);
            mapInstance.current = map;
            console.log("카카오 지도 생성 성공!");

            // 현재 위치 표시 로직
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  const locPosition = new kakao.maps.LatLng(lat, lng);

                  if (mapInstance.current) {
                    mapInstance.current.setCenter(locPosition);
                    new kakao.maps.Marker({
                      map: mapInstance.current,
                      position: locPosition,
                    });
                  }
                },
                (error) => console.error("위치 획득 실패:", error)
              );
            }
          } catch (e) {
            console.error("지도 생성 중 에러:", e);
          }
        });
      } else {
        // 객체가 아직 없으면 100ms 후 다시 시도
        setTimeout(initMap, 100);
      }
    };

    initMap();
  }, []);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
        backgroundColor: "#eee",
      }}
    />
  );
};

export default KakaoMap;
