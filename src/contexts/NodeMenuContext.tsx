// MenuContext.tsx
import { createContext } from "react";

type NodeMenuContextType = {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const NodeMenuContext = createContext<NodeMenuContextType | undefined>(
  undefined
);
