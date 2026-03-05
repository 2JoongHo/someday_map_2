// 모달 공통 레이아웃 컴포넌트

import React from "react";

interface ModalLayoutProps {
  title: string; // 모달 상단에 뜰 제목
  onClose: () => void; // 닫기 버튼 눌렀을 때 실행할 함수
  children: React.ReactNode; // 액자 안에 들어갈 실제 내용(사진)
}

const ModalLayout: React.FC<ModalLayoutProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation: 내용창 클릭했을 땐 모달이 안 닫히게 방어 */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>X</button>
        </div>
        <hr />
        <div className="modal-body">
          {children} {/* 여기에 PlaceModal이나 LoginModal이 들어옴 */}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
