// 내 장소 리스트 모달 컴포넌트

import React from "react";
import "./PlaceModal.css";

interface PlaceModalProps {
  places: any[];
  onSelect: (place: any) => void;
}

const PlaceModal: React.FC<PlaceModalProps> = ({ places, onSelect }) => {
  return (
    <div className="place-list-container">
      {places.length === 0 ? (
        <div className="place-empty-msg">저장된 장소가 없습니다.</div>
      ) : (
        <ul className="place-ul">
          {places.map((place) => (
            <li
              className="place-item"
              key={place.id}
              onClick={() => onSelect(place)}
            >
              <div className="place-items-name">{place.name}</div>
              <div>{place.address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaceModal;
