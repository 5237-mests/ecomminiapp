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

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/admin",
  },
  {
    id: uniqueId(),
    title: "Orders",
    icon: IconShoppingCart,
    href: "/admin/ui-components/buttons",
  },
  {
    id: uniqueId(),
    title: "Customers",
    icon: IconUsers,
    href: "/admin/ui-components/forms",
  },
  {
    id: uniqueId(),
    title: "Employees",
    icon: IconUserCheck,
    href: "/admin/ui-components/alerts",
  },
  {
    id: uniqueId(),
    title: "Order Status",
    icon: IconTimeline,
    href: "/admin/ui-components/ratings",
  },
  {
    id: uniqueId(),
    title: "Images",
    icon: IconPhoto,
    href: "/admin/ui-components/images",
  },
  {
    id: uniqueId(),
    title: "Product Categories",
    icon: IconTags,
    href: "/admin/ui-components/pagination",
  },
  {
    id: uniqueId(),
    title: "Products",
    icon: IconPackage,
    href: "/admin/ui-components/table",
  },
];

export default Menuitems;
