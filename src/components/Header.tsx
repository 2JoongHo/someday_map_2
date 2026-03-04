import React from "react";
import menuIcon from "../assets/icons/menuIcon.svg";
import Menu from "./Menu";
import searchIcon from "../assets/icons/searchIcon3.svg";

interface HeaderProps {
  onOpenSearch: () => void; // 검색창 열기
  onOpenPlace: () => void; // 장소 추가 창 열기
  onOpenSettings: () => void; // 설정 창 열기
}

const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenPlace,
  onOpenSettings,
}) => {
  // 메뉴 열림 상태 관리
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  // 메뉴 토글 함수
  const toogleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header>
      {/* 중앙 로고 영역 */}
      <h1>
        <span>
          언제<span className="h1-gal">갈</span>지도
        </span>
      </h1>
      {/* 메뉴 버튼 */}
      <div>
        <button className="menu-btn" onClick={toogleMenu}>
          <img src={menuIcon} alt="메뉴" />
        </button>

        <Menu
          isMenuOpen={isMenuOpen}
          onOpenPlace={onOpenPlace}
          onOpenSettings={onOpenSettings}
          onCloseMenu={() => setIsMenuOpen(false)}
        />
      </div>

      {/* 검색 버튼 */}
      <button className="search-btn" onClick={onOpenSearch}>
        <img src={searchIcon} alt="검색" />
      </button>
    </header>
  );
};

export default Header;
