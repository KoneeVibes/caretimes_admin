import { useContext, useEffect } from "react";
import { AppLayoutPropsType } from "../../../type/container.type";
import { MainArea } from "../../mainarea";
import { SideNavigation } from "../../navigation/sidenavigation";
import { TopNavigation } from "../../navigation/topnavigation";
import { AppLayoutWrapper } from "./styled";
import avatar from "../../../asset/image/demo-avatar.svg";
import { AppContext } from "../../../context";
import { retrieveLoggedInUserService } from "../../../util/usermanagement/user/retrieveLoggedInUser";
import Cookies from "universal-cookie";

export const AppLayout: React.FC<AppLayoutPropsType> = ({
	children,
	pageId,
}) => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const { authenticatedUser, setAuthenticatedUser } = useContext(AppContext);

	useEffect(() => {
		if (!pageId) return;
		document.body.id = pageId;
		return () => {
			document.body.removeAttribute("id");
		};
	}, [pageId]);

	useEffect(() => {
		if (!TOKEN) return;
		const fetchLoggedInUser = async () => {
			try {
				const response = await retrieveLoggedInUserService(TOKEN);
				return setAuthenticatedUser(response);
			} catch (error) {
				console.error("Failed to fetch authenticated user:", error);
			}
		};
		fetchLoggedInUser();
	}, [TOKEN, setAuthenticatedUser]);

	return (
		<AppLayoutWrapper id={pageId} maxWidth={false}>
			<SideNavigation
				avatar={avatar}
				role={authenticatedUser?.type?.toUpperCase()}
				username={`${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`}
			/>
			<TopNavigation
				avatar={avatar}
				role={authenticatedUser?.type?.toUpperCase()}
				username={`${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`}
			/>
			<MainArea>{children}</MainArea>
		</AppLayoutWrapper>
	);
};
