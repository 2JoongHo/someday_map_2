// 내 장소 리스트 모달 컴포넌트

import React from "react";
import "./PlaceModal.css";

interface PlaceModalProps {
  places: any[];
  onSelect: (place: any) => void;
  onDelete: (id: number) => void;
}

const PlaceModal: React.FC<PlaceModalProps> = ({
  places,
  onSelect,
  onDelete,
}) => {
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
              <div className="place-info-wrapper">
                <div className="place-item-name">{place.name}</div>
                <div className="place-item-address">{place.address}</div>
              </div>

              <button
                className="place-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(place.id);
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaceModal;
