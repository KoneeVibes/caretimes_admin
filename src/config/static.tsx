import {
	SideNavigationDashboardIcon,
	SideNavigationInventoryIcon,
	SideNavigationLogoutIcon,
	SideNavigationOrdersIcon,
	// SideNavigationSettingsIcon,
	// SideNavigationSupportIcon,
	SideNavigationTransactionsIcon,
	SideNavigationAdminManagementIcon,
} from "../asset";

export const sideNavigationItems = [
	{
		name: "Dashboard",
		icon: <SideNavigationDashboardIcon />,
		url: "/dashboard",
		userType: ["super-admin", "admin", "distributor"],
	},
	{
		name: "Orders",
		icon: <SideNavigationOrdersIcon />,
		url: "/order",
		userType: ["super-admin", "admin", "distributor"],
	},
	{
		name: "Inventory",
		icon: <SideNavigationInventoryIcon />,
		url: "/inventory",
		userType: ["super-admin", "admin", "distributor"],
	},
	{
		name: "Transactions",
		icon: <SideNavigationTransactionsIcon />,
		url: "/transaction",
		userType: ["super-admin", "admin"],
	},
	// {
	// 	name: "Support",
	// 	icon: <SideNavigationSupportIcon />,
	// 	url: "/support",
	// 	userType: ["super-admin", "admin", "distributor"],
	// },
	{
		name: "Admin Management",
		icon: <SideNavigationAdminManagementIcon />,
		url: "/admin-management",
		userType: ["super-admin"],
	},
	// {
	// 	name: "Settings",
	// 	icon: <SideNavigationSettingsIcon />,
	// 	url: "/setting",
	// 	userType: ["super-admin", "admin", "distributor"],
	// },
	{
		name: "Logout",
		icon: <SideNavigationLogoutIcon />,
		url: "/",
		userType: ["super-admin", "admin", "distributor"],
	},
];
