// MenuContext.tsx
import { createContext } from "react";

type ContentsNodeMenuContextType = {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const ContentsNodeMenuContext = createContext<
  ContentsNodeMenuContextType | undefined
>(undefined);
