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
    href: "/admin/ui-components/buttons",
  },
  {
    title: "Customers",
    icon: IconUsers,
    href: "/admin/ui-components/forms",
  },
  {
    title: "Employees",
    icon: IconUserCheck,
    href: "/admin/ui-components/alerts",
  },
  {
    title: "Order Status",
    icon: IconTimeline,
    href: "/admin/ui-components/ratings",
  },
  {
    title: "Images",
    icon: IconPhoto,
    href: "/admin/ui-components/images",
  },
  {
    title: "Product Categories",
    icon: IconTags,
    href: "/admin/ui-components/pagination",
  },
  {
    title: "Products",
    icon: IconPackage,
    href: "/admin/ui-components/table",
  },
];

export default Menuitems;
