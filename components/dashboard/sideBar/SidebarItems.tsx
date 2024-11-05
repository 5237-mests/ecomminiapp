// SidebarItems.tsx
import React from 'react';
import Menuitems from './MenuItems';
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';

interface SidebarItemsProps {
  toggleMobileSidebar: (event: MouseEvent | null) => void;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ toggleMobileSidebar }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event) {
      toggleMobileSidebar(event as unknown as MouseEvent);
    }
  };

  return (
    <div>
      <section className="">
        {Menuitems.map((item, index) => (
          <NavItem
            item={item}
            key={index}
            pathDirect={pathDirect}
            onClick={handleClick}
          />
        ))}
      </section>

      <div className="h-32"></div>
    </div>
  );
};

export default SidebarItems;
