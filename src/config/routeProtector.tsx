import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { useQuery } from "@tanstack/react-query";

import { AppContext } from "../context";
import { sideNavigationItems as allSideNavigationItems } from "../config/static";
import { retrievePermissionsService } from "../util/usermanagement/accesscontrol/retrievePermissions";
import { BASE_ENDPOINT } from "../util/endpoint";

export const RouteProtector: React.FC = () => {
	const location = useLocation();
	const cookies = useMemo(() => new Cookies(), []);
	const TOKEN = cookies.get("TOKEN");

	const {
		authenticatedUser,
		setAuthenticatedUser,
		sideNavigationItems,
		setSideNavigationItems,
	} = useContext(AppContext);

	const [sessionValid, setSessionValid] = useState<boolean | null>(null);
	const [navigationLoaded, setNavigationLoaded] = useState(false);

	const {
		data: permissions,
		isLoading: permissionsLoading,
		isError: permissionsError,
	} = useQuery<
		{
			module: string;
			status: string;
		}[]
	>({
		queryKey: ["authenticated-user-permissions", TOKEN, authenticatedUser?.id],
		queryFn: () => retrievePermissionsService(TOKEN, authenticatedUser!.id),
		enabled: Boolean(TOKEN && authenticatedUser?.id && sessionValid === true),
	});

	useEffect(() => {
		const controller = new AbortController();
		const verifySession = async () => {
			setSessionValid(null);
			setNavigationLoaded(false);
			if (!TOKEN) {
				setSessionValid(false);
				return;
			}
			try {
				const response = await fetch(
					`${BASE_ENDPOINT}/api/v1/admin-interface/auth/verify-token`,
					{
						headers: { Authorization: `Bearer ${TOKEN}` },
						signal: controller.signal,
					},
				);
				if (!response.ok) {
					setSessionValid(false);
					return;
				}
				const data: {
					valid: boolean;
					user: {
						id: string;
						type: string;
					};
				} = await response.json();
				if (!data.valid || !data.user?.id || !data.user?.type) {
					setSessionValid(false);
					return;
				}
				setAuthenticatedUser(data.user);
				setSessionValid(true);
			} catch {
				if (!controller.signal.aborted) {
					setSessionValid(false);
				}
			}
		};
		verifySession();
		return () => controller.abort();
	}, [TOKEN, setAuthenticatedUser]);

	useEffect(() => {
		if (sessionValid !== true || !authenticatedUser?.id || permissionsLoading) {
			return;
		}
		const authenticatedModules = allSideNavigationItems.filter(
			(item) =>
				item.userType.includes(authenticatedUser.type) &&
				(item.name === "Logout" ||
					(!permissionsError &&
						permissions?.some(
							(permission) =>
								permission.module === item.name &&
								permission.status !== "inactive",
						))),
		);
		setSideNavigationItems(authenticatedModules);
		setNavigationLoaded(true);
	}, [
		authenticatedUser,
		permissions,
		permissionsError,
		permissionsLoading,
		sessionValid,
		setSideNavigationItems,
	]);

	const permittedRoutes = sideNavigationItems.filter(
		(item) => item.name !== "Logout",
	);

	const currentRouteAllowed = permittedRoutes.some(
		(item) =>
			location.pathname === item.url ||
			location.pathname.startsWith(`${item.url}/`),
	);

	useEffect(() => {
		if (sessionValid === false) {
			setAuthenticatedUser(null);
			setSideNavigationItems([]);
			cookies.remove("TOKEN", { path: "/" });
		}
	}, [cookies, sessionValid, setAuthenticatedUser, setSideNavigationItems]);

	useEffect(() => {
		if (
			sessionValid === true &&
			navigationLoaded &&
			permittedRoutes.length === 0
		) {
			cookies.remove("TOKEN", { path: "/" });
			setAuthenticatedUser(null);
			setSideNavigationItems([]);
		}
	}, [
		cookies,
		navigationLoaded,
		permittedRoutes.length,
		sessionValid,
		setAuthenticatedUser,
		setSideNavigationItems,
	]);

	if (sessionValid === null || (sessionValid && !navigationLoaded)) {
		return <div>Checking session…</div>;
	}

	if (!sessionValid || permittedRoutes.length === 0) {
		return <Navigate to="/" replace />;
	}

	if (!currentRouteAllowed) {
		return <Navigate to={permittedRoutes[0].url} replace />;
	}

	return <Outlet />;
};
