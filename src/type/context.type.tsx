export type ContextProviderPropsType = {
	children: React.ReactNode;
};

export type ContextType = {
	isMobileSideNavigationOpen: boolean;
	setIsMobileSideNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isSideNavigationClosing: boolean;
	setIsSideNavigationClosing: React.Dispatch<React.SetStateAction<boolean>>;
	authenticatedUser: Record<string, any> | null;
	setAuthenticatedUser: React.Dispatch<
		React.SetStateAction<Record<string, any> | null>
	>;
};
