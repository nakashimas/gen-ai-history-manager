import { useState } from "react";
import { NodeMenuContext } from "./NodeMenuContext";

export const NodeMenuProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <NodeMenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu }}>
      {children}
    </NodeMenuContext.Provider>
  );
};
