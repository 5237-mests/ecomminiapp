// NavItem.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconProps as TablerIconProps } from "@tabler/icons-react";



type NavGroup = {
  navlabel?: boolean;
  subheader?: string;
  id: string;
  title: string;
  icon?: React.ComponentType<TablerIconProps>; 
  href: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

interface ItemType {
  item: NavGroup;
  pathDirect: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const NavItem: React.FC<ItemType> = ({ item, pathDirect, onClick }) => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (item.href) {
      router.push(item.href);
    }
    if (onClick) onClick(event);
  };

  const Icon = item.icon;

  const itemIcon = Icon ? (
    <Icon strokeWidth={1.5} className="w-[1.3rem]" />
  ) : null;

  return (
    <div
      className={`nav-item ${pathDirect === item.href ? "active" : ""}`}
      onClick={handleClick}
    >
      <Link
        href={item.href}
        passHref
        className="flex items-center p-4 text-gray-900 rounded-lg dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
          {itemIcon}
        </span>
        <span className="flex-1 ms-3 whitespace-nowrap">{item.title}</span>
      </Link>
    </div>
  );
};

export default NavItem;

