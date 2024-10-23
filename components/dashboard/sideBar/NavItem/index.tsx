import React from "react";
import Link from "next/link";
import { IconProps as TablerIconProps } from "@tabler/icons-react";
import { usePathname } from "next/navigation";



type NavGroup = {
  navlabel?: boolean;
  subheader?: string;
  title: string;
  icon?: React.ComponentType<TablerIconProps>;
  href: string;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

interface ItemType {
  item: NavGroup;
  pathDirect: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}


const NavItem: React.FC<ItemType> = ({ item, onClick }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const Icon = item.icon;

  const itemIcon = Icon ? (
    <Icon strokeWidth={1.5} className="w-[1.3rem]" />
  ) : null;

  return (
    <div
      className={`nav-item }`}
      onClick={onClick}
    >
      <Link
        href={item.href}
        className={`  flex ${isActive(item.href) ? "bg-blue-200" : ""} items-center m-3 p-4 text-gray-900 rounded-lg dark:text-gray-600 hover:bg-blue-100 dark:hover:bg-blue-100 group`}
      >
        <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-500">
          {itemIcon}
        </span>
        <span className="flex-1 ms-3 whitespace-nowrap">{item.title}</span>
      </Link>
    </div>
  );
};

export default NavItem;

