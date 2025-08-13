import { SideNavigationDashboardIcon, SideNavigationInventoryIcon, SideNavigationLogoutIcon, SideNavigationOrdersIcon, SideNavigationSettingsIcon, SideNavigationSupportIcon, SideNavigationTransactionsIcon } from "../asset";

export const sideNavigationItems = [
    {
        name: "Dashboard",
        icon: <SideNavigationDashboardIcon />,
        url: "/dashboard"
    },
    {
        name: "Orders",
        icon: <SideNavigationOrdersIcon />,
        url: "/order"
    },
    {
        name: "Inventory",
        icon: <SideNavigationInventoryIcon />,
        url: "/inventory"
    },
    {
        name: "Transactions",
        icon: <SideNavigationTransactionsIcon />,
        url: "/transaction"
    },
    {
        name: "Support",
        icon: <SideNavigationSupportIcon />,
        url: "/support"
    },
    {
        name: "Settings",
        icon: <SideNavigationSettingsIcon />,
        url: "/setting"
    },
    {
        name: "Logout",
        icon: <SideNavigationLogoutIcon />,
        url: "/"
    },
];