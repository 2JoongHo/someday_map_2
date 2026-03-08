// 내 장소 리스트 모달 컴포넌트

interface PlaceModalProps {
  places: any[];
}

import React from "react";

const PlaceModal: React.FC<PlaceModalProps> = ({ places }) => {
  return (
    <div className="place-list-container">
      {places.length === 0 ? (
        <p>저장된 장소가 없습니다.</p>
      ) : (
        places.map((place) => (
          <div key={place.id} className="place-item">
            <div className="place-info">
              <div className="place-name">{place.name}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaceModal;
