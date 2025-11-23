import { createContext, useState } from "react";
import { ContextProviderPropsType, ContextType } from "../type/context.type";

export const AppContext = createContext({} as ContextType);

export const AppContextProvider: React.FC<ContextProviderPropsType> = ({
	children,
}) => {
	const [authenticatedUser, setAuthenticatedUser] = useState<Record<
		string,
		any
	> | null>(null);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
	const [alertModalInfo, setAlertModalInfo] = useState<Record<
		string,
		any
	> | null>(null);
	const [isMobileSideNavigationOpen, setIsMobileSideNavigationOpen] =
		useState(false);
	const [isSideNavigationClosing, setIsSideNavigationClosing] = useState(false);
	const [isAddUserFormModalOpen, setIsAddUserFormModalOpen] = useState(false);
	const [isEditUserFormModalOpen, setIsEditUserFormModalOpen] = useState(false);
	const [isAddProductFormModalOpen, setIsAddProductFormModalOpen] =
		useState(false);
	const [isEditProductFormModalOpen, setIsEditProductFormModalOpen] =
		useState(false);
	const [isAddCategoryFormModalOpen, setIsAddCategoryFormModalOpen] =
		useState(false);
	const [isEditCategoryFormModalOpen, setIsEditCategoryFormModalOpen] =
		useState(false);

	return (
		<AppContext.Provider
			value={{
				isMobileSideNavigationOpen,
				setIsMobileSideNavigationOpen,
				isSideNavigationClosing,
				setIsSideNavigationClosing,
				authenticatedUser,
				setAuthenticatedUser,
				isAddUserFormModalOpen,
				setIsAddUserFormModalOpen,
				isEditUserFormModalOpen,
				setIsEditUserFormModalOpen,
				isAlertModalOpen,
				setIsAlertModalOpen,
				alertModalInfo,
				setAlertModalInfo,
				isAddProductFormModalOpen,
				setIsAddProductFormModalOpen,
				isEditProductFormModalOpen,
				setIsEditProductFormModalOpen,
				isAddCategoryFormModalOpen,
				setIsAddCategoryFormModalOpen,
				isEditCategoryFormModalOpen,
				setIsEditCategoryFormModalOpen,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
