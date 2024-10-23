import {
  IconHome,
  IconShoppingCart,
  IconPhoto,
  IconTimeline,
  IconUsers,
  IconUserCheck,
  IconTags,
  IconPackage,
} from "@tabler/icons-react";

const Menuitems = [
  {
    title: "Dashboard",
    icon: IconHome,
    href: "/admin",
  },
  {
    title: "Orders",
    icon: IconShoppingCart,
    href: "/admin/buttons",
  },
  {
    title: "Customers",
    icon: IconUsers,
    href: "/admin/forms",
  },
  {
    title: "Employees",
    icon: IconUserCheck,
    href: "/admin/alerts",
  },
  {
    title: "Order Status",
    icon: IconTimeline,
    href: "/admin/ratings",
  },
  {
    title: "Images",
    icon: IconPhoto,
    href: "/admin/images",
  },
  {
    title: "Product Categories",
    icon: IconTags,
    href: "/admin/product_category",
  },
  {
    title: "Products",
    icon: IconPackage,
    href: "/admin/product",
  },
];

export default Menuitems;
