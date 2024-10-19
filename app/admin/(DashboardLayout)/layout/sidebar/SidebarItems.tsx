// SidebarItems.tsx
import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";

interface SidebarItemsProps {
  toggleMobileSidebar: () => void;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ toggleMobileSidebar }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <div>
      <section className="">
        {Menuitems.map((item) => (
          <NavItem
            key={item.id}
            item={item} // Ensure item is typed correctly
            pathDirect={pathDirect}
            onClick={() => {
              toggleMobileSidebar();
            }}
          />
        ))}
      </section>
    </div>
  );
};

export default SidebarItems;


