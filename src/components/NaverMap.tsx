import React, { useEffect, useRef } from "react";

const NaverMap: React.FC = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // 1. 0.5초 정도 의도적인 지연을 주어 스크립트 로드 시점과 맞춥니다.
    const initTimer = setTimeout(() => {
      const { naver } = window;

      if (!mapElement.current || !naver || !naver.maps || mapInstance.current)
        return;

      const defaultLocation = new naver.maps.LatLng(37.245833, 127.056667);
      const mapOptions = {
        center: defaultLocation,
        zoom: 15,
        zoomControl: true,
      };

      // 지도 객체 생성
      mapInstance.current = new naver.maps.Map(mapElement.current, mapOptions);

      // 2. 위치 정보는 지도가 확실히 생성된 후에 별도로 요청합니다.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentPosition = new naver.maps.LatLng(latitude, longitude);

            if (mapInstance.current) {
              mapInstance.current.setCenter(currentPosition);
              new naver.maps.Marker({
                position: currentPosition,
                map: mapInstance.current,
                icon: {
                  content:
                    '<div style="width:12px; height:12px; background:red; border-radius:50%; border:2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
                  anchor: new naver.maps.Point(6, 6),
                },
              });
            }
          },
          (error) => console.error("위치 획득 실패:", error),
          { enableHighAccuracy: true, timeout: 5000 },
        );
      }
    }, 500); // 0.5초 지연

    return () => clearTimeout(initTimer);
  }, []);

  return (
    <div
      id="map"
      ref={mapElement}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        backgroundColor: "#eee",
      }}
    />
  );
};

export default NaverMap;
