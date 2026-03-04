import React from "react";

interface MenuProps {
  isMenuOpen: boolean; // 메뉴 열림 상태
  onOpenPlace: () => void; // 장소 추가 창 열기
  onOpenSettings: () => void; // 설정 창 열기
  onCloseMenu: () => void; // 메뉴 닫기
}

const Menu: React.FC<MenuProps> = ({
  isMenuOpen,
  onOpenPlace,
  onOpenSettings,
  onCloseMenu,
}) => {
  // 메뉴 아이템 클릭 시 해당 액션 실행 후 메뉴 닫기
  const handleItemClick = (action: () => void) => {
    action();
    onCloseMenu(); // 메뉴 닫기
  };

  return (
    <ul className={`menu ${isMenuOpen ? "show" : ""}`}>
      <li>
        <button onClick={() => handleItemClick(onOpenPlace)}>내 장소</button>
      </li>
      <li>
        <button onClick={() => alert("로그인 기능은 곧 추가됩니다")}>
          로그인
        </button>
      </li>
      <li>
        <button onClick={() => handleItemClick(onOpenSettings)}>설정</button>
      </li>
    </ul>
  );
};

export default Menu;
