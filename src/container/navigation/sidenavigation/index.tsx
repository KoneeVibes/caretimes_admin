import { useContext } from "react";
import logo from "../../../asset/logo.png";
import { AppContext } from "../../../context";
import { sideNavigationItems } from "../../../config/static";
import {
	Box,
	Drawer,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { SideNavigationPropsType } from "../../../type/container.type";
import { signOutUserService } from "../../../util/authentication/signout";
import Cookies from "universal-cookie";

export const SideNavigation: React.FC<SideNavigationPropsType> = ({
	avatar,
	username,
	role,
	type,
}) => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;
	const authenticatedModules = sideNavigationItems.filter((item) =>
		item.userType.includes(type)
	);

	const navigate = useNavigate();
	const matchesMobileAndAbove = useMediaQuery("(min-width:425px)");
	const {
		setIsSideNavigationClosing,
		isMobileSideNavigationOpen,
		setIsMobileSideNavigationOpen,
	} = useContext(AppContext);

	const handleDrawerClose = () => {
		setIsSideNavigationClosing(true);
		setIsMobileSideNavigationOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsSideNavigationClosing(false);
	};

	const handleLogOutUser = async (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.preventDefault();
		try {
			const response = await signOutUserService(TOKEN);
			if (response.status === "success") {
				cookies.remove("TOKEN", { path: "/" });
				navigate("/", { replace: true });
			} else {
				console.error("Logout failed. Try again");
			}
		} catch (error: any) {
			console.error("Logout failed, Contact Admin:", error);
		}
	};

	const handleNavItemClick = async (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		destination: string
	) => {
		e.stopPropagation();
		if (destination === "/") {
			await handleLogOutUser(e);
			return navigate(destination);
		}
		navigate(destination);
		return setIsMobileSideNavigationOpen(false);
	};

	const navItems = authenticatedModules.map((sideNavItem, index) => {
		return (
			<ListItem
				key={index}
				className={`${sideNavItem.name.replace(
					/\s+/g,
					"-"
				)}-Side-Nav-Item Side-Nav-Item`}
				component={"div"}
				sx={{
					flexDirection: "column",
					alignItems: "stretch",
					padding: "calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)",
					marginTop: index === 0 ? "var(--basic-margin)" : "0",
				}}
				onClick={(e) => handleNavItemClick(e, sideNavItem.url)}
			>
				<ListItemButton>
					<ListItemIcon>{sideNavItem.icon}</ListItemIcon>
					<ListItemText primary={sideNavItem.name} />
				</ListItemButton>
			</ListItem>
		);
	});

	return (
		<Box>
			<Drawer
				variant="temporary"
				open={isMobileSideNavigationOpen}
				onTransitionEnd={handleDrawerTransitionEnd}
				onClose={handleDrawerClose}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { mobile: "block", tablet: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: "var(--side-nav-width)",
						paddingBottom: "calc(var(--basic-padding) / 2)",
						backgroundColor: "var(--primary-color-complement)",
						borderRight: "1px solid var(--primary-color-complement)",
					},
				}}
			>
				<ListItem className="side-navigation-header">
					<ListItemIcon className="app-icon">
						<img src={logo} alt="caretimes-logo" className="caretimes-logo" />
					</ListItemIcon>
					<Box component={"div"} className="close-button">
						<IconButton
							sx={{
								borderRadius: "6px",
								color: "var(--light-color)",
								padding: "calc(var(--basic-padding)/8)",
								backgroundColor: "var(--primary-color)",
								display: matchesMobileAndAbove ? "none" : "inline-flex",
							}}
							onClick={handleDrawerClose}
						>
							<Close />
						</IconButton>
					</Box>
				</ListItem>
				{navItems}
				<Stack
					sx={{
						marginTop: "auto",
						gap: "calc(var(--flex-gap)/2)",
						padding: "var(--basic-padding)",
					}}
				>
					<Box overflow={"hidden"}>
						<img
							src={avatar}
							alt="user-avatar"
							className="user-avatar"
							style={{ width: "100%", height: "auto", maxWidth: "50px" }}
						/>
					</Box>
					<Stack
						sx={{
							gap: "calc(var(--flex-gap)/4)",
						}}
					>
						<Box>
							<Typography
								variant="subtitle1"
								fontFamily={"Gilroy"}
								fontWeight={600}
								fontSize={14}
								lineHeight={"normal"}
								color={"var(--input-field-text-color)"}
								maxWidth={"64px"}
								marginBlockEnd={"calc(var(--basic-margin)/4)"}
							>
								{username}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="subtitle2"
								fontFamily={"Gilroy"}
								fontWeight={400}
								fontSize={12}
								lineHeight={"normal"}
								maxWidth={"64px"}
								color={"var(--input-field-text-color)"}
							>
								{role}
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { mobile: "none", tablet: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: "var(--side-nav-width)",
						paddingBottom: "calc(var(--basic-padding) / 2)",
						backgroundColor: "var(--primary-color-complement)",
						borderRight: "1px solid var(--primary-color-complement)",
					},
				}}
				open
			>
				<ListItem className="side-navigation-header">
					<ListItemIcon className="app-icon">
						<img src={logo} alt="caretimes-logo" className="caretimes-logo" />
					</ListItemIcon>
				</ListItem>
				{navItems}
			</Drawer>
		</Box>
	);
};
