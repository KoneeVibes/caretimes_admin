import {
	DashboardActiveOrderIcon,
	DashboardCompletedOrderIcon,
	DashboardCustomerIcon,
	DashboardIssueIcon,
	DashboardTransactionIcon,
	DashboardUnsettledFundIcon,
	SideNavigationDashboardIcon,
	SideNavigationInventoryIcon,
	SideNavigationLogoutIcon,
	SideNavigationOrdersIcon,
	// SideNavigationSettingsIcon,
	// SideNavigationSupportIcon,
	SideNavigationTransactionsIcon,
	SideNavigationAdminManagementIcon,
	InventoryTotalProductItemsIcon,
	InventoryApprovedProductsIcon,
	InventoryPendingProductsIcon,
	InventoryRejectedProductsIcon,
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
		userType: ["super-admin", "admin", "distributor"],
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

export const dashboardCards = [
	{
		name: "Customers",
		amount: 2000,
		traction: +2.5,
		icon: <DashboardCustomerIcon />,
	},
	{
		name: "Transactions",
		amount: 500000,
		traction: -2.5,
		icon: <DashboardTransactionIcon />,
	},
	{
		name: "Issues",
		amount: 3,
		traction: +2.5,
		icon: <DashboardIssueIcon />,
	},
	{
		name: "Completed Orders",
		amount: 3000,
		traction: 0,
		icon: <DashboardCompletedOrderIcon />,
	},
	{
		name: "Active Orders",
		amount: 8,
		traction: 0,
		icon: <DashboardActiveOrderIcon />,
	},
	{
		name: "Unsettled Funds",
		amount: 10000,
		traction: 0,
		icon: <DashboardUnsettledFundIcon />,
	},
];

export const inventorySummaryCards = [
	{
		name: "Total Product Items",
		amount: 2342,
		traction: 0,
		icon: <InventoryTotalProductItemsIcon />,
	},
	{
		name: "Approved Products",
		amount: 2000,
		traction: -2.5,
		icon: <InventoryApprovedProductsIcon />,
	},
	{
		name: "Pending Products",
		amount: 300,
		traction: +2.5,
		icon: <InventoryPendingProductsIcon />,
	},
	{
		name: "Rejected Products",
		amount: 42,
		traction: 0,
		icon: <InventoryRejectedProductsIcon />,
	},
];

export const summary = {
	total: 10000,
	distributor: [
		{
			name: "Lagos Branch 1",
			address: "47 Ogombo Road, Ajah",
			sales: 1000,
		},
		{
			name: "Lagos Branch 2",
			address: "47 Ogombo Road, Ajah",
			sales: 500,
		},
		{
			name: "Lagos Branch 3",
			address: "47 Ogombo Road, Ajah",
			sales: 250,
		},
		{
			name: "Lagos Branch 4",
			address: "47 Ogombo Road, Ajah",
			sales: 100,
		},
	],
	product: [
		{
			name: "Hair Care Products",
			sales: 10,
		},
		{
			name: "Body Care Products",
			sales: 50,
		},
		{
			name: "Perfumery Products",
			sales: 100,
		},
		{
			name: "Home Care Products",
			sales: 150,
		},
	],
};
