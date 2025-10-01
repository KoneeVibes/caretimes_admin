export type AuthLayoutPropsType = {
	children: React.ReactNode;
};

export type AppLayoutPropsType = {
	pageId: string;
	children: React.ReactNode;
};

export type SideNavigationPropsType = {
	role: string;
	type: string;
	avatar: string;
	username: string;
};

export type MainAreaPropsType = {
	children: React.ReactNode;
};

export type BaseTablePropsType = {
	rows: Record<any, any>[];
};

export type OrderTablePropsType = {
	handleViewDetailsClick: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string | Record<any, any>
	) => void;
} & BaseTablePropsType;

export type AdminTablePropsType = {
	handleViewDetailsClick: (
		e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
		id: string | Record<any, any>
	) => void;
} & BaseTablePropsType;

export type EditUserFormPropsType = {
	initialFormDetails: Record<string, any>;
};
