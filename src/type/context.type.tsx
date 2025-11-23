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
	isAddUserFormModalOpen: boolean;
	setIsAddUserFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEditUserFormModalOpen: boolean;
	setIsEditUserFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isAlertModalOpen: boolean;
	setIsAlertModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	alertModalInfo: Record<string, any> | null;
	setAlertModalInfo: React.Dispatch<
		React.SetStateAction<Record<string, any> | null>
	>;
	isAddProductFormModalOpen: boolean;
	setIsAddProductFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEditProductFormModalOpen: boolean;
	setIsEditProductFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isAddCategoryFormModalOpen: boolean;
	setIsAddCategoryFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEditCategoryFormModalOpen: boolean;
	setIsEditCategoryFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
