import React, { useEffect, useRef } from "react";

interface KakaoMapProps {
  keyword: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ keyword }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      if (!kakao || !kakao.maps) {
        setTimeout(initMap, 100);
        return;
      }

      kakao.maps.load(() => {
        if (!mapContainer.current || mapInstance.current) return;

        // 초기 접속 시 보여줄 임시 중심점 (위치 권한 거부 시 대비)
        const defaultPos = new kakao.maps.LatLng(37.245833, 127.056667); // 망포역
        // 지도 초기 값
        const options = {
          center: defaultPos, // 임시 중심점을 중심으로
          level: 3, // 확대 레벨
        };
        // 지도 생성하기
        const map = new kakao.maps.Map(mapContainer.current, options);
        // 지도 인스턴스 저장
        mapInstance.current = map;

        // 접속 즉시 브라우저 GPS로 실제 위치 파악
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const currentPos = new kakao.maps.LatLng(lat, lng);

              // 지도의 중심을 내 위치로 변경
              map.setCenter(currentPos);

              // 내 위치임을 알리는 마커(옵션)
              new kakao.maps.Marker({
                position: currentPos,
                map: map,
              });

              console.log("현재 위치로 중심점 변경 완료");
            },
            (error) => {
              console.error("위치 정보를 가져올 수 없습니다.", error);
            },
          );
        }
      });
    };
    initMap();
  }, []);

  // 검색어 변경 감지 로직
  useEffect(() => {
    const { kakao } = window as any;
    if (!mapInstance.current || !keyword || !kakao) return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(data[0].y, data[0].x);
        if (markerInstance.current) markerInstance.current.setMap(null);
        markerInstance.current = new kakao.maps.Marker({
          position: coords,
          map: mapInstance.current,
        });
        mapInstance.current.panTo(coords);
      }
    });
  }, [keyword]);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
};

export default KakaoMap;
