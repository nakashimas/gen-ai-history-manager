import { useState } from "react";
import { ContentsNodeMenuContext } from "./ContentsNodeMenuContext";

export const ContentsNodeMenuProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <ContentsNodeMenuContext.Provider
      value={{ isMenuOpen, openMenu, closeMenu }}
    >
      {children}
    </ContentsNodeMenuContext.Provider>
  );
};
