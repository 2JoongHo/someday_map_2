// 설정 모달 컴포넌트

import React from "react";
import "./SettingsModal.css";

interface SettingModalProps {
  radius: number;
  setRadius: (value: number) => void;
}

const SettingsModal: React.FC<SettingModalProps> = ({ radius, setRadius }) => {
  return (
    <div className="setting-container">
      <div className="setting-item">
        <div className="setting-label">
          <span>알림 반경 설정 :</span>
          <span className="radius-value">{radius}m</span>
        </div>

        <input
          className="radius-slider"
          type="range"
          min="50"
          max="1000"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
