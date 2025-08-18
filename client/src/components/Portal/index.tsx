import { createPortal } from "react-dom";
import { ReactNode } from "react";

type PortalProps = {
  children: ReactNode;
};

const Portal = ({ children }: PortalProps) => {
  const portalRoot = document.getElementById("portal");
  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
};

export default Portal;
